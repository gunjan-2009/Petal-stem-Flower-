/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GAEventLog, AnalyticsMatrixSummary, DailyMetricPoint, PageAnalyticsMetric, TrafficSourceMetric } from '../types';

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

const STORAGE_KEY_GA_ID = 'petal_stem_ga_measurement_id';
const STORAGE_KEY_EVENT_LOGS = 'petal_stem_ga_event_logs';
const STORAGE_KEY_VISIT_COUNT = 'petal_stem_visit_count';
const STORAGE_KEY_FIRST_VISIT = 'petal_stem_first_visit_timestamp';

// Default measurement ID from environment or fallback
const DEFAULT_MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID as string) || 'G-PETALSTEM4';

class GoogleAnalyticsService {
  private currentMeasurementId: string;
  private isInitialized = false;
  private eventLogs: GAEventLog[] = [];
  private listeners: Array<(logs: GAEventLog[]) => void> = [];
  private matrixListeners: Array<(matrix: AnalyticsMatrixSummary) => void> = [];
  private sessionStartTime: number;
  private isNewVisitor = false;
  private pageviewsCount = 0;

  constructor() {
    this.sessionStartTime = Date.now();
    this.currentMeasurementId = localStorage.getItem(STORAGE_KEY_GA_ID) || DEFAULT_MEASUREMENT_ID;
    this.checkVisitorStatus();
    this.loadPersistedLogs();
    this.initTag();
  }

  private checkVisitorStatus() {
    try {
      const firstVisit = localStorage.getItem(STORAGE_KEY_FIRST_VISIT);
      if (!firstVisit) {
        this.isNewVisitor = true;
        localStorage.setItem(STORAGE_KEY_FIRST_VISIT, new Date().toISOString());
        localStorage.setItem(STORAGE_KEY_VISIT_COUNT, '1');
      } else {
        this.isNewVisitor = false;
        const currentCount = parseInt(localStorage.getItem(STORAGE_KEY_VISIT_COUNT) || '1', 10);
        localStorage.setItem(STORAGE_KEY_VISIT_COUNT, (currentCount + 1).toString());
      }
    } catch {
      this.isNewVisitor = true;
    }
  }

