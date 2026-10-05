import React from 'react';
import { SuspiciousPhrase } from '../../types/scam.js';

interface SuspiciousPhraseHighlighterProps {
  originalText: string;
  phrases: SuspiciousPhrase[];
}

export const SuspiciousPhraseHighlighter: React.FC<SuspiciousPhraseHighlighterProps> = ({
  originalText,
  phrases,
}) => {
  if (!originalText) return null;

  if (!phrases || phrases.length === 0) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
        {originalText}
      </div>
    );
  }

  // Create a regex to match any of the phrases
  // Clean phrases to match safely
  const escapeRegex = (s: string) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const validPhrases = phrases.map((p) => p.phrase.trim()).filter((p) => p.length > 2);

  if (validPhrases.length === 0) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
        {originalText}
      </div>
    );
  }

  const pattern = new RegExp(`(${validPhrases.map(escapeRegex).join('|')})`, 'gi');
  const parts = originalText.split(pattern);

  return (
    <div className="space-y-3">
      <div className="p-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed shadow-sm">
        {parts.map((part, i) => {
          const matchPhrase = phrases.find(
            (p) => p.phrase.toLowerCase() === part.toLowerCase()
          );

          if (matchPhrase) {
            return (
              <mark
                key={i}
                className="bg-amber-100 text-amber-900 border-b-2 border-amber-500 px-1 py-0.5 rounded font-semibold transition-all hover:bg-amber-200 cursor-help inline-block mx-0.5"
                title={`Flagged Trigger: ${matchPhrase.category} (+${matchPhrase.riskWeight} points)`}
              >
                {part}
              </mark>
            );
          }

          return <span key={i}>{part}</span>;
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Detected Trigger Elements:
        </span>
        {phrases.map((p, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 border border-amber-200 text-amber-800"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span className="font-semibold">"{p.phrase}"</span>
            <span className="text-slate-400 text-[10px]">({p.category})</span>
          </span>
        ))}
      </div>
    </div>
  );
};
