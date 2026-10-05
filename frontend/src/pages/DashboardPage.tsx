import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  Activity,
  ChevronRight,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AnalyticsSummary, ScanRecord } from '../types/scam.js';
import { RiskBadge } from '../components/ui/RiskBadge.js';
import { formatDate } from '../lib/utils.js';

interface DashboardPageProps {
  analytics: AnalyticsSummary | null;
  recentScans: ScanRecord[];
  onAnalyzeNew: () => void;
  onViewScan: (scan: ScanRecord) => void;
  onViewAllHistory: () => void;
  userName?: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  analytics,
  recentScans,
  onAnalyzeNew,
  onViewScan,
  onViewAllHistory,
  userName,
}) => {
  // Dynamic greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const total = analytics?.totalScans ?? recentScans.length;
  const highRisk = analytics?.highRiskCount ?? recentScans.filter((s) => s.riskLevel === 'HIGH').length;
  const suspicious = analytics?.suspiciousCount ?? recentScans.filter((s) => s.riskLevel === 'SUSPICIOUS').length;
  const safe = analytics?.safeCount ?? recentScans.filter((s) => s.riskLevel === 'SAFE').length;

  const chartData = [
    { name: 'Safe Messages', value: safe || 1, color: '#16A34A' },
    { name: 'Suspicious Messages', value: suspicious || 1, color: '#F59E0B' },
    { name: 'High-Risk Threats', value: highRisk || 1, color: '#DC2626' },
  ];

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Top Banner Greeting */}
      <div className="bg-gradient-to-r from-[#0B1220] via-slate-900 to-blue-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Cyber Threat Shield Active</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {greeting}{userName ? `, ${userName}` : ''}
          </h1>
          <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
            Stay one step ahead of scams. Evaluate incoming SMS, emails, job offers, and payment requests with explainable AI.
          </p>
        </div>

        <div className="z-10 shrink-0">
          <button
            onClick={onAnalyzeNew}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-glow-blue transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze New Message</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Scans',
            value: total,
            icon: FileText,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-slate-200/90',
          },
          {
            label: 'High-Risk Detected',
            value: highRisk,
            icon: ShieldAlert,
            color: 'text-red-600',
            bg: 'bg-red-50',
            border: 'border-red-200/70',
          },
          {
            label: 'Suspicious Detected',
            value: suspicious,
            icon: AlertTriangle,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-200/70',
          },
          {
            label: 'Safe Messages',
            value: safe,
            icon: ShieldCheck,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-200/70',
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`bg-white rounded-2xl border ${stat.border} shadow-card-subtle p-5 flex items-center justify-between`}
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {stat.label}
                </div>
                <div className="text-3xl font-black text-[#0B1220] font-mono mt-1">
                  {stat.value}
                </div>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid: Risk Chart & Recent Scans */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Recharts Risk Distribution */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-card-subtle p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0B1220]">Risk Distribution</h3>
              <p className="text-xs text-slate-500">Breakdown across all analyzed messages</p>
            </div>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>

          <div className="h-64 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} message(s)`, 'Count']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-800 font-mono">{total}</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Scans</span>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
            {chartData.map((item, idx) => (
              <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] font-semibold text-slate-600 truncate">{item.name.split(' ')[0]}</span>
                </div>
                <div className="text-sm font-bold text-slate-800 font-mono">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Analyses Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-card-subtle p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0B1220]">Recent Analyses</h3>
              <p className="text-xs text-slate-500">Latest inspected communications</p>
            </div>
            <button
              onClick={onViewAllHistory}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View History</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-y border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Message Preview</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Risk Score</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {recentScans && recentScans.length > 0 ? (
                  recentScans.slice(0, 5).map((scan) => (
                    <tr key={scan.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                        {formatDate(scan.createdAt).split(',')[0]}
                      </td>
                      <td className="py-3 px-3 max-w-[200px] truncate font-sans text-slate-900 font-normal">
                        "{scan.inputText}"
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                        {scan.category}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold whitespace-nowrap">
                        <span
                          className={
                            scan.riskLevel === 'HIGH'
                              ? 'text-red-600'
                              : scan.riskLevel === 'SUSPICIOUS'
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }
                        >
                          {scan.riskScore}/100
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <RiskBadge level={scan.riskLevel} size="sm" />
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => onViewScan(scan)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-[11px] transition-colors"
                        >
                          View Analysis
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No analyses found. Click "Analyze New Message" to start protecting your inbox!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
