/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FlowerCategory =
  | 'all'
  | 'romantic'
  | 'wildflower'
  | 'celebration'
  | 'comfort'
  | 'everlasting'
  | 'plants';

export type BouquetSize = 'classic' | 'deluxe' | 'grandLuxe';

export interface BouquetItem {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  price: number; // Base classic price
  deluxePrice: number;
  grandLuxePrice: number;
  category: FlowerCategory;
  categoryLabel: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  tags: string[];
  includes: string[];
  vaseIncludedDefault: boolean;
  vasePrice: number;
  seasonality: string;
  dimensions: string;
  careGuide: string;
}

export interface CartItem {
  id: string;
  bouquet: BouquetItem;
  size: BouquetSize;
  unitPrice: number;
  quantity: number;
  includeVase: boolean;
  giftMessage?: string;
  recipientName?: string;
  deliveryDate?: string;
}

export interface GAEventLog {
  id: string;
  timestamp: string;
  eventName: string;
  params: Record<string, any>;
  status: 'sent' | 'queued' | 'simulated';
}

export interface DailyMetricPoint {
  date: string;
  displayDate: string;
  uniqueVisitors: number;
  pageviews: number;
  newVisits: number;
  avgDurationSeconds: number;
}

export interface PageAnalyticsMetric {
  path: string;
  title: string;
  pageviews: number;
  uniqueVisitors: number;
  avgDurationFormatted: string;
  bounceRate: string;
}

export interface TrafficSourceMetric {
  source: string;
  visitors: number;
  percentage: number;
  conversionRate: string;
}

export interface AnalyticsMatrixSummary {
  measurementId: string;
  isLiveConnected: boolean;
  timeRange: 'today' | '7days' | '30days';
  // 4 Primary requested metrics:
  uniqueVisitors: number;
  uniqueVisitorsChange: number; // e.g. +14.8%
  pageviews: number;
  pageviewsChange: number; // e.g. +22.4%
  avgVisitDurationFormatted: string; // e.g. "2m 45s"
  avgVisitDurationSeconds: number;
  avgVisitDurationChange: number; // e.g. +12.3%
  newVisits: number;
  newVisitsPercent: number; // e.g. 74.5%
  newVisitsChange: number; // e.g. +8.2%
  // Additional matrix dimensions:
  activeUsersNow: number;
  totalOrders: number;
  conversionRate: string;
  dailyTrend: DailyMetricPoint[];
  topPages: PageAnalyticsMetric[];
  trafficSources: TrafficSourceMetric[];
}
