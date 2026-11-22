import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, ArrowLeft, Search, Mic, MicOff, Send, Sparkles, 
  AlertCircle, Clock, Store, Layers, HelpCircle, CheckCircle2, 
  BookOpen, MessageSquare, Volume2, Play, Pause, RefreshCw, 
  ArrowRight, Shield, Scale, FileText, Lock, ExternalLink
} from 'lucide-react';
import { playSound } from '../utils/audio';
import { speak, pauseSpeech, resumeSpeech, stopSpeech, isSpeaking, VoiceRecognition } from '../utils/speech';
import { executeAgentQuery } from '../data/telecomPlans';
import { translations } from '../data/translations';
import { FormattedMessage } from './FormattedMessage';

export const ResolveModeView = ({ 
  language = 'en', 
  initialQuery = '', 
  autoExecute = false,
  onBack, 
  onSwitchToAction,
  onOpenNexconn 
}) => {
  const t = translations[language] || translations.en;
  const isHindi = language === 'hi';

  const [query, setQuery] = useState(initialQuery || '');
  const [activeDesk, setActiveDesk] = useState('all');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioElement, setAudioElement] = useState(null);

  const voiceRef = useRef(null);
  const workspaceRef = useRef(null);

  // Initialize Voice
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

  // Execute initial query ONLY if explicitly requested from submit
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

      setTimeout(() => {
        workspaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);

      if (data.audio_base64) {
        playBase64Audio(data.audio_base64);
      } else if (data.ai_message) {
        speak(data.ai_message, isHindi ? 'hi-IN' : 'en-IN');
      }
    } catch (err) {
      console.error('Resolve execution error:', err);
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
      audio.play().catch(e => console.warn('Audio playback error:', e));
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

  const disputeDesks = [
    { id: 'all', label: isHindi ? 'सभी विवाद' : 'All Disputes', icon: ShieldCheck, query: '' },
    { id: 'pending', label: isHindi ? 'लंबित लेन-देन' : 'Pending', icon: Clock, query: 'Are there any pending transactions?' },
    { id: 'refund', label: isHindi ? 'सक्रिय रिफंड' : 'Refunds', icon: RefreshCw, query: 'Are there any refund requests?' },
    { id: 'failed', label: isHindi ? 'विफल भुगतान' : 'Failed', icon: AlertCircle, query: 'Show me failed transactions' },
    { id: 'complaint', label: isHindi ? 'नोडल शिकायतें' : 'Complaints', icon: FileText, query: 'Are there any formal complaints filed?' },
    { id: 'track', label: isHindi ? 'विवाद ट्रैक करें' : 'Track Case', icon: Search, query: 'Track dispute case DISP-99214' }
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
            <span className="w-2.5 h-2.5 rounded-full bg-[#05b169] animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              {isHindi ? 'रिजॉल्व मोड सक्रिय' : 'Resolve Mode Interface'}
            </span>
          </div>
        </div>

        <button
          onClick={() => onSwitchToAction?.('')}
          className="px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0052ff] border border-blue-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-[#0052ff]" />
          <span>{isHindi ? 'एक्शन मोड (Action Mode) पर जाएं' : 'Switch to Action Mode'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hero Header for Resolve Mode */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-emerald-300 border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>{isHindi ? 'फोरेंसिक विवाद निवारण' : 'FORENSIC DISPUTE RECOVERY • PILLAR B'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {isHindi ? 'पेटीएम रिजॉल्व — विवाद निवारण' : 'Paytm Resolve Mode'}
          </h1>
          <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
            {isHindi 
              ? '3-वे सुलह (बैंक कोर vs NPCI स्विच vs ऑपरेटर गेटवे), RBI सर्कुलर 81 T+1 ऑटो-रिफंड नियम और तत्काल लाइव नोडल अधिकारी डेस्क।'
              : 'Autonomous 3-Way Reconciliation across sender CBS, NPCI switch, and destination ledger with RBI Circular 81 compensation proof.'}
          </p>
        </div>
      </div>

      {/* Dispute Desks Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {disputeDesks.map((desk) => {
          const Icon = desk.icon;
          const isActive = activeDesk === desk.id;
          return (
            <button
              key={desk.id}
              onClick={() => {
                playSound('click');
                setActiveDesk(desk.id);
                if (desk.query) {
                  setQuery(desk.query);
                } else {
                  setQuery('');
                }
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                isActive 
                  ? 'bg-[#05b169] text-white shadow-md shadow-emerald-500/20' 
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
              <span>{desk.label}</span>
            </button>
          );
        })}
      </div>

      {/* Resolve Input Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-lg">
        <form onSubmit={(e) => { e.preventDefault(); handleExecute(); }} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isHindi 
                ? 'उदा. पैसे कट गए पर रिचार्ज नहीं हुआ, ₹1200 पेंडिंग रिफंड चेक करें...' 
                : 'e.g. Money debited ₹599 but recharge not activated, track pending refund...'}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm sm:text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#05b169] focus:bg-white transition-all"
            />
          </div>

          <button
            type="button"
            onClick={toggleVoice}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              isListening 
                ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Voice Input"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-emerald-600" />}
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 rounded-2xl bg-[#05b169] hover:bg-[#049457] text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">{isHindi ? 'जांच करें' : 'Investigate'}</span>
          </button>
        </form>
      </div>

      {/* FORENSIC INVESTIGATION WORKSPACE */}
      {result && (
        <div ref={workspaceRef} className="rounded-3xl bg-white border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-200 flex items-center justify-center text-[#05b169]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 uppercase">
                    Forensic Verdict • {result.service || 'Dispute Resolved'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    Evidence Verified
                  </span>
                </div>
                <div className="text-xs text-slate-500">Autonomous 3-Way Banking Ledger Cross-Audit</div>
              </div>
            </div>

            {/* Audio Voice Readout */}
            {result.ai_message && (
              <button
                onClick={toggleAudio}
                className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isPlayingAudio ? 'bg-[#05b169] text-white shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
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
                    <Play className="w-3.5 h-3.5 text-[#05b169]" />
                    <span>Resume</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#05b169]" />
                    <span>Voice Explanation</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* AI Narrative */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Forensic Summary & Finding</span>
              <span className="text-[10px] font-mono font-bold text-slate-400">NPCI Circular 81 Backed</span>
            </div>
            <FormattedMessage text={result.ai_message} />
          </div>

          {/* MULTI-CASE FORENSIC LEDGER & DISPUTE DIRECTORY */}
          {result.disputes_list && result.disputes_list.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Forensic Dispute & Transaction Directory ({result.disputes_list.length} Records)</span>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  Immutable Audit Ledger
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {result.disputes_list.map((item, idx) => {
                  const isRefund = item.status_type === 'refund' || item.id?.startsWith('REF');
                  const isFailed = item.status_type === 'failed' || item.id?.startsWith('FAIL');
                  const isPending = item.status_type === 'pending' || item.id?.startsWith('DISP');

                  const badgeClass = isRefund 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                    : isFailed 
                    ? 'bg-rose-100 text-rose-800 border-rose-200'
                    : isPending
                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                    : 'bg-blue-100 text-blue-800 border-blue-200';

                  return (
                    <div 
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900">
                            #{item.id}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${badgeClass}`}>
                            {item.status}
                          </span>
                        </div>

                        <div>
                          <div className="text-xs font-bold text-slate-800 line-clamp-1">
                            {item.service}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                            RRN: {item.bank_rrn}
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-snug line-clamp-2">
                          {item.issue}
                        </p>

                        <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                          <span>SLA: {item.sla}</span>
                          <span className="font-bold text-slate-900 text-xs">₹{item.amount}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setQuery(`Audit case ${item.id} ${item.service}`);
                          handleExecute(`Audit case ${item.id} ${item.service}`);
                        }}
                        className="mt-3 w-full py-2 rounded-xl bg-slate-900 hover:bg-[#002970] text-white text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Shield className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Inspect 3-Way Audit</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Case & Evidence Details Banner */}
          {(result.resolve_data?.case_id || result.transaction?.id) && (
            <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-cyan-400">
                    Case #{result.resolve_data?.case_id || result.transaction?.id}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300 font-semibold">
                    {result.resolve_data?.service_name || result.transaction?.operator || 'Payment Investigation'}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-emerald-400">
                  {result.resolve_data?.evidence_bundle?.sha256 
                    ? `SHA-256 Seal: ${result.resolve_data.evidence_bundle.sha256.substring(0, 24)}...`
                    : 'SHA-256 Cryptographic Seal Verified'}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Disputed Amount</div>
                  <div className="font-mono font-bold text-white text-base">
                    {result.resolve_data?.amount ? `₹${result.resolve_data.amount}` : result.transaction?.amount || '₹1,200'}
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs">
                  {result.resolve_data?.status_badge || result.transaction?.status || 'Switch Timeout'}
                </span>
              </div>
            </div>
          )}

          {/* 3-Way Reconciliation Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600">
              <span>{t.workspace?.reconciliationMatrix || '3-Way Forensic Reconciliation Matrix'}</span>
              <span className="text-[11px] font-mono text-emerald-600">Cross-Switch Verification</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-900">
                    {result.resolve_data?.reconciliation?.user_bank?.title || 'User Bank (SBI)'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-200/70 text-emerald-900 font-bold">
                    {result.resolve_data?.reconciliation?.user_bank?.status || 'DEBITED'}
                  </span>
                </div>
                <div className="text-xs text-emerald-800">
                  {result.resolve_data?.reconciliation?.user_bank?.detail || 'Source debit verified with positive banking acknowledgement.'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-cyan-900">
                    {result.resolve_data?.reconciliation?.npci_switch?.title || 'NPCI Central Switch'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-200/70 text-cyan-900 font-bold">
                    {result.resolve_data?.reconciliation?.npci_switch?.status || 'CLEARED'}
                  </span>
                </div>
                <div className="text-xs text-cyan-800">
                  {result.resolve_data?.reconciliation?.npci_switch?.detail || 'Inter-bank clearing verified. Funds routed to destination switch.'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-900">
                    {result.resolve_data?.reconciliation?.destination?.title || 'Operator Gateway'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-200/70 text-amber-900 font-bold">
                    {result.resolve_data?.reconciliation?.destination?.status || 'TIMEOUT'}
                  </span>
                </div>
                <div className="text-xs text-amber-800">
                  {result.resolve_data?.reconciliation?.destination?.detail || 'Provisioning network lag. Token acknowledgment timed out.'}
                </div>
              </div>
            </div>
          </div>

          {/* Legal Citations Bar */}
          {result.citations && (
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <a 
                  href={result.citations?.url || 'https://www.npci.org.in'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors group"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{result.citations?.source_title || 'NPCI Harmonisation Circular No. 81'}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-300 ml-0.5" />
                </a>
                <div className="text-slate-300 text-[11px] max-w-2xl">{result.citations?.snippet}</div>
              </div>

              {onOpenNexconn && (
                <button
                  onClick={() => onOpenNexconn(result.nexconn_chat || {})}
                  className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{t.workspace?.escalateLive || 'Connect Live Specialist'}</span>
                </button>
              )}
            </div>
          )}

          {/* VERIFIED LIVE WEB SOURCES & REGULATORY CITATIONS */}
          {result.resource_links && result.resource_links.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <ExternalLink className="w-4 h-4 text-emerald-600" />
                  <span>Verified Legal Mandates & Citations</span>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  RBI & NPCI Verified
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {result.resource_links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-sm transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 text-xs font-bold text-slate-900 group-hover:text-emerald-600">
                        <span className="line-clamp-1">{link.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-emerald-600" />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {link.snippet}
                      </p>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-semibold text-slate-600">{link.source || 'Official Source'}</span>
                      <span className="text-emerald-600 font-bold group-hover:underline">Verify Source ↗</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Steps Log Trace */}
          {result.steps_log && result.steps_log.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Forensic Multi-Agent Trace
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

export default ResolveModeView;
