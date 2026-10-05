import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe2,
  Lock,
  Unlock,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Search,
  Server,
  Layers,
} from 'lucide-react';
import { UrlAnalysisResult } from '../types/scam.js';
import { analyzeUrlApi } from '../services/api.js';
import { RiskBadge } from '../components/ui/RiskBadge.js';
import { RiskScoreGauge } from '../components/ui/RiskScoreGauge.js';
import { useToast } from '../components/ui/Toast.js';

interface UrlScannerPageProps {
  onScanCompleted?: () => void;
}

export const UrlScannerPage: React.FC<UrlScannerPageProps> = ({ onScanCompleted }) => {
  const { showToast } = useToast();
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UrlAnalysisResult | null>(null);

  const sampleUrls = [
    { label: 'Suspicious IP Host', url: 'http://192.168.1.1/login-verify.php' },
    { label: 'Phishing Keyword TLD', url: 'http://sbi-kyc-verify-portal.xyz/login' },
    { label: 'Shortened Link', url: 'https://bit.ly/claim-prize-reward-now' },
    { label: 'Safe Domain', url: 'https://www.google.com' },
  ];

  const handleScan = async (targetUrl?: string) => {
    const toScan = (targetUrl || urlInput).trim();
    if (!toScan) {
      setError('Please enter a web address (URL) to scan.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const data = await analyzeUrlApi(toScan);
      setResult(data);
      setUrlInput(toScan);
      showToast('URL security assessment complete', 'success');
      if (onScanCompleted) {
        onScanCompleted();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to scan URL. Please verify the web address.');
      showToast(err.message || 'Scan error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setUrlInput('');
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-left space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide">
          <Globe2 className="w-3.5 h-3.5" />
          <span>PHISHING & DESTINATION DEFENSE</span>
        </div>
        <h1 className="text-3xl font-black text-[#0B1220] tracking-tight">
          URL & Web Address Scanner
        </h1>
        <p className="text-sm text-slate-600">
          Inspect suspicious hyperlinks before tapping or clicking. Detect raw IP hosts, high-abuse TLDs, shortened redirect masks, and phishing indicators.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card-subtle p-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="url-input" className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Web Address to Inspect
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Globe2 className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="url-input"
                type="text"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  if (error) setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleScan();
                }}
                placeholder="https://example.com/login or http://sbi-kyc-verify.xyz"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm font-mono text-slate-800 transition-all"
              />
            </div>
            <button
              onClick={() => handleScan()}
              disabled={loading || !urlInput.trim()}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-blue transition-all shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Inspecting...' : 'Scan URL'}</span>
            </button>
          </div>
        </div>

        {/* Quick Sample URLs */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Try sample links:</span>
          {sampleUrls.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setUrlInput(s.url);
                handleScan(s.url);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
            {error}
          </div>
        )}
      </div>

      {/* Result Display */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          {/* Main Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card-subtle p-6 md:p-8 relative overflow-hidden">
            <div
              className={`absolute top-0 left-0 right-0 h-1.5 ${
                result.riskLevel === 'HIGH'
                  ? 'bg-red-600'
                  : result.riskLevel === 'SUSPICIOUS'
                  ? 'bg-amber-500'
                  : 'bg-emerald-600'
              }`}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Score Left */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50/60 rounded-2xl border border-slate-100">
                <RiskScoreGauge score={result.riskScore} level={result.riskLevel} />
              </div>

              {/* Info Right */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <RiskBadge level={result.riskLevel} size="lg" />
                  <span className="text-xs font-mono font-semibold bg-slate-100 px-3 py-1 rounded-full text-slate-700">
                    {result.domain}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#0B1220]">
                    {result.riskLevel === 'HIGH'
                      ? 'High-Risk Suspicious Link'
                      : result.riskLevel === 'SUSPICIOUS'
                      ? 'Suspicious URL Structure'
                      : 'Standard Legitimate Domain'}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {result.explanation}
                  </p>
                </div>

                {/* Technical properties pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2">
                    {result.isHttps ? (
                      <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Unlock className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Protocol</div>
                      <div className="font-semibold text-slate-800">{result.isHttps ? 'HTTPS' : 'Insecure HTTP'}</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2">
                    <Server className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Host Type</div>
                      <div className="font-semibold text-slate-800">{result.hasIpAddress ? 'Raw IP Address' : 'Domain Name'}</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-600 shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Shortener</div>
                      <div className="font-semibold text-slate-800">{result.isShortener ? 'Yes (Masked)' : 'Direct Link'}</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Abuse TLD</div>
                      <div className="font-semibold text-slate-800">{result.suspiciousTld ? 'Flagged' : 'Standard'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Characteristics & Red Flags */}
          {result.characteristics.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card-subtle p-6 space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Detailed Security Characteristics
              </h4>
              <div className="space-y-2">
                {result.characteristics.map((char, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{char}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card-subtle p-6 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Safety Advice for this Link
            </h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800"
                >
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Scan Another Address</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
