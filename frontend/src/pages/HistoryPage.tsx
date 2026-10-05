import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  Search,
  Filter,
  Trash2,
  Eye,
  ArrowUpDown,
  FileText,
  Globe2,
  X,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { ScanRecord } from '../types/scam.js';
import { RiskBadge } from '../components/ui/RiskBadge.js';
import { formatDate } from '../lib/utils.js';
import { deleteScanApi } from '../services/api.js';
import { useToast } from '../components/ui/Toast.js';

interface HistoryPageProps {
  scans: ScanRecord[];
  onRefresh: () => void;
  onViewScan: (scan: ScanRecord) => void;
  onGoToAnalyzer: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  scans,
  onRefresh,
  onViewScan,
  onGoToAnalyzer,
}) => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'SAFE' | 'SUSPICIOUS' | 'HIGH'>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highestRisk'>('newest');
  const [activeModalScan, setActiveModalScan] = useState<ScanRecord | null>(null);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteScanApi(id);
      showToast('Scan deleted from history', 'info');
      onRefresh();
      if (activeModalScan?.id === id) {
        setActiveModalScan(null);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete scan', 'error');
    }
  };

  // Filter and sort
  const filteredScans = scans
    .filter((s) => {
      if (riskFilter !== 'ALL' && s.riskLevel !== riskFilter) {
        return false;
      }
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          s.inputText.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.explanation.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'highestRisk') {
        return b.riskScore - a.riskScore;
      }
      return 0;
    });

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide">
            <History className="w-3.5 h-3.5" />
            <span>AUDIT TRAIL</span>
          </div>
          <h1 className="text-3xl font-black text-[#0B1220] tracking-tight mt-1">
            Scan History
          </h1>
          <p className="text-sm text-slate-600">
            Review past message evaluations, identified threat vectors, and recommended security actions.
          </p>
        </div>

        <button
          onClick={onGoToAnalyzer}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 shadow-sm transition-all shrink-0 self-start sm:self-auto"
        >
          <span>Analyze New Message</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card-subtle p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search keywords, categories, or text..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-600 outline-none transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['ALL', 'HIGH', 'SUSPICIOUS', 'SAFE'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setRiskFilter(lvl)}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-colors shrink-0 ${
                riskFilter === lvl
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl === 'ALL' ? 'All Scans' : lvl === 'HIGH' ? 'High Risk' : lvl === 'SUSPICIOUS' ? 'Suspicious' : 'Safe'}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 outline-none focus:border-blue-600"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highestRisk">Highest Risk First</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card-subtle overflow-hidden">
        {filteredScans.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Preview</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredScans.map((scan) => (
                  <tr
                    key={scan.id}
                    onClick={() => setActiveModalScan(scan)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {formatDate(scan.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 uppercase">
                        {scan.scanType === 'url' ? <Globe2 className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                        <span>{scan.scanType}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate font-sans text-slate-900 font-normal">
                      "{scan.inputText}"
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-medium">
                      {scan.category}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold whitespace-nowrap">
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
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <RiskBadge level={scan.riskLevel} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewScan(scan);
                        }}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View Full Report"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(scan.id, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Scan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State (Section 45) */
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <History className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#0B1220]">No analyses found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchTerm || riskFilter !== 'ALL'
                  ? 'No scans match your current filter criteria. Try clearing search filters.'
                  : 'Analyze your first message to start building your safety history.'}
              </p>
            </div>
            <button
              onClick={onGoToAnalyzer}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 shadow-sm"
            >
              <span>Analyze a Message Now</span>
            </button>
          </div>
        )}
      </div>

      {/* Quick History Detail Modal */}
      <AnimatePresence>
        {activeModalScan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
            >
              <div className="bg-[#0B1220] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <RiskBadge level={activeModalScan.riskLevel} size="md" />
                  <span className="text-xs text-slate-400">{activeModalScan.category}</span>
                </div>
                <button
                  onClick={() => setActiveModalScan(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
                <div>
                  <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block mb-1">
                    Evaluated Input
                  </span>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-sans whitespace-pre-wrap">
                    "{activeModalScan.inputText}"
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Risk Score</span>
                    <span className="text-xl font-bold text-white font-mono">{activeModalScan.riskScore}/100</span>
                  </div>
                  {activeModalScan.scamPattern && (
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-slate-400 font-bold block">Pattern</span>
                      <span className="text-xs text-blue-300 font-semibold">{activeModalScan.scamPattern}</span>
                    </div>
                  )}
                </div>

                <div>
                  <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block mb-1">
                    Assessment Explanation
                  </span>
                  <p className="text-slate-700 leading-relaxed">{activeModalScan.explanation}</p>
                </div>

                {activeModalScan.saferAlternative && (
                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950">
                    <span className="font-bold uppercase tracking-wider text-blue-800 text-[10px] block mb-0.5">
                      Safer Alternative
                    </span>
                    <p className="leading-snug">{activeModalScan.saferAlternative}</p>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={(e) => handleDelete(activeModalScan.id, e)}
                  className="text-xs font-semibold text-red-600 hover:text-red-700"
                >
                  Delete Record
                </button>
                <button
                  onClick={() => {
                    const scan = activeModalScan;
                    setActiveModalScan(null);
                    onViewScan(scan);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700"
                >
                  Open Full Analysis
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
