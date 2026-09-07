/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  BarChart3,
  Users,
  Eye,
  Clock,
  UserPlus,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Copy,
  ExternalLink,
  RefreshCw,
  Activity,
  Send,
  HelpCircle,
  TrendingUp,
  Settings,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { gaService } from '../services/googleAnalytics';
import { AnalyticsMatrixSummary, GAEventLog } from '../types';

interface AnalyticsMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsMatrixModal: React.FC<AnalyticsMatrixModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days'>('7days');
  const [matrixData, setMatrixData] = useState<AnalyticsMatrixSummary>(() =>
    gaService.getMatrixData('7days')
  );
  const [eventLogs, setEventLogs] = useState<GAEventLog[]>([]);
  const [measurementIdInput, setMeasurementIdInput] = useState(gaService.getMeasurementId());
  const [isEditingId, setIsEditingId] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [testSentNotice, setTestSentNotice] = useState(false);
  const [activeTab, setActiveTab] = useState<'matrix' | 'events' | 'setup'>('matrix');

  useEffect(() => {
    if (!isOpen) return;

    // Track modal view
    gaService.trackPageView('/admin/analytics-matrix', 'Google Analytics Matrix Dashboard');

    const unsubscribeEvents = gaService.subscribeEvents((logs) => {
      setEventLogs(logs);
    });

    const unsubscribeMatrix = gaService.subscribeMatrix((matrix) => {
      setMatrixData(matrix);
    });

    // Update with current timeframe
    setMatrixData(gaService.getMatrixData(timeRange));

    return () => {
      unsubscribeEvents();
      unsubscribeMatrix();
    };
  }, [isOpen, timeRange]);

  const handleTimeRangeChange = (range: 'today' | '7days' | '30days') => {
    setTimeRange(range);
    setMatrixData(gaService.getMatrixData(range));
    gaService.trackEvent('analytics_range_changed', { time_range: range });
  };

  const handleSaveMeasurementId = (e: React.FormEvent) => {
    e.preventDefault();
    gaService.setMeasurementId(measurementIdInput);
    setIsEditingId(false);
    setMatrixData(gaService.getMatrixData(timeRange));
  };

  const handleSendTestEvent = () => {
    gaService.trackEvent('test_ping_event', {
      source: 'analytics_matrix_modal',
      timestamp: new Date().toISOString(),
      shop_section: 'flower_catalog',
    });
    setTestSentNotice(true);
    setTimeout(() => setTestSentNotice(false), 2000);
  };

  const gaSnippetCode = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${matrixData.measurementId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${matrixData.measurementId}');
</script>`;

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(gaSnippetCode);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  if (!isOpen) return null;

  // Pie data for New vs Returning
  const visitorPieData = [
    { name: 'New Visits', value: matrixData.newVisits, color: '#C06043' },
    {
      name: 'Returning Visits',
      value: matrixData.uniqueVisitors - matrixData.newVisits,
      color: '#4B634E',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-fade-in">
      <div className="relative bg-[#FAF8F5] w-full max-w-6xl rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E8E4DD] overflow-hidden my-4 max-h-[94vh] flex flex-col">
        {/* Modal Header & Connection Status */}
        <div className="p-4 sm:p-6 border-b border-[#E8E4DD] bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#F3F6F2] border border-[#D5DDD2] text-[#C06043] flex items-center justify-center shrink-0">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2C2926]">
                  Google Analytics Matrix & Hub
                </h3>
                {matrixData.isLiveConnected ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    GA4 Stream Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Simulator Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-[#736E67] mt-0.5">
                Real-time tracking of Unique Visitors, Pageviews, Visit Duration & New Visits for Petal & Stem.
              </p>
            </div>
          </div>

          {/* Right Controls: Measurement ID & Close */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Measurement ID Chip / Quick Edit */}
            {isEditingId ? (
              <form onSubmit={handleSaveMeasurementId} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={measurementIdInput}
                  onChange={(e) => setMeasurementIdInput(e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="px-2.5 py-1.5 text-xs font-mono rounded-lg border border-[#D5DDD2] bg-white focus:outline-none focus:ring-1 focus:ring-[#2E3F30] w-36"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1.5 rounded-lg bg-[#2E3F30] text-white text-xs font-semibold hover:bg-[#3D5240] cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingId(false)}
                  className="px-2 py-1.5 rounded-lg bg-gray-100 text-[#5A554E] text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 bg-[#F3F6F2] border border-[#D5DDD2] px-3 py-1.5 rounded-xl">
                <span className="text-[11px] text-[#736E67] font-medium">Tag ID:</span>
                <span className="font-mono text-xs font-bold text-[#2E3F30]">
                  {matrixData.measurementId}
                </span>
                <button
                  onClick={() => setIsEditingId(true)}
                  className="text-[11px] text-[#C06043] hover:underline font-semibold ml-1 cursor-pointer flex items-center gap-1"
                  title="Configure your own Google Analytics Measurement ID"
                >
                  <Settings className="w-3 h-3" /> Change
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full hover:bg-[#F3F6F2] text-[#5A554E] flex items-center justify-center transition-colors cursor-pointer ml-auto"
              aria-label="Close Analytics modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-header Navigation Tabs & Actions */}
        <div className="px-4 sm:px-6 py-3 bg-[#FAF8F5] border-b border-[#E8E4DD] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'matrix'
                  ? 'bg-[#2E3F30] text-white'
                  : 'bg-white text-[#5A554E] hover:bg-[#F3F6F2] border border-[#E8E4DD]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Analytic Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 relative ${
                activeTab === 'events'
                  ? 'bg-[#2E3F30] text-white'
                  : 'bg-white text-[#5A554E] hover:bg-[#F3F6F2] border border-[#E8E4DD]'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>Live Telemetry Stream</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#E4EAE2] text-[#2E3F30] font-bold">
                {eventLogs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('setup')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'setup'
                  ? 'bg-[#2E3F30] text-white'
                  : 'bg-white text-[#5A554E] hover:bg-[#F3F6F2] border border-[#E8E4DD]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#C06043]" />
              <span>GA4 Setup Guide</span>
            </button>
          </div>

          <div className="flex items-center gap-2 justify-between sm:justify-end">
            {activeTab === 'matrix' && (
              <div className="flex items-center bg-white border border-[#D5DDD2] rounded-lg p-0.5 text-xs font-medium">
                {(['today', '7days', '30days'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleTimeRangeChange(r)}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      timeRange === r
                        ? 'bg-[#2E3F30] text-white font-semibold shadow-xs'
                        : 'text-[#5A554E] hover:text-[#2C2926]'
                    }`}
                  >
                    {r === 'today' ? 'Today' : r === '7days' ? 'Last 7 Days' : 'Last 30 Days'}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={handleSendTestEvent}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#F3F6F2] border border-[#D5DDD2] text-[#2E3F30] text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Dispatches a test event to gtag.js"
            >
              <Send className="w-3 h-3 text-[#C06043]" />
              <span>{testSentNotice ? 'Event Sent!' : 'Ping Test Event'}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'matrix' ? (
            <>
              {/* THE 4 PRIMARY REQUESTED METRICS (Analytic Matrix Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. UNIQUE VISITORS */}
                <div className="p-5 rounded-2xl bg-white border border-[#E8E4DD] shadow-xs space-y-3 relative overflow-hidden group hover:border-[#CCD8C9] transition-all">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#F3F6F2] text-[#2E3F30] flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#4B634E]" />
                    </div>
                    <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />+{matrixData.uniqueVisitorsChange}%
                    </span>
                  </div>

                  <div>
                    <div className="text-xs uppercase font-semibold tracking-wider text-[#736E67]">
                      1. Unique Visitors
                    </div>
                    <div className="text-3xl font-serif font-bold text-[#2C2926] mt-1">
                      {matrixData.uniqueVisitors.toLocaleString()}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#F3F6F2] text-[11px] text-[#736E67] flex items-center justify-between">
                    <span>Active Now: {matrixData.activeUsersNow} visitors</span>
                    <span className="font-medium text-[#2E3F30]">Distinct Users</span>
                  </div>
                </div>

                {/* 2. PAGEVIEWS */}
                <div className="p-5 rounded-2xl bg-white border border-[#E8E4DD] shadow-xs space-y-3 relative overflow-hidden group hover:border-[#CCD8C9] transition-all">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF1ED] text-[#C06043] flex items-center justify-center">
                      <Eye className="w-5 h-5 text-[#C06043]" />
                    </div>
                    <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />+{matrixData.pageviewsChange}%
                    </span>
                  </div>

                  <div>
                    <div className="text-xs uppercase font-semibold tracking-wider text-[#736E67]">
                      2. Total Pageviews
                    </div>
                    <div className="text-3xl font-serif font-bold text-[#2C2926] mt-1">
                      {matrixData.pageviews.toLocaleString()}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#F3F6F2] text-[11px] text-[#736E67] flex items-center justify-between">
                    <span>
                      Avg: {(matrixData.pageviews / matrixData.uniqueVisitors).toFixed(1)} pages/session
                    </span>
                    <span className="font-medium text-[#2E3F30]">Bouquet & Cart Views</span>
                  </div>
                </div>

                {/* 3. AVERAGE VISIT DURATION */}
                <div className="p-5 rounded-2xl bg-white border border-[#E8E4DD] shadow-xs space-y-3 relative overflow-hidden group hover:border-[#CCD8C9] transition-all">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#F4F6F9] text-[#334E68] flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#334E68]" />
                    </div>
                    <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />+{matrixData.avgVisitDurationChange}%
                    </span>
                  </div>

                  <div>
                    <div className="text-xs uppercase font-semibold tracking-wider text-[#736E67]">
                      3. Avg Visit Duration
                    </div>
                    <div className="text-3xl font-serif font-bold text-[#2C2926] mt-1">
                      {matrixData.avgVisitDurationFormatted}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#F3F6F2] text-[11px] text-[#736E67] flex items-center justify-between">
                    <span>Current Session: {gaService.getSessionDurationSeconds()}s</span>
                    <span className="font-medium text-[#2E3F30]">Engaged Dwell Time</span>
                  </div>
                </div>

                {/* 4. NEW VISITS */}
                <div className="p-5 rounded-2xl bg-white border border-[#E8E4DD] shadow-xs space-y-3 relative overflow-hidden group hover:border-[#CCD8C9] transition-all">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#F7F2EC] text-[#8C6D46] flex items-center justify-center">
                      <UserPlus className="w-5 h-5 text-[#8C6D46]" />
                    </div>
                    <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />+{matrixData.newVisitsChange}%
                    </span>
                  </div>

                  <div>
                    <div className="text-xs uppercase font-semibold tracking-wider text-[#736E67]">
                      4. New Visits
                    </div>
                    <div className="text-3xl font-serif font-bold text-[#2C2926] mt-1">
                      {matrixData.newVisits.toLocaleString()}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#F3F6F2] text-[11px] text-[#736E67] flex items-center justify-between">
                    <span>{matrixData.newVisitsPercent}% of all visits</span>
                    <span className="font-medium text-[#2E3F30]">First-Time Discoveries</span>
                  </div>
                </div>
              </div>

              {/* Charts Grid: Daily Trend & Visitor Composition */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Daily Trend Area Chart */}
                <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-white border border-[#E8E4DD] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#2C2926]">
                        Traffic Matrix Trend
                      </h4>
                      <p className="text-xs text-[#736E67]">
                        Daily Unique Visitors vs. Total Pageviews over time
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-[#C06043]" />
                        <span className="text-[#5A554E] font-medium">Pageviews</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-[#4B634E]" />
                        <span className="text-[#5A554E] font-medium">Unique Visitors</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={matrixData.dailyTrend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                        <defs>
                          <linearGradient id="pageviewsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#C06043" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#C06043" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4B634E" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#4B634E" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0ECE6" />
                        <XAxis dataKey="displayDate" tick={{ fontSize: 11, fill: '#736E67' }} />
                        <YAxis tick={{ fontSize: 11, fill: '#736E67' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FAF8F5',
                            border: '1px solid #E8E4DD',
                            borderRadius: '12px',
                            fontSize: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="pageviews"
                          name="Pageviews"
                          stroke="#C06043"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#pageviewsGradient)"
                        />
                        <Area
                          type="monotone"
                          dataKey="uniqueVisitors"
                          name="Unique Visitors"
                          stroke="#4B634E"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#visitorsGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Visitor Composition Donut & Acquisition */}
                <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-white border border-[#E8E4DD] shadow-xs space-y-4 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#2C2926]">
                      Visitor Composition
                    </h4>
                    <p className="text-xs text-[#736E67]">
                      New First-Time Discoveries vs. Loyal Returning Customers
                    </p>
                  </div>

                  <div className="h-44 w-full relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={visitorPieData}
                          innerRadius={50}
                          outerRadius={75}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {visitorPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FAF8F5',
                            border: '1px solid #E8E4DD',
                            borderRadius: '8px',
                            fontSize: '11px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute text-center pointer-events-none">
                      <div className="font-serif text-xl font-bold text-[#2C2926]">
                        {matrixData.newVisitsPercent}%
                      </div>
                      <div className="text-[10px] text-[#736E67] uppercase font-bold">New Visits</div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#F0ECE6]">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#C06043]" />
                        <span className="text-[#5A554E]">New First-Time Visits</span>
                      </div>
                      <span className="font-bold text-[#2C2926]">
                        {matrixData.newVisits.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#4B634E]" />
                        <span className="text-[#5A554E]">Returning Flower Lovers</span>
                      </div>
                      <span className="font-bold text-[#2C2926]">
                        {(matrixData.uniqueVisitors - matrixData.newVisits).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Matrix Table: Top Bouquet Pages & Traffic Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Top Bouquet Pages Matrix Table */}
                <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-white border border-[#E8E4DD] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#2C2926]">
                        Top Flower Bouquet Performance
                      </h4>
                      <p className="text-xs text-[#736E67]">
                        Pageviews, unique visitors and dwell duration per flower arrangement
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E8E4DD] text-[#736E67] uppercase text-[10px] font-semibold tracking-wider">
                          <th className="pb-2.5">Bouquet & Page</th>
                          <th className="pb-2.5 text-right">Pageviews</th>
                          <th className="pb-2.5 text-right">Unique Visitors</th>
                          <th className="pb-2.5 text-right">Avg Duration</th>
                          <th className="pb-2.5 text-right">Bounce Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F3F6F2]">
                        {matrixData.topPages.map((page) => (
                          <tr key={page.path} className="hover:bg-[#FAF8F5] transition-colors">
                            <td className="py-2.5 pr-2">
                              <div className="font-medium text-[#2C2926]">{page.title}</div>
                              <div className="text-[10px] font-mono text-[#736E67]">{page.path}</div>
                            </td>
                            <td className="py-2.5 text-right font-semibold text-[#2E3F30]">
                              {page.pageviews.toLocaleString()}
                            </td>
                            <td className="py-2.5 text-right text-[#5A554E]">
                              {page.uniqueVisitors.toLocaleString()}
                            </td>
                            <td className="py-2.5 text-right font-mono text-[#C06043]">
                              {page.avgDurationFormatted}
                            </td>
                            <td className="py-2.5 text-right text-[#736E67]">
                              {page.bounceRate}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Traffic Acquisition Sources */}
                <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-white border border-[#E8E4DD] shadow-xs space-y-4">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#2C2926]">
                      Acquisition Channels
                    </h4>
                    <p className="text-xs text-[#736E67]">
                      Where flower lovers find Petal & Stem
                    </p>
                  </div>

                  <div className="space-y-3">
                    {matrixData.trafficSources.map((src) => (
                      <div key={src.source} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-[#2C2926]">{src.source}</span>
                          <span className="text-[#736E67]">{src.percentage}%</span>
                        </div>
                        <div className="w-full bg-[#F3F6F2] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#4B634E] h-full rounded-full"
                            style={{ width: `${src.percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-[#736E67]">
                          <span>{src.visitors} visitors</span>
                          <span className="text-emerald-700 font-semibold">{src.conversionRate} conv.</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : activeTab === 'events' ? (
            /* LIVE TELEMETRY / EVENT STREAM */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-[#E8E4DD] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#2C2926]">
                    Live Google Analytics Event Stream
                  </h4>
                  <p className="text-xs text-[#736E67]">
                    Captures real-time actions dispatched to Google Analytics (<code className="font-mono text-[#C06043]">gtag.js</code>) as you click around the flower website.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => gaService.clearEventLogs()}
                    className="px-3 py-1.5 rounded-lg border border-[#D5DDD2] text-xs font-semibold text-[#736E67] hover:bg-[#F3F6F2] cursor-pointer"
                  >
                    Clear Stream
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {eventLogs.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-2xl border border-[#E8E4DD] space-y-2">
                    <Activity className="w-8 h-8 text-[#9E988F] mx-auto" />
                    <p className="text-xs font-medium text-[#2C2926]">No events captured yet</p>
                    <p className="text-[11px] text-[#736E67]">
                      Interact with bouquet cards, add flowers to cart, or click &ldquo;Ping Test Event&rdquo; above!
                    </p>
                  </div>
                ) : (
                  eventLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-white border border-[#E8E4DD] hover:border-[#CCD8C9] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#2C2926]">
                              {log.eventName}
                            </span>
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#FAF1ED] text-[#C06043] font-semibold uppercase">
                              {log.status === 'sent' ? 'Dispatched to GA4' : 'Simulated'}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-[#736E67] mt-0.5 max-w-xl truncate">
                            {JSON.stringify(log.params)}
                          </div>
                        </div>
                      </div>
                      <div className="text-[11px] font-mono text-[#736E67] text-right">
                        {log.timestamp}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* SETUP GUIDE & SNIPPET */
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-[#E8E4DD] space-y-5">
                <div className="space-y-1">
                  <h4 className="font-serif text-2xl font-bold text-[#2C2926]">
                    Connecting Your Google Analytics 4 (GA4) Account
                  </h4>
                  <p className="text-xs text-[#5A554E] leading-relaxed">
                    This website is already equipped with an enterprise-ready Google Analytics 4 integration. Follow these simple steps to link your personal or business Google Analytics account:
                  </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-[#F3F6F2] border border-[#D5DDD2] space-y-2">
                    <span className="w-6 h-6 rounded-full bg-[#2E3F30] text-white flex items-center justify-center font-bold text-xs">
                      1
                    </span>
                    <h5 className="font-bold text-[#2C2926]">Open Google Analytics</h5>
                    <p className="text-[#5A554E] text-[11px] leading-relaxed">
                      Visit <a href="https://analytics.google.com" target="_blank" rel="noreferrer" className="text-[#C06043] underline font-semibold">analytics.google.com</a> and sign in with your Google account.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F3F6F2] border border-[#D5DDD2] space-y-2">
                    <span className="w-6 h-6 rounded-full bg-[#2E3F30] text-white flex items-center justify-center font-bold text-xs">
                      2
                    </span>
                    <h5 className="font-bold text-[#2C2926]">Create Web Data Stream</h5>
                    <p className="text-[#5A554E] text-[11px] leading-relaxed">
                      Navigate to Admin &rarr; Data Streams &rarr; Add Stream &rarr; Web. Enter your website name and URL.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F3F6F2] border border-[#D5DDD2] space-y-2">
                    <span className="w-6 h-6 rounded-full bg-[#2E3F30] text-white flex items-center justify-center font-bold text-xs">
                      3
                    </span>
                    <h5 className="font-bold text-[#2C2926]">Copy Measurement ID</h5>
                    <p className="text-[#5A554E] text-[11px] leading-relaxed">
                      Find your Measurement ID starting with <code className="font-mono font-bold text-[#C06043]">G-XXXXXXXXXX</code> in the stream details.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F3F6F2] border border-[#D5DDD2] space-y-2">
                    <span className="w-6 h-6 rounded-full bg-[#2E3F30] text-white flex items-center justify-center font-bold text-xs">
                      4
                    </span>
                    <h5 className="font-bold text-[#2C2926]">Paste in Top Header</h5>
                    <p className="text-[#5A554E] text-[11px] leading-relaxed">
                      Click &ldquo;Change&rdquo; in the top right of this dialog and paste your ID. The app immediately connects and streams live events!
                    </p>
                  </div>
                </div>

                {/* HTML Snippet Box */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#2C2926]">
                      Standard Global Site Tag (gtag.js) Code Snippet:
                    </span>
                    <button
                      onClick={handleCopySnippet}
                      className="inline-flex items-center gap-1.5 text-xs text-[#C06043] font-semibold hover:underline cursor-pointer"
                    >
                      {copiedSnippet ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy HTML Snippet</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="relative rounded-xl bg-[#2C2926] text-[#FAF8F5] p-4 font-mono text-xs overflow-x-auto">
                    <pre>{gaSnippetCode}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-4 border-t border-[#E8E4DD] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#736E67]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              Google Analytics Matrix Active • Measuring Unique Visitors, Pageviews, Avg Duration & New Visits
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#2E3F30] hover:bg-[#3D5240] text-white font-semibold text-xs cursor-pointer ml-auto"
          >
            Back to Flower Shop
          </button>
        </div>
      </div>
    </div>
  );
};
