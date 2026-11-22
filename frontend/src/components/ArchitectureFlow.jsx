import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, ShieldCheck, Cpu, Search, Volume2, Lock, CheckCircle2, 
  Layers, Activity, Maximize2, Minimize2, X, Play, RefreshCw,
  Scale, Mic, Terminal, Sparkles, ZoomIn, ZoomOut, RotateCcw,
  Shield, UserCheck
} from 'lucide-react';
import { playSound } from '../utils/audio';
import { speak } from '../utils/speech';

export const ArchitectureFlow = ({ language = 'en', onClose }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeStep, setActiveStep] = useState(null);
  const [completedNodes, setCompletedNodes] = useState([]);
  const canvasRef = useRef(null);

  const isHindi = language === 'hi';

  // Node telemetry and payload definitions
  const nodeData = {
    trigger: {
      id: 'trigger',
      icon: Mic,
      name: isHindi ? 'यूज़र इनपुट' : 'User Ingestion',
      subtitle: isHindi ? 'मल्टीमोडल इनपुट' : 'Multimodal Input',
      category: isHindi ? 'इनपुट ट्रिगर' : 'Input Trigger',
      latency: '< 40ms',
      tech: 'Web Speech API • Phonetic Normalizer • Canvas OCR',
      desc: isHindi 
        ? 'उपयोगकर्ता के हिंदी, अंग्रेजी अथवा स्थानीय आवाज व टेक्स्ट को कैप्चर कर बैकग्राउंड नॉइज़ हटाता है और देवनागरी अंकों को सामान्य करता है।'
        : 'Captures spoken voice or typed text in English and Hindi. Strips ambient acoustic noise and normalizes phonetic vernacular tokens into canonical commands.',
      inbound: {
        raw_input: isHindi ? 'मला 299 चा जिओ रिचार्ज हवा / पैसे कट झाले रिफंड' : 'Book cheapest flight to Pune & check ₹1200 failed refund',
        language_detected: isHindi ? 'hi-IN' : 'en-IN',
        voice_fidelity: '99.4%'
      },
      outbound: {
        normalized_tokens: ['flight', 'pune', 'recharge', 'refund_investigation', 'failed_1200'],
        intent_envelope: 'DUAL_PARALLEL_DISPATCH',
        routed_to: 'MASTER_ROUTER'
      }
    },
    orchestrator: {
      id: 'orchestrator',
      icon: Cpu,
      name: isHindi ? 'मास्टर राउटर' : 'Master Router',
      subtitle: isHindi ? 'इंटेंट क्लासिफायर' : 'Intent Classifier',
      category: isHindi ? 'डिसीजन कोर' : 'Decision Core',
      latency: '~ 280ms',
      tech: 'Groq Llama-3.3 70B • High-Speed Intent Pipeline',
      desc: isHindi
        ? 'उपयोगकर्ता के इरादे का उप-सेकंड वर्गीकरण करता है और समानांतर में एक्शन और रिजॉल्व दोनों वर्कफ्लो को सक्रिय करता है।'
        : 'Performs sub-300ms neural intent classification. Deconstructs multi-intent queries and simultaneously dispatches requests to both Action Mode and Resolve Mode engines.',
      inbound: {
        envelope_id: 'PTM-ENV-8841',
        query_type: 'PARALLEL_EXECUTION_REQUEST',
        context_window: 'SESSION_STATE_ACTIVE'
      },
      outbound: {
        primary_branch: 'ACTION_MODE (Utilities, Travel, Recharge)',
        secondary_branch: 'RESOLVE_MODE (Forensic Dispute & 3-Way Reconciliation)',
        parallel_dispatch: true,
        confidence_score: 0.998
      }
    },
    action_mode: {
      id: 'action_mode',
      icon: Zap,
      name: isHindi ? 'एक्शन मोड' : 'Action Mode',
      subtitle: isHindi ? 'ऑटोनॉमस इंजन' : 'Autonomous Engine',
      category: isHindi ? 'पिलर 1: एक्शन' : 'Pillar 1: Action',
      latency: '~ 50ms',
      tech: 'Paytm ONE Unified Cart & BBPS Protocol Hub',
      desc: isHindi
        ? 'मोबाइल रिचार्ज, बिजली बिल, फास्टैग, फ्लाइट्स और होटल जैसी 10+ आवश्यक सेवाओं को सिंगल-कन्वर्सशन पाइपलाइन में एकीकृत करता है।'
        : 'Coordinates 10+ core consumer verticals (Mobile, FASTag, Electricity, Flights, Bus, Hotels) into an autonomous one-click execution pipeline.',
      inbound: {
        service_target: 'FLIGHT_BOOKING + FASTAG_RECHARGE',
        budget_cap: 3500,
        preference: 'CHEAPEST_DIRECT'
      },
      outbound: {
        action_route: 'LIVE_SEARCH_CATALOG_SCOUT',
        cart_status: 'ITEM_STAGED_FOR_TARIFF_VALIDATION'
      }
    },
    agent_action: {
      id: 'agent_action',
      icon: Search,
      name: isHindi ? 'लाइव टैरिफ व डील्स' : 'Live Tariffs & Deals',
      subtitle: isHindi ? 'रीयल-टाइम सर्च' : 'Real-Time Search',
      category: isHindi ? 'लाइव एजेंट' : 'Live Agent',
      latency: '~ 680ms',
      tech: 'SerpApi Engine • Live Travel & Telecom Scraper',
      desc: isHindi
        ? 'रियल-टाइम एयरलाइन फेयर्स, आईआरसीटीसी रेल सीट्स और टेलीकॉम टैरिफ की सीधे बाजार से जांच कर सबसे किफायती विकल्प ढूंढता है।'
        : 'Scouts real-time telecom catalogs and live travel fares across flight providers and bus aggregators with zero hallucination guarantee.',
      inbound: {
        search_query: 'IndiGo Mumbai to Pune flight cheapest departure today',
        geo_location: 'IN',
        filter: 'BEST_VALUE_WITH_CASHBACK'
      },
      outbound: {
        selected_option: 'IndiGo 6E-241 @ ₹2,149 (Save ₹450 with Cashback)',
        availability: 'CONFIRMED_SEATS_12',
        staged_amount: 2149
      }
    },
    resolve_mode: {
      id: 'resolve_mode',
      icon: ShieldCheck,
      name: isHindi ? 'रिजॉल्व मोड' : 'Resolve Mode',
      subtitle: isHindi ? 'फोरेंसिक कोर' : 'Forensic Core',
      category: isHindi ? 'पिलर 2: रिजॉल्व' : 'Pillar 2: Resolve',
      latency: '~ 50ms',
      tech: 'Paytm Dispute Audit Core & Transaction Tracker',
      desc: isHindi
        ? 'कटे हुए पैसों की तुरंत जांच कर ग्राहक बैंक, एनपीसीआई और मर्चेंट लेजर के बीच त्वरित 3-वे क्रॉस ऑडिट शुरू करता है।'
        : 'Initializes forensic dispute recovery for pending or debited funds, establishing real-time tracking across customer bank, NPCI switch, and destination ledger.',
      inbound: {
        txn_id: 'PTM-UPI-994821',
        dispute_type: 'AMOUNT_DEBITED_OPERATOR_PENDING',
        claim_amount: 1200
      },
      outbound: {
        audit_trigger: '3_WAY_RECONCILIATION_MATRIX',
        priority_level: 'INSTANT_SETTLEMENT_CRITICAL'
      }
    },
    agent_resolve: {
      id: 'agent_resolve',
      icon: Scale,
      name: isHindi ? '3-वे रिकंसीलिएशन' : '3-Way Reconciliation',
      subtitle: isHindi ? 'बैंक व लीगल मैट्रिक्स' : 'Bank & Legal Matrix',
      category: isHindi ? 'फोरेंसिक ऑडिट' : 'Forensic Audit',
      latency: '~ 1.1s',
      tech: 'Forensic Audit Matrix • You.com Legal Citations • Nexconn Live Bus',
      desc: isHindi
        ? 'आरबीआई सर्कुलर 81 टी+1 ऑटो-रिफंड जनादेश को उद्धृत करता है, SHA-256 सीलबंद साक्ष्य डॉकेट बनाता है और आवश्यकता पड़ने पर नोडल अधिकारी से जोड़ता है।'
        : 'Cross-verifies 3-way matrix across Sender CBS, NPCI UPI Switch, and Operator. Cites RBI Harmonisation Circular 81 for T+1 mandatory auto-reversal.',
      inbound: {
        cbs_sender_status: 'DEBITED_OK',
        npci_switch: 'CLEARED_MESSAGE',
        operator_switch: 'TIMEOUT_ERROR'
      },
      outbound: {
        forensic_verdict: 'OPERATOR_GATEWAY_FAILURE_CONFIRMED',
        sha256_docket: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        rbi_mandate: 'T+1 Reversal Guaranteed + ₹100/day compensation SLA',
        escalation_room: 'nexconn_live_officer_available'
      }
    },
    zero_trust: {
      id: 'zero_trust',
      icon: Shield,
      name: isHindi ? 'ज़ीरो-ट्रस्ट गेट' : 'Zero-Trust Gate',
      subtitle: isHindi ? 'ह्यूमन-इन-द-लूप' : 'Human-in-the-Loop',
      category: isHindi ? 'ज़ीरो-ट्रस्ट आर्किटेक्चर' : 'Zero-Trust Architecture',
      latency: '< 10ms',
      tech: 'Zero-Trust Framework • Explicit Human-in-the-Loop Consent',
      desc: isHindi
        ? 'वित्तीय लेनदेन से पहले स्पष्ट मानवीय पिन सहमति अनिवार्य करता है। एआई कभी भी आपका यूपीआई पिन नहीं देखता और न ही सेव करता है।'
        : 'Zero-Trust financial architecture enforcing strict Human-in-the-Loop authorization before execution. The autonomous agent prepares the transaction payload, while the human retains full cryptographic control via native secure PIN entry.',
      inbound: {
        total_authorized_amount: 2149,
        security_token: 'HMAC_SHA256_SESSION_TOKEN',
        governance_gate: 'HUMAN_IN_THE_LOOP_APPROVAL_REQUIRED'
      },
      outbound: {
        governance_verdict: 'HUMAN_CONSENT_GRANTED_ZERO_TRUST_PASS',
        secure_handshake: 'AUTHENTICATED_BY_USER'
      }
    },
    terminal: {
      id: 'terminal',
      icon: CheckCircle2,
      name: isHindi ? 'सेटलमेंट व वॉयस' : 'Settlement & Voice',
      subtitle: isHindi ? 'आउटपुट व रसीद' : 'Output & Receipt',
      category: isHindi ? 'फाइनल निष्पादन' : 'Final Execution',
      latency: '< 50ms',
      tech: 'Paytm Settlement Bus • Dynamic UPI QR • Neural Voice Synthesis',
      desc: isHindi
        ? 'स्क्रीन पर गतिशील यूपीआई क्यूआर कोड रसीद प्रस्तुत करता है और महिला वॉयस में लेनदेन की सफलता की घोषणा करता है।'
        : 'Renders dynamic verification receipts, registers instant dispute resolution tickets, and reads out confirmation via natural female voice audio.',
      inbound: {
        action_status: 'TICKET_CONFIRMED',
        resolve_status: 'DOCKET_REGISTERED_AUTO_REFUND_ACTIVE',
        receipt_no: 'PTM-CONF-2026-90412'
      },
      outbound: {
        rendered_ui: 'DYNAMIC_TRANSACTION_CARD',
        voice_confirmation: 'COMPLETED_SUCCESSFULLY',
        system_status: 'PIPELINE_COMPLETE_200_OK'
      }
    }
  };

  const executeSimulation = async () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setCompletedNodes([]);
    setActiveStep('trigger');
    playSound('click');

    const stepDelay = (ms) => new Promise(res => setTimeout(res, ms));

    try {
      // 1. Ingestion
      setActiveStep('trigger');
      playSound('keypad');
      await stepDelay(400);
      setCompletedNodes(prev => [...prev, 'trigger']);

      // 2. Master Router
      setActiveStep('orchestrator');
      playSound('keypad');
      await stepDelay(500);
      setCompletedNodes(prev => [...prev, 'orchestrator']);

      // 3. BOTH Parallel Branches simultaneously (Pillar A & Pillar B)
      setActiveStep('parallel_stage_1');
      playSound('click');
      await stepDelay(400);
      setCompletedNodes(prev => [...prev, 'action_mode', 'resolve_mode']);

      // 4. BOTH Live Engines simultaneously (Tariffs & 3-Way Matrix)
      setActiveStep('parallel_stage_2');
      playSound('keypad');
      await stepDelay(650);
      setCompletedNodes(prev => [...prev, 'agent_action', 'agent_resolve']);

      // 5. Convergence to Zero-Trust Gate (Human-in-the-Loop)
      setActiveStep('zero_trust');
      playSound('keypad');
      await stepDelay(450);
      setCompletedNodes(prev => [...prev, 'zero_trust']);

      // 6. Terminal Settlement
      setActiveStep('terminal');
      playSound('chime');
      await stepDelay(400);
      setCompletedNodes(prev => [...prev, 'terminal']);

      // Announce via strict female voice
      const speechMsg = isHindi 
        ? 'पेटीएम वन समानांतर आर्किटेक्चर पाइपलाइन सफलतापूर्वक पूरी हुई। ज़ीरो-ट्रस्ट ह्यूमन-इन-द-लूप सुरक्षा सत्यापित।'
        : 'Paytm ONE parallel architecture pipeline executed successfully with 100 percent zero-trust human-in-the-loop verification.';
      speak(speechMsg, isHindi ? 'hi-IN' : 'en-IN');
    } finally {
      setIsExecuting(false);
      setActiveStep(null);
    }
  };

  const handleZoom = (delta) => {
    setZoomLevel(prev => {
      const next = prev + delta;
      return Math.min(Math.max(next, 0.65), 1.35);
    });
  };

  const resetZoom = () => {
    if (canvasRef.current && canvasRef.current.clientWidth < 1180) {
      setZoomLevel(canvasRef.current.clientWidth / 1200);
    } else {
      setZoomLevel(1.0);
    }
  };

  useEffect(() => {
    resetZoom();
    const handleResize = () => resetZoom();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isNodeRunning = (id) => {
    if (activeStep === id) return true;
    if (activeStep === 'parallel_stage_1' && (id === 'action_mode' || id === 'resolve_mode')) return true;
    if (activeStep === 'parallel_stage_2' && (id === 'agent_action' || id === 'agent_resolve')) return true;
    return false;
  };

  const isNodeCompleted = (id) => completedNodes.includes(id);

  return (
    <div className={`w-full bg-[#0a0d14] text-white flex flex-col transition-all ${
      isFullScreen 
        ? 'fixed inset-0 z-50 p-4 sm:p-6 overflow-y-auto' 
        : 'rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl'
    }`}>
      
      {/* Scoped CSS for n8n Dotted Grid, Node Cards & Animated SVG Cables */}
      <style>{`
        .n8n-canvas-wrapper {
          background-color: #0d1117;
          background-image: radial-gradient(circle, #21262d 1.5px, transparent 1.5px);
          background-size: 20px 20px;
          box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.85);
          position: relative;
        }
        .workflow-node {
          background: #161b22;
          border: 1.5px solid #30363d;
          border-radius: 14px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
          transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          user-select: none;
          overflow: hidden;
        }
        .workflow-node:hover {
          border-color: #58a6ff;
          transform: translateY(-2px) scale(1.015);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.6), 0 0 16px rgba(88, 166, 255, 0.3);
        }
        .workflow-node.active-selected {
          border-color: #38bdf8 !important;
          box-shadow: 0 0 24px rgba(56, 189, 248, 0.45), 0 0 0 2px #38bdf8 !important;
        }
        .workflow-node.node-running {
          border-color: #f59e0b !important;
          box-shadow: 0 0 25px rgba(245, 158, 11, 0.6), 0 0 0 2px #f59e0b !important;
          animation: pulseRunning 0.8s infinite alternate;
        }
        .workflow-node.node-completed {
          border-color: #22c55e !important;
          box-shadow: 0 0 22px rgba(34, 197, 94, 0.5), 0 0 0 2px #22c55e !important;
        }
        @keyframes pulseRunning {
          from { box-shadow: 0 0 10px rgba(245, 158, 11, 0.3); }
          to { box-shadow: 0 0 26px rgba(245, 158, 11, 0.8), 0 0 0 2px #f59e0b; }
        }
        .node-port {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid #161b22;
          background: #484f58;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          transition: all 0.2s;
          z-index: 20;
        }
        .node-port-in { left: -6px; }
        .node-port-out { right: -6px; }
        .node-completed .node-port {
          background: #22c55e;
          box-shadow: 0 0 8px #22c55e;
        }
        .node-running .node-port {
          background: #f59e0b;
          box-shadow: 0 0 8px #f59e0b;
        }
        .n8n-wire-base {
          fill: none;
          stroke: #21262d;
          stroke-width: 2.5;
          stroke-linecap: round;
        }
        .n8n-wire-active-blue {
          fill: none;
          stroke: #0284c7;
          stroke-width: 2.8;
          stroke-linecap: round;
          stroke-dasharray: 6 10;
          animation: wirePulse 1.2s linear infinite;
          filter: drop-shadow(0 0 4px rgba(2, 132, 199, 0.6));
        }
        .n8n-wire-active-green {
          fill: none;
          stroke: #10b981;
          stroke-width: 2.8;
          stroke-linecap: round;
          stroke-dasharray: 6 10;
          animation: wirePulse 1.2s linear infinite;
          filter: drop-shadow(0 0 4px rgba(16, 185, 129, 0.6));
        }
        .n8n-wire-active-cyan {
          fill: none;
          stroke: #38bdf8;
          stroke-width: 2.8;
          stroke-linecap: round;
          stroke-dasharray: 6 10;
          animation: wirePulse 1.2s linear infinite;
          filter: drop-shadow(0 0 4px rgba(56, 189, 248, 0.6));
        }
        .n8n-wire-running {
          fill: none;
          stroke: #f59e0b;
          stroke-width: 3.5;
          stroke-linecap: round;
          stroke-dasharray: 6 10;
          animation: wirePulse 0.7s linear infinite;
          filter: drop-shadow(0 0 8px #f59e0b);
        }
        @keyframes wirePulse {
          to {
            stroke-dashoffset: -16;
          }
        }
      `}</style>

      {/* TOP HEADER & TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        
        {/* Title & Live Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0052ff] to-[#00b9f1] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                Paytm ONE Dual-Engine Architecture
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Both Modes Parallel
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {isHindi 
                ? 'एक्शन मोड और रिजॉल्व मोड का एकीकृत समानांतर नोड वर्कफ्लो' 
                : 'Concurrent Multi-Agent Workflow: Action Execution & Forensic Dispute Resolution'}
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => handleZoom(-0.1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold text-cyan-400 px-1 min-w-[40px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => handleZoom(0.1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetZoom}
              className="px-2 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-[10px] font-bold font-mono transition-colors"
              title="Fit to Screen"
            >
              Fit
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Exit View Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Architecture View"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* DOTTED LINE WORKFLOW CANVAS CONTAINER */}
      <div 
        ref={canvasRef}
        className="mt-4 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl bg-slate-950 flex flex-col"
      >
        {/* Canvas Sub-header */}
        <div className="bg-slate-900/90 px-5 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Paytm_ONE_Parallel_Graph.canvas</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 rounded-full bg-[#0284c7]"></span>
              <span className="text-sky-300 font-medium">Top: Action Mode</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 rounded-full bg-[#10b981]"></span>
              <span className="text-emerald-300 font-medium">Bottom: Resolve Mode</span>
            </span>
            <span className="hidden sm:inline text-slate-500 font-mono text-[10px]">
              Click any node to inspect payload
            </span>
          </div>
        </div>

        {/* N8N Interactive Dotted Grid Canvas */}
        <div className="n8n-canvas-wrapper overflow-x-auto p-4 sm:p-8 flex justify-center items-center min-h-[460px]">
          
          <div 
            style={{ 
              width: '1140px', 
              height: '380px', 
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top center'
            }}
            className="relative transition-transform duration-200 select-none"
          >
            {/* SVG Connecting Cables Layer */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              style={{ zIndex: 1 }}
            >
              {/* 1. Node 1 (Trigger) -> Node 2 (Master Router) */}
              <path 
                d="M 165 190 L 210 190" 
                className={activeStep === 'trigger' ? 'n8n-wire-running' : 'n8n-wire-active-cyan'} 
              />

              {/* 2. Node 2 (Router) -> Branch 3A (Action Mode) */}
              <path 
                d="M 375 190 C 400 190, 400 80, 425 80" 
                className={activeStep === 'orchestrator' || activeStep === 'parallel_stage_1' ? 'n8n-wire-running' : 'n8n-wire-active-blue'} 
              />

              {/* 3. Node 3A (Action Mode) -> Node 4A (Live Tariffs & Deals) */}
              <path 
                d="M 575 80 L 615 80" 
                className={activeStep === 'parallel_stage_1' || activeStep === 'parallel_stage_2' ? 'n8n-wire-running' : 'n8n-wire-active-blue'} 
              />

              {/* 4. Node 4A (Live Tariffs) -> Node 5 (Zero-Trust Gate) */}
              <path 
                d="M 770 80 C 792 80, 792 190, 815 190" 
                className={activeStep === 'parallel_stage_2' || activeStep === 'zero_trust' ? 'n8n-wire-running' : 'n8n-wire-active-blue'} 
              />

              {/* 5. Node 2 (Router) -> Branch 3B (Resolve Mode) */}
              <path 
                d="M 375 190 C 400 190, 400 300, 425 300" 
                className={activeStep === 'orchestrator' || activeStep === 'parallel_stage_1' ? 'n8n-wire-running' : 'n8n-wire-active-green'} 
              />

              {/* 6. Node 3B (Resolve Mode) -> Node 4B (3-Way Matrix & Audit) */}
              <path 
                d="M 575 300 L 615 300" 
                className={activeStep === 'parallel_stage_1' || activeStep === 'parallel_stage_2' ? 'n8n-wire-running' : 'n8n-wire-active-green'} 
              />

              {/* 7. Node 4B (3-Way Matrix) -> Node 5 (Zero-Trust Gate) */}
              <path 
                d="M 770 300 C 792 300, 792 190, 815 190" 
                className={activeStep === 'parallel_stage_2' || activeStep === 'zero_trust' ? 'n8n-wire-running' : 'n8n-wire-active-green'} 
              />

              {/* 8. Node 5 (Zero-Trust Gate) -> Node 6 (Terminal Settlement) */}
              <path 
                d="M 965 190 L 995 190" 
                className={activeStep === 'zero_trust' || activeStep === 'terminal' ? 'n8n-wire-running' : 'n8n-wire-active-cyan'} 
              />
            </svg>

            {/* ================= WORKFLOW NODES ================= */}

            {/* NODE 1: Multimodal User Trigger */}
            <div 
              onClick={() => { playSound('click'); setSelectedNode(nodeData.trigger); }}
              className={`workflow-node absolute p-2.5 flex flex-col justify-between ${
                isNodeRunning('trigger') ? 'node-running' : ''
              } ${isNodeCompleted('trigger') ? 'node-completed' : ''} ${
                selectedNode?.id === 'trigger' ? 'active-selected' : ''
              }`}
              style={{ left: '15px', top: '145px', width: '150px', height: '90px', zIndex: 10 }}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0">
                  <Mic className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-black text-white truncate leading-tight">{nodeData.trigger.name}</div>
                  <div className="text-[9px] text-slate-400 truncate leading-tight mt-0.5">{nodeData.trigger.subtitle}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-slate-800/80 pt-1 mt-auto">
                <span className={`truncate max-w-[70px] ${isNodeRunning('trigger') ? 'text-amber-400 font-bold' : isNodeCompleted('trigger') ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                  {isNodeRunning('trigger') ? 'ACTIVE' : isNodeCompleted('trigger') ? 'DONE' : 'Standby'}
                </span>
                <span className="text-cyan-400 shrink-0">&lt; 40ms</span>
              </div>
              <div className="node-port node-port-out" />
            </div>

            {/* NODE 2: Master Intent Router */}
            <div 
              onClick={() => { playSound('click'); setSelectedNode(nodeData.orchestrator); }}
              className={`workflow-node absolute p-2.5 flex flex-col justify-between ${
                isNodeRunning('orchestrator') ? 'node-running' : ''
              } ${isNodeCompleted('orchestrator') ? 'node-completed' : ''} ${
                selectedNode?.id === 'orchestrator' ? 'active-selected' : ''
              }`}
              style={{ left: '210px', top: '145px', width: '165px', height: '90px', zIndex: 10 }}
            >
              <div className="node-port node-port-in" />
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-black text-white truncate leading-tight">{nodeData.orchestrator.name}</div>
                  <div className="text-[9px] text-cyan-300 truncate leading-tight mt-0.5">{nodeData.orchestrator.subtitle}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-slate-800/80 pt-1 mt-auto">
                <span className={`truncate max-w-[75px] ${isNodeRunning('orchestrator') ? 'text-amber-400 font-bold' : isNodeCompleted('orchestrator') ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                  {isNodeRunning('orchestrator') ? 'ROUTING' : isNodeCompleted('orchestrator') ? 'PARALLEL' : 'Standby'}
                </span>
                <span className="text-cyan-400 shrink-0">~ 280ms</span>
              </div>
              <div className="node-port node-port-out" />
            </div>

            {/* ================= TOP BRANCH: ACTION MODE ================= */}

            {/* NODE 3A: Action Mode Core */}
            <div 
              onClick={() => { playSound('click'); setSelectedNode(nodeData.action_mode); }}
              className={`workflow-node absolute p-2.5 flex flex-col justify-between ${
                isNodeRunning('action_mode') ? 'node-running' : ''
              } ${isNodeCompleted('action_mode') ? 'node-completed' : ''} ${
                selectedNode?.id === 'action_mode' ? 'active-selected' : ''
              }`}
              style={{ left: '425px', top: '35px', width: '150px', height: '90px', zIndex: 10 }}
            >
              <div className="node-port node-port-in" />
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-black text-white truncate leading-tight">{nodeData.action_mode.name}</div>
                  <div className="text-[9px] text-sky-300 truncate leading-tight mt-0.5">{nodeData.action_mode.subtitle}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-slate-800/80 pt-1 mt-auto">
                <span className={`truncate max-w-[65px] ${isNodeRunning('action_mode') ? 'text-amber-400 font-bold' : isNodeCompleted('action_mode') ? 'text-emerald-400 font-bold' : 'text-sky-400'}`}>
                  {isNodeRunning('action_mode') ? 'ACTIVE' : isNodeCompleted('action_mode') ? 'DONE' : 'Pillar A'}
                </span>
                <span className="text-sky-400 shrink-0">10+ Utils</span>
              </div>
              <div className="node-port node-port-out" />
            </div>

            {/* NODE 4A: Live Tariffs & Deals Engine */}
            <div 
              onClick={() => { playSound('click'); setSelectedNode(nodeData.agent_action); }}
              className={`workflow-node absolute p-2.5 flex flex-col justify-between ${
                isNodeRunning('agent_action') ? 'node-running' : ''
              } ${isNodeCompleted('agent_action') ? 'node-completed' : ''} ${
                selectedNode?.id === 'agent_action' ? 'active-selected' : ''
              }`}
              style={{ left: '615px', top: '35px', width: '155px', height: '90px', zIndex: 10 }}
            >
              <div className="node-port node-port-in" />
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-black text-white truncate leading-tight">{nodeData.agent_action.name}</div>
                  <div className="text-[9px] text-cyan-300 truncate leading-tight mt-0.5">{nodeData.agent_action.subtitle}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-slate-800/80 pt-1 mt-auto">
                <span className={`truncate max-w-[70px] ${isNodeRunning('agent_action') ? 'text-amber-400 font-bold' : isNodeCompleted('agent_action') ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                  {isNodeRunning('agent_action') ? 'SEARCH' : isNodeCompleted('agent_action') ? 'VERIFIED' : 'Live Tariffs'}
                </span>
                <span className="text-cyan-400 shrink-0">~ 680ms</span>
              </div>
              <div className="node-port node-port-out" />
            </div>

            {/* ================= BOTTOM BRANCH: RESOLVE MODE ================= */}

            {/* NODE 3B: Resolve Mode Core */}
            <div 
              onClick={() => { playSound('click'); setSelectedNode(nodeData.resolve_mode); }}
              className={`workflow-node absolute p-2.5 flex flex-col justify-between ${
                isNodeRunning('resolve_mode') ? 'node-running' : ''
              } ${isNodeCompleted('resolve_mode') ? 'node-completed' : ''} ${
                selectedNode?.id === 'resolve_mode' ? 'active-selected' : ''
              }`}
              style={{ left: '425px', top: '255px', width: '150px', height: '90px', zIndex: 10 }}
            >
              <div className="node-port node-port-in" />
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-black text-white truncate leading-tight">{nodeData.resolve_mode.name}</div>
                  <div className="text-[9px] text-emerald-300 truncate leading-tight mt-0.5">{nodeData.resolve_mode.subtitle}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-slate-800/80 pt-1 mt-auto">
                <span className={`truncate max-w-[65px] ${isNodeRunning('resolve_mode') ? 'text-amber-400 font-bold' : isNodeCompleted('resolve_mode') ? 'text-emerald-400 font-bold' : 'text-emerald-400'}`}>
                  {isNodeRunning('resolve_mode') ? 'ACTIVE' : isNodeCompleted('resolve_mode') ? 'AUDITING' : 'Pillar B'}
                </span>
                <span className="text-emerald-400 shrink-0">3-Way</span>
              </div>
              <div className="node-port node-port-out" />
            </div>

            {/* NODE 4B: 3-Way Reconciliation & Legal */}
            <div 
              onClick={() => { playSound('click'); setSelectedNode(nodeData.agent_resolve); }}
              className={`workflow-node absolute p-2.5 flex flex-col justify-between ${
                isNodeRunning('agent_resolve') ? 'node-running' : ''
              } ${isNodeCompleted('agent_resolve') ? 'node-completed' : ''} ${
                selectedNode?.id === 'agent_resolve' ? 'active-selected' : ''
              }`}
              style={{ left: '615px', top: '255px', width: '155px', height: '90px', zIndex: 10 }}
            >
              <div className="node-port node-port-in" />
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Scale className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-black text-white truncate leading-tight">{nodeData.agent_resolve.name}</div>
                  <div className="text-[9px] text-emerald-300 truncate leading-tight mt-0.5">{nodeData.agent_resolve.subtitle}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-slate-800/80 pt-1 mt-auto">
                <span className={`truncate max-w-[70px] ${isNodeRunning('agent_resolve') ? 'text-amber-400 font-bold' : isNodeCompleted('agent_resolve') ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                  {isNodeRunning('agent_resolve') ? 'MATCH' : isNodeCompleted('agent_resolve') ? 'RESOLVED' : 'Matrix'}
                </span>
                <span className="text-emerald-400 shrink-0">~ 1.1s</span>
              </div>
              <div className="node-port node-port-out" />
            </div>

            {/* ================= CONVERGENCE ================= */}

            {/* NODE 5: Zero-Trust Governance Gate (Human-in-the-Loop) */}
            <div 
              onClick={() => { playSound('click'); setSelectedNode(nodeData.zero_trust); }}
              className={`workflow-node absolute p-2.5 flex flex-col justify-between ${
                isNodeRunning('zero_trust') ? 'node-running' : ''
              } ${isNodeCompleted('zero_trust') ? 'node-completed' : ''} ${
                selectedNode?.id === 'zero_trust' ? 'active-selected' : ''
              }`}
              style={{ left: '815px', top: '145px', width: '150px', height: '90px', zIndex: 10 }}
            >
              <div className="node-port node-port-in" />
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400 shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-black text-white truncate leading-tight">{nodeData.zero_trust.name}</div>
                  <div className="text-[9px] text-teal-300 truncate leading-tight mt-0.5">{nodeData.zero_trust.subtitle}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-slate-800/80 pt-1 mt-auto">
                <span className={`truncate max-w-[70px] ${isNodeRunning('zero_trust') ? 'text-amber-400 font-bold' : isNodeCompleted('zero_trust') ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                  {isNodeRunning('zero_trust') ? 'AUTH' : isNodeCompleted('zero_trust') ? 'PASSED' : 'Human Auth'}
                </span>
                <span className="text-teal-400 shrink-0">Zero-Trust</span>
              </div>
              <div className="node-port node-port-out" />
            </div>

            {/* NODE 6: Terminal Settlement & Voice */}
            <div 
              onClick={() => { playSound('click'); setSelectedNode(nodeData.terminal); }}
              className={`workflow-node absolute p-2.5 flex flex-col justify-between ${
                isNodeRunning('terminal') ? 'node-running' : ''
              } ${isNodeCompleted('terminal') ? 'node-completed' : ''} ${
                selectedNode?.id === 'terminal' ? 'active-selected' : ''
              }`}
              style={{ left: '995px', top: '145px', width: '140px', height: '90px', zIndex: 10 }}
            >
              <div className="node-port node-port-in" />
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-black text-white truncate leading-tight">{nodeData.terminal.name}</div>
                  <div className="text-[9px] text-cyan-300 truncate leading-tight mt-0.5">{nodeData.terminal.subtitle}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-slate-800/80 pt-1 mt-auto">
                <span className={`truncate max-w-[60px] ${isNodeRunning('terminal') ? 'text-amber-400 font-bold' : isNodeCompleted('terminal') ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                  {isNodeRunning('terminal') ? 'COMMIT' : isNodeCompleted('terminal') ? 'SUCCESS' : 'Complete'}
                </span>
                <span className="text-emerald-400 shrink-0">Output</span>
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM EXECUTION & TELEMETRY BAR */}
        <div className="bg-slate-900 px-6 py-4 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Query Context Display */}
          <div className="flex items-center gap-2 text-xs w-full md:w-auto">
            <span className="text-slate-400 whitespace-nowrap">
              {isHindi ? 'समानांतर क्वेरी:' : 'Parallel Query:'}
            </span>
            <span className="font-mono text-cyan-300 font-semibold bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 truncate max-w-xl">
              {isHindi
                ? '"मुंबई ते पुणे सर्वात स्वस्त तिकीट दाखवा आणि ₹1200 अयशस्वी व्यवहाराचा रिफंड तपासा"'
                : '"Show me cheapest flights to Pune & audit ₹1,200 pending recharge dispute"'}
            </span>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={executeSimulation}
              disabled={isExecuting}
              className={`px-7 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all ${
                isExecuting
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:brightness-110 text-white shadow-orange-950/40 hover:scale-102 active:scale-98'
              }`}
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isHindi ? 'पाइपलाइन चालू आहे...' : 'Executing Parallel Pipeline...'}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>{isHindi ? 'समानांतर फ्लो चालवा' : 'Simulate Parallel Flow'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Minimalist Metrics Strip */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-900 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Latency: <strong className="text-white">&lt; 1.8s End-to-End</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Audit: <strong className="text-white">3-Way Matrix</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>Architecture: <strong className="text-white">Action & Resolve</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            <span>Governance: <strong className="text-white">Zero-Trust Human Auth</strong></span>
          </div>
        </div>

      </div>

      {/* NODE TELEMETRY INSPECTOR MODAL */}
      {selectedNode && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setSelectedNode(null)}
        >
          <div 
            className="max-w-xl w-full bg-[#161b22] text-white rounded-3xl p-6 sm:p-7 border border-slate-700 shadow-2xl relative space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-700 pb-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                <selectedNode.icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                  {selectedNode.category}
                </span>
                <h3 className="text-lg font-black text-white">{selectedNode.name}</h3>
                <div className="text-xs text-slate-400">{selectedNode.subtitle}</div>
              </div>
              <span className="ml-auto text-xs font-mono font-bold bg-slate-800 text-cyan-300 px-3 py-1 rounded-full border border-slate-700">
                {selectedNode.latency}
              </span>
            </div>

            {/* Description */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {isHindi ? 'कार्यप्रणाली (How It Works):' : 'System Role & Function:'}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/70 p-3 rounded-xl border border-slate-800 font-medium">
                {selectedNode.desc}
              </p>
            </div>

            {/* Tech Stack */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {isHindi ? 'तकनीकी इंफ्रास्ट्रक्चर:' : 'Technical Specification:'}
              </div>
              <div className="text-xs font-mono text-cyan-300 font-bold bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                {selectedNode.tech}
              </div>
            </div>

            {/* Inbound & Outbound Payloads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Inbound Payload:
                </div>
                <pre className="text-[10px] font-mono bg-slate-950 text-cyan-300 p-2.5 rounded-xl border border-slate-800 overflow-x-auto max-h-36 leading-relaxed">
                  {JSON.stringify(selectedNode.inbound, null, 2)}
                </pre>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Outbound Verdict:
                </div>
                <pre className="text-[10px] font-mono bg-slate-950 text-emerald-400 p-2.5 rounded-xl border border-slate-800 overflow-x-auto max-h-36 leading-relaxed">
                  {JSON.stringify(selectedNode.outbound, null, 2)}
                </pre>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedNode(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedNode(null);
                  executeSimulation();
                }}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Simulate Flow</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ArchitectureFlow;
