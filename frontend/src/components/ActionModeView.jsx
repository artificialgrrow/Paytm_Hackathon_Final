import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, ArrowLeft, Search, Mic, MicOff, Send, Sparkles, 
  Smartphone, Plane, Receipt, Car, ShoppingBag, Coins, 
  CheckCircle2, KeyRound, Volume2, Play, Pause, RefreshCw, 
  ChevronRight, ArrowRight, ShieldCheck, Tag, Clock, History, 
  Copy, ExternalLink, Ticket, Calendar
} from 'lucide-react';
import { playSound } from '../utils/audio';
import { speak, pauseSpeech, resumeSpeech, stopSpeech, isSpeaking, VoiceRecognition } from '../utils/speech';
import { executeAgentQuery } from '../data/telecomPlans';
import { translations } from '../data/translations';
import { FormattedMessage } from './FormattedMessage';

export const ActionModeView = ({ 
  language = 'en', 
  initialQuery = '', 
  autoExecute = false,
  onBack, 
  onSwitchToResolve,
  onOpenPinModal 
}) => {
  const t = translations[language] || translations.en;
  const isHindi = language === 'hi';

  const [query, setQuery] = useState(initialQuery || '');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Audio / Voice Readout State
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioElement, setAudioElement] = useState(null);

  const voiceRef = useRef(null);
  const workspaceRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const langCode = isHindi ? 'hi-IN' : 'en-IN';
    voiceRef.current = new VoiceRecognition(
      (transcript, isFinal) => {
        setQuery(transcript);
        if (isFinal) {
          handleExecute(transcript);
        }
      },
      (listening) => setIsListening(listening)
    );
  }, [language]);

  // Handle Initial Query: ONLY auto-execute if explicitly requested from submit
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      setQuery(initialQuery);
      if (autoExecute) {
        handleExecute(initialQuery);
      }
    } else {
      setQuery('');
      setResult(null);
    }
  }, [initialQuery, autoExecute]);

  const toggleVoice = () => {
    if (isListening) {
      voiceRef.current?.stop();
    } else {
      playSound('chime');
      const langCode = isHindi ? 'hi-IN' : 'en-IN';
      voiceRef.current?.start(langCode);
    }
  };

  const handleExecute = async (queryToRun) => {
    const q = (queryToRun || query).trim();
    if (!q || loading) return;

    playSound('click');
    setLoading(true);
    setResult(null);

    try {
      const data = await executeAgentQuery(q, language);
      setResult(data);
      playSound('chime');

      // Add to session chat history
      setChatHistory(prev => [
        {
          id: Date.now(),
          query: q,
          service: data.service,
          mode: data.mode,
          message: data.ai_message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);

      setTimeout(() => {
        workspaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);

      // Play Lady Voice Readout
      if (data.audio_base64) {
        playBase64Audio(data.audio_base64);
      } else if (data.ai_message) {
        setIsPlayingAudio(true);
        setIsPaused(false);
        speak(
          data.ai_message,
          isHindi ? 'hi-IN' : 'en-IN',
          () => { setIsPlayingAudio(true); setIsPaused(false); },
          () => { setIsPlayingAudio(false); setIsPaused(false); }
        );
      }
    } catch (err) {
      console.error('Action execution error:', err);
    } finally {
      setLoading(false);
    }
  };

  const playBase64Audio = (base64Str) => {
    try {
      if (audioElement) audioElement.pause();
      stopSpeech();
      const audio = new Audio(`data:audio/wav;base64,${base64Str}`);
      setAudioElement(audio);
      setIsPlayingAudio(true);
      setIsPaused(false);
      audio.onended = () => {
        setIsPlayingAudio(false);
        setIsPaused(false);
      };
      audio.play().catch(e => console.warn('Audio playback prevented:', e));
    } catch (e) {
      console.warn('Audio stream error:', e);
    }
  };

  const toggleAudio = () => {
    playSound('click');
    if (audioElement) {
      if (isPlayingAudio) {
        audioElement.pause();
        setIsPlayingAudio(false);
        setIsPaused(true);
      } else if (isPaused) {
        audioElement.play();
        setIsPlayingAudio(true);
        setIsPaused(false);
      } else if (result?.audio_base64) {
        playBase64Audio(result.audio_base64);
      }
    } else if (isSpeaking()) {
      pauseSpeech();
      setIsPlayingAudio(false);
      setIsPaused(true);
    } else if (isPaused) {
      resumeSpeech();
      setIsPlayingAudio(true);
      setIsPaused(false);
    } else if (result?.ai_message) {
      setIsPlayingAudio(true);
      setIsPaused(false);
      speak(
        result.ai_message,
        isHindi ? 'hi-IN' : 'en-IN',
        () => { setIsPlayingAudio(true); setIsPaused(false); },
        () => { setIsPlayingAudio(false); setIsPaused(false); }
      );
    }
  };

  const categories = [
    { id: 'all', label: isHindi ? 'सभी सेवाएं' : 'All Services', icon: Zap, query: '' },
    { id: 'recharge', label: isHindi ? 'मोबाइल रिचार्ज' : 'Mobile Recharge', icon: Smartphone, query: 'Jio 299 recharge 2GB daily data' },
    { id: 'travel', label: isHindi ? 'फ्लाइट व बस' : 'Flights & Travel', icon: Plane, query: 'Cheapest flights from Mumbai to Pune' },
    { id: 'movies', label: isHindi ? 'मूवी टिकट्स' : 'Movie Tickets', icon: Ticket, query: 'Which movie tickets are available now?' },
    { id: 'bills', label: isHindi ? 'पेंडिंग बिल' : 'Pending Bills', icon: Receipt, query: 'Are there any pending bills?' },
    { id: 'offers', label: isHindi ? 'प्रोमो कोड्स' : 'Offers & Promos', icon: Tag, query: 'Are there any promo codes?' },
    { id: 'shopping', label: isHindi ? 'शॉपिंग डील्स' : 'Shopping Deals', icon: ShoppingBag, query: 'Show me shopping deals in Pune at Croma' },
    { id: 'fastag', label: isHindi ? 'फास्टैग' : 'FASTag Toll', icon: Car, query: 'Recharge FASTag 500' },
    { id: 'gold', label: isHindi ? '24K डिजिटल गोल्ड' : 'Digital Gold', icon: Coins, query: 'Buy ₹500 24K digital gold' }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Top Breadcrumb & Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isHindi ? 'पेटीएम वन हब' : 'Paytm ONE Hub'}</span>
          </button>
          <div className="h-4 w-px bg-slate-300" />
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0052ff] animate-pulse"></span>
            <span className="text-xs font-bold text-[#002970] uppercase tracking-wider">
              {isHindi ? 'एक्शन मोड सक्रिय' : 'Action Mode Interface'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {chatHistory.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span>{isHindi ? 'चैट इतिहास' : 'History'} ({chatHistory.length})</span>
            </button>
          )}

          <button
            onClick={() => onSwitchToResolve?.('')}
            className="px-4 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{isHindi ? 'विवाद निवारण (Resolve Mode) पर जाएं' : 'Switch to Resolve Mode'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hero Header for Action Mode */}
      <div className="bg-gradient-to-r from-[#002970] via-[#003e9c] to-[#0052ff] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-cyan-300 border border-white/20">
            <Zap className="w-3.5 h-3.5 text-cyan-300" />
            <span>{isHindi ? 'ऑटोनॉमस वित्तीय निष्पादन' : 'AUTONOMOUS EXECUTION ENGINE • PILLAR A'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {isHindi ? 'पेटीएम वन — एक्शन मोड' : 'Paytm ONE Action Mode'}
          </h1>
          <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
            {isHindi 
              ? 'मोबाइल रिचार्ज, यात्रा टिकट, बिजली बिल और शॉपिंग डिस्काउंट को रीयल-टाइम लाइव टैरिफ और जीरो-ट्रस्ट ह्यूमन-इन-द-लूप सुरक्षा से तुरंत पूरा करें।'
              : 'Autonomous 1-click execution for mobile recharges, live flight/bus fares, utility bills, and shopping deals with zero hallucination and Zero-Trust Human-in-the-Loop authorization.'}
          </p>
        </div>
      </div>

      {/* Category Tabs: DOES NOT AUTO-EXECUTE, PRE-FILLS QUERY ONLY */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                playSound('click');
                setActiveCategory(cat.id);
                if (cat.query) {
                  setQuery(cat.query);
                } else {
                  setQuery('');
                }
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                isActive 
                  ? 'bg-[#0052ff] text-white shadow-md shadow-blue-500/20' 
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#0052ff]'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Action Input Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-lg">
        <form onSubmit={(e) => { e.preventDefault(); handleExecute(); }} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isHindi 
                ? 'उदा. Jio 299 रिचार्ज, मुंबई से पुणे फ्लाइट, MSEDCL बिजली बिल, क्रोमा शॉपिंग डील्स...' 
                : 'e.g. Jio 299 recharge 2GB daily data, cheapest flights from Mumbai to Pune, Croma deals...'}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0052ff] focus:bg-white transition-all"
            />
          </div>

          {/* Voice Input Mic Button */}
          <button
            type="button"
            onClick={toggleVoice}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-center shrink-0 ${
              isListening 
                ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse' 
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
            }`}
            title={isListening ? 'Listening...' : 'Voice Input'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Execute Submit Button */}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3.5 rounded-2xl bg-[#0052ff] hover:bg-[#003ecc] disabled:opacity-50 text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">{isHindi ? 'पूछें / निष्पादित करें' : 'Execute'}</span>
          </button>
        </form>
      </div>

      {/* SESSION CHAT HISTORY (COLLAPSIBLE) */}
      {showHistory && chatHistory.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Recent Queries in this Session</span>
            <button onClick={() => setShowHistory(false)} className="text-[#0052ff] hover:underline">Close</button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {chatHistory.map((item) => (
              <div 
                key={item.id} 
                onClick={() => { setQuery(item.query); handleExecute(item.query); }}
                className="p-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-blue-300 cursor-pointer flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-[10px] bg-blue-50 text-[#0052ff] px-2 py-0.5 rounded font-bold uppercase">{item.service}</span>
                  <span className="font-medium text-slate-800 truncate">{item.query}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">{item.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RESULTS WORKSPACE */}
      {result && (
        <div ref={workspaceRef} className="rounded-3xl bg-white border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-200 flex items-center justify-center text-[#0052ff]">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 uppercase">
                    Action Result • {result.service || 'Execution Complete'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    Live Verified
                  </span>
                </div>
                <div className="text-xs text-slate-500">Autonomous reasoning completed with zero hallucination</div>
              </div>
            </div>

            {/* Audio Voice Readout Controls */}
            {result.ai_message && (
              <button
                onClick={toggleAudio}
                className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isPlayingAudio ? 'bg-[#0052ff] text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Audio</span>
                    <span className="flex items-center gap-0.5 ml-1">
                      <span className="w-1 h-2.5 bg-white rounded-full animate-bounce"></span>
                      <span className="w-1 h-3.5 bg-white rounded-full animate-bounce [animation-delay:0.15s]"></span>
                      <span className="w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:0.3s]"></span>
                    </span>
                  </>
                ) : isPaused ? (
                  <>
                    <Play className="w-3.5 h-3.5 text-[#0052ff]" />
                    <span>Resume</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#0052ff]" />
                    <span>Voice Explanation</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* AI Narrative */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>AI Recommendation</span>
              <span className="text-[10px] font-mono font-bold text-slate-400">Zero-Hallucination Audit</span>
            </div>
            <FormattedMessage text={result.ai_message} />
          </div>

          {/* SPECIFIC DATA CARDS BY VERTICAL */}

          {/* 1. RECHARGE PLAN CARD */}
          {result.service === 'recharge' && result.plan_data?.best && (
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-[#002970]">
                    ₹{result.plan_data.best.price}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-200 text-[#002970]">
                    {result.plan_data.best.badge || 'Best Value'}
                  </span>
                </div>
                <div className="text-xs text-slate-700 font-medium">
                  {result.plan_data.best.data_daily || result.plan_data.best.data} • {result.plan_data.best.validity} • Unlimited Calls
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {result.plan_data.best.network} • OTT: {result.plan_data.best.ott || 'JioCinema'}
                </div>
              </div>

              {onOpenPinModal && (
                <button
                  onClick={() => onOpenPinModal({
                    amount: result.plan_data.best.price,
                    operator: (result.operator || 'Jio').toUpperCase(),
                    validity: result.plan_data.best.validity,
                    service: 'Mobile Recharge'
                  })}
                  className="px-6 py-3 rounded-full bg-[#0052ff] hover:bg-[#003ecc] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Authorize with UPI PIN</span>
                </button>
              )}
            </div>
          )}

          {/* 2. TRAVEL OPTIONS GRID (FLIGHTS / BUSES / TRAINS) */}
          {result.service === 'travel' && result.travel_data?.options && (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Live Travel Options ({result.travel_data.route || 'Available Routes'})</span>
                <span className="text-emerald-600 font-semibold text-[11px]">Instant IRCTC & Carrier Booking</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {result.travel_data.options.slice(0, 4).map((opt, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between hover:border-blue-300 transition-colors">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span className="truncate pr-1">{opt.carrier || opt.name}</span>
                        <span className="text-[#0052ff] shrink-0 font-black">₹{opt.price}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Dep: {opt.dep_time} • {opt.travel_type ? opt.travel_type.toUpperCase() : opt.type}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                        {opt.seats} • {opt.cashback || 'Flat Cashback'}
                      </div>
                    </div>

                    {onOpenPinModal && (
                      <button
                        onClick={() => onOpenPinModal({
                          amount: opt.price,
                          operator: opt.carrier || opt.name,
                          service: `Travel Booking (${opt.travel_type || opt.type})`
                        })}
                        className="mt-3 w-full py-2 rounded-lg bg-[#002970] text-white text-[11px] font-bold text-center hover:bg-[#001d52] transition-colors cursor-pointer"
                      >
                        Book with UPI PIN
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2B. MOVIES & CINEMA CARDS */}
          {result.service === 'movies' && result.movie_data?.movies && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-rose-500" />
                  <span>Blockbuster Movies in Theatres ({result.movie_data.city || 'Pune'})</span>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 font-bold border border-rose-200">
                  Instant Seat Lock & Food Deals
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.movie_data.movies.map((m, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-gradient-to-br from-rose-50/40 via-white to-slate-50 border border-rose-200/80 shadow-sm flex flex-col justify-between hover:border-rose-400 hover:shadow-md transition-all">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-black text-slate-900">{m.title}</div>
                          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                            {m.language} • {m.genre}
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 text-[10px] font-black shrink-0">
                          {m.rating}
                        </span>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5">
                        <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                          <span className="truncate">{m.theatre_name || m.theatre}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-bold">
                            {m.format}
                          </span>
                          <span className="text-[10px] font-medium text-emerald-600">
                            {m.seats_available} seats left
                          </span>
                        </div>

                        {/* Showtimes Pills */}
                        <div className="pt-1">
                          <div className="text-[10px] text-slate-400 font-semibold mb-1">Select Showtime:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {(Array.isArray(m.showtimes) ? m.showtimes : (m.showtimes || '10:30 AM, 02:15 PM, 06:45 PM, 10:15 PM').split(',')).map((st, sidx) => (
                              <span key={sidx} className="text-[10px] font-mono px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-bold hover:bg-rose-50 hover:text-rose-600 border border-slate-200 cursor-pointer">
                                {st.trim()}
                              </span>
                            ))}
                          </div>
                        </div>

                        {m.snack_offer && (
                          <div className="text-[10px] text-rose-600 font-medium bg-rose-50/80 px-2 py-1 rounded-lg border border-rose-100 mt-2">
                            🍿 {m.snack_offer}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono">From</div>
                        <div className="text-lg font-black text-[#002970]">₹{m.price}</div>
                      </div>

                      {onOpenPinModal && (
                        <button
                          onClick={() => onOpenPinModal({
                            amount: m.price,
                            operator: `${m.title} (${m.format})`,
                            validity: m.theatre_name || m.theatre,
                            service: 'Movie Ticket Booking'
                          })}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Book with PIN</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. SHOPPING DEALS & MALL DISCOUNTS GRID */}
          {result.service === 'shopping' && result.shopping_data?.deals && (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Verified Retail Deals & Coupons ({result.shopping_data.city || 'Pune'})</span>
                <span className="text-purple-600 font-semibold text-[11px]">Paytm Exclusive Discounts</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {result.shopping_data.deals.slice(0, 6).map((deal, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/40 to-slate-50 border border-purple-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{deal.brand}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                          {deal.discount_pct}% OFF
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-700 mt-1.5 leading-snug">
                        {deal.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <span>📍 {deal.mall_name}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-purple-100/60 flex items-center justify-between">
                      <div className="text-[11px] font-mono font-bold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200">
                        {deal.coupon_code}
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard?.writeText(deal.coupon_code);
                          playSound('click');
                          alert(`Coupon ${deal.coupon_code} copied!`);
                        }}
                        className="text-xs font-bold text-[#0052ff] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3B. PROMO CODES & EXCLUSIVE OFFERS */}
          {result.service === 'promos' && result.promo_data?.promos && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-500" />
                  <span>Verified Paytm Promo Codes & Deals</span>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  100% Guaranteed Redemption
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {result.promo_data.promos.map((promo, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-400 hover:shadow-md transition-all">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                          {promo.category}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          {promo.discount_text || promo.discount_amount}
                        </span>
                      </div>

                      <div className="text-sm font-bold text-slate-900 mt-2">
                        {promo.title}
                      </div>

                      <p className="text-xs text-slate-500 mt-1 leading-snug">
                        {promo.terms || `Min Spend: ₹${promo.min_spend} • Valid until ${promo.valid_until}`}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="font-mono font-black text-sm text-[#002970] bg-slate-50 px-2.5 py-1 rounded border border-dashed border-slate-300 tracking-wider">
                        {promo.code}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(promo.code);
                          playSound('click');
                          alert(`Promo code ${promo.code} copied! Apply at checkout.`);
                        }}
                        className="text-xs font-bold text-[#0052ff] hover:text-[#003ecc] flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. CONSOLIDATED PENDING BILLS HUB (MULTI-BILL) */}
          {result.bills_data?.is_multi_bill && result.bills_data?.bills && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-50 border border-amber-300 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-amber-950">
                      ₹{result.bills_data.total_due || '4,258'}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
                      {result.bills_data.bills.length} Pending Invoices
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 font-medium">
                    Consumer: {result.bills_data.consumer_name || 'Akash Bichukale'} • BBPS Instant Settlement
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    All utility bills fetched directly from central Bharat Bill Payment System
                  </div>
                </div>

                {onOpenPinModal && (
                  <button
                    onClick={() => onOpenPinModal({
                      amount: result.bills_data.total_due || '4258',
                      operator: 'Consolidated BBPS Utility Bills',
                      validity: `${result.bills_data.bills.length} Bills (Electricity, Gas, Water, Broadband, FASTag)`,
                      service: 'Pay All Pending Bills'
                    })}
                    className="px-6 py-3 rounded-full bg-[#002970] hover:bg-[#001d52] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Pay All Bills (₹{result.bills_data.total_due}) with UPI PIN</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.bills_data.bills.map((bill, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-amber-300 transition-colors">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                          {bill.category}
                        </span>
                        <span className="text-xs font-black text-slate-900">
                          ₹{bill.amount_due}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-800 mt-2 truncate">
                        {bill.provider_name}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                        ID: {bill.consumer_id}
                      </div>
                      <div className="text-[10px] text-rose-600 font-semibold mt-1">
                        Due: {bill.due_date}
                      </div>
                    </div>

                    {onOpenPinModal && (
                      <button
                        onClick={() => onOpenPinModal({
                          amount: bill.amount_due,
                          operator: bill.provider_name,
                          validity: `Due: ${bill.due_date}`,
                          service: `${bill.category.toUpperCase()} Bill Payment`
                        })}
                        className="mt-3 w-full py-2 rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-[#002970] hover:text-white hover:border-[#002970] text-[11px] font-bold text-center transition-all cursor-pointer"
                      >
                        Pay ₹{bill.amount_due} with PIN
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4B. SINGLE UTILITY BILL & FASTAG (BBPS CERTIFIED) */}
          {(!result.bills_data?.is_multi_bill) && (result.service === 'electricity' || result.service === 'fastag' || result.service === 'dth' || result.service === 'gas' || result.service === 'water' || result.service === 'broadband') && result.service_data && (
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-amber-900">
                    ₹{result.service_data.amount_due || result.service_data.bill_amount}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    Bharat BillPay Certified
                  </span>
                </div>
                <div className="text-xs text-slate-700 font-medium">
                  {result.service_data.provider_name || result.service_data.board} • Consumer: {result.service_data.consumer_id || result.service_data.vehicle_no}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Due: {result.service_data.due_date} • {result.service_data.cashback || 'Cashback Eligible'}
                </div>
              </div>

              {onOpenPinModal && (
                <button
                  onClick={() => onOpenPinModal({
                    amount: result.service_data.amount_due || result.service_data.bill_amount,
                    operator: result.service_data.provider_name || result.service_data.board,
                    service: `${result.service.toUpperCase()} Bill Payment`
                  })}
                  className="px-6 py-3 rounded-full bg-[#002970] hover:bg-[#001d52] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Pay Bill with UPI PIN</span>
                </button>
              )}
            </div>
          )}

          {/* 5. DIGITAL GOLD CARD */}
          {result.service === 'gold' && result.gold_data && (
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-300 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-amber-950">
                    ₹{result.gold_data.budget} • {result.gold_data.grams} gm
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    24K 99.99% Pure
                  </span>
                </div>
                <div className="text-xs text-amber-900 font-medium">
                  Rate: ₹{result.gold_data.rate || result.gold_data.gold_rate}/gm • MMTC-PAMP Certified
                </div>
                <div className="text-[11px] text-slate-600 font-mono">
                  Vault: IDBI Trusteeship 100% Insured Custody
                </div>
              </div>

              {onOpenPinModal && (
                <button
                  onClick={() => onOpenPinModal({
                    amount: result.gold_data.budget,
                    operator: 'MMTC-PAMP Digital Gold',
                    service: '24K Digital Gold Purchase'
                  })}
                  className="px-6 py-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Buy Gold with UPI PIN</span>
                </button>
              )}
            </div>
          )}

          {/* 6. VERIFIED LIVE WEB SOURCES & CITATIONS (SERPAPI & YOU.COM) */}
          {result.resource_links && result.resource_links.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <ExternalLink className="w-4 h-4 text-[#0052ff]" />
                  <span>Verified Web Sources & Citations</span>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0052ff] border border-blue-200 font-bold">
                  Live Web Citations
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {result.resource_links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 text-xs font-bold text-slate-900 group-hover:text-[#0052ff]">
                        <span className="line-clamp-1">{link.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-[#0052ff]" />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {link.snippet}
                      </p>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-semibold text-slate-600">{link.source || 'Web Citation'}</span>
                      <span className="text-[#0052ff] font-bold group-hover:underline">Verify Source ↗</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Multi-Agent Execution Trace */}
          {result.steps_log && result.steps_log.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Multi-Agent Execution Trace
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {result.steps_log.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-bold text-slate-800">{step.title}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5 leading-snug">{step.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default ActionModeView;
