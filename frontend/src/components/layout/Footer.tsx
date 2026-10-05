import React from 'react';
import { Shield, Lock, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 px-4 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-medium">
          <Shield className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-[#0B1220]">AI Scam Guardian</span>
          <span className="text-slate-400">— AI for Everyday Life</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero Knowledge: Analyzed communications are securely evaluated and never shared.</span>
        </div>

        <div className="text-slate-400 text-[11px]">
          Assistance tool. Always independently verify important communications.
        </div>
      </div>
    </footer>
  );
};
