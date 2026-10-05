import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  ShieldAlert,
  ArrowRight,
  BookOpen,
  X,
  AlertTriangle,
  Target,
  CheckCircle2,
  Clock,
  Sparkles,
  KeyRound,
  MailWarning,
  Briefcase,
  TrendingUp,
  Trophy,
  Landmark,
  Package,
} from 'lucide-react';
import { EducationArticle } from '../types/scam.js';
import { EDUCATION_ARTICLES } from '../data/educationArticles.js';

interface EducationPageProps {
  onAnalyzeExample?: (text: string) => void;
}

export const EducationPage: React.FC<EducationPageProps> = ({ onAnalyzeExample }) => {
  const [selectedArticle, setSelectedArticle] = useState<EducationArticle | null>(null);

  const getArticleIcon = (iconName: string) => {
    switch (iconName) {
      case 'MailWarning':
        return <MailWarning className="w-5 h-5 text-blue-600" />;
      case 'KeyRound':
        return <KeyRound className="w-5 h-5 text-amber-600" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-purple-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-amber-600" />;
      case 'Landmark':
        return <Landmark className="w-5 h-5 text-red-600" />;
      case 'Package':
        return <Package className="w-5 h-5 text-blue-600" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-left space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>CYBER SAFETY KNOWLEDGE BASE</span>
        </div>
        <h1 className="text-3xl font-black text-[#0B1220] tracking-tight">
          Learn to Spot the Signs
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          The best cyber defense is an informed decision. Explore real-world social engineering playbooks, warning signs, attacker motivations, and safe responses.
        </p>
      </div>

      {/* Grid of 8 Scam Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {EDUCATION_ARTICLES.map((article) => (
          <motion.div
            key={article.id}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedArticle(article)}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-card-subtle p-6 flex flex-col justify-between cursor-pointer hover:border-blue-400 hover:shadow-lg transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {getArticleIcon(article.icon)}
                </div>
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{article.readTime}</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-0.5">
                  {article.category}
                </span>
                <h3 className="text-base font-bold text-[#0B1220] leading-snug">
                  {article.title}
                </h3>
              </div>

              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                {article.summary}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span>Read Playbook</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200"
              role="dialog"
            >
              {/* Header */}
              <div className="bg-[#0B1220] text-white p-6 flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                    {selectedArticle.category} • {selectedArticle.readTime}
                  </span>
                  <h2 className="text-xl font-bold text-white">{selectedArticle.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 max-h-[72vh] overflow-y-auto space-y-6 text-sm">
                {/* 1. What it is */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>What It Is</span>
                  </h4>
                  <p className="text-slate-700 text-xs md:text-sm leading-relaxed">
                    {selectedArticle.whatItIs}
                  </p>
                </div>

                {/* 2. Common Warning Signs */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Common Warning Signs</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedArticle.warningSigns.map((sign, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-amber-950 font-medium"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Real Example Message */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Example Message
                  </h4>
                  <div className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-sans italic border border-slate-800 leading-relaxed">
                    {selectedArticle.exampleMessage}
                  </div>
                </div>

                {/* 4. What Scammers Want */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-red-600" />
                    <span>What Scammers Want</span>
                  </h4>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    {selectedArticle.attackerGoals}
                  </p>
                </div>

                {/* 5. How to Stay Safe */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>How to Stay Safe</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedArticle.safetySteps.map((step, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-950 font-medium"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
                {onAnalyzeExample && (
                  <button
                    onClick={() => {
                      const ex = selectedArticle.exampleMessage.replace(/[“”"]/g, '');
                      setSelectedArticle(null);
                      onAnalyzeExample(ex);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 shadow-sm"
                  >
                    <span>Test This Example in Analyzer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
