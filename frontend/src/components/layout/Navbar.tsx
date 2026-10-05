import React, { useState } from 'react';
import {
  Shield,
  Menu,
  X,
  LayoutDashboard,
  MessageSquareWarning,
  Globe2,
  History,
  GraduationCap,
  BarChart3,
  Settings,
  Sparkles,
  User,
  LogOut,
} from 'lucide-react';
import { UserProfile } from '../../types/scam.js';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: UserProfile | null;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onLogout,
  onOpenAuth,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze Message', icon: MessageSquareWarning },
    { id: 'scan-url', label: 'Scan URL', icon: Globe2 },
    { id: 'history', label: 'History', icon: History },
    { id: 'learn', label: 'Learn', icon: GraduationCap },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5">
      <div className="flex items-center justify-between">
        {/* Left: Mobile hamburger & current view title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => onSelectTab('landing')}
            className="flex items-center gap-2 cursor-pointer lg:hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm text-[#0B1220] tracking-tight">
              Scam Guardian
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="text-slate-400">Workspace /</span>
            <span className="capitalize font-semibold text-slate-800">
              {currentTab.replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Right: Quick Action, Hackathon Tag, Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Analyze CTA if not already on analyze tab */}
          {currentTab !== 'analyze' && (
            <button
              onClick={() => onSelectTab('analyze')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyze Message</span>
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <div className="text-right hidden md:block">
                <div className="text-xs font-bold text-slate-800">{user.fullName || 'User'}</div>
                <div className="text-[10px] text-slate-400">{user.email}</div>
              </div>
              <button
                onClick={() => onSelectTab('settings')}
                className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold ring-2 ring-blue-100"
              >
                {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 space-y-1 pb-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          {user ? (
            <button
              onClick={() => {
                onLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onOpenAuth();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 hover:bg-blue-50"
            >
              <User className="w-4 h-4" />
              <span>Sign In / Demo Access</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
