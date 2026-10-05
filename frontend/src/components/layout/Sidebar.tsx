import React from 'react';
import {
  ShieldCheck,
  LayoutDashboard,
  MessageSquareWarning,
  Globe2,
  History,
  GraduationCap,
  BarChart3,
  Settings,
  LogOut,
  User,
  Shield,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../../types/scam.js';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: UserProfile | null;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onLogout,
  onOpenAuth,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze Message', icon: MessageSquareWarning, badge: 'Main' },
    { id: 'scan-url', label: 'Scan URL', icon: Globe2 },
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'learn', label: 'Learn & Prevent', icon: GraduationCap },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0B1220] text-slate-300 flex flex-col justify-between border-r border-slate-800 shrink-0 min-h-screen select-none">
      {/* Top: Logo & Brand */}
      <div>
        <div
          onClick={() => onSelectTab('landing')}
          className="p-5 flex items-center gap-3 cursor-pointer border-b border-slate-800/80 hover:bg-slate-900/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-glow-blue shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-base text-white tracking-tight flex items-center gap-1.5">
              <span>Scam Guardian</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 font-semibold px-1.5 py-0.5 rounded border border-blue-500/30">
                AI
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Cybersecurity Assistant</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-glow-blue'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-blue-900/60 text-blue-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Hackathon Badge & Profile */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        {/* Hackathon Callout */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 font-semibold text-blue-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI for Everyday Life</span>
          </div>
          <div>Explainable everyday threat protection for all.</div>
        </div>

        {/* User Card */}
        {user ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden text-left">
                <div className="text-xs font-semibold text-white truncate">{user.fullName || 'Active User'}</div>
                <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-colors"
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign In / Demo Guest</span>
          </button>
        )}
      </div>
    </aside>
  );
};
