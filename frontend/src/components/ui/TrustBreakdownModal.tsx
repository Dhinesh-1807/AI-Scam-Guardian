import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, HelpCircle, Layers, CheckCircle2 } from 'lucide-react';
import { ScoreFactor } from '../../types/scam.js';

interface TrustBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  factors: ScoreFactor[];
  totalScore: number;
  category: string;
}

export const TrustBreakdownModal: React.FC<TrustBreakdownModalProps> = ({
  isOpen,
  onClose,
  factors,
  totalScore,
  category,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="trust-modal-title"
          >
            {/* Header */}
            <div className="bg-[#0B1220] text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 id="trust-modal-title" className="text-lg font-bold text-white leading-tight">
                    Why Should I Trust This Result?
                  </h3>
                  <p className="text-xs text-slate-400">Explainable AI Scoring Breakdown</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  Unlike black-box AI engines that return opaque answers, <strong>AI Scam Guardian</strong> evaluates text against verified behavioral threat vectors, assigning calibrated weights to every detected signal.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <span>Detected Threat Factor</span>
                  <span>Impact Weight</span>
                </div>

                <div className="space-y-2">
                  {factors && factors.length > 0 ? (
                    factors.map((factor, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                      >
                        <div className="pr-4">
                          <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                            {factor.factor}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{factor.description}</div>
                        </div>
                        <div className="shrink-0 font-mono font-bold text-sm text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                          +{factor.points}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-slate-500 p-4 text-center">
                      Baseline conversational analysis. No adverse factors detected.
                    </div>
                  )}
                </div>
              </div>

              {/* Total Calculation Bar */}
              <div className="border-t border-slate-200 pt-4 flex items-center justify-between bg-slate-900 text-white p-4 rounded-xl">
                <div>
                  <div className="text-xs text-slate-400 uppercase font-semibold">Total Calibrated Score</div>
                  <div className="text-xs text-slate-300 font-medium">Scam Type: {category}</div>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {totalScore}
                  <span className="text-sm font-normal text-slate-400">/100</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Understood
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
