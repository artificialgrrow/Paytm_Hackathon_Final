import React, { useState, useEffect, useRef } from 'react';
import { 
  User, ShieldCheck, Zap, ShieldAlert, Sparkles, Send, Mic, MicOff, 
  ArrowLeft, CreditCard, Wallet, Smartphone, CheckCircle2, AlertCircle, 
  ExternalLink, MessageSquare, KeyRound, RefreshCw, Volume2, Database,
  Clock, FileText, ChevronRight
} from 'lucide-react';
import { playSound } from '../utils/audio';
import { speak, VoiceRecognition } from '../utils/speech';
import { fetchMerchantData, executeAgentQuery } from '../data/telecomPlans';
import { FormattedMessage } from './FormattedMessage';

export default function MainDashboard({ onLogOut, onOpenPinModal, onOpenNexconn, initialQuery }) {
  // Navigation & Mode
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'action_catalog' | 'resolve_disputes' | 'sqlite_db'
  const [activeMode, setActiveMode] = useState('ACTION'); // 'ACTION' | 'RESOLVE'
  
  // Data State from SQLite
  const [merchantData, setMerchantData] = useState(null);
  const [loadingDb, setLoadingDb] = useState(true);

  // Chat State
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Namaste Akash! I am your Paytm AI Assistant. I am directly connected to your merchant Sharma Telecom & Digital Services. What would you like to do today?',
      timestamp: '10:45 AM',
      mode: 'ACTION'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState('hi-IN');
  const [isListening, setIsListening] = useState(false);

  const chatBottomRef = useRef(null);
  const voiceRef = useRef(null);

  // Load SQLite Merchant Data
  useEffect(() => {
    async function loadData() {
      setLoadingDb(true);
      const data = await fetchMerchantData();
      setMerchantData(data);
      setLoadingDb(false);
    }
    loadData();
  }, []);

  // Voice recognition init
  useEffect(() => {
    voiceRef.current = new VoiceRecognition(
      (transcript, isFinal) => {
        setInputVal(transcript);
        if (isFinal) {
          handleSendMessage(transcript);
        }
      },
      (listening) => setIsListening(listening)
    );
  }, [language]);

  // Initial query if passed
  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const toggleMic = () => {
    if (isListening) {
      voiceRef.current?.stop();
    } else {
      playSound('chime');
      voiceRef.current?.start(language);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isProcessing) return;

    playSound('click');
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsProcessing(true);

    try {
      // Execute pure AI agent grounded in SQLite
      const agentResult = await executeAgentQuery(text);
      setActiveMode(agentResult.mode || 'ACTION');

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: agentResult.ai_message,
        payload: agentResult,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: agentResult.mode
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Voice TTS
      const langCode = agentResult.language === 'hi' ? 'hi-IN' : (agentResult.language === 'mr' ? 'mr-IN' : 'en-US');
      setLanguage(langCode);
      if (agentResult.ai_message) {
        speak(agentResult.ai_message, langCode);
      }
      playSound('chime');
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprovePlan = (plan) => {
    playSound('click');
    onOpenPinModal({
      amount: plan.price,
      operator: plan.operator.toUpperCase(),
      validity: plan.validity,
      language: 'hi'
    });
  };

  const handleDisputeHandoff = (sessionData) => {
    playSound('click');
    onOpenNexconn(sessionData);
  };

  const merchant = merchantData?.merchant || {
    name: "Sharma Telecom & Digital Services",
    merchant_id: "MERCH_SHARMA_01",
    upi_id: "sharmatelecom@paytm",
    address: "Shop 14, Linking Road, Bandra West, Mumbai"
  };

  return (
    <div className="min-h-screen bg-surface-soft flex flex-col font-sans">
      
      {/* 1. TOP DASHBOARD NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white border-b border-hairline px-4 sm:px-8 py-3 flex items-center justify-between">
        
        {/* Brand & User Breadcrumb */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
              P
            </div>
            <span className="font-bold text-xl text-ink tracking-tight">paytm</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
              DASHBOARD
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-muted pl-4 border-l border-hairline">
            <span>Linked Merchant:</span>
            <span className="font-semibold text-ink">{merchant.name}</span>
            <span className="text-[10px] bg-semantic-up/10 text-semantic-up font-mono px-1.5 py-0.5 rounded">
              SQLite Active
            </span>
          </div>
        </div>

        {/* User Account Capsule & Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 bg-surface-soft border border-hairline px-3.5 py-1.5 rounded-pill">
            <div className="w-7 h-7 rounded-full bg-ink text-white flex items-center justify-center text-xs font-bold">
              AB
            </div>
            <div className="text-left text-xs leading-tight">
              <div className="font-semibold text-ink">Akash Bichukale</div>
              <div className="text-[11px] text-muted font-mono">akash@paytm • SBI XX4821</div>
            </div>
            <div className="text-right text-xs pl-2 border-l border-hairline">
              <div className="text-[10px] text-muted uppercase font-semibold">Wallet</div>
              <div className="font-mono font-bold text-semantic-up">₹4,250.00</div>
            </div>
          </div>

          <button
            onClick={() => {
              playSound('click');
              onLogOut();
            }}
            className="btn-pill h-9 px-4 text-xs font-semibold text-body hover:text-ink bg-surface-strong hover:bg-hairline transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>

      </header>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (4 Cols): Profiles, Models & SQLite DB Explorer */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* A. User Profile & Wallet Card */}
          <div className="bg-white border border-hairline rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-surface-strong border border-hairline flex items-center justify-center font-bold text-base text-ink">
                  AB
                </div>
                <div>
                  <div className="font-bold text-base text-ink flex items-center gap-1.5">
                    <span>Akash Bichukale</span>
                    <CheckCircle2 className="w-4 h-4 text-semantic-up" />
                  </div>
                  <div className="text-xs text-muted font-mono">+91 98201 23456 • KYC Verified</div>
                </div>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-semantic-up/10 text-semantic-up">
                Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-surface-soft p-3 rounded-lg border border-hairline">
                <div className="text-muted font-medium flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5 text-primary" />
                  <span>Paytm Wallet</span>
                </div>
                <div className="font-mono text-lg font-bold text-ink mt-1">₹4,250.00</div>
              </div>
              <div className="bg-surface-soft p-3 rounded-lg border border-hairline">
                <div className="text-muted font-medium flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-primary" />
                  <span>Primary Bank</span>
                </div>
                <div className="font-mono text-xs font-bold text-ink mt-2 truncate">SBI •••• 4821</div>
              </div>
            </div>
          </div>

          {/* B. Two Operational Models Overview & Tabs */}
          <div className="bg-white border border-hairline rounded-xl p-5 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-muted uppercase tracking-wider">
                Two Operational Models
              </div>
              <div className="flex gap-1 bg-surface-strong p-1 rounded-pill text-xs font-semibold">
                <button
                  onClick={() => {
                    playSound('click');
                    setActiveMode('ACTION');
                  }}
                  className={`px-3 py-1 rounded-pill transition-colors flex items-center gap-1 ${
                    activeMode === 'ACTION' ? 'bg-primary text-white shadow-xs' : 'text-body hover:text-ink'
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  <span>Action (Pay)</span>
                </button>
                <button
                  onClick={() => {
                    playSound('click');
                    setActiveMode('RESOLVE');
                  }}
                  className={`px-3 py-1 rounded-pill transition-colors flex items-center gap-1 ${
                    activeMode === 'RESOLVE' ? 'bg-semantic-down text-white shadow-xs' : 'text-body hover:text-ink'
                  }`}
                >
                  <ShieldAlert className="w-3 h-3" />
                  <span>Resolve (Dispute)</span>
                </button>
              </div>
            </div>

            {/* Model 1: Action Mode Explanation */}
            <div className={`p-4 rounded-lg border transition-all ${activeMode === 'ACTION' ? 'bg-primary/5 border-primary/30' : 'bg-surface-soft border-hairline'}`}>
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm text-ink flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>Action Mode (Paytm ONE)</span>
                </div>
                <span className="text-[10px] font-mono text-primary font-bold">Fulfillment Rail</span>
              </div>
              <p className="text-xs text-body mt-1.5 leading-relaxed">
                Autonomous bill payments and telecom recharges. Speak or ask naturally — AI matches live inventory from Sharma Telecom, verifies tariffs, and lets you approve with your PIN.
              </p>
            </div>

            {/* Model 2: Resolve Mode Explanation */}
            <div className={`p-4 rounded-lg border transition-all ${activeMode === 'RESOLVE' ? 'bg-semantic-down/5 border-semantic-down/30' : 'bg-surface-soft border-hairline'}`}>
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm text-ink flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-semantic-down" />
                  <span>Resolve Mode (Paytm Resolve)</span>
                </div>
                <span className="text-[10px] font-mono text-semantic-down font-bold">Dispute Rail</span>
              </div>
              <p className="text-xs text-body mt-1.5 leading-relaxed">
                Autonomous reconciliation for failed/debited payments. AI checks telecom switch logs in SQLite, references official NPCI circulars, and hands off to live support (Priya Sharma).
              </p>
            </div>

          </div>

          {/* C. Live SQLite Database Inspector */}
          <div className="bg-white border border-hairline rounded-xl p-5 shadow-xs space-y-3">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-ink uppercase tracking-wider">
                  Merchant SQLite Database Records
                </span>
              </div>
              <span className="text-[10px] font-mono text-muted">ID: {merchant.merchant_id}</span>
            </div>

            <p className="text-xs text-muted">
              Click any database scenario below to query the AI agent with real data:
            </p>

            {/* Scenario 1: The Critical Pending Failed Payment in SQLite */}
            <div
              onClick={() => {
                handleSendMessage('Meri transaction #PTM7890124 ka status kya hai? Paise kat gaye the.');
              }}
              className="p-3 bg-semantic-down/5 border border-semantic-down/20 rounded-lg hover:border-semantic-down transition-colors cursor-pointer text-xs space-y-1"
            >
              <div className="flex items-center justify-between font-mono font-semibold">
                <span className="text-ink">TXN #PTM7890124 (Jio 84 Days)</span>
                <span className="text-semantic-down">₹599.00</span>
              </div>
              <div className="text-[11px] text-body flex items-center justify-between">
                <span>Status: PENDING_AT_SWITCH (Timeout)</span>
                <span className="text-primary font-semibold">Ask AI →</span>
              </div>
            </div>

            {/* Scenario 2: Active Plan in SQLite */}
            <div
              onClick={() => {
                handleSendMessage('Sharma Telecom se Jio ka 299 wala 2GB plan recharge karo');
              }}
              className="p-3 bg-surface-soft border border-hairline rounded-lg hover:border-primary transition-colors cursor-pointer text-xs space-y-1"
            >
              <div className="flex items-center justify-between font-mono font-semibold">
                <span className="text-ink">Plan: Jio 299 (28 Days)</span>
                <span className="text-primary">₹299.00</span>
              </div>
              <div className="text-[11px] text-body flex items-center justify-between">
                <span>2 GB / Day • True 5G • JioCinema</span>
                <span className="text-primary font-semibold">Recharge →</span>
              </div>
            </div>

            {/* Scenario 3: Electricity Bill in SQLite */}
            <div
              onClick={() => {
                handleSendMessage('MSEDCL electricity bill CA 002948192841 pay karo');
              }}
              className="p-3 bg-surface-soft border border-hairline rounded-lg hover:border-primary transition-colors cursor-pointer text-xs space-y-1"
            >
              <div className="flex items-center justify-between font-mono font-semibold">
                <span className="text-ink">Bill: MSEDCL Power Due</span>
                <span className="text-semantic-up">₹1,420.00</span>
              </div>
              <div className="text-[11px] text-body flex items-center justify-between">
                <span>Consumer CA #002948192841</span>
                <span className="text-primary font-semibold">Pay Bill →</span>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN (7 Cols): FULL-HEIGHT, SPACIOUS CHATBOT */}
        <div className="lg:col-span-7 bg-white border border-hairline rounded-xl shadow-xs flex flex-col h-[780px] overflow-hidden">
          
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-hairline bg-surface-dark text-on-dark flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <span>Paytm AI Agent</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-semantic-up/10 text-semantic-up font-semibold">
                    Online
                  </span>
                </div>
                <div className="text-xs text-muted-soft">
                  Grounded in Sharma Telecom's Live SQLite Database
                </div>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-surface-dark-elevated rounded-pill p-0.5 text-xs font-semibold text-muted-soft border border-hairline/10">
              <button
                onClick={() => setLanguage('hi-IN')}
                className={`px-2.5 py-1 rounded-pill transition-colors ${language.startsWith('hi') ? 'bg-primary text-white' : 'hover:text-white'}`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('en-US')}
                className={`px-2.5 py-1 rounded-pill transition-colors ${language.startsWith('en') ? 'bg-primary text-white' : 'hover:text-white'}`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('mr-IN')}
                className={`px-2.5 py-1 rounded-pill transition-colors ${language.startsWith('mr') ? 'bg-primary text-white' : 'hover:text-white'}`}
              >
                मराठी
              </button>
            </div>
          </div>

          {/* Chat Message Stream */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-surface-soft text-sm">
            
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 space-y-3 leading-relaxed shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-xs'
                      : 'bg-white text-ink border border-hairline rounded-tl-xs'
                  }`}
                >
                  {/* Sender Tag */}
                  {m.sender === 'ai' && (
                    <div className="flex items-center justify-between border-b border-hairline pb-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-primary uppercase">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{m.mode === 'RESOLVE' ? 'Paytm Resolve (Dispute Assistant)' : 'Paytm ONE (Action Assistant)'}</span>
                      </div>
                      <button
                        onClick={() => speak(m.text, language)}
                        className="text-muted hover:text-ink text-[11px] flex items-center gap-1"
                        title="Listen"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen</span>
                      </button>
                    </div>
                  )}

                  {/* Message Prose */}
                  <div className="text-[14px] font-normal leading-relaxed">
                    <FormattedMessage text={m.text} />
                  </div>

                  {/* DYNAMIC ACTION CARD (If Agent Result included a plan) */}
                  {m.payload?.plan_data?.best && (
                    <div className="bg-surface-soft border-2 border-primary/30 rounded-xl p-4 text-ink space-y-3 mt-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-mono text-2xl font-bold text-ink">
                            ₹{m.payload.plan_data.best.price}
                          </div>
                          <div className="text-xs text-muted">
                            {m.payload.plan_data.best.operator} • {m.payload.plan_data.best.validity}
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-semantic-up bg-semantic-up/10 px-2 py-0.5 rounded-pill">
                          {m.payload.plan_data.best.badge || 'Verified Match'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-lg border border-hairline">
                        <div>
                          <span className="text-muted text-[10px] block">DAILY DATA</span>
                          <span className="font-semibold text-primary">{m.payload.plan_data.best.data}</span>
                        </div>
                        <div>
                          <span className="text-muted text-[10px] block">VOICE CALLS</span>
                          <span className="font-semibold text-ink">{m.payload.plan_data.best.calls}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleApprovePlan(m.payload.plan_data.best)}
                        className="btn-pill w-full h-11 text-xs font-semibold text-white bg-primary hover:bg-primary-active transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Approve & Pay ₹{m.payload.plan_data.best.price} via UPI PIN</span>
                      </button>
                    </div>
                  )}

                  {/* DYNAMIC RESOLVE CARD (If Agent Result found transaction dispute) */}
                  {m.payload?.mode === 'RESOLVE' && m.payload?.transaction && (
                    <div className="bg-surface-soft border border-semantic-down/30 rounded-xl p-4 text-ink space-y-3 mt-2">
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="font-bold text-ink">TXN #{m.payload.transaction.txn_id}</span>
                        <span className="text-semantic-down font-bold text-sm">₹{m.payload.transaction.amount}</span>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-hairline text-xs space-y-1">
                        <div className="text-muted text-[11px]">Reason for delay:</div>
                        <p className="text-body text-[12px] italic">
                          {m.payload.transaction.failure_reason || 'Bank debited, switch timeout.'}
                        </p>
                        <div className="text-[11px] font-semibold text-semantic-up pt-1">
                          Auto-refund ETA: {m.payload.transaction.refund_tat}
                        </div>
                      </div>

                      {/* Official NPCI Citation */}
                      {m.payload.citations && (
                        <div className="text-[11px] text-muted flex items-center justify-between border-t border-hairline pt-2">
                          <span className="truncate max-w-[200px]">NPCI Circular No. 81 Verified</span>
                          <a
                            href={m.payload.citations.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline font-semibold flex items-center gap-0.5"
                          >
                            <span>Official Rule</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      {/* Nexconn Live Support Button */}
                      <button
                        onClick={() => handleDisputeHandoff(m.payload.nexconn_chat)}
                        className="btn-pill w-full h-10 text-xs font-semibold text-white bg-semantic-up hover:bg-semantic-up/90 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat with Specialist Priya Sharma (Nexconn SDK)</span>
                      </button>
                    </div>
                  )}

                  <div className={`text-[10px] text-right ${m.sender === 'user' ? 'text-white/75' : 'text-muted'}`}>
                    {m.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {/* Thinking / AI Spinner */}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white border border-hairline rounded-2xl rounded-tl-xs p-4 flex items-center gap-3 shadow-xs">
                  <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <span className="text-xs font-medium text-body">
                    Evaluating Sharma Telecom SQLite database & live network...
                  </span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompts Strip */}
          <div className="px-4 py-2 bg-white border-t border-hairline flex flex-wrap gap-1.5 text-xs">
            <span className="text-muted font-medium self-center text-[11px] mr-1">Ask:</span>
            <button
              onClick={() => handleSendMessage('Sharma Telecom ka Jio 299 recharge karo')}
              className="bg-surface-soft hover:bg-surface-strong text-ink px-2.5 py-1 rounded-pill transition-colors text-[11px]"
            >
              Jio 299 Recharge
            </button>
            <button
              onClick={() => handleSendMessage('Paise cut gaye 599 recharge nahi hua refund status')}
              className="bg-surface-soft hover:bg-surface-strong text-ink px-2.5 py-1 rounded-pill transition-colors text-[11px]"
            >
              Check ₹599 Failed Refund
            </button>
            <button
              onClick={() => handleSendMessage('Show all catalog plans from this merchant')}
              className="bg-surface-soft hover:bg-surface-strong text-ink px-2.5 py-1 rounded-pill transition-colors text-[11px]"
            >
              All Plans
            </button>
          </div>

          {/* Input & Voice Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 sm:p-4 bg-white border-t border-hairline flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleMic}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-semantic-down text-white animate-pulse'
                  : 'bg-surface-strong text-ink hover:bg-hairline'
              }`}
              title="Speak in Hindi / English / Marathi"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask anything: 'Recharge Jio 299', 'Why is my ₹599 pending?', 'Pay bill'..."
              className="flex-1 h-11 px-4 text-[14px] text-ink placeholder:text-muted bg-surface-soft border border-hairline rounded-pill outline-none focus:border-primary transition-colors"
            />

            <button
              type="submit"
              disabled={isProcessing || !inputVal.trim()}
              className="btn-pill h-11 px-5 text-sm font-semibold text-white bg-primary hover:bg-primary-active transition-colors flex items-center gap-1.5 disabled:bg-primary-disabled"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
