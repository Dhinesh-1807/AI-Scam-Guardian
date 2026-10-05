import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Lock,
  Search,
  CheckCircle2,
  Zap,
  Globe2,
  FileText,
  BadgeAlert,
  HelpCircle,
  Eye,
  ShieldAlert,
  Landmark,
  Briefcase,
  TrendingUp,
  Trophy,
  Package,
  KeyRound,
  Users,
} from 'lucide-react';

interface LandingPageProps {
  onStartAnalyze: () => void;
  onExploreFeatures: () => void;
  onSelectTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAnalyze,
  onExploreFeatures,
  onSelectTab,
}) => {
  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 px-4 max-w-7xl mx-auto text-center">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI FOR EVERYDAY LIFE — CYBER DEFENSE ASSISTANT</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-black text-[#0B1220] tracking-tight leading-[1.15]">
            Detect the Scam Before You Take the Bait.
          </h1>

          {/* Supporting Text */}
          <p className="text-base md:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            AI Scam Guardian analyzes suspicious messages and links, explains the warning signs in plain language, and helps you make safer digital decisions within seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <button
              onClick={onStartAnalyze}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-blue-600 text-white font-bold text-base hover:bg-blue-700 shadow-glow-blue transition-all"
            >
              <span>Analyze a Message</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectTab('learn')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-base hover:bg-slate-50 transition-colors shadow-sm"
            >
              <span>See How It Works</span>
            </button>
          </div>
        </motion.div>

        {/* Hero Visual: Cybersecurity Pipeline (Message -> AI Analysis -> Risk Detection -> Recommendation) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 max-w-5xl mx-auto bg-[#0B1220] rounded-3xl p-6 md:p-8 text-white shadow-2xl border border-slate-800"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 text-xs text-slate-400">
            <div className="flex items-center gap-2 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="ml-2 text-slate-300 font-semibold">guardian-ai://pipeline-inspection</span>
            </div>
            <div className="text-[11px] text-blue-400 font-medium">Real-Time Threat Vector Scoring</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
            {/* Step 1: Input */}
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  01 Incoming Message
                </span>
                <p className="text-xs text-slate-300 italic line-clamp-3">
                  "Congratulations! You won ₹50,000. Claim reward immediately, fee ₹499 required..."
                </p>
              </div>
              <div className="mt-3 text-[10px] text-amber-400 font-mono">Unverified Sender</div>
            </div>

            {/* Step 2: AI Analysis */}
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-blue-900/60 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                  02 Pattern Extraction
                </span>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>Urgency (+16 pts)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>Advance Fee (+22 pts)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>Link Intent (+20 pts)</span>
                  </li>
                </ul>
              </div>
              <div className="mt-3 text-[10px] text-blue-400 font-mono">Calibrated Rules Engine</div>
            </div>

            {/* Step 3: Risk Detection */}
            <div className="bg-red-950/40 rounded-2xl p-4 border border-red-900/60 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block mb-1">
                  03 Risk Detection
                </span>
                <div className="text-2xl font-black text-red-500 font-mono">92/100</div>
                <div className="text-xs font-bold text-red-300 mt-0.5">HIGH RISK DETECTED</div>
                <div className="text-[11px] text-slate-400 mt-1">Prize / Reward Scam</div>
              </div>
              <div className="mt-3 text-[10px] text-red-400 font-mono">Explainable AI Score</div>
            </div>

            {/* Step 4: Recommendation */}
            <div className="bg-emerald-950/40 rounded-2xl p-4 border border-emerald-900/60 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  04 Safe Next Steps
                </span>
                <p className="text-xs text-emerald-200 leading-snug">
                  • Do not pay the fee
                  <br />• Do not tap link
                  <br />• Official prizes never ask for advance fees
                </p>
              </div>
              <div className="mt-3 text-[10px] text-emerald-400 font-mono">Safer Alternative Ready</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. Problem Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 className="text-3xl font-extrabold text-[#0B1220] tracking-tight">
            Scams are becoming harder to recognize.
          </h2>
          <p className="text-sm md:text-base text-slate-600">
            Attackers use artificial intelligence, spoofed sender IDs, and psychological urgency to manipulate even tech-savvy individuals.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Landmark, title: 'Fake Bank Alerts', desc: 'Account suspension and urgent KYC threats.' },
            { icon: Trophy, title: 'Prize & Lottery Scams', desc: 'Unsolicited cash rewards requiring a processing fee.' },
            { icon: Briefcase, title: 'Recruitment & Job Fraud', desc: 'Prepaid commission tasks and fake work-from-home.' },
            { icon: TrendingUp, title: 'Investment & Crypto Schemes', desc: 'Guaranteed 100% daily returns with zero risk.' },
            { icon: KeyRound, title: 'OTP & Credential Harvesting', desc: 'Urgent requests asking for 6-digit cancellation codes.' },
            { icon: Package, title: 'Delivery & Courier Smishing', desc: 'Fake failed parcel delivery demanding small fees.' },
            { icon: Users, title: 'Impersonation Threats', desc: 'Police, customs, or family distress calls.' },
            { icon: Globe2, title: 'Malicious Links & Clones', desc: 'Spoofed lookalike portals capturing passwords.' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md transition-all space-y-2.5"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#0B1220]">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. How It Works (01 Paste, 02 Analyze, 03 Protect) */}
      <section className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Simple 3-Step Protection
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">How AI Scam Guardian Works</h2>
            <p className="text-slate-400 text-sm">
              Zero complicated configurations. Paste any message or link to evaluate threat indicators in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Paste Suspicious Input',
                desc: 'Paste any suspicious SMS, WhatsApp message, email, job offer, or payment request into the analyzer.',
              },
              {
                step: '02',
                title: 'Explainable AI Analysis',
                desc: 'The guardian scans for urgency tactics, credential harvesting, financial fraud patterns, and malicious URLs.',
              },
              {
                step: '03',
                title: 'Actionable Protection',
                desc: 'Receive a transparent score breakdown, identified red flags, and verified official alternatives to keep you safe.',
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3 relative overflow-hidden"
              >
                <div className="text-3xl font-black text-blue-400 font-mono opacity-80">{s.step}</div>
                <h3 className="text-lg font-bold text-white">{s.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. AI Detection Features */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-[#0B1220] tracking-tight">
            Architected for Serious Threat Detection
          </h2>
          <p className="text-sm text-slate-600">
            A startup-grade cybersecurity engine designed specifically for everyday non-technical users.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Message Analysis',
              desc: 'Deep multi-vector behavioral inspection of SMS, WhatsApp, and email communications.',
              icon: FileText,
            },
            {
              title: 'URL & Phishing Scanner',
              desc: 'Inspects web links, IP addresses, suspicious top-level domains, and credential capture keywords.',
              icon: Globe2,
            },
            {
              title: 'Scam Classification',
              desc: 'Automatically classifies communications into specific scam categories such as Prize, Job, Banking, or OTP fraud.',
              icon: BadgeAlert,
            },
            {
              title: 'Red Flag Detection',
              desc: 'Pinpoints specific manipulative phrases and psychological pressure tactics in human-readable terms.',
              icon: AlertTriangle,
            },
            {
              title: 'Transparent Risk Scoring',
              desc: 'Shows exactly why a score was assigned with open point breakdowns (+16 Urgency, +22 Financial, etc.).',
              icon: Search,
            },
            {
              title: 'Safer Alternative Guidance',
              desc: 'Provides the exact official action you should take instead of falling for the malicious prompt.',
              icon: CheckCircle2,
            },
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card-subtle space-y-3 hover:border-blue-300 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0B1220]">{feat.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Trust Section (Section 9) */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-slate-100 border border-slate-200 rounded-3xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#0B1220]">
            Built to help people understand digital risks — not to replace official verification.
          </h3>
          <p className="text-xs md:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            AI Scam Guardian operates with responsible cybersecurity principles. It never makes absolute claims, instead highlighting high-risk indicators and steering users toward verified official channels.
          </p>
          <div className="pt-2">
            <button
              onClick={onStartAnalyze}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-md"
            >
              <span>Test with a Demo Message</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
