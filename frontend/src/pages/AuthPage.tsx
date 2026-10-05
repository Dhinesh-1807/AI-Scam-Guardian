import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, User, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured, setLocalDemoUser } from '../lib/supabase.js';
import { UserProfile } from '../types/scam.js';
import { useToast } from '../components/ui/Toast.js';

interface AuthPageProps {
  onSuccess: (user: UserProfile) => void;
  onCancel: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onCancel }) => {
  const { showToast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        if (isLogin) {
          const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (authError) throw authError;
          if (data.user) {
            const user: UserProfile = {
              id: data.user.id,
              email: data.user.email || email,
              fullName: data.user.user_metadata?.full_name || email.split('@')[0],
              role: 'user',
            };
            setLocalDemoUser(user);
            showToast('Welcome back! Successfully logged in.', 'success');
            onSuccess(user);
          }
        } else {
          const { data, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: fullName },
            },
          });
          if (authError) throw authError;
          if (data.user) {
            const user: UserProfile = {
              id: data.user.id,
              email: data.user.email || email,
              fullName: fullName || email.split('@')[0],
              role: 'user',
            };
            setLocalDemoUser(user);
            showToast('Account created! Signed in successfully.', 'success');
            onSuccess(user);
          }
        }
      } else {
        // High fidelity demo / offline auth
        const demoUser: UserProfile = {
          id: `demo-${Date.now()}`,
          email: email || 'demo.user@scamguardian.ai',
          fullName: fullName || (email ? email.split('@')[0] : 'Cybersecurity Analyst'),
          role: 'user',
        };
        setLocalDemoUser(demoUser);
        showToast('Logged in with Demo Session!', 'success');
        onSuccess(demoUser);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please check credentials.');
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemoLogin = () => {
    const demoUser: UserProfile = {
      id: 'demo-analyst-1',
      email: 'analyst@scamguardian.ai',
      fullName: 'Alex Morgan (Judge Demo)',
      role: 'security_analyst',
    };
    setLocalDemoUser(demoUser);
    showToast('Logged in as Demo Judge/Analyst!', 'success');
    onSuccess(demoUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
      >
        {/* Top Header */}
        <div className="bg-[#0B1220] text-white p-7 text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-3 shadow-glow-blue">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-black tracking-tight">AI Scam Guardian</h2>
          <p className="text-xs text-slate-400 mt-1">
            {isLogin ? 'Sign in to sync your threat audit history' : 'Create an account to track safe communications'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 md:p-8 space-y-5">
          {/* Toggle Login / Register */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                isLogin ? 'bg-white text-[#0B1220] shadow-sm' : 'text-slate-500'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                !isLogin ? 'bg-white text-[#0B1220] shadow-sm' : 'text-slate-500'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {!isLogin && (
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required={!isLogin}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-600 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@domain.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-600 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-700 shadow-glow-blue transition-all disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Guardian Account'}
            </button>
          </form>

          {/* Quick Hackathon Judge Demo Button */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              type="button"
              onClick={handleInstantDemoLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Instant 1-Click Demo Login (Hackathon Mode)</span>
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2 text-xs text-slate-500 hover:text-slate-700 font-medium"
            >
              Continue as Anonymous Guest
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