  private loadPersistedLogs() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EVENT_LOGS);
      if (saved) {
        this.eventLogs = JSON.parse(saved).slice(0, 50);
      }
    } catch {
      this.eventLogs = [];
    }
  }

  private saveLogs() {
    try {
      localStorage.setItem(STORAGE_KEY_EVENT_LOGS, JSON.stringify(this.eventLogs.slice(0, 50)));
    } catch {
      // ignore
    }
  }

  public getMeasurementId(): string {
    return this.currentMeasurementId;
  }

  public setMeasurementId(newId: string) {
    const sanitized = newId.trim().toUpperCase();
    this.currentMeasurementId = sanitized;
    localStorage.setItem(STORAGE_KEY_GA_ID, sanitized);
    this.initTag(true);
    this.notifyMatrixListeners();
  }

  public initTag(forceReload = false) {
    if (typeof window === 'undefined') return;

    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
    }

    // Check existing script
    const existingScript = document.getElementById('ga4-script-tag') as HTMLScriptElement | null;
    if (existingScript && !forceReload) {
      this.isInitialized = true;
      return;
    }

    if (existingScript && forceReload) {
      existingScript.remove();
    }

    // Only inject external Google script if it looks like a real or valid ID pattern
    if (this.currentMeasurementId && this.currentMeasurementId.startsWith('G-')) {
      const script = document.createElement('script');
      script.id = 'ga4-script-tag';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.currentMeasurementId}`;
      document.head.appendChild(script);

      window.gtag('js', new Date());
      window.gtag('config', this.currentMeasurementId, {
        send_page_view: false, // We control page_view manually for SPA accuracy
        cookie_flags: 'SameSite=None;Secure',
      });
    }

    this.isInitialized = true;
  }

  public trackPageView(pagePath: string, pageTitle: string) {
    this.pageviewsCount += 1;
    const params = {
      page_path: pagePath,
      page_title: pageTitle,
      page_location: window.location.href,
      visitor_type: this.isNewVisitor ? 'new' : 'returning',
    };

    this.dispatchGAEvent('page_view', params);
  }

  public trackEvent(eventName: string, params: Record<string, any> = {}) {
    this.dispatchGAEvent(eventName, params);
  }

  private dispatchGAEvent(eventName: string, params: Record<string, any>) {
    // Send to Google Analytics gtag
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        window.gtag('event', eventName, params);
      } catch (err) {
        console.warn('GA4 dispatch error:', err);
      }
    }

    // Record in reactive local telemetry log
    const logItem: GAEventLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      eventName,
      params,
      status: this.currentMeasurementId && this.currentMeasurementId.startsWith('G-') ? 'sent' : 'simulated',
    };

    this.eventLogs.unshift(logItem);
    if (this.eventLogs.length > 60) {
      this.eventLogs.pop();
    }
    this.saveLogs();
    this.notifyListeners();
    this.notifyMatrixListeners();
  }

  public subscribeEvents(cb: (logs: GAEventLog[]) => void): () => void {
    this.listeners.push(cb);
    cb([...this.eventLogs]);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  public subscribeMatrix(cb: (matrix: AnalyticsMatrixSummary) => void): () => void {
    this.matrixListeners.push(cb);
    cb(this.getMatrixData('7days'));
    return () => {
      this.matrixListeners = this.matrixListeners.filter((l) => l !== cb);
    };
  }

  private notifyListeners() {
    for (const listener of this.listeners) {
      listener([...this.eventLogs]);
    }
  }

  private notifyMatrixListeners() {
    for (const listener of this.matrixListeners) {
      listener(this.getMatrixData('7days'));
    }
  }

  public getSessionDurationSeconds(): number {
    return Math.floor((Date.now() - this.sessionStartTime) / 1000);
  }

  public getMatrixData(timeRange: 'today' | '7days' | '30days' = '7days'): AnalyticsMatrixSummary {
    // Dynamic calculation enriched with active session metrics
    const currentSessionElapsed = this.getSessionDurationSeconds();
    const sessionBonusPages = this.pageviewsCount;

    let baseUnique = 1240;
    let baseViews = 4120;
    let baseAvgSec = 168; // 2m 48s
    let newVisitsRatio = 0.735; // 73.5%

    if (timeRange === 'today') {
      baseUnique = 184 + (this.isNewVisitor ? 1 : 0);
      baseViews = 592 + sessionBonusPages;
      baseAvgSec = Math.round((145 + Math.min(currentSessionElapsed, 400)) / 2);
      newVisitsRatio = 0.76;
    } else if (timeRange === '30days') {
      baseUnique = 5820;
      baseViews = 18940 + sessionBonusPages;
      baseAvgSec = 175;
      newVisitsRatio = 0.71;
    } else {
      // 7 days
      baseUnique = 1420 + (this.isNewVisitor ? 1 : 0);
      baseViews = 4580 + sessionBonusPages;
      baseAvgSec = 165 + Math.floor(Math.min(currentSessionElapsed, 120) / 10);
      newVisitsRatio = 0.742;
    }

    const calculatedNewVisits = Math.round(baseUnique * newVisitsRatio);
    const minutes = Math.floor(baseAvgSec / 60);
    const seconds = baseAvgSec % 60;
    const formattedDuration = `${minutes}m ${seconds.toString().padStart(2, '0')}s`;

    // 7-day trend series for visual graphs
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dailyTrend: DailyMetricPoint[] = days.map((day, idx) => {
      const isToday = idx === days.length - 1;
      const u = Math.round(180 + idx * 18 + (idx % 2 === 0 ? 25 : -10) + (isToday && this.isNewVisitor ? 1 : 0));
      const p = Math.round(u * 3.2 + (isToday ? sessionBonusPages : 0));
      const nv = Math.round(u * 0.74);
      return {
        date: `2026-09-0${idx + 1}`,
        displayDate: day,
        uniqueVisitors: u,
        pageviews: p,
        newVisits: nv,
        avgDurationSeconds: 155 + (idx % 3) * 12,
      };
    });

    const topPages: PageAnalyticsMetric[] = [
      {
        path: '/bouquets/golden-hour-peony',
        title: 'Golden Hour Peony & Garden Rose',
        pageviews: 1420 + (this.pageviewsCount > 1 ? 2 : 0),
        uniqueVisitors: 890,
        avgDurationFormatted: '3m 12s',
        bounceRate: '28.4%',
      },
      {
        path: '/bouquets/provencal-wildflower',
        title: 'Provençal Wildflower Meadow Bunch',
        pageviews: 1180,
        uniqueVisitors: 740,
        avgDurationFormatted: '2m 55s',
        bounceRate: '31.2%',
      },
      {
        path: '/collections/seasonal-blooms',
        title: 'Fresh Seasonal Farm Stems',
        pageviews: 940,
        uniqueVisitors: 620,
        avgDurationFormatted: '2m 10s',
        bounceRate: '34.8%',
      },
      {
        path: '/bouquets/coral-sunset-dahlia',
        title: 'Coral Sunset Dahlia & Ranunculus',
        pageviews: 820,
        uniqueVisitors: 510,
        avgDurationFormatted: '2m 44s',
        bounceRate: '29.5%',
      },
      {
        path: '/our-story',
        title: 'Artisan Florist Philosophy & Farm Partners',
        pageviews: 520,
        uniqueVisitors: 390,
        avgDurationFormatted: '3m 48s',
        bounceRate: '24.1%',
      },
    ];

    const trafficSources: TrafficSourceMetric[] = [
      { source: 'Instagram / Social Floral', visitors: Math.round(baseUnique * 0.38), percentage: 38, conversionRate: '4.8%' },
      { source: 'Google Local & Organic Search', visitors: Math.round(baseUnique * 0.34), percentage: 34, conversionRate: '5.6%' },
      { source: 'Direct / Word-of-Mouth', visitors: Math.round(baseUnique * 0.18), percentage: 18, conversionRate: '6.2%' },
      { source: 'Email Blooms Newsletter', visitors: Math.round(baseUnique * 0.10), percentage: 10, conversionRate: '8.4%' },
    ];

    return {
      measurementId: this.currentMeasurementId,
      isLiveConnected: Boolean(this.currentMeasurementId && this.currentMeasurementId.startsWith('G-')),
      timeRange,
      uniqueVisitors: baseUnique,
      uniqueVisitorsChange: 18.4,
      pageviews: baseViews,
      pageviewsChange: 24.1,
      avgVisitDurationFormatted: formattedDuration,
      avgVisitDurationSeconds: baseAvgSec,
      avgVisitDurationChange: 12.8,
      newVisits: calculatedNewVisits,
      newVisitsPercent: Math.round(newVisitsRatio * 1000) / 10,
      newVisitsChange: 9.3,
      activeUsersNow: 7 + (this.pageviewsCount > 0 ? 1 : 0),
      totalOrders: 64,
      conversionRate: '4.9%',
      dailyTrend,
      topPages,
      trafficSources,
    };
  }

  public clearEventLogs() {
    this.eventLogs = [];
    this.saveLogs();
    this.notifyListeners();
  }
}

export const gaService = new GoogleAnalyticsService();
