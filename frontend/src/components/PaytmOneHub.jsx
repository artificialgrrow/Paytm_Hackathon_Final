import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, ShieldCheck, Search, Mic, MicOff, Send, Sparkles, 
  Smartphone, Plane, Receipt, Car, ShoppingBag, Coins, 
  AlertCircle, Clock, Store, Layers, HelpCircle, CheckCircle2, 
  ArrowRight, KeyRound, MessageSquare, Volume2, Play, Pause, RefreshCw,
  ExternalLink, FileText, Shield, User, ChevronRight, Lock, Building2
} from 'lucide-react';
import { playSound } from '../utils/audio';
import { VoiceRecognition } from '../utils/speech';
import { translations } from '../data/translations';

export const PaytmOneHub = ({ 
  language = 'en', 
  onNavigateToMode,
  onLaunchArchitecture,
  onOpenPinModal, 
  onOpenNexconn
}) => {
  const t = translations[language] || translations.en;
  const isHindi = language === 'hi';

  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const voiceRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const langCode = isHindi ? 'hi-IN' : 'en-IN';
    voiceRef.current = new VoiceRecognition(
      (transcript, isFinal) => {
        setQuery(transcript);
        if (isFinal) {
          handleSearch(transcript);
        }
      },
      (listening) => setIsListening(listening)
    );
  }, [language]);

  const toggleVoice = () => {
    if (isListening) {
      voiceRef.current?.stop();
    } else {
      playSound('chime');
      const langCode = isHindi ? 'hi-IN' : 'en-IN';
      voiceRef.current?.start(langCode);
    }
  };

  // Auto-route query from landing page to dedicated Action or Resolve Mode
  const handleSearch = (queryToRoute) => {
    const q = (queryToRoute || query).trim();
    if (!q) return;

    playSound('click');
    const lowerQ = q.toLowerCase();

    // Check if dispute or resolve query
    const isResolve = lowerQ.includes('cut') || lowerQ.includes('kat') || 
                      lowerQ.includes('refund') || lowerQ.includes('pending') || 
                      lowerQ.includes('failed') || lowerQ.includes('stuck') || 
                      lowerQ.includes('duplicate') || lowerQ.includes('wrong') || 
                      lowerQ.includes('dispute') || lowerQ.includes('issue') || 
                      lowerQ.includes('599') || lowerQ.includes('1200') ||
                      lowerQ.includes('complaint') || lowerQ.includes('takrar') ||
                      lowerQ.includes('adakle') || lowerQ.includes('recall') ||
                      lowerQ.includes('पैसे') || lowerQ.includes('रिफंड') || lowerQ.includes('तक्रार');

    const targetMode = isResolve ? 'resolve' : 'action';
    if (onNavigateToMode) {
      onNavigateToMode(targetMode, q, true);
    }
  };

  const getSubActionIcon = (id) => {
    switch (id) {
      case 'recharge': return '/assets/icon_mobile.png';
      case 'travel': return '/assets/icon_flight.png';
      case 'electricity': return '/assets/icon_electricity.png';
      case 'fastag': return '/assets/icon_fastag.png';
      case 'deals': return ShoppingBag;
      case 'gold': return Coins;
      case 'stuck': return AlertCircle;
      case 'refund': return Clock;
      case 'merchant': return Store;
      case 'duplicate': return Layers;
      case 'recall': return HelpCircle;
      default: return Sparkles;
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* ========================================================
          HERO PANORAMIC BANNER (Paytm AI Hub Official Visual)
          ======================================================== */}
      <div className="w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 bg-gradient-to-r from-[#002970] via-[#003e9c] to-[#0060c4] group">
        <img 
          src="/assets/Paytm AI Hub Hero Banner.png" 
          alt="Paytm AI Hub Hero Banner" 
          className="w-full h-auto object-cover max-h-72 sm:max-h-80 md:max-h-96 group-hover:scale-[1.01] transition-transform duration-500"
        />
      </div>

      {/* ========================================================
          CONVERSATIONAL SEARCH & AUTO-ROUTER INTERFACE
          ======================================================== */}
      <div className="relative rounded-3xl bg-white border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
        
        {/* Title and Subtitle */}
        <div className="space-y-2 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-[#0052ff] px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{t.heroBadge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t.heroTitle}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>
        </div>

        {/* Input Form with Voice Button & Auto-Route */}
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="max-w-3xl mx-auto">
          <div className="relative flex items-center shadow-lg rounded-2xl overflow-hidden border-2 border-slate-200 focus-within:border-[#0052ff] transition-all bg-white">
            <div className="pl-4 sm:pl-5 text-slate-400">
              <Search className="w-5 h-5 text-slate-400" />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.inputPlaceholder}
              className="w-full py-4 px-3 sm:px-4 text-sm sm:text-base font-medium text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
            />

            {/* Mic Button */}
            <button
              type="button"
              onClick={toggleVoice}
              className={`p-3 rounded-xl mx-1 transition-all cursor-pointer ${
                isListening 
                  ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30' 
                  : 'text-slate-500 hover:text-[#0052ff] hover:bg-slate-100'
              }`}
              title={isListening ? 'Listening...' : t.voiceTooltip}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-[#0052ff]" />}
            </button>

            {/* Execute Button */}
            <button
              type="submit"
              className="m-1.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#002970] to-[#0052ff] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-blue-500/20 hover:brightness-110 active:scale-98 transition-all cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </div>
        </form>

        {/* Popular Flow Quick Chips (Auto-Redirects) */}
        <div className="max-w-3xl mx-auto pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.quickChipsLabel}</span>
            </span>

            {t.chips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => handleSearch(chip.query)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#0052ff] border border-slate-200/90 hover:border-blue-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <span>{chip.label}</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

      </div>


      {/* ========================================================
          TWO CORE PILLARS: ACTION MODE & RESOLVE MODE
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 pt-2">
        
        {/* ================= CARD 1: ACTION MODE ================= */}
        <div className="relative group rounded-3xl bg-white border border-slate-200/90 hover:border-blue-400 p-5 sm:p-7 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
          
          {/* Subtle Top Glowing Edge */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#002970] via-[#0052ff] to-[#00b9f1]" />

          <div className="space-y-4">
            
            {/* 3D Action Card Illustration Asset */}
            <div 
              onClick={() => onNavigateToMode?.('action', '', false)}
              className="relative w-full rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-br from-blue-50/60 to-slate-50 border border-blue-100 flex items-center justify-center p-2 group-hover:scale-[1.01] transition-transform"
            >
              <img 
                src="/assets/action_card_clean.png" 
                alt="Paytm Action Mode" 
                className="w-full h-auto max-h-48 sm:max-h-52 object-contain rounded-xl drop-shadow-md"
              />
            </div>

            {/* Header Badge & Title */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-[#0052ff] px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                <Zap className="w-3.5 h-3.5" />
                <span>{t.actionCard.badge}</span>
              </span>

              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                10+ Verticals
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {t.actionCard.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed font-normal">
                {t.actionCard.desc}
              </p>
            </div>

            {/* Sub-Action Buttons Grid */}
            <div className="pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Instant Execution Desks:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {t.actionCard.subActions.map((sub) => {
                  const SubIcon = getSubActionIcon(sub.id);
                  const isImg = typeof SubIcon === 'string';
                  return (
                    <button
                      key={sub.id}
                      onClick={() => onNavigateToMode?.('action', sub.query, false)}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 text-left transition-all group/btn cursor-pointer flex items-center gap-2"
                    >
                      {isImg ? (
                        <img src={SubIcon} alt={sub.label} className="w-5 h-5 object-contain shrink-0 group-hover/btn:scale-110 transition-transform" />
                      ) : (
                        <SubIcon className="w-4 h-4 text-[#0052ff] shrink-0 group-hover/btn:scale-110 transition-transform" />
                      )}
                      <div className="text-xs font-bold text-slate-800 group-hover/btn:text-[#0052ff] transition-colors truncate">
                        {sub.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Launch Action Button */}
          <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero-Trust Human Auth Safe</span>
            </span>

            <button
              onClick={() => onNavigateToMode?.('action', '', false)}
              className="px-5 py-2.5 rounded-full bg-[#0052ff] hover:bg-[#003ecc] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>{t.actionCard.buttonLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>


        {/* ================= CARD 2: RESOLVE MODE ================= */}
        <div className="relative group rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-400 p-5 sm:p-7 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
          
          {/* Subtle Top Glowing Edge */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-[#002970]" />

          <div className="space-y-4">
            
            {/* 3D Resolve Card Illustration Asset */}
            <div 
              onClick={() => onNavigateToMode?.('resolve', '', false)}
              className="relative w-full rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-br from-emerald-50/60 to-slate-50 border border-emerald-100 flex items-center justify-center p-2 group-hover:scale-[1.01] transition-transform"
            >
              <img 
                src="/assets/resolve_card_clean.png" 
                alt="Paytm Resolve Mode" 
                className="w-full h-auto max-h-48 sm:max-h-52 object-contain rounded-xl drop-shadow-md"
              />
            </div>

            {/* Header Badge & Title */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.resolveCard.badge}</span>
              </span>

              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                3-Way Forensics
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {t.resolveCard.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed font-normal">
                {t.resolveCard.desc}
              </p>
            </div>

            {/* Sub-Action Buttons Grid */}
            <div className="pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Forensic Investigation Desks:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {t.resolveCard.subActions.map((sub) => {
                  const SubIcon = getSubActionIcon(sub.id);
                  const isImg = typeof SubIcon === 'string';
                  return (
                    <button
                      key={sub.id}
                      onClick={() => onNavigateToMode?.('resolve', sub.query, false)}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/80 border border-slate-200/80 hover:border-emerald-300 text-left transition-all group/btn cursor-pointer flex items-center gap-2"
                    >
                      {isImg ? (
                        <img src={SubIcon} alt={sub.label} className="w-5 h-5 object-contain shrink-0 group-hover/btn:scale-110 transition-transform" />
                      ) : (
                        <SubIcon className="w-4 h-4 text-emerald-600 shrink-0 group-hover/btn:scale-110 transition-transform" />
                      )}
                      <div className="text-xs font-bold text-slate-800 group-hover/btn:text-emerald-700 transition-colors truncate">
                        {sub.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Launch Resolve Button */}
          <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>RBI Circular 81 Backed</span>
            </span>

            <button
              onClick={() => onNavigateToMode?.('resolve', '', false)}
              className="px-5 py-2.5 rounded-full bg-[#05b169] hover:bg-[#049457] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>{t.resolveCard.buttonLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================
          ECOSYSTEM VISUAL SHOWCASE STRIP (3 Official Photo Cards)
          ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
        
        {/* Card 1: Inside Paytm AI Architecture */}
        <div 
          onClick={onLaunchArchitecture}
          className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-blue-500 shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
        >
          <img 
            src="/assets/inside_paytm_ai_card.png" 
            alt="Inside Paytm AI" 
            className="w-full h-auto object-cover group-hover:scale-102 transition-transform"
          />
          <div className="p-3.5 bg-slate-900 flex items-center justify-between text-xs border-t border-slate-800">
            <span className="font-bold text-white group-hover:text-blue-300 transition-colors">
              Inside Paytm AI Architecture Flow
            </span>
            <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Smart Money Intelligence */}
        <div 
          onClick={() => onNavigateToMode?.('action', 'Show smart money and expense analytics')}
          className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500 shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
        >
          <img 
            src="/assets/paytm_smart_money_card.png" 
            alt="Smart Money Intelligence" 
            className="w-full h-auto object-cover group-hover:scale-102 transition-transform"
          />
          <div className="p-3.5 bg-slate-900 flex items-center justify-between text-xs border-t border-slate-800">
            <span className="font-bold text-white group-hover:text-emerald-300 transition-colors">
              Smart Money & Expense Analytics
            </span>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Paytm Business & Soundbox */}
        <div 
          onClick={() => onNavigateToMode?.('action', 'Show Soundbox 4G merchant collection')}
          className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-cyan-500 shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
        >
          <img 
            src="/assets/paytm_business_ai_card.png" 
            alt="Paytm Business Soundbox" 
            className="w-full h-auto object-cover group-hover:scale-102 transition-transform"
          />
          <div className="p-3.5 bg-slate-900 flex items-center justify-between text-xs border-t border-slate-800">
            <span className="font-bold text-white group-hover:text-cyan-300 transition-colors">
              Merchant Soundbox 4G Ledger
            </span>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

    </div>
  );
};

export default PaytmOneHub;
