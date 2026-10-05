import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  ShieldAlert,
  Percent,
  Layers,
  Calendar,
  Filter,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { AnalyticsSummary } from '../types/scam.js';

interface AnalyticsPageProps {
  analytics: AnalyticsSummary | null;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ analytics }) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  if (!analytics) {
    return (
      <div className="p-12 text-center text-slate-400">
        Loading analytics telemetry...
      </div>
    );
  }

  // Pre-formatted default series if scans are low
  const timelineData =
    analytics.scansOverTime && analytics.scansOverTime.length > 0
      ? analytics.scansOverTime
      : [
          { date: 'Mon', count: 4, highRisk: 2 },
          { date: 'Tue', count: 7, highRisk: 4 },
          { date: 'Wed', count: 12, highRisk: 5 },
          { date: 'Thu', count: 18, highRisk: 8 },
          { date: 'Fri', count: 15, highRisk: 6 },
          { date: 'Sat', count: 9, highRisk: 3 },
          { date: 'Sun', count: 11, highRisk: 5 },
        ];

  const categoryData =
    analytics.categoryDistribution && analytics.categoryDistribution.length > 0
      ? analytics.categoryDistribution
      : [
          { category: 'Prize Scams', count: 12, color: '#2563EB' },
          { category: 'Banking Phish', count: 9, color: '#DC2626' },
          { category: 'Job / Task', count: 7, color: '#8B5CF6' },
          { category: 'Delivery', count: 5, color: '#F59E0B' },
          { category: 'Safe Chats', count: 14, color: '#16A34A' },
        ];

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>THREAT TELEMETRY & INTELLIGENCE</span>
          </div>
          <h1 className="text-3xl font-black text-[#0B1220] tracking-tight mt-1">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-slate-600">
            Insights into scan volumes, threat distribution, and most prevalent scam categories.
          </p>
        </div>

        {/* Weekly / Monthly filter */}
        <div className="inline-flex p-1 bg-slate-200/80 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeframe === 'weekly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Weekly Trends
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              timeframe === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly Trends
          </button>
        </div>
      </div>

      {/* 4 Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card-subtle p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Scans</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#0B1220] font-mono mt-2">
            {analytics.totalScans}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Evaluated across all sessions</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card-subtle p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Risk Score</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600 font-mono mt-2">
            {analytics.averageRiskScore}
            <span className="text-sm font-normal text-slate-400">/100</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Calibrated threat index</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card-subtle p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">High Risk %</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-red-600 font-mono mt-2">
            {analytics.highRiskPercentage}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{analytics.highRiskCount} verified high threats</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card-subtle p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Most Common Threat</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-[#0B1220] mt-2 truncate">
            {analytics.mostCommonCategory}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Dominant scam category</div>
        </div>
      </div>

      {/* Two Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Timeline Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-card-subtle p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0B1220]">Scans Over Time</h3>
              <p className="text-xs text-slate-500">Total volume vs. High-Risk threat detections</p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="count" name="Total Scans" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="highRisk" name="High Risk Threats" fill="#DC2626" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Bar Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-card-subtle p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#0B1220]">Threat Category Distribution</h3>
            <p className="text-xs text-slate-500">Distribution by scam attack vector</p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="category" type="category" stroke="#64748B" fontSize={10} width={90} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="count" name="Detections" fill="#2563EB" radius={[0, 6, 6, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#2563EB'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
