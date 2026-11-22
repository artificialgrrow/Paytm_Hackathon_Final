import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Mic, MicOff, Send, Shield, Zap, Plane, CheckCircle2, 
  ExternalLink, MessageSquare, ArrowRight, RefreshCw, Volume2, KeyRound
} from 'lucide-react';
import { playSound } from '../utils/audio';
import { speak, VoiceRecognition } from '../utils/speech';
import { executeAgentQuery } from '../data/telecomPlans';
import { FormattedMessage } from './FormattedMessage';

export default function AiWorkspace({ initialPrompt, onClose, onOpenPinModal, onOpenNexconn }) {
  const [query, setQuery] = useState(initialPrompt || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [language, setLanguage] = useState('hi-IN');
  const [isListening, setIsListening] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const voiceRef = useRef(null);

  useEffect(() => {
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

  useEffect(() => {
    if (initialPrompt) {
      handleExecute(initialPrompt);
    }
  }, []);

  const handleExecute = async (qToRun) => {
    const q = (qToRun || query).trim();
    if (!q) return;

    playSound('click');
    setLoading(true);
    setResult(null);
    setShowAlternatives(false);

    try {
      const data = await executeAgentQuery(q);
      setResult(data);
      if (data.plan_data?.best) {
        setSelectedPlan(data.plan_data.best);
      }
      
      // Auto voice readout
      const langCode = data.language === 'hi' ? 'hi-IN' : (data.language === 'mr' ? 'mr-IN' : 'en-US');
      setLanguage(langCode);
      if (data.ai_message) {
        speak(data.ai_message, langCode);
      }
      playSound('chime');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      voiceRef.current?.stop();
    } else {
      playSound('chime');
      voiceRef.current?.start(language);
    }
  };

  const handleApproveRecharge = () => {
    playSound('click');
    const plan = selectedPlan || result?.plan_data?.best;
    if (plan) {
      onOpenPinModal({
        amount: plan.price,
        operator: (result?.operator || 'Jio').toUpperCase(),
        validity: plan.validity,
        language: result?.language || 'hi'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-canvas border border-hairline rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Workspace Top Header */}
        <div className="px-6 py-4 bg-surface-dark text-on-dark flex items-center justify-between border-b border-hairline/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-base tracking-tight">Paytm AI Assistant</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 uppercase">
                  Online
                </span>
              </div>
              <p className="text-[12px] text-muted-soft">Recharge, Bills, Travel & Payment Dispute Help</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher Pill */}
            <div className="hidden sm:flex items-center bg-surface-dark-elevated rounded-pill p-0.5 text-xs font-semibold text-muted-soft border border-hairline/10">
              <button
                onClick={() => setLanguage('hi-IN')}
                className={`px-3 py-1 rounded-pill transition-colors ${language.startsWith('hi') ? 'bg-primary text-white' : 'hover:text-white'}`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('en-US')}
                className={`px-3 py-1 rounded-pill transition-colors ${language.startsWith('en') ? 'bg-primary text-white' : 'hover:text-white'}`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('mr-IN')}
                className={`px-3 py-1 rounded-pill transition-colors ${language.startsWith('mr') ? 'bg-primary text-white' : 'hover:text-white'}`}
              >
                मराठी
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                playSound('click');
                onClose();
              }}
              className="text-muted-soft hover:text-white w-8 h-8 rounded-full flex items-center justify-center bg-surface-dark-elevated transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Workspace Body / Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface-soft">
          
          {/* Active Query Input Box */}
          <div className="bg-white border border-hairline rounded-lg p-3 shadow-xs">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleExecute()}
                placeholder="उदा. Jio 300 का 2GB daily data प्लान, या पैसे कट गए refund चाहिए..."
                className="flex-1 text-[15px] text-ink placeholder:text-muted bg-transparent outline-none px-2 py-1 font-sans"
              />

              {/* Mic STT Button */}
              <button
                type="button"
                onClick={toggleMic}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isListening 
                    ? 'bg-semantic-down text-white animate-pulse' 
                    : 'bg-surface-strong text-ink hover:bg-hairline'
                }`}
                title="Speak in Hindi / English / Marathi"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleExecute()}
                disabled={loading}
                className="btn-pill h-10 px-5 text-[14px] font-semibold text-white bg-primary hover:bg-primary-active transition-colors flex items-center gap-1.5 disabled:bg-primary-disabled"
              >
                <span>Process</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Action Chips */}
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-hairline-soft text-[12px]">
              <span className="text-muted font-medium self-center mr-1">Quick:</span>
              <button
                onClick={() => {
                  setQuery('Jio 300 budget 2gb daily data aur netflix recharge');
                  handleExecute('Jio 300 budget 2gb daily data aur netflix recharge');
                }}
                className="bg-surface-strong hover:bg-hairline text-ink px-2.5 py-1 rounded-pill transition-colors font-medium"
              >
                Jio 2GB + Netflix
              </button>
              <button
                onClick={() => {
                  setQuery('Paise cut ho gaye par recharge nahi hua, check refund');
                  handleExecute('Paise cut ho gaye par recharge nahi hua, check refund');
                }}
                className="bg-surface-strong hover:bg-hairline text-ink px-2.5 py-1 rounded-pill transition-colors font-medium"
              >
                Failed Payment & Refund
              </button>
              <button
                onClick={() => {
                  setQuery('Cheapest flight from Pune to Mumbai');
                  handleExecute('Cheapest flight from Pune to Mumbai');
                }}
                className="bg-surface-strong hover:bg-hairline text-ink px-2.5 py-1 rounded-pill transition-colors font-medium"
              >
                Pune-Mumbai Flights
              </button>
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="bg-white border border-hairline rounded-lg p-12 text-center space-y-4 shadow-xs">
              <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <div className="text-[15px] font-semibold text-ink">Analyzing your request...</div>
                <p className="text-[13px] text-muted">Checking operator plans and official bank refund rules...</p>
              </div>
            </div>
          )}

          {/* Result Output Area */}
          {!loading && result && (
            <div className="space-y-5 animate-in fade-in duration-300">
              
              {/* Agent Explanation Header */}
              <div className="bg-white border border-hairline rounded-lg p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-semantic-up" />
                    <span className="text-[12px] font-mono uppercase font-semibold text-primary">
                      {result.mode === 'RESOLVE' ? 'Payment Help & Dispute Investigation' : 'Recharge & Payment Recommendation'}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-surface-strong text-ink">
                      {result.language === 'hi' ? 'हिंदी (Hindi)' : (result.language === 'mr' ? 'मराठी (Marathi)' : 'English')}
                    </span>
                  </div>

                  {result.ai_message && (
                    <button
                      onClick={() => speak(result.ai_message, language)}
                      className="text-body hover:text-ink text-xs flex items-center gap-1 font-medium"
                      title="Listen again"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen</span>
                    </button>
                  )}
                </div>

                <div className="text-[15px] font-normal leading-relaxed">
                  <FormattedMessage text={result.ai_message} />
                </div>
              </div>

              {/* BRANCH 1: RECHARGE MODE */}
              {result.mode === 'ACTION' && result.service === 'recharge' && selectedPlan && (
                <div className="bg-white border-2 border-primary/30 rounded-lg p-6 shadow-sm space-y-6">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-5">
                    <div>
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-4xl font-semibold text-ink">₹{selectedPlan.price}</span>
                        <span className="text-xs text-muted line-through font-mono">₹{selectedPlan.price + 50}</span>
                        <span className="text-[11px] font-semibold text-semantic-up px-2 py-0.5 rounded-pill bg-semantic-up/10">
                          {selectedPlan.badge || 'Best Match'}
                        </span>
                      </div>
                      <p className="text-[13px] text-body mt-1">{selectedPlan.description}</p>
                    </div>

                    <div className="text-left sm:text-right font-mono text-[12px] text-muted">
                      <div>TARGET MSISDN</div>
                      <div className="text-ink font-semibold text-sm">98201 23456</div>
                      <div className="text-[11px]">{result.operator?.toUpperCase()} • Mumbai / MH</div>
                    </div>
                  </div>

                  {/* Plan Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-surface-soft p-3 rounded-md border border-hairline">
                      <div className="text-[11px] text-muted font-medium">VALIDITY</div>
                      <div className="font-mono text-sm font-semibold text-ink mt-0.5">{selectedPlan.validity}</div>
                    </div>
                    <div className="bg-surface-soft p-3 rounded-md border border-hairline">
                      <div className="text-[11px] text-muted font-medium">DAILY DATA</div>
                      <div className="font-mono text-sm font-semibold text-primary mt-0.5">{selectedPlan.data}</div>
                    </div>
                    <div className="bg-surface-soft p-3 rounded-md border border-hairline">
                      <div className="text-[11px] text-muted font-medium">VOICE</div>
                      <div className="font-mono text-sm font-semibold text-ink mt-0.5">{selectedPlan.calls}</div>
                    </div>
                    <div className="bg-surface-soft p-3 rounded-md border border-hairline">
                      <div className="text-[11px] text-muted font-medium">5G NETWORK</div>
                      <div className="font-mono text-sm font-semibold text-semantic-up mt-0.5">{selectedPlan.network}</div>
                    </div>
                  </div>

                  {/* SerpApi Verification Ribbon (Sponsor Track 1) */}
                  {result.serp_verification?.live_web_matches?.length > 0 && (
                    <div className="p-3 bg-surface-soft rounded-md border border-hairline text-[12px] space-y-1">
                      <div className="flex items-center justify-between text-muted">
                        <span className="font-semibold text-ink flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                          SerpApi Google Search Verification
                        </span>
                        <span className="font-mono text-[10px] text-semantic-up bg-semantic-up/10 px-2 py-0.5 rounded-full">
                          HTTP 200 OK
                        </span>
                      </div>
                      <p className="text-body italic">
                        "{result.serp_verification.live_web_matches[0].snippet}"
                      </p>
                    </div>
                  )}

                  {/* Action & Approval Pill */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={handleApproveRecharge}
                      className="btn-pill w-full sm:flex-1 h-12 text-[15px] font-semibold text-white bg-primary hover:bg-primary-active transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Approve & Authorize PIN (₹{selectedPlan.price})</span>
                    </button>

                    {result.plan_data?.alternatives?.length > 0 && (
                      <button
                        onClick={() => {
                          playSound('click');
                          setShowAlternatives(!showAlternatives);
                        }}
                        className="btn-pill w-full sm:w-auto h-12 px-6 text-[14px] font-semibold text-ink bg-surface-strong hover:bg-hairline transition-colors"
                      >
                        {showAlternatives ? 'Hide Alternatives' : 'Compare Alternatives'}
                      </button>
                    )}
                  </div>

                  {/* Alternative Plans Drawer */}
                  {showAlternatives && result.plan_data?.alternatives && (
                    <div className="pt-4 border-t border-hairline space-y-2">
                      <div className="text-[12px] font-semibold text-muted uppercase tracking-wider">Other Telecom Options:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {result.plan_data.alternatives.map((alt) => (
                          <div
                            key={alt.id}
                            onClick={() => {
                              playSound('click');
                              setSelectedPlan(alt);
                            }}
                            className="p-3 rounded-md border border-hairline hover:border-primary cursor-pointer transition-colors bg-white"
                          >
                            <div className="flex justify-between items-baseline font-mono font-semibold">
                              <span className="text-ink">₹{alt.price}</span>
                              <span className="text-xs text-muted">{alt.validity}</span>
                            </div>
                            <div className="text-xs text-primary font-medium mt-1">{alt.data}</div>
                            <div className="text-[11px] text-muted mt-0.5 truncate">{alt.ott?.join(', ')}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* BRANCH 2: RESOLVE / DISPUTE MODE (You.com & Nexconn) */}
              {result.mode === 'RESOLVE' && (
                <div className="bg-white border border-hairline rounded-lg p-6 shadow-sm space-y-5">
                  
                  {/* Transaction In Dispute Card */}
                  <div className="bg-surface-soft p-4 rounded-md border border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-mono text-muted uppercase">Disputed Transaction ID</div>
                      <div className="text-ink font-semibold font-mono text-base">{result.transaction?.id || '#PTM7890124'}</div>
                      <div className="text-xs text-body mt-0.5">{result.transaction?.operator || 'Jio'} • {result.transaction?.amount || '₹599'}</div>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="inline-block text-[11px] font-semibold font-mono px-2.5 py-1 rounded-full bg-semantic-down/10 text-semantic-down">
                        {result.transaction?.status || 'Pending at Telecom Switch'}
                      </span>
                      <div className="text-[11px] text-muted mt-1">Reconciliation trigger sent to NPCI</div>
                    </div>
                  </div>

                  {/* You.com Cited Policy Box (Track 2) */}
                  {result.citations && (
                    <div className="p-4 rounded-md bg-white border border-hairline space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                          <Shield className="w-4 h-4 text-primary" />
                          <span>Official NPCI Bank Refund Rule</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-semantic-up/10 text-semantic-up">Verified</span>
                        </div>
                        <a
                          href={result.citations.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline text-xs flex items-center gap-0.5 font-semibold"
                        >
                          <span>View Official Circular</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-[13px] text-body italic leading-relaxed">
                        "{result.citations.snippet}"
                      </p>
                      <div className="text-[11px] text-muted">
                        Verified via You.com: {result.citations.source_title}
                      </div>
                    </div>
                  )}

                  {/* Nexconn Real-Time Dispute Handoff (Track 3) */}
                  <div className="p-4 rounded-md bg-surface-soft border border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold text-ink flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-semantic-up animate-ping" />
                        <span>Live Support Specialist Online</span>
                      </div>
                      <p className="text-xs text-body mt-1">
                        Dispute specialist <strong>{result.nexconn_chat?.assigned_agent?.name || 'Priya Sharma'}</strong> is available right now to review your transaction.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        playSound('click');
                        onOpenNexconn(result.nexconn_chat);
                      }}
                      className="btn-pill h-11 px-5 text-xs font-semibold text-white bg-primary hover:bg-primary-active transition-colors flex items-center gap-2 shrink-0"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat with Support Specialist</span>
                    </button>
                  </div>

                </div>
              )}

              {/* BRANCH 3: TRAVEL MODE (SerpApi Flights & Buses) */}
              {result.service === 'travel' && result.travel_data && (
                <div className="bg-white border border-hairline rounded-lg p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-hairline pb-3">
                    <div className="text-sm font-semibold text-ink flex items-center gap-2">
                      <Plane className="w-4 h-4 text-primary" />
                      <span>SerpApi Live Flight & Transit Engine</span>
                    </div>
                    <span className="text-xs text-muted font-mono">Pune (PNQ) ⇄ Mumbai (BOM)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.travel_data.options.map((opt, i) => (
                      <div key={i} className="bg-surface-soft p-4 rounded-md border border-hairline space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-ink">{opt.airline || opt.operator}</span>
                          <span className="font-mono text-base font-semibold text-semantic-up">{opt.price}</span>
                        </div>
                        <div className="text-xs text-muted">{opt.route} • {opt.time}</div>
                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-strong text-ink">
                            {opt.badge}
                          </span>
                          <button
                            onClick={() => {
                              playSound('chime');
                              alert(`Booking simulated for ${opt.airline || opt.operator}`);
                            }}
                            className="text-xs font-semibold text-primary hover:underline"
                          >
                            Book via Paytm UPI →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
