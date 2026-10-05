import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  AlertCircle,
  Trash2,
  Send,
  ShieldAlert,
  ArrowRight,
  Info,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { AnalysisResult } from '../types/scam.js';
import { SAMPLE_PRESETS, DemoSample } from '../data/sampleScams.js';
import { analyzeMessageApi } from '../services/api.js';
import { LoadingAnalysis } from '../components/analyzer/LoadingAnalysis.js';
import { ResultSection } from '../components/analyzer/ResultSection.js';
import { useToast } from '../components/ui/Toast.js';

interface MessageAnalyzerPageProps {
  onScanCompleted?: () => void;
}

export const MessageAnalyzerPage: React.FC<MessageAnalyzerPageProps> = ({ onScanCompleted }) => {
  const { showToast } = useToast();
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzedMessage, setAnalyzedMessage] = useState('');

  const handleSelectSample = (sample: DemoSample) => {
    setMessageText(sample.text);
    setError(null);
    setResult(null);
    showToast(`Loaded "${sample.name}" into analyzer`, 'info');
  };

  const handleAnalyze = async () => {
    const trimmed = messageText.trim();
    if (!trimmed) {
      setError('Please paste or type a message before analyzing.');
      showToast('Please enter a message to analyze', 'error');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await analyzeMessageApi(trimmed);
      setResult(response);
      setAnalyzedMessage(trimmed);
      showToast('Analysis completed successfully!', 'success');
      if (onScanCompleted) {
        onScanCompleted();
      }
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setError(err.message || 'Analysis could not be completed. Please try again.');
      showToast(err.message || 'Analysis failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setMessageText('');
    setAnalyzedMessage('');
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-left space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>REAL-TIME THREAT DETECTOR</span>
        </div>
        <h1 className="text-3xl font-black text-[#0B1220] tracking-tight">
          Analyze a Suspicious Message
        </h1>
        <p className="text-sm text-slate-600">
          Paste an SMS, email, social media message, or payment request below. Our AI evaluates threat vectors, psychological manipulation, and dangerous links.
        </p>
      </div>

      {/* Analyzer Main Box or Result */}
      {loading ? (
        <LoadingAnalysis />
      ) : result ? (
        <ResultSection
          result={result}
          originalMessage={analyzedMessage}
          onReset={handleReset}
        />
      ) : (
        <div className="space-y-6">
          {/* Quick Demo Mode Preset Selector */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card-subtle p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Demo Presets — 1-Click Fast Hackathon Test
              </span>
              <span className="text-[11px] text-blue-600 font-semibold">Click to populate</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {SAMPLE_PRESETS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    messageText === sample.text
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : sample.expectedRisk === 'SAFE'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span>{sample.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                      messageText === sample.text
                        ? 'bg-white/20 text-white'
                        : sample.expectedRisk === 'SAFE'
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {sample.expectedScore}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Textarea Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card-subtle p-6 space-y-4 relative">
            {/* Input area */}
            <div className="space-y-2">
              <label
                htmlFor="message-input"
                className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between"
              >
                <span>Message Content to Inspect</span>
                <span className="font-mono text-slate-400 font-normal">
                  {messageText.length} characters
                </span>
              </label>

              <textarea
                id="message-input"
                value={messageText}
                onChange={(e) => {
                  setMessageText(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Paste the suspicious message here... (e.g. 'Congratulations! You have won ₹50,000. Claim your prize immediately by clicking the link below. A processing fee of ₹499 is required.')"
                className="w-full min-h-[260px] p-4 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 placeholder:text-slate-400 font-sans leading-relaxed resize-y transition-all"
              />
            </div>

            {/* Error display */}
            {error && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Credentials Saved • Evaluated Locally with Transparent Scoring</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {messageText.length > 0 && (
                  <button
                    onClick={() => setMessageText('')}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-slate-100 transition-colors"
                    title="Clear Input"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={loading || !messageText.trim()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-blue transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze with AI</span>
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Notice Banner */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Cybersecurity Notice:</strong> Do not paste passwords, OTPs, PINs, or highly sensitive financial credentials into the analyzer. AI Scam Guardian is designed to inspect suspicious message patterns, tone, and requests.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
