import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  HelpCircle,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Lock,
  ArrowRight,
  Bookmark,
  Share2,
  FileCheck2,
} from 'lucide-react';
import { AnalysisResult } from '../../types/scam.js';
import { RiskBadge } from '../ui/RiskBadge.js';
import { RiskScoreGauge } from '../ui/RiskScoreGauge.js';
import { TrustBreakdownModal } from '../ui/TrustBreakdownModal.js';
import { SuspiciousPhraseHighlighter } from '../ui/SuspiciousPhraseHighlighter.js';
import { useToast } from '../ui/Toast.js';

interface ResultSectionProps {
  result: AnalysisResult;
  originalMessage: string;
  onReset: () => void;
}

export const ResultSection: React.FC<ResultSectionProps> = ({
  result,
  originalMessage,
  onReset,
}) => {
  const { showToast } = useToast();
  const [showTrustModal, setShowTrustModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyRecommendations = () => {
    const text = [
      `🛡️ AI Scam Guardian Recommendations for [${result.category}]:`,
      `Risk Score: ${result.riskScore}/100 (${result.riskLevel})`,
      '',
      ...result.recommendations.map((r, i) => `${i + 1}. ${r}`),
      '',
      `Safer Alternative: ${result.saferAlternative}`,
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Recommendations copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const isHighRisk = result.riskLevel === 'HIGH';
  const isSuspicious = result.riskLevel === 'SUSPICIOUS';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {/* 1. Main Header Card with Score and Primary Finding */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card-subtle p-6 md:p-8 overflow-hidden relative">
        {/* Subtle accent banner */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 ${
            isHighRisk ? 'bg-red-600' : isSuspicious ? 'bg-amber-500' : 'bg-emerald-600'
          }`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Score Gauge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50/60 rounded-2xl border border-slate-100">
            <RiskScoreGauge score={result.riskScore} level={result.riskLevel} />
            <button
              onClick={() => setShowTrustModal(true)}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 px-3 py-1.5 rounded-lg border border-blue-200/60 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Why Should I Trust This Result?</span>
            </button>
          </div>

          {/* Right: Category, Pattern & Summary */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <RiskBadge level={result.riskLevel} size="lg" />
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {result.category}
              </span>
              <span className="text-xs font-medium text-slate-400">
                Confidence: {Math.round(result.confidence * 100)}%
              </span>
            </div>

            {/* Headline */}
            <div>
              <h2 className="text-2xl font-extrabold text-[#0B1220] tracking-tight">
                {isHighRisk
                  ? 'Potential Scam Detected'
                  : isSuspicious
                  ? 'Suspicious Indicators Identified'
                  : 'Low Risk — Safe Communication'}
              </h2>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                {result.explanation}
              </p>
            </div>

            {/* Differentiator 2: Scam Pattern */}
            <div className="p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Identified Threat Pattern Formula
                </span>
                <span className="text-sm font-semibold text-blue-300 font-mono">
                  {result.scamPattern}
                </span>
              </div>
              <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded text-slate-300">
                Behavioral Analysis
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Why was this flagged? Vector Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Core Threat Vector Inspection
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Time Urgency', active: result.indicators.urgency },
            { label: 'Payment Request', active: result.indicators.financialRequest },
            { label: 'Credential / OTP', active: result.indicators.credentialRequest },
            { label: 'External Link', active: result.indicators.suspiciousLink },
            { label: 'Impersonation', active: result.indicators.impersonation },
            { label: 'Unrealistic Claim', active: result.indicators.unrealisticPromise },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-center transition-all ${
                item.active
                  ? 'bg-red-50/80 border-red-200 text-red-900 shadow-sm'
                  : 'bg-white border-slate-200/80 text-slate-400 opacity-70'
              }`}
            >
              <div className="text-xs font-medium text-slate-600 truncate">{item.label}</div>
              <div className="mt-1 flex items-center justify-center gap-1">
                {item.active ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                    <span className="text-xs font-bold text-red-700">Detected</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    <span className="text-xs text-slate-400">None</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Section 17: Suspicious Phrases Highlighted in Original Message */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card-subtle p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#0B1220]">
            Original Message with Flagged Trigger Elements
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Highlighted keywords influenced risk score
          </span>
        </div>
        <SuspiciousPhraseHighlighter
          originalText={originalMessage}
          phrases={result.suspiciousPhrases}
        />
      </div>

      {/* 4. Red Flags List */}
      {result.redFlags.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card-subtle p-6 space-y-4">
          <h3 className="text-base font-bold text-[#0B1220] flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <span>Specific Red Flags Identified</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.redFlags.map((flag, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50/50 border border-red-100 text-sm text-red-950"
              >
                <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  !
                </div>
                <span className="leading-snug">{flag}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Differentiator 3: Safer Alternative Action */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-lg border border-blue-800">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-300">
              Recommended Safer Alternative
            </div>
            <div className="text-base font-semibold text-white leading-relaxed">
              {result.saferAlternative}
            </div>
            <p className="text-xs text-blue-200/80 pt-1">
              Taking the official path protects your identity, accounts, and finances from social engineering traps.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Actionable Safety Recommendations & Buttons */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card-subtle p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base font-bold text-[#0B1220] flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-600" />
            <span>Recommended Next Steps</span>
          </h3>
          <button
            onClick={handleCopyRecommendations}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Recommendations</span>
              </>
            )}
          </button>
        </div>

        <ul className="space-y-2.5">
          {result.recommendations.map((rec, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-800"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <span className="leading-snug">{rec}</span>
            </li>
          ))}
        </ul>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-slate-400">
            Scan result automatically saved to your history.
          </div>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-md transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Analyze Another Message</span>
          </button>
        </div>
      </div>

      {/* Trust Breakdown Modal */}
      <TrustBreakdownModal
        isOpen={showTrustModal}
        onClose={() => setShowTrustModal(false)}
        factors={result.scoreBreakdown}
        totalScore={result.riskScore}
        category={result.category}
      />
    </motion.div>
  );
};
