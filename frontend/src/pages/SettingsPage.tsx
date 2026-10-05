import React, { useState } from 'react';
import {
  Settings,
  User,
  Shield,
  Key,
  Server,
  Database,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { UserProfile } from '../types/scam.js';
import { isSupabaseConfigured, clearLocalDemoUser } from '../lib/supabase.js';
import { useToast } from '../components/ui/Toast.js';

interface SettingsPageProps {
  user: UserProfile | null;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ user, onLogout, onOpenAuth }) => {
  const { showToast } = useToast();
  const [sensitivity, setSensitivity] = useState<'standard' | 'strict'>('standard');

  const handleClearLocalData = () => {
    if (confirm('Clear local demo sessions and cached user preferences?')) {
      clearLocalDemoUser();
      showToast('Local preferences cleared', 'info');
      onLogout();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-left space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide">
          <Settings className="w-3.5 h-3.5" />
          <span>CONFIGURATION & PREFERENCES</span>
        </div>
        <h1 className="text-3xl font-black text-[#0B1220] tracking-tight">
          System Settings & Profile
        </h1>
        <p className="text-sm text-slate-600">
          Manage your AI analysis preferences, user profile, and cloud database integrations.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card-subtle p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#0B1220] flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <span>User Account</span>
          </h3>
          {user && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
              Active Session
            </span>
          )}
        </div>

        {user ? (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">Full Name</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{user.fullName}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 font-semibold block uppercase text-[10px]">Email Address</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{user.email}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
            <p className="text-xs text-slate-600">
              You are currently using AI Scam Guardian in Anonymous / Demo Mode.
            </p>
            <button
              onClick={onOpenAuth}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 shadow-sm"
            >
              Sign In or Create Account
            </button>
          </div>
        )}
      </div>

      {/* AI Engine & System Telemetry Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card-subtle p-6 space-y-4">
        <h3 className="text-base font-bold text-[#0B1220] flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-600" />
          <span>AI Engine Configuration</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="font-bold text-slate-800">Active AI Provider</div>
              <div className="text-slate-500 text-[11px]">
                Deterministic Rule-Based Threat Analyzer (Zero Latency + 100% Offline Demo Reliability)
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              OPERATIONAL
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="font-bold text-slate-800">Threat Sensitivity Level</div>
              <div className="text-slate-500 text-[11px]">
                Controls the weight multipliers for urgency and credential triggers
              </div>
            </div>
            <div className="flex p-0.5 bg-slate-200 rounded-lg">
              <button
                onClick={() => setSensitivity('standard')}
                className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  sensitivity === 'standard' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => setSensitivity('strict')}
                className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  sensitivity === 'strict' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Strict / Zero Trust
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="font-bold text-slate-800">Cloud Database (Supabase PostgreSQL)</div>
              <div className="text-slate-500 text-[11px]">
                {isSupabaseConfigured
                  ? 'Connected to configured Supabase project with Row Level Security'
                  : 'In-Memory Zero-Setup Demo Storage active (Supabase env keys optional)'}
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                isSupabaseConfigured
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {isSupabaseConfigured ? 'CONNECTED' : 'LOCAL DEMO DB'}
            </span>
          </div>
        </div>
      </div>

      {/* Deployment & Environment Helper */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-3 border border-slate-800">
        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
          <Code2 className="w-4 h-4" />
          <span>Production Deployment Ready</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          This full-stack application is preconfigured with complete environment isolation for <strong>Vercel (Frontend)</strong>, <strong>Render (Backend)</strong>, and <strong>Supabase (PostgreSQL)</strong>.
        </p>
        <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
          AI_PROVIDER=local | llm<br />
          PORT=5000<br />
          VITE_API_URL=http://localhost:5000/api
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card-subtle p-6 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-[#0B1220]">Clear Cached Demo Data</h4>
          <p className="text-xs text-slate-500">Resets locally stored session tokens and demo user state.</p>
        </div>
        <button
          onClick={handleClearLocalData}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset Demo Cache</span>
        </button>
      </div>
    </div>
  );
};
