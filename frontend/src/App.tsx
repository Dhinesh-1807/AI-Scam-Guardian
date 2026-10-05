import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar.js';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { ToastProvider, useToast } from './components/ui/Toast.js';
import { LandingPage } from './pages/LandingPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { MessageAnalyzerPage } from './pages/MessageAnalyzerPage.js';
import { UrlScannerPage } from './pages/UrlScannerPage.js';
import { HistoryPage } from './pages/HistoryPage.js';
import { EducationPage } from './pages/EducationPage.js';
import { AnalyticsPage } from './pages/AnalyticsPage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { AuthPage } from './pages/AuthPage.js';
import { AnalyticsSummary, ScanRecord, UserProfile } from './types/scam.js';
import { getAnalyticsApi, getScansApi } from './services/api.js';
import { getLocalDemoUser, clearLocalDemoUser } from './lib/supabase.js';
import { ResultSection } from './components/analyzer/ResultSection.js';

function MainApp() {
  const { showToast } = useToast();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [user, setUser] = useState<UserProfile | null>(() => getLocalDemoUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [inspectedScan, setInspectedScan] = useState<ScanRecord | null>(null);

  // Fetch scans and analytics
  const refreshData = async () => {
    try {
      const [scansData, analyticsData] = await Promise.all([
        getScansApi().catch(() => []),
        getAnalyticsApi().catch(() => null),
      ]);
      setScans(scansData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.warn('Initial data load error:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleLogout = () => {
    clearLocalDemoUser();
    setUser(null);
    showToast('Signed out successfully', 'info');
  };

  const handleAuthSuccess = (loggedUser: UserProfile) => {
    setUser(loggedUser);
    setAuthModalOpen(false);
    if (currentTab === 'landing') {
      setCurrentTab('dashboard');
    }
  };

  const handleViewScan = (scan: ScanRecord) => {
    setInspectedScan(scan);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* If Landing Page */}
      {currentTab === 'landing' ? (
        <div className="min-h-screen flex flex-col">
          {/* Top Landing Nav */}
          <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div
                onClick={() => setCurrentTab('landing')}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-glow-blue">
                  <span className="font-black text-sm">SG</span>
                </div>
                <div>
                  <div className="font-extrabold text-base text-[#0B1220] tracking-tight">
                    AI Scam Guardian
                  </div>
                  <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                    AI for Everyday Life
                  </div>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
                <button
                  onClick={() => setCurrentTab('dashboard')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentTab('analyze')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Analyze Message
                </button>
                <button
                  onClick={() => setCurrentTab('scan-url')}
                  className="hover:text-blue-600 transition-colors"
                >
                  URL Scanner
                </button>
                <button
                  onClick={() => setCurrentTab('learn')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Scam Education
                </button>
                <button
                  onClick={() => setCurrentTab('analytics')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Threat Analytics
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentTab('analyze')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-glow-blue transition-all"
                >
                  <span>Launch Analyzer</span>
                </button>
                {user ? (
                  <button
                    onClick={() => setCurrentTab('dashboard')}
                    className="w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center"
                    title={user.fullName}
                  >
                    {user.fullName[0].toUpperCase()}
                  </button>
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="text-xs font-semibold text-slate-700 hover:text-blue-600 px-3 py-1.5"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1">
            <LandingPage
              onStartAnalyze={() => setCurrentTab('analyze')}
              onExploreFeatures={() => setCurrentTab('learn')}
              onSelectTab={(tab) => setCurrentTab(tab)}
            />
          </main>
          <Footer />
        </div>
      ) : (
        /* Authenticated / Dashboard Workspace Layout */
        <div className="flex-1 flex overflow-hidden">
          {/* Desktop Left Sidebar */}
          <div className="hidden lg:block">
            <Sidebar
              currentTab={currentTab}
              onSelectTab={(tab) => {
                setInspectedScan(null);
                setCurrentTab(tab);
              }}
              user={user}
              onLogout={handleLogout}
              onOpenAuth={() => setAuthModalOpen(true)}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            <Navbar
              currentTab={currentTab}
              onSelectTab={(tab) => {
                setInspectedScan(null);
                setCurrentTab(tab);
              }}
              user={user}
              onLogout={handleLogout}
              onOpenAuth={() => setAuthModalOpen(true)}
            />

            <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
              {inspectedScan ? (
                /* Detail inspection view for a saved scan */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setInspectedScan(null)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg"
                    >
                      ← Back to {currentTab}
                    </button>
                    <span className="text-xs text-slate-400">
                      Scan ID: {inspectedScan.id}
                    </span>
                  </div>
                  <ResultSection
                    result={{
                      riskScore: inspectedScan.riskScore,
                      riskLevel: inspectedScan.riskLevel,
                      category: inspectedScan.category,
                      confidence: inspectedScan.confidence,
                      redFlags: inspectedScan.redFlags || [],
                      suspiciousPhrases: inspectedScan.suspiciousPhrases || [],
                      recommendations: inspectedScan.recommendations || [],
                      explanation: inspectedScan.explanation,
                      indicators: inspectedScan.indicators || {
                        urgency: false,
                        financialRequest: false,
                        credentialRequest: false,
                        suspiciousLink: false,
                        impersonation: false,
                        unrealisticPromise: false,
                      },
                      scamPattern: inspectedScan.scamPattern || 'Pattern Detected',
                      saferAlternative: inspectedScan.saferAlternative || 'Verify independently.',
                      scoreBreakdown: inspectedScan.scoreBreakdown || [],
                      analyzedAt: inspectedScan.createdAt,
                      urlsFound: [],
                    }}
                    originalMessage={inspectedScan.inputText}
                    onReset={() => setInspectedScan(null)}
                  />
                </div>
              ) : (
                <>
                  {currentTab === 'dashboard' && (
                    <DashboardPage
                      analytics={analytics}
                      recentScans={scans}
                      onAnalyzeNew={() => setCurrentTab('analyze')}
                      onViewScan={handleViewScan}
                      onViewAllHistory={() => setCurrentTab('history')}
                      userName={user?.fullName}
                    />
                  )}

                  {currentTab === 'analyze' && (
                    <MessageAnalyzerPage onScanCompleted={refreshData} />
                  )}

                  {currentTab === 'scan-url' && (
                    <UrlScannerPage onScanCompleted={refreshData} />
                  )}

                  {currentTab === 'history' && (
                    <HistoryPage
                      scans={scans}
                      onRefresh={refreshData}
                      onViewScan={handleViewScan}
                      onGoToAnalyzer={() => setCurrentTab('analyze')}
                    />
                  )}

                  {currentTab === 'learn' && (
                    <EducationPage
                      onAnalyzeExample={(text) => {
                        setCurrentTab('analyze');
                      }}
                    />
                  )}

                  {currentTab === 'analytics' && (
                    <AnalyticsPage analytics={analytics} />
                  )}

                  {currentTab === 'settings' && (
                    <SettingsPage
                      user={user}
                      onLogout={handleLogout}
                      onOpenAuth={() => setAuthModalOpen(true)}
                    />
                  )}
                </>
              )}
            </main>

            <Footer />
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {authModalOpen && (
        <AuthPage
          onSuccess={handleAuthSuccess}
          onCancel={() => setAuthModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
