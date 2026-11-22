import React, { useState } from 'react';
import TopNav from './components/TopNav';
import PaytmOneHub from './components/PaytmOneHub';
import ActionModeView from './components/ActionModeView';
import ResolveModeView from './components/ResolveModeView';
import ArchitectureFlow from './components/ArchitectureFlow';
import Footer from './components/Footer';
import UpiPinModal from './components/UpiPinModal';
import NexconnModal from './components/NexconnModal';
import ServiceModal from './components/ServiceModal';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  // Language State: 'en' (English) | 'hi' (Hindi)
  const [language, setLanguage] = useState('en');

  // Navigation View: 'hub' (Paytm ONE Hub Landing) | 'action' (Action Mode UI) | 'resolve' (Resolve Mode UI) | 'architecture' (Architecture Flow)
  const [currentView, setCurrentView] = useState('hub');
  const [initialQuery, setInitialQuery] = useState('');
  const [autoExecute, setAutoExecute] = useState(false);

  // Modals
  const [pinModalData, setPinModalData] = useState(null);
  const [nexconnData, setNexconnData] = useState(null);
  const [serviceModal, setServiceModal] = useState(null);

  const navigateToMode = (mode, query = '', execute = false) => {
    setInitialQuery(query);
    setAutoExecute(execute);
    setCurrentView(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 antialiased selection:bg-[#0052ff] selection:text-white">
      
      {/* 1. Global Navigation Bar with Language Switcher (EN & HI) */}
      <TopNav
        language={language}
        onLanguageChange={(newLang) => setLanguage(newLang)}
        activeView={currentView}
        onSelectView={(view) => {
          setInitialQuery('');
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 2. Main Content View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-12">
        <ErrorBoundary onReset={() => setCurrentView('hub')}>
          {currentView === 'architecture' ? (
            /* ========================================================
               PRESENTATION VIEW: MULTI-AGENT ARCHITECTURE FLOW
               Supports: Action Flow, Resolve Flow & Parallel Architecture
               ======================================================== */
            <ArchitectureFlow
              language={language}
              onClose={() => setCurrentView('hub')}
            />
          ) : currentView === 'action' ? (
            /* ========================================================
               DEDICATED ACTION MODE UI: AUTONOMOUS EXECUTION
               Recharges, Travel, Bills, Shopping, Gold + Zero-Trust Human Auth
               ======================================================== */
            <ActionModeView
              language={language}
              initialQuery={initialQuery}
              autoExecute={autoExecute}
              onBack={() => setCurrentView('hub')}
              onSwitchToResolve={(q) => navigateToMode('resolve', q, false)}
              onOpenPinModal={(data) => setPinModalData(data)}
            />
          ) : currentView === 'resolve' ? (
            /* ========================================================
               DEDICATED RESOLVE MODE UI: FORENSIC DISPUTE RECOVERY
               3-Way Reconciliation Matrix + RBI Citations + Nexconn Live
               ======================================================== */
            <ResolveModeView
              language={language}
              initialQuery={initialQuery}
              autoExecute={autoExecute}
              onBack={() => setCurrentView('hub')}
              onSwitchToAction={(q) => navigateToMode('action', q, false)}
              onOpenNexconn={(data) => setNexconnData(data)}
            />
          ) : (
            /* ========================================================
               FLAGSHIP LANDING PAGE: PAYTM ONE CONVERSATIONAL HUB
               Hero Banner, Multimodal Search with Auto-Redirect, 2 Pillars
               ======================================================== */
            <PaytmOneHub
              language={language}
              onNavigateToMode={navigateToMode}
              onLaunchArchitecture={() => setCurrentView('architecture')}
              onOpenPinModal={(data) => setPinModalData(data)}
              onOpenNexconn={(data) => setNexconnData(data)}
            />
          )}
        </ErrorBoundary>
      </main>

      {/* 3. Institutional Footer */}
      <Footer />

      {/* ================= MODALS & OVERLAYS ================= */}

      {/* UPI PIN NPCI AUTHORIZATION MODAL */}
      {pinModalData && (
        <UpiPinModal
          paymentData={pinModalData}
          onClose={() => setPinModalData(null)}
          onComplete={() => setPinModalData(null)}
        />
      )}

      {/* NEXCONN REAL-TIME WEBSOCKET DISPUTE SUPPORT CHAT MODAL */}
      {nexconnData && (
        <NexconnModal
          sessionData={nexconnData}
          onClose={() => setNexconnData(null)}
        />
      )}

      {/* OPTIONAL SERVICE MODAL */}
      {serviceModal && (
        <ServiceModal
          serviceId={serviceModal}
          onClose={() => setServiceModal(null)}
          onOpenPinModal={(data) => setPinModalData(data)}
          onLaunchAiWithPrompt={(p) => {
            setServiceModal(null);
            setCurrentView('hub');
          }}
        />
      )}

    </div>
  );
}