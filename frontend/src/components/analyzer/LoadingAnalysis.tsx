import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Check, Loader2 } from 'lucide-react';

interface LoadingAnalysisProps {
  onComplete?: () => void;
}

const STAGES = [
  'Scanning text & extracting structure',
  'Detecting social engineering patterns',
  'Checking credential & financial indicators',
  'Calculating transparent risk score',
  'Formulating actionable safety recommendations',
];

export const LoadingAnalysis: React.FC<LoadingAnalysisProps> = () => {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl p-8 max-w-lg mx-auto text-center overflow-hidden relative">
      {/* Animated cybersecurity radar line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        />
      </div>

      {/* Cyber shield pulse icon */}
      <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-2xl bg-blue-500/10 border border-blue-500/30"
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
        <Shield className="w-10 h-10 text-blue-600 relative z-10" />
      </div>

      <h3 className="text-xl font-bold text-[#0B1220] tracking-tight mb-1">
        AI Guardian Analyzing Message...
      </h3>
      <p className="text-xs text-slate-500 mb-6">
        Evaluating threat indicators across 7 defense vectors
      </p>

      {/* Steps progress list */}
      <div className="space-y-2.5 text-left max-w-sm mx-auto">
        {STAGES.map((stageText, idx) => {
          const isDone = idx < currentStage;
          const isCurrent = idx === currentStage;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                isDone
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : isCurrent
                  ? 'bg-blue-50 border-blue-200 text-blue-900 shadow-sm'
                  : 'bg-slate-50/50 border-transparent text-slate-400'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isDone ? (
                  <Check className="w-3 h-3 stroke-[3]" />
                ) : isCurrent ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  idx + 1
                )}
              </div>
              <span className={isCurrent ? 'font-semibold' : ''}>{stageText}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
