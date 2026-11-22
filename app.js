// Paytm AI Hub — Universal Action & Resolution OS
// Powered by Groq LLM, Sarvam AI Voice, SerpApi Live Search, You.com Citations, and Nexconn Chat SDK

const FRONTEND_PLANS = {
  jio: [
    { id: 'jio-198', price: 198, validity: '14 Days', data: '2 GB / Day', calls: 'Unlimited', badge: '5G Booster 🚀', ott: ['JioTV', 'JioCinema'], cashback: '₹15 Cashback', network: 'True Unlimited 5G', description: '2GB/day fast data pack.' },
    { id: 'jio-239', price: 239, validity: '28 Days', data: '1.5 GB / Day', calls: 'Unlimited', badge: 'Daily 1.5GB 📱', ott: ['JioTV', 'JioCinema'], cashback: '₹20 Cashback', network: 'Jio 4G/5G', description: 'Standard 28-day daily pack.' },
    { id: 'jio-299', price: 299, validity: '28 Days', data: '2 GB / Day', calls: 'Unlimited', badge: 'Best Seller ⭐', ott: ['JioCinema', 'JioTV', 'JioCloud'], cashback: '₹25 Cashback with Paytm UPI', network: 'True Unlimited 5G', description: 'Unlimited 5G Data with 2GB/day high-speed.' },
    { id: 'jio-349', price: 349, validity: '28 Days', data: '2.5 GB / Day', calls: 'Unlimited', badge: 'Power Pack ⚡', ott: ['JioCinema Premium', 'JioTV'], cashback: '₹30 Cashback', network: 'True Unlimited 5G', description: '2.5GB per day with JioCinema Premium.' },
    { id: 'jio-398', price: 398, validity: '28 Days', data: '2 GB / Day', calls: 'Unlimited', badge: 'Netflix Mobile 🍿', ott: ['Netflix (Basic Mobile)', 'JioCinema'], cashback: '₹40 Cashback', network: 'True Unlimited 5G', description: 'Includes Netflix Mobile Subscription + 2GB/Day.' },
    { id: 'jio-448', price: 448, validity: '28 Days', data: '2 GB / Day', calls: 'Unlimited', badge: '12 OTT Suite 🎬', ott: ['SonyLIV', 'Zee5', 'JioCinema Premium'], cashback: '₹45 Cashback', network: 'True Unlimited 5G', description: 'Mega entertainment pack with 12 OTTs.' },
    { id: 'jio-666', price: 666, validity: '70 Days', data: '1.5 GB / Day', calls: 'Unlimited', badge: '70 Days Value 🌟', ott: ['JioTV', 'JioCinema'], cashback: '₹50 Cashback', network: 'True Unlimited 5G', description: '70 days long validity plan.' },
    { id: 'jio-857', price: 857, validity: '84 Days', data: '2 GB / Day', calls: 'Unlimited', badge: 'Amazon Prime 📦', ott: ['Amazon Prime Video Mobile', 'JioCinema'], cashback: '₹50 Cashback', network: 'True Unlimited 5G', description: '84 days with Amazon Prime Video.' },
    { id: 'jio-1099', price: 1099, validity: '84 Days', data: '2 GB / Day', calls: 'Unlimited', badge: 'Netflix 84 Days 🍿', ott: ['Netflix (Basic)', 'Unlimited 5G'], cashback: '₹75 Cashback', network: 'True Unlimited 5G', description: '84 Days with Netflix Basic.' },
    { id: 'jio-2999', price: 2999, validity: '365 Days (1 Year)', data: '2.5 GB / Day', calls: 'Unlimited', badge: 'Annual 👑', ott: ['JioCinema Premium', 'JioTV'], cashback: '₹150 Cashback', network: 'True Unlimited 5G', description: 'Full 1 year unlimited 5G.' }
  ],
  airtel: [
    { id: 'airtel-199', price: 199, validity: '28 Days', data: '2 GB Total', calls: 'Unlimited', badge: 'Calling Special 📞', ott: ['Wynk Music', 'Free Hellotunes'], cashback: '₹15 Cashback', network: 'Airtel 4G/5G', description: 'Budget calling pack.' },
    { id: 'airtel-299', price: 299, validity: '28 Days', data: '1.5 GB / Day', calls: 'Unlimited', badge: 'Popular ⭐', ott: ['Airtel Xstream Play (20+ OTTs)'], cashback: '₹20 Cashback', network: 'Unlimited 5G Data', description: '1.5GB daily with Xstream Play.' },
    { id: 'airtel-349', price: 349, validity: '28 Days', data: '2 GB / Day', calls: 'Unlimited', badge: 'Best 2GB 🌟', ott: ['Airtel Xstream Play'], cashback: '₹30 Cashback', network: 'Unlimited 5G Data', description: '2GB per day with unlimited 5G.' },
    { id: 'airtel-399', price: 399, validity: '28 Days', data: '2.5 GB / Day', calls: 'Unlimited', badge: 'Disney+ Hotstar 🏏', ott: ['Disney+ Hotstar (3 Months)', 'Xstream'], cashback: '₹35 Cashback', network: 'Unlimited 5G Data', description: '2.5GB/day + 3 Months Disney+ Hotstar.' },
    { id: 'airtel-839', price: 839, validity: '84 Days', data: '2 GB / Day', calls: 'Unlimited', badge: 'Hotstar 84D 🏏', ott: ['Disney+ Hotstar (3 Months)'], cashback: '₹50 Cashback', network: 'Unlimited 5G Data', description: '84 days with Disney+ Hotstar.' },
    { id: 'airtel-999', price: 999, validity: '84 Days', data: '2.5 GB / Day', calls: 'Unlimited', badge: 'Amazon Prime 📦', ott: ['Amazon Prime (84 Days)', 'Xstream'], cashback: '₹60 Cashback', network: 'Unlimited 5G Data', description: '84 days validity with Amazon Prime.' },
    { id: 'airtel-1199', price: 1199, validity: '84 Days', data: '2.5 GB / Day', calls: 'Unlimited', badge: 'Netflix + Prime 🍿', ott: ['Netflix (Basic)', 'Amazon Prime'], cashback: '₹80 Cashback', network: 'Unlimited 5G Data', description: 'Dual OTT pack with Netflix and Prime.' },
    { id: 'airtel-2999', price: 2999, validity: '365 Days', data: '2 GB / Day', calls: 'Unlimited', badge: 'Annual Pack 👑', ott: ['Apollo 24/7', 'Wynk Music'], cashback: '₹150 Cashback', network: 'Unlimited 5G Data', description: 'Full 365 days 2GB/day data.' }
  ],
  vi: [
    { id: 'vi-199', price: 199, validity: '18 Days', data: '1 GB / Day', calls: 'Unlimited', badge: 'Short Term 🏷️', ott: ['Vi Movies & TV'], cashback: '₹15 Cashback', network: 'Vi 4G', description: 'Quick recharge.' },
    { id: 'vi-299', price: 299, validity: '28 Days', data: '1.5 GB / Day + Night Free', calls: 'Unlimited', badge: 'Hero Unlimited 🦸', ott: ['Binge All Night (12AM-6AM)', 'Weekend Rollover'], cashback: '₹25 Cashback', network: 'Vi 4G', description: 'Unlimited night data 12AM-6AM.' },
    { id: 'vi-365', price: 365, validity: '28 Days', data: '2 GB / Day', calls: 'Unlimited', badge: 'Hotstar Special 🍿', ott: ['Disney+ Hotstar', 'Binge All Night'], cashback: '₹35 Cashback', network: 'Vi 4G', description: '2GB/Day + Hotstar + Binge All Night.' },
    { id: 'vi-839', price: 839, validity: '84 Days', data: '2 GB / Day', calls: 'Unlimited', badge: '84 Days Hero 🦸', ott: ['Binge All Night', 'Weekend Rollover'], cashback: '₹50 Cashback', network: 'Vi 4G', description: '84 days with Hero Unlimited benefits.' },
    { id: 'vi-2899', price: 2899, validity: '365 Days', data: '1.5 GB / Day', calls: 'Unlimited', badge: 'Annual Hero 👑', ott: ['Binge All Night', 'Weekend Rollover'], cashback: '₹150 Cashback', network: 'Vi 4G', description: '1 Year unlimited night data.' }
  ],
  bsnl: [
    { id: 'bsnl-107', price: 107, validity: '35 Days', data: '3 GB Total', calls: '200 Mins', badge: 'Super Economy 🏷️', ott: ['BSNL Tunes'], cashback: '₹10 Cashback', network: 'BSNL 4G', description: '35 days longest validity under ₹110.' },
    { id: 'bsnl-197', price: 197, validity: '70 Days', data: '2 GB / Day (18D)', calls: 'Unlimited (18D)', badge: '70 Days Saver 🌟', ott: ['Zing'], cashback: '₹15 Cashback', network: 'BSNL 4G', description: '70 days incoming validity saver.' },
    { id: 'bsnl-397', price: 397, validity: '150 Days', data: '2 GB / Day (30D)', calls: 'Unlimited (30D)', badge: '150 Days 👑', ott: ['Free PRBT'], cashback: '₹25 Cashback', network: 'BSNL 4G', description: '150 days secondary SIM validity.' }
  ]
};

class PaytmApp {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
    this.speechSynthesis = window.speechSynthesis || null;
    this.speechRecognition = null;
    this.isListening = false;
    this.currentLanguage = 'hi-IN'; // Default: Hindi as requested
    this.backendUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port === '5500' ? 'http://localhost:8000' : '';
    this.activeVoiceAudio = null;
    this.selectedOperator = 'jio';
    this.selectedCategory = 'recommended';
    
    this.initAudio();
    this.initSpeechRecognition();
    this.bindEvents();
  }

  initAudio() {
    const unlockAudio = () => {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.audioCtx = new AudioContext();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      document.removeEventListener('click', unlockAudio);
    };
    document.addEventListener('click', unlockAudio, { once: true });
  }

  playSound(type = 'click') {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.audioCtx = new AudioContext();
      }
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

      const now = this.audioCtx.currentTime;
      if (type === 'click') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.exponentialRampToValueAtTime(850, now + 0.04);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'keypad') {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800 + Math.random() * 200, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'chime') {
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((freq, idx) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const noteTime = now + (idx * 0.07);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, noteTime);
          gain.gain.setValueAtTime(0.12, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(noteTime);
          osc.stop(noteTime + 0.4);
        });
      } else if (type === 'paytm_success') {
        const notes = [
          { f: 587.33, d: 0.12 },
          { f: 880.00, d: 0.16 },
          { f: 1174.66, d: 0.35 }
        ];
        let offset = 0;
        notes.forEach(note => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const noteTime = now + offset;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(note.f, noteTime);
          gain.gain.setValueAtTime(0.18, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.001, noteTime + note.d);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(noteTime);
          osc.stop(noteTime + note.d + 0.05);
          offset += note.d * 0.85;
        });
      }
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  b64toBlob(b64Data, contentType = 'audio/wav') {
    try {
      const cleanB64 = b64Data.replace(/^data:audio\/\w+;base64,/, '').trim();
      const byteCharacters = atob(cleanB64);
      const byteArrays = [];
      const sliceSize = 1024;
      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      return new Blob(byteArrays, { type: contentType });
    } catch (e) {
      console.warn('[Sarvam AI] b64toBlob error:', e);
      return null;
    }
  }

  async playSarvamAudio(base64Audio, fallbackText = null, targetLang = null) {
    if (!this.soundEnabled) return;
    if (base64Audio) this.lastAudioBase64 = base64Audio;
    if (fallbackText) this.lastSpokenText = fallbackText;
    if (targetLang) this.lastSpokenLang = targetLang;

    if (!base64Audio) {
      if (fallbackText) {
        try {
          const apiTarget = this.backendUrl !== undefined ? this.backendUrl : ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port === '5500' ? 'http://localhost:8000' : '');
          const resp = await fetch(`${apiTarget}/api/tts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: fallbackText,
              language_code: targetLang || this.currentLanguage || 'hi-IN',
              speaker: 'priya'
            })
          });
          if (resp.ok) {
            const d = await resp.json();
            if (d.audio_base64) {
              this.lastAudioBase64 = d.audio_base64;
              return this.playSarvamAudio(d.audio_base64, fallbackText, targetLang);
            }
          }
        } catch (e) {
          console.warn('[Sarvam AI] On-demand TTS fetch error:', e);
        }
        this.speakTextFallback(fallbackText, targetLang || this.currentLanguage);
      }
      return;
    }

    try {
      if (this.activeVoiceAudio) {
        this.activeVoiceAudio.pause();
        this.activeVoiceAudio.currentTime = 0;
        this.activeVoiceAudio = null;
      }

      const blob = this.b64toBlob(base64Audio, 'audio/wav');
      let audioSrc;
      if (blob) {
        audioSrc = URL.createObjectURL(blob);
      } else {
        audioSrc = "data:audio/wav;base64," + base64Audio;
      }

      this.activeVoiceAudio = new Audio(audioSrc);
      this.activeVoiceAudio.volume = 1.0;
      this.setSpeakerPlayingState(true);

      const p = this.activeVoiceAudio.play();
      if (p !== undefined) {
        p.then(() => {
          console.log("[Sarvam AI] Playing audio successfully!");
          this.hideAutoplayPill();
        }).catch(e => {
          console.warn("[Sarvam AI] Autoplay restricted by browser policy, queuing for tap:", e);
          this.setSpeakerPlayingState(false);
          this.showAutoplayPill(fallbackText || 'Paytm Sarvam Voice');

          // Automatic one-tap resume on ANY user gesture anywhere on page
          const unlockHandler = () => {
            if (this.lastAudioBase64) {
              this.replayAudio();
            }
            document.removeEventListener('click', unlockHandler);
            document.removeEventListener('touchstart', unlockHandler);
            document.removeEventListener('pointerdown', unlockHandler);
          };
          document.addEventListener('click', unlockHandler, { once: true });
          document.addEventListener('touchstart', unlockHandler, { once: true });
          document.addEventListener('pointerdown', unlockHandler, { once: true });
        });
      }

      this.activeVoiceAudio.onended = () => {
        this.setSpeakerPlayingState(false);
      };
      this.activeVoiceAudio.onerror = (err) => {
        console.warn("[Sarvam AI] HTML5 Audio playback error, falling back to Web Speech:", err);
        this.setSpeakerPlayingState(false);
        if (fallbackText) {
          this.speakTextFallback(fallbackText, targetLang || this.currentLanguage);
        }
      };
    } catch (e) {
      console.warn("[Sarvam AI] Audio element error:", e);
      this.setSpeakerPlayingState(false);
      if (fallbackText) {
        this.speakTextFallback(fallbackText, targetLang || this.currentLanguage);
      }
    }
  }

  async replayAudio() {
    this.playSound('click');
    if (this.lastAudioBase64) {
      this.playSarvamAudio(this.lastAudioBase64, this.lastSpokenText, this.lastSpokenLang);
    } else if (this.lastSpokenText) {
      this.showToast('🎙️ Generating Sarvam Voice...', 'info', '⏳');
      try {
        const apiTarget = this.backendUrl !== undefined ? this.backendUrl : ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port === '5500' ? 'http://localhost:8000' : '');
        const resp = await fetch(`${apiTarget}/api/tts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: this.lastSpokenText,
            language_code: this.lastSpokenLang || this.currentLanguage || 'hi-IN',
            speaker: 'priya'
          })
        });
        if (resp.ok) {
          const d = await resp.json();
          if (d.audio_base64) {
            this.lastAudioBase64 = d.audio_base64;
            this.playSarvamAudio(d.audio_base64, this.lastSpokenText, this.lastSpokenLang);
            return;
          }
        }
      } catch (err) {
        console.warn('Replay TTS fetch failed:', err);
      }
      this.speakTextFallback(this.lastSpokenText, this.lastSpokenLang || this.currentLanguage);
    } else {
      this.showToast('🔊 व्हॉईस क्लिप तयार आहे, पुन्हा टॅप करा.', 'info', 'ℹ️');
    }
  }

  setSpeakerPlayingState(isPlaying) {
    const btns = document.querySelectorAll('.sarvam-voice-btn');
    btns.forEach(b => {
      if (isPlaying) {
        b.classList.add('ring-2', 'ring-cyan-400', 'animate-pulse');
        const icon = b.querySelector('.speaker-icon');
        if (icon) icon.textContent = '🔊';
      } else {
        b.classList.remove('ring-2', 'ring-cyan-400', 'animate-pulse');
        const icon = b.querySelector('.speaker-icon');
        if (icon) icon.textContent = '🔈';
      }
    });
  }

  showAutoplayPill(title) {
    let pill = document.getElementById('audio-floating-pill');
    if (!pill) {
      pill = document.createElement('div');
      pill.id = 'audio-floating-pill';
      pill.className = 'fixed bottom-20 right-4 sm:right-6 z-50 bg-gradient-to-r from-[#002970] via-[#0052cc] to-[#00b9f1] text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-white/50 flex items-center gap-2.5 cursor-pointer hover:scale-105 transition-transform animate-bounce';
      pill.onclick = () => {
        paytm.replayAudio();
        paytm.hideAutoplayPill();
      };
      document.body.appendChild(pill);
    }
    pill.innerHTML = `
      <span class="text-xl">🎙️</span>
      <div class="text-left">
        <div class="text-[10px] font-black uppercase tracking-wider text-cyan-200">Sarvam AI Voice Ready</div>
        <div class="text-xs font-bold flex items-center gap-1">आवाज ऐका <span>🔊</span></div>
      </div>
    `;
    pill.style.display = 'flex';
  }

  hideAutoplayPill() {
    const pill = document.getElementById('audio-floating-pill');
    if (pill) pill.style.display = 'none';
  }

  speakTextFallback(text, lang = this.currentLanguage) {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const clean = (text || '')
        .replace(/[\*\#\_\[\]\(\)\{\}\<\>•–—\|]/g, ' ')
        .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (!clean) return;

      const utterance = new SpeechSynthesisUtterance(clean);
      let targetLang = lang || 'hi-IN';
      if (targetLang.includes('mr')) targetLang = 'mr-IN';
      else if (targetLang.includes('hi')) targetLang = 'hi-IN';
      else targetLang = 'en-IN';
      utterance.lang = targetLang;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const matched = voices.find(v => v.lang.startsWith(targetLang.substring(0, 2)) || v.name.includes('Hindi') || v.name.includes('Marathi') || v.name.includes('India'));
        if (matched) utterance.voice = matched;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('[Web Speech] Fallback error:', e);
    }
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.speechRecognition = new SpeechRecognition();
      this.speechRecognition.continuous = false;
      this.speechRecognition.interimResults = true; // Live interim text display!
      this.speechRecognition.lang = this.currentLanguage;

      this.speechRecognition.onstart = () => {
        this.isListening = true;
        this.playSound('chime');
        this.updateMicUi(true);
        this.showToast('🎙️ Sun raha hoon... Boliye! (Listening...)', 'info', '🎤');
      };

      this.speechRecognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const inputElem = document.getElementById('user-chat-prompt') || document.getElementById('ai-prompt-input');
        if (inputElem) {
          inputElem.value = finalTranscript || interimTranscript;
        }

        if (finalTranscript) {
          this.handleVoiceInput(finalTranscript);
        }
      };

      this.speechRecognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        this.isListening = false;
        this.updateMicUi(false);
      };

      this.speechRecognition.onend = () => {
        this.isListening = false;
        this.updateMicUi(false);
      };
    }
  }

  toggleVoiceRecognition(customLang = null) {
    if (!this.speechRecognition) {
      this.showToast('Speech recognition not supported in this browser. Please use Chrome/Edge.', 'info', '🎙️');
      return;
    }
    this.speechRecognition.lang = customLang || this.currentLanguage;

    if (this.isListening) {
      this.speechRecognition.stop();
    } else {
      try {
        this.speechRecognition.start();
      } catch (e) {
        console.warn('Voice restart error:', e);
      }
    }
  }

  updateMicUi(listening) {
    const micBtns = document.querySelectorAll('.voice-mic-btn');
    micBtns.forEach(btn => {
      if (listening) {
        btn.classList.add('mic-active', 'ring-4', 'ring-red-400', 'animate-pulse');
        btn.title = "Listening... Speak now";
      } else {
        btn.classList.remove('mic-active', 'ring-4', 'ring-red-400', 'animate-pulse');
        btn.title = "Click to speak";
      }
    });
  }

  handleVoiceInput(transcript) {
    this.showToast(`🗣️ "${transcript}"`, 'ai', '🎙️');
    if (window.agentEngine) {
      window.agentEngine.processQuery(transcript);
    } else {
      window.location.href = `ai-workspace.html?q=${encodeURIComponent(transcript)}`;
    }
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('.interactive-btn, .ripple-effect');
      if (!target) return;

      this.playSound('click');

      const rect = target.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple');

      const existingRipple = target.querySelector('.ripple');
      if (existingRipple) existingRipple.remove();

      target.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  }

  showToast(message, type = 'info', icon = '💡') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'success') toast.style.borderLeftColor = '#10b981';
    if (type === 'ai') toast.style.borderLeftColor = '#002970';

    toast.innerHTML = `
      <span style="font-size: 1.25rem;">${icon}</span>
      <div style="flex: 1;">${message}</div>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    this.playSound('click');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    if (modalId === 'recharge-modal') {
      this.renderPlansCatalog();
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    this.playSound('click');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  navigateToAiHub() {
    this.playSound('chime');
    this.showToast('🚀 Opening Paytm AI Hub Assistant...', 'ai', '🤖');

    const overlay = document.getElementById('portal-overlay');
    if (overlay) overlay.classList.add('active');

    setTimeout(() => {
      window.location.href = 'ai-hub.html';
    }, 450);
  }

  simulateRecharge(event) {
    if (event) event.preventDefault();
    this.closeModal('recharge-modal');
    this.playSound('paytm_success');
    this.showToast('✅ Mobile Recharge of ₹299 Successful! Ref ID: PAYTM' + Math.floor(100000 + Math.random() * 900000), 'success', '📱');
  }

  simulateRechargeDirect(amount, op) {
    this.closeModal('recharge-modal');
    this.playSound('paytm_success');
    this.showToast(`✅ ${op} Recharge of ₹${amount} Successful! Ref ID: PAYTM` + Math.floor(100000 + Math.random() * 900000), 'success', '📱');
  }

  simulateBillPay(event) {
    if (event) event.preventDefault();
    this.closeModal('bill-modal');
    this.closeModal('electricity-modal');
    this.playSound('paytm_success');
    this.showToast('✅ Bill Payment Successful! Ref ID: BBPS' + Math.floor(100000 + Math.random() * 900000), 'success', '⚡');
  }

  selectRechargeOperator(op) {
    this.selectedOperator = op;
    this.playSound('click');
    ['jio', 'airtel', 'vi', 'bsnl'].forEach(o => {
      const btn = document.getElementById(`op-btn-${o}`);
      if (btn) {
        if (o === op) {
          btn.className = 'py-2 px-3 rounded-xl border-2 border-[#00b9f1] bg-sky-50 text-[#002970] font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs';
        } else {
          btn.className = 'py-2 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold flex items-center justify-center gap-1.5 transition-all';
        }
      }
    });
    this.renderPlansCatalog();
  }

  filterPlanCategory(category) {
    this.selectedCategory = category;
    this.playSound('click');
    const pills = document.querySelectorAll('#plan-category-tabs .category-pill');
    pills.forEach(pill => {
      if (pill.getAttribute('onclick')?.includes(`'${category}'`)) {
        pill.className = 'category-pill active shrink-0 px-3 py-1.5 rounded-full bg-[#002970] text-white shadow-xs';
      } else {
        pill.className = 'category-pill shrink-0 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200';
      }
    });
    this.renderPlansCatalog();
  }

  rechargeWithAi(operator, planQuery) {
    this.playSound('chime');
    this.closeModal('recharge-modal');
    this.showToast(`🤖 Handing over to Paytm AI Hub: ${operator} ${planQuery}...`, 'ai', '🚀');
    setTimeout(() => {
      window.location.href = `ai-workspace.html?q=${encodeURIComponent('Recharge ' + operator + ' ' + planQuery)}`;
    }, 400);
  }

  renderPlansCatalog() {
    const catalog = document.getElementById('recharge-plans-catalog');
    if (!catalog) return;

    const op = this.selectedOperator || 'jio';
    const cat = this.selectedCategory || 'recommended';
    const plans = FRONTEND_PLANS[op] || FRONTEND_PLANS['jio'];

    let filtered = plans;
    if (cat === 'recommended') {
      filtered = plans.slice(0, 4);
    } else if (cat === 'daily') {
      filtered = plans.filter(p => p.data.includes('1.5') || p.data.includes('2 GB') || p.data.includes('2.5'));
    } else if (cat === '5g') {
      filtered = plans.filter(p => p.network.includes('5G') || p.badge.includes('5G'));
    } else if (cat === 'ott') {
      filtered = plans.filter(p => (p.ott && p.ott.length > 0) || p.has_netflix);
    } else if (cat === 'annual') {
      filtered = plans.filter(p => p.validity.includes('365') || p.validity.includes('Year') || p.validity.includes('150') || p.validity.includes('84'));
    }

    if (!filtered || filtered.length === 0) filtered = plans;

    catalog.innerHTML = filtered.map(plan => `
      <div class="p-3.5 bg-slate-50/90 hover:bg-white rounded-2xl border border-slate-200 hover:border-[#00b9f1] transition-all shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-lg font-black text-[#002970]">₹${plan.price}</span>
            <span class="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">• ${plan.validity}</span>
            <span class="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">${plan.badge}</span>
          </div>
          <div class="text-xs font-bold text-[#00b9f1] flex items-center gap-2">
            <span>📊 ${plan.data}</span>
            <span class="text-slate-400">•</span>
            <span class="text-slate-600">📞 ${plan.calls}</span>
          </div>
          <div class="text-[11px] text-slate-500">
            ${plan.ott && plan.ott.length ? '✨ Perks: ' + plan.ott.join(', ') : plan.description}
          </div>
          <div class="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
            <span>🎁</span> <span>${plan.cashback}</span>
          </div>
        </div>

        <div class="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
          <button type="button" onclick="paytm.rechargeWithAi('${op.toUpperCase()}', '${plan.price} plan (${plan.data}, ${plan.validity})')"
                  class="interactive-btn flex-1 sm:flex-none py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#002970] to-[#00b9f1] text-white font-bold text-xs hover:brightness-110 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer">
            <span>🤖 AI Auto-Pay</span>
          </button>
          <button type="button" onclick="paytm.simulateRechargeDirect(${plan.price}, '${op.toUpperCase()}')"
                  class="interactive-btn flex-1 sm:flex-none py-1.5 px-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer">
            <span>Direct Pay ₹${plan.price}</span>
          </button>
        </div>
      </div>
    `).join('');
  }
}

const paytm = new PaytmApp();
window.paytm = paytm;


// =========================================================================
// MASTER AGENT ENGINE (ORCHESTRATING ASTA-STYLE STEPS & APIS)
// =========================================================================
class PaytmAgentOrchestrator {
  constructor() {
    this.activePlan = null;
    this.currentData = null;
    this.activeLanguage = 'hi';
    this.enteredPin = '';
  }

  renderSuggestedChips(suggestions) {
    if (!suggestions || suggestions.length === 0) return '';
    return `
      <div class="mt-4 pt-3 border-t border-slate-200/80">
        <div class="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
          <span>💡</span> <span>Smart AI Suggestions (One-Tap Follow-Up):</span>
        </div>
        <div class="flex flex-wrap gap-2">
          ${suggestions.map(s => `
            <button onclick="window.agentEngine.processQuery('${s.replace(/['"]/g, '')}')"
                    class="px-3 py-1.5 bg-slate-100/90 hover:bg-sky-50 text-slate-700 hover:text-[#002970] text-xs font-bold rounded-xl border border-slate-200 hover:border-sky-300 transition-all cursor-pointer flex items-center gap-1 shadow-2xs">
              <span>${s}</span>
              <span class="text-[10px] text-slate-400">↗</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  filterTravelCards(type, btn) {
    paytm.playSound('click');
    document.querySelectorAll('.travel-filter-btn').forEach(b => {
      b.classList.remove('bg-[#002970]', 'text-white');
      b.classList.add('bg-slate-100', 'text-slate-700');
    });
    if (btn) {
      btn.classList.add('bg-[#002970]', 'text-white');
      btn.classList.remove('bg-slate-100', 'text-slate-700');
    }
    const cards = document.querySelectorAll('.travel-card-item');
    cards.forEach(c => {
      const cardType = c.getAttribute('data-type');
      if (type === 'all' || cardType === type) {
        c.classList.remove('hidden');
      } else {
        c.classList.add('hidden');
      }
    });
  }

  filterShoppingCards(category, btn) {
    paytm.playSound('click');
    document.querySelectorAll('.shop-filter-btn').forEach(b => {
      b.classList.remove('bg-pink-600', 'text-white');
      b.classList.add('bg-slate-100', 'text-slate-700');
    });
    if (btn) {
      btn.classList.add('bg-pink-600', 'text-white');
      btn.classList.remove('bg-slate-100', 'text-slate-700');
    }
    const cards = document.querySelectorAll('.shopping-card-item');
    cards.forEach(c => {
      const cardCat = c.getAttribute('data-category') || '';
      if (category === 'all' || cardCat.includes(category)) {
        c.classList.remove('hidden');
      } else {
        c.classList.add('hidden');
      }
    });
  }

  initWorkspace(mode = 'action', query = '') {
    this.currentMode = mode || 'action';
    this.updateModeTabsUi(this.currentMode);
    this.updateActivityBadge();

    if (query && query.trim()) {
      this.processQuery(query.trim());
    } else {
      this.renderModeShowcase(this.currentMode);
    }
  }

  switchMode(mode) {
    paytm.playSound('click');
    this.currentMode = mode;
    this.updateModeTabsUi(mode);
    this.renderModeShowcase(mode);
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    const promptInput = document.getElementById('user-chat-prompt');
    if (promptInput) promptInput.value = '';
  }

  updateModeTabsUi(mode) {
    const actBtn = document.getElementById('mode-tab-action');
    const resBtn = document.getElementById('mode-tab-resolve');
    const smBtn = document.getElementById('mode-tab-smart_money');
    const promptInput = document.getElementById('user-chat-prompt');

    if (actBtn) actBtn.className = 'px-3 py-1 rounded-full text-xs font-black text-slate-600 hover:text-blue-900 cursor-pointer flex items-center gap-1 transition-all';
    if (resBtn) resBtn.className = 'px-3 py-1 rounded-full text-xs font-black text-slate-600 hover:text-red-700 cursor-pointer flex items-center gap-1 transition-all';
    if (smBtn) smBtn.className = 'px-3 py-1 rounded-full text-xs font-black text-slate-600 hover:text-emerald-700 cursor-pointer flex items-center gap-1 transition-all';

    if (mode === 'action') {
      if (actBtn) actBtn.className = 'px-3 py-1 rounded-full text-xs font-black bg-[#002970] text-white shadow-xs cursor-pointer flex items-center gap-1 transition-all';
      if (promptInput) promptInput.placeholder = 'बोलिए या टाइप करें... (उदा. Jio 299 रिचार्ज, पुणे ते मुंबई बस, 1000 मध्ये हॉटेल, 50% ऑफ शॉपिंग...)';
    } else if (mode === 'resolve') {
      if (resBtn) resBtn.className = 'px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-xs cursor-pointer flex items-center gap-1 transition-all';
      if (promptInput) promptInput.placeholder = 'आपकी समस्या बताएं... (उदा. पैसे कट गए रिचार्ज नहीं हुआ, रिफंड अटका है, मर्चेंट को पैसे नहीं मिले...)';
    } else if (mode === 'smart_money') {
      if (smBtn) smBtn.className = 'px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs cursor-pointer flex items-center gap-1 transition-all';
      if (promptInput) promptInput.placeholder = 'Smart Money ला विचारा... (उदा. या महिन्यात किती खर्च झाला?, सर्वाधिक पैसे कुठे गेले?, कुठे बचत करता येईल?)';
    }
  }

  renderModeShowcase(mode) {
    if (mode === 'resolve') {
      this.renderResolveShowcase();
    } else if (mode === 'smart_money') {
      this.renderSmartMoneyShowcase();
    } else {
      this.renderActionShowcase();
    }
  }

  renderActionShowcase() {
    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    container.innerHTML = `
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border-2 border-sky-300 text-left animate-in fade-in duration-200">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-sky-100">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-2xl shadow-xs">⚡</div>
            <div>
              <h2 class="text-base sm:text-lg font-black text-[#002970]">Paytm ONE — Universal Action Squad</h2>
              <p class="text-xs text-sky-700 font-semibold">Autonomous Payments, Fast Travel Booking & Verified Deals</p>
            </div>
          </div>
          <span class="text-xs font-black bg-sky-100 text-[#002970] px-3 py-1 rounded-full hidden sm:inline">10 Live Services</span>
        </div>

        <p class="text-xs text-slate-600 mb-3 font-medium">खालीलपैकी कोणत्याही सेवेवर क्लिक करा किंवा खाली व्हॉइस/टेक्स्टने थेट बोला:</p>

        <!-- Authentic Action Mode Card Banner -->
        <div class="mb-4 text-center">
          <img src="assets/action_card_clean.png" alt="Action Mode Banner" class="max-h-24 sm:max-h-28 mx-auto rounded-2xl shadow-lg border-2 border-sky-300 hover:scale-102 transition-all">
        </div>

        <!-- 10 Action Service Cards Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 mb-5">
          <button onclick="window.agentEngine.processQuery('Jio 299 recharge 2gb daily data')" class="p-3 bg-slate-50 hover:bg-sky-50 rounded-xl border border-slate-200 hover:border-sky-400 text-left transition-all group cursor-pointer">
            <div class="text-2xl mb-1 group-hover:scale-110 transition-transform">📱</div>
            <div class="text-xs font-black text-slate-800">Mobile Recharge</div>
            <div class="text-[10px] text-slate-500">Jio, Airtel, Vi 5G</div>
          </button>

          <button onclick="window.agentEngine.processQuery('Pune to Mumbai bus ticket')" class="p-3 bg-slate-50 hover:bg-sky-50 rounded-xl border border-slate-200 hover:border-sky-400 text-left transition-all group cursor-pointer">
            <div class="text-2xl mb-1 group-hover:scale-110 transition-transform">🚌</div>
            <div class="text-xs font-black text-slate-800">AC Volvo Bus</div>
            <div class="text-[10px] text-slate-500">Shivneri M-Ticket</div>
          </button>

          <button onclick="window.agentEngine.processQuery('Pune to Mumbai flight ticket')" class="p-3 bg-slate-50 hover:bg-sky-50 rounded-xl border border-slate-200 hover:border-sky-400 text-left transition-all group cursor-pointer">
            <div class="text-2xl mb-1 group-hover:scale-110 transition-transform">✈️</div>
            <div class="text-xs font-black text-slate-800">Flights & Air</div>
            <div class="text-[10px] text-slate-500">IndiGo, Akasa Air</div>
          </button>

          <button onclick="window.agentEngine.processQuery('Pune to Mumbai Vande Bharat train')" class="p-3 bg-slate-50 hover:bg-sky-50 rounded-xl border border-slate-200 hover:border-sky-400 text-left transition-all group cursor-pointer">
            <div class="text-2xl mb-1 group-hover:scale-110 transition-transform">🚆</div>
            <div class="text-xs font-black text-slate-800">IRCTC Trains</div>
            <div class="text-[10px] text-slate-500">Vande Bharat Seats</div>
          </button>

          <button onclick="window.agentEngine.processQuery('Budget hotels near Mumbai airport')" class="p-3 bg-slate-50 hover:bg-sky-50 rounded-xl border border-slate-200 hover:border-sky-400 text-left transition-all group cursor-pointer">
            <div class="text-2xl mb-1 group-hover:scale-110 transition-transform">🏨</div>
            <div class="text-xs font-black text-slate-800">Airport Hotels</div>
            <div class="text-[10px] text-slate-500">Under ₹1,500/night</div>
          </button>

          <button onclick="window.agentEngine.processQuery('Pay MSEDCL electricity bill 1450')" class="p-3 bg-slate-50 hover:bg-sky-50 rounded-xl border border-slate-200 hover:border-sky-400 text-left transition-all group cursor-pointer">
            <div class="text-2xl mb-1 group-hover:scale-110 transition-transform">⚡</div>
            <div class="text-xs font-black text-slate-800">Electricity Bill</div>
            <div class="text-[10px] text-slate-500">Mahavitaran MSEDCL</div>
          </button>

          <button onclick="window.agentEngine.processQuery('Recharge FASTag 500')" class="p-3 bg-slate-50 hover:bg-sky-50 rounded-xl border border-slate-200 hover:border-sky-400 text-left transition-all group cursor-pointer">
            <div class="text-2xl mb-1 group-hover:scale-110 transition-transform">🚗</div>
            <div class="text-xs font-black text-slate-800">FASTag Toll</div>
            <div class="text-[10px] text-slate-500">NETC NHAI Instant</div>
          </button>

          <button onclick="window.agentEngine.processQuery('Pune madhe shopping che best offers dakhva')" class="p-3 bg-slate-50 hover:bg-pink-50 rounded-xl border border-slate-200 hover:border-pink-400 text-left transition-all group cursor-pointer">
            <div class="text-2xl mb-1 group-hover:scale-110 transition-transform">🛍️</div>
            <div class="text-xs font-black text-slate-800">Shopping Deals</div>
            <div class="text-[10px] text-pink-600 font-bold">50% Off Malls</div>
          </button>

          <button onclick="window.agentEngine.processQuery('Pushpa 2 movie tickets in Pune')" class="p-3 bg-slate-50 hover:bg-purple-50 rounded-xl border border-slate-200 hover:border-purple-400 text-left transition-all group cursor-pointer">
            <div class="text-2xl mb-1 group-hover:scale-110 transition-transform">🎬</div>
            <div class="text-xs font-black text-slate-800">Movie Tickets</div>
            <div class="text-[10px] text-slate-500">PVR & INOX Shows</div>
          </button>

          <button onclick="window.agentEngine.processQuery('Buy 500 digital gold')" class="p-3 bg-slate-50 hover:bg-amber-50 rounded-xl border border-slate-200 hover:border-amber-400 text-left transition-all group cursor-pointer">
            <div class="text-2xl mb-1 group-hover:scale-110 transition-transform">🪙</div>
            <div class="text-xs font-black text-slate-800">24K Digital Gold</div>
            <div class="text-[10px] text-slate-500">MMTC-PAMP Insured</div>
          </button>
        </div>

        <!-- 1-Tap Quick Action Chips -->
        <div class="pt-3 border-t border-slate-200/80">
          <div class="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
            <span>💡</span> <span>Try Asking or Tapping These Prompts:</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <button onclick="window.agentEngine.processQuery('मला पुणे ते मुंबई 1 ते 2k च्या आसपास फ्लाईट दाखव')" class="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#002970] text-xs font-bold rounded-xl border border-sky-200 cursor-pointer">✈️ पुणे ते मुंबई 1-2k फ्लाईट</button>
            <button onclick="window.agentEngine.processQuery('या महिन्यात माझे पैसे कुठे जास्त खर्च झाले?')" class="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl border border-emerald-200 cursor-pointer">📊 या महिन्यात खर्च कुठे झाला?</button>
            <button onclick="window.agentEngine.processQuery('आज किती पैसे मिळाले?')" class="px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-900 text-xs font-bold rounded-xl border border-cyan-200 cursor-pointer">🏪 आज किती पैसे मिळाले? (Soundbox)</button>
            <button onclick="window.agentEngine.processQuery('मुझे पुणे से मुंबई जाना है बस देखो अच्छे से टिकट')" class="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold rounded-xl border border-blue-200 cursor-pointer">🚌 पुणे से मुंबई बस टिकट</button>
            <button onclick="window.agentEngine.processQuery('Jio 299 ka 2gb daily data plan')" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 cursor-pointer">📱 Jio 299 2GB/Day</button>
            <button onclick="window.agentEngine.processQuery('मुझे शॉपिंग करनी हे बेस्ट ऑफर देखो पुणे में')" class="px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-900 text-xs font-bold rounded-xl border border-pink-200 cursor-pointer">🛍️ शॉपिंग बेस्ट ऑफर्स पुणे</button>
            <button onclick="window.agentEngine.processQuery('पुण्यात पुष्पा २ चं तिकीट बुक कर')" class="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold rounded-xl border border-purple-200 cursor-pointer">🎬 पुष्पा २ तिकीट पुणे</button>
          </div>
        </div>
      </div>
    `;
  }

  renderResolveShowcase() {
    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    container.innerHTML = `
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border-2 border-rose-300 text-left animate-in fade-in duration-200">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-rose-100">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-2xl shadow-xs">🛡️</div>
            <div>
              <h2 class="text-base sm:text-lg font-black text-rose-900">Paytm Resolve — Payment Investigation Squad</h2>
              <p class="text-xs text-rose-700 font-semibold">Autonomous Payment Investigation & Verified SLA Resolution</p>
            </div>
          </div>
          <span class="text-xs font-black bg-rose-100 text-rose-900 px-3 py-1 rounded-full">NPCI 24H SLA</span>
        </div>

        <!-- 4-Step Squad Pipeline Tracker Banner -->
        <div class="bg-slate-900 text-white rounded-xl p-3.5 mb-4 border border-slate-700 text-xs">
          <div class="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider mb-2">⚡ 4-Step Autonomous Resolution Squad Active</div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-semibold text-slate-300">
            <div class="flex items-center gap-1.5"><span class="text-emerald-400">✓</span> <span>1. Classification</span></div>
            <div class="flex items-center gap-1.5"><span class="text-emerald-400">✓</span> <span>2. You.com Citation</span></div>
            <div class="flex items-center gap-1.5"><span class="text-emerald-400">✓</span> <span>3. Nexconn Room</span></div>
            <div class="flex items-center gap-1.5"><span class="text-emerald-400">✓</span> <span>4. Sarvam Voice</span></div>
          </div>
        </div>

        <p class="text-xs text-slate-700 font-medium mb-3">तुम्हाला कोणती समस्या आली आहे? खालील पर्यायावर टॅप करा किंवा तुमची अडचण बोला/टाइप करा:</p>

        <!-- Authentic Resolve Mode Card Banner -->
        <div class="mb-4 text-center">
          <img src="assets/resolve_card_clean.png" alt="Resolve Mode Banner" class="max-h-24 sm:max-h-28 mx-auto rounded-2xl shadow-lg border-2 border-emerald-400 hover:scale-102 transition-all">
        </div>

        <!-- 6 Dispute Case Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <button onclick="window.agentEngine.processQuery('माझे पैसे कट झाले पण रिचार्ज झाला नाही')" class="p-3.5 bg-rose-50/70 hover:bg-rose-100/90 rounded-2xl border border-rose-200 text-left transition-all cursor-pointer">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xl">💸</span>
              <span class="text-[10px] font-bold bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full">High Priority</span>
            </div>
            <div class="text-xs font-black text-rose-950">पैसे कट झाले पण Recharge नाही</div>
            <div class="text-[10px] text-slate-600 mt-1">बँक आणि ऑपरेटर स्टेटस तपासून SLA Auto-Reversal ट्रॅक करेल</div>
          </button>

          <button onclick="window.agentEngine.processQuery('UPI payment pending amount debited from bank')" class="p-3.5 bg-amber-50/70 hover:bg-amber-100/90 rounded-2xl border border-amber-200 text-left transition-all cursor-pointer">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xl">⏳</span>
              <span class="text-[10px] font-bold bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">SLA: T+1</span>
            </div>
            <div class="text-xs font-black text-amber-950">Payment Pending / Debited</div>
            <div class="text-[10px] text-slate-600 mt-1">UPI स्विच आणि बँक UTR reconciliation तपासेल</div>
          </button>

          <button onclick="window.agentEngine.processQuery('Refund not received yet 4 days passed')" class="p-3.5 bg-sky-50/70 hover:bg-sky-100/90 rounded-2xl border border-sky-200 text-left transition-all cursor-pointer">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xl">↩️</span>
              <span class="text-[10px] font-bold bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full">Reversal</span>
            </div>
            <div class="text-xs font-black text-sky-950">Refund अजून मिळाला नाही</div>
            <div class="text-[10px] text-slate-600 mt-1">गेटवे आणि मर्चंट रिफंड सायकल ट्रॅक करून पुरावे देईल</div>
          </button>

          <button onclick="window.agentEngine.processQuery('Merchant claims payment not received but money debited')" class="p-3.5 bg-purple-50/70 hover:bg-purple-100/90 rounded-2xl border border-purple-200 text-left transition-all cursor-pointer">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xl">🏪</span>
              <span class="text-[10px] font-bold bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">Proof</span>
            </div>
            <div class="text-xs font-black text-purple-950">Merchant ला पैसे मिळाले नाहीत</div>
            <div class="text-[10px] text-slate-600 mt-1">अधिकृत UTR सेटलमेंट पुरावा तयार करेल</div>
          </button>

          <button onclick="window.agentEngine.processQuery('MSEDCL bill paid but showing unpaid on portal')" class="p-3.5 bg-yellow-50/70 hover:bg-yellow-100/90 rounded-2xl border border-yellow-200 text-left transition-all cursor-pointer">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xl">💡</span>
              <span class="text-[10px] font-bold bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">Biller</span>
            </div>
            <div class="text-xs font-black text-yellow-950">Bill भरले पण Unpaid दिसते</div>
            <div class="text-[10px] text-slate-600 mt-1">BBPS कन्फर्मेशन आणि ऑपरेटर तिकिटिंग सुरू करेल</div>
          </button>

          <button onclick="window.agentEngine.processQuery('Duplicate UPI debit double payment on order')" class="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-300 text-left transition-all cursor-pointer">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xl">🔁</span>
              <span class="text-[10px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">Dual TXN</span>
            </div>
            <div class="text-xs font-black text-slate-900">दोनदा पैसे कापले गेले (Duplicate)</div>
            <div class="text-[10px] text-slate-600 mt-1">दोन्ही व्यवहार पडताळून त्वरित रिव्हर्सल ट्रिगर करेल</div>
          </button>
        </div>

        <!-- Quick 1-Tap Dispute Chips -->
        <div class="pt-3 border-t border-slate-200/80">
          <div class="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
            <span>🛡️</span> <span>Quick Investigation Starters:</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <button onclick="window.agentEngine.processQuery('माझे पैसे कट झाले पण रिचार्ज झाला नाही')" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-bold rounded-xl border border-rose-200 cursor-pointer">🚨 पैसे कट झाले रिचार्ज नाही</button>
            <button onclick="window.agentEngine.processQuery('Refund not received yet 4 days passed')" class="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-900 text-xs font-bold rounded-xl border border-sky-200 cursor-pointer">↩️ 4 दिवस झाले रिफंड नाही</button>
            <button onclick="window.agentEngine.processQuery('Galti se dusre number par UPI transfer ho gaya')" class="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl border border-amber-200 cursor-pointer">⚠️ चुकीच्या नंबरवर UPI ट्रान्सफर</button>
            <button onclick="window.agentEngine.processQuery('Merchant claims payment not received but money debited')" class="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold rounded-xl border border-purple-200 cursor-pointer">🏪 मर्चंट म्हणतो पैसे नाही मिळाले</button>
          </div>
        </div>
      </div>
    `;
  }

  // Smart Money Intelligence Showcase
  renderSmartMoneyShowcase() {
    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    container.innerHTML = `
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border-2 border-emerald-400 text-left animate-in fade-in duration-200">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-emerald-100">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl shadow-xs">📊</div>
            <div>
              <h2 class="text-base sm:text-lg font-black text-[#002970]">Paytm Smart Money</h2>
              <p class="text-xs text-emerald-800 font-semibold">PAYTM AI HUB • Your Personal AI Money Advisor</p>
            </div>
          </div>
          <span class="text-xs font-black bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full">Finance Intelligence</span>
        </div>

        <!-- Smart Money Banner Image (Crisp 3D Card) -->
        <div class="mb-4 text-center">
          <img src="assets/paytm_smart_money_card.png?v=full_crisp" alt="Paytm Smart Money" class="max-h-28 sm:max-h-32 mx-auto rounded-2xl shadow-lg border-2 border-emerald-400 hover:scale-102 transition-all">
        </div>

        <!-- Monthly Spending & Interactive Analytics Card -->
        <div class="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 mb-4 shadow-lg border border-slate-800">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 pb-3 border-b border-slate-800">
            <div>
              <span class="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">MONTHLY SPENDING (या महिन्यातील एकूण खर्च)</span>
              <div class="text-3xl font-black text-white mt-0.5">₹9,150</div>
              <div class="text-[11px] text-slate-400">उदाहरणार्थ Demo Data • 32 Payments Analyzed</div>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="window.agentEngine.processQuery('या महिन्यात किती खर्च झाला?')" class="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5">
                <span>🤖</span> <span>AI Voice Analysis</span>
              </button>
            </div>
          </div>

          <!-- Category Progress Bars -->
          <div class="space-y-2.5">
            <div class="text-xs font-bold text-slate-300 mb-1">तुमचे पैसे कुठे खर्च झाले?</div>
            
            <!-- Shopping 49% -->
            <div class="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
              <div class="flex justify-between items-center text-xs font-bold mb-1">
                <div class="flex items-center gap-2">
                  <span>🛍️</span>
                  <span>Shopping</span>
                </div>
                <span class="font-mono text-cyan-300">₹4,500 <span class="text-slate-400 text-[10px]">(49%)</span></span>
              </div>
              <div class="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div class="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style="width: 49%"></div>
              </div>
            </div>

            <!-- Food & Zomato 35% -->
            <div class="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
              <div class="flex justify-between items-center text-xs font-bold mb-1">
                <div class="flex items-center gap-2">
                  <span>🍔</span>
                  <span>Food & Zomato</span>
                </div>
                <span class="font-mono text-emerald-400">₹3,200 <span class="text-slate-400 text-[10px]">(35%)</span></span>
              </div>
              <div class="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div class="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full" style="width: 35%"></div>
              </div>
            </div>

            <!-- Bills & Recharge 16% -->
            <div class="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
              <div class="flex justify-between items-center text-xs font-bold mb-1">
                <div class="flex items-center gap-2">
                  <span>⚡</span>
                  <span>Bills & Recharge</span>
                </div>
                <span class="font-mono text-amber-300">₹1,450 <span class="text-slate-400 text-[10px]">(16%)</span></span>
              </div>
              <div class="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div class="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full" style="width: 16%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Savings Insight Box -->
        <div class="p-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 rounded-2xl border border-emerald-300 mb-4 flex items-center justify-between gap-3">
          <div class="flex items-start gap-2.5">
            <span class="text-2xl">💡</span>
            <div>
              <div class="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                <span>AI Savings Insight</span>
                <span class="bg-emerald-200 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full">बचत ₹499/महिना</span>
              </div>
              <p class="text-xs text-slate-700 mt-1 leading-relaxed">तुमच्या खर्चात recurring subscriptions आढळल्या. त्यांचा आढावा घेतल्यास दरमहा ₹499 पर्यंत बचत होण्याची शक्यता आहे.</p>
            </div>
          </div>
          <button onclick="window.agentEngine.processQuery('माझे recurring payments कोणते आहेत?')" class="shrink-0 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer">
            आढावा घ्या
          </button>
        </div>

        <!-- 4 Core Pillars Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
          <!-- Pillar 1: Expense Analysis -->
          <button onclick="window.agentEngine.processQuery('या महिन्यात माझे पैसे कुठे जास्त खर्च झाले?')" class="p-3 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-slate-200 hover:border-emerald-300 text-left transition-all cursor-pointer">
            <div class="text-2xl mb-1">📊</div>
            <div class="text-xs font-black text-[#002970]">Expense Analysis</div>
            <div class="text-[10px] text-slate-500 mt-0.5">पैसे कुठे खर्च झाले?</div>
          </button>

          <!-- Pillar 2: Recurring Payments -->
          <button onclick="window.agentEngine.processQuery('माझे recurring payments कोणते?')" class="p-3 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-slate-200 hover:border-emerald-300 text-left transition-all cursor-pointer">
            <div class="text-2xl mb-1">🔄</div>
            <div class="text-xs font-black text-[#002970]">Recurring Payments</div>
            <div class="text-[10px] text-slate-500 mt-0.5">नियमित खर्च शोधणे</div>
          </button>

          <!-- Pillar 3: Smart Savings -->
          <button onclick="window.agentEngine.processQuery('कुठे पैसे वाचवता येतील?')" class="p-3 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-slate-200 hover:border-emerald-300 text-left transition-all cursor-pointer">
            <div class="text-2xl mb-1">🪙</div>
            <div class="text-xs font-black text-[#002970]">Smart Savings</div>
            <div class="text-[10px] text-slate-500 mt-0.5">बचतीच्या संधी दाखवणे</div>
          </button>

          <!-- Pillar 4: Budget Planner -->
          <button onclick="window.agentEngine.processQuery('5000 मध्ये महिन्याचा budget बनव')" class="p-3 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-slate-200 hover:border-emerald-300 text-left transition-all cursor-pointer">
            <div class="text-2xl mb-1">🎯</div>
            <div class="text-xs font-black text-[#002970]">Budget Planner</div>
            <div class="text-[10px] text-slate-500 mt-0.5">आर्थिक नियोजन</div>
          </button>
        </div>

        <!-- 7 One-Tap Ask Money AI Question Chips -->
        <div class="pt-3 border-t border-slate-200/80">
          <div class="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
            <span>🤖</span> <span>Ask Money AI (विचारून माहिती घ्या):</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <button onclick="window.agentEngine.processQuery('या महिन्यात किती खर्च झाला?')" class="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl border border-emerald-200 cursor-pointer">💰 या महिन्यात किती खर्च झाला?</button>
            <button onclick="window.agentEngine.processQuery('सर्वाधिक पैसे कुठे गेले?')" class="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold rounded-xl border border-purple-200 cursor-pointer">🛍️ सर्वाधिक पैसे कुठे गेले?</button>
            <button onclick="window.agentEngine.processQuery('माझे recurring payments कोणते?')" class="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold rounded-xl border border-blue-200 cursor-pointer">🔄 Recurring payments कोणते?</button>
            <button onclick="window.agentEngine.processQuery('कुठे पैसे वाचवता येतील?')" class="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl border border-amber-200 cursor-pointer">💡 कुठे पैसे वाचवता येतील?</button>
            <button onclick="window.agentEngine.processQuery('माझा प्रवासाचा खर्च किती झाला?')" class="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-900 text-xs font-bold rounded-xl border border-sky-200 cursor-pointer">🚗 प्रवासाचा खर्च किती झाला?</button>
            <button onclick="window.agentEngine.processQuery('5000 मध्ये महिन्याचा budget बनव')" class="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-bold rounded-xl border border-teal-200 cursor-pointer">🎯 ₹5,000 मध्ये बजेट बनव</button>
            <button onclick="window.agentEngine.processQuery('मागील महिन्यापेक्षा खर्च वाढला का?')" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-bold rounded-xl border border-rose-200 cursor-pointer">📈 मागील महिन्याशी तुलना</button>
          </div>
        </div>
      </div>
    `;
  }

  // Activity History & Persistence
  getActivityList() {
    try {
      const saved = localStorage.getItem('PAYTM_ACTIVITY_LOG');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    // Pre-populate with high quality verified demo activities
    return [
      {
        id: 'PTM9841029',
        ref: 'IRCTC782194',
        title: 'Shivneri AC Volvo (Pune ➔ Mumbai)',
        subtitle: 'Confirmed Seat • Departs 08:30 AM',
        amount: 495,
        type: 'Bus Booking',
        status: 'CONFIRMED',
        date: '10:45 AM, Today'
      },
      {
        id: 'PTM7890124',
        ref: 'NPCI_AUTO_REVERSAL_24H',
        title: 'UPI Payment Pending & Reconciliation',
        subtitle: 'Auto-reversal SLA: within 24h via NPCI Hub',
        amount: 500,
        type: 'Dispute Docket',
        status: 'INVESTIGATING',
        date: '09:20 AM, Today'
      },
      {
        id: 'PTM6291048',
        ref: 'JIO902814',
        title: 'Jio Prepaid 5G Booster Pack (2GB/Day)',
        subtitle: '28 Days Validity + Unlimited 5G Data',
        amount: 299,
        type: 'Mobile Recharge',
        status: 'CONFIRMED',
        date: 'Yesterday'
      }
    ];
  }

  saveToActivity(item) {
    try {
      const list = this.getActivityList();
      list.unshift(item);
      localStorage.setItem('PAYTM_ACTIVITY_LOG', JSON.stringify(list.slice(0, 15)));
      this.updateActivityBadge();
    } catch (e) {
      console.warn('Save activity error:', e);
    }
  }

  updateActivityBadge() {
    const list = this.getActivityList();
    const badge = document.getElementById('activity-badge-count');
    if (badge) badge.textContent = list.length;
  }

  openActivityDrawer() {
    paytm.playSound('click');
    const modal = document.getElementById('activity-drawer-modal');
    const container = document.getElementById('activity-list-container');
    if (!modal || !container) return;

    const list = this.getActivityList();
    if (list.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 text-slate-400">
          <div class="text-4xl mb-2">📂</div>
          <p class="text-sm font-semibold">No transactions or cases yet</p>
        </div>
      `;
    } else {
      container.innerHTML = list.map(item => `
        <div class="p-3.5 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2 text-left transition-all">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${item.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : (item.status === 'INVESTIGATING' ? 'bg-amber-100 text-amber-800' : 'bg-cyan-100 text-[#002970]')}">
              ${item.status}
            </span>
            <span class="text-[10px] text-slate-400 font-mono">${item.date || 'Today'}</span>
          </div>

          <div>
            <div class="text-xs font-black text-slate-900">${item.title}</div>
            <div class="text-[11px] text-slate-500">${item.subtitle}</div>
          </div>

          <div class="flex items-center justify-between pt-1 border-t border-slate-200/60">
            <span class="text-xs font-black text-[#002970]">₹${item.amount}</span>
            <button onclick="window.agentEngine.generateOfficialReceipt(${JSON.stringify(item).replace(/"/g, '&quot;')})" class="text-[11px] font-bold text-cyan-600 hover:text-cyan-800 flex items-center gap-1 cursor-pointer">
              <span>📄 View Receipt</span>
            </button>
          </div>
        </div>
      `).join('');
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  closeActivityDrawer() {
    paytm.playSound('click');
    const modal = document.getElementById('activity-drawer-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }
  }

  clearActivityLog() {
    paytm.playSound('click');
    localStorage.removeItem('PAYTM_ACTIVITY_LOG');
    this.updateActivityBadge();
    this.openActivityDrawer();
    paytm.showToast('Activity log cleared', 'info', '🗑️');
  }

  // Interactive Visual Soundbox Simulation
  triggerSoundbox(amount = 299, merchant = 'Paytm Merchant', lang = this.activeLanguage) {
    const soundbox = document.getElementById('paytm-soundbox-widget');
    const led = document.getElementById('soundbox-led');
    const waves = document.getElementById('soundbox-waves');
    const statusText = document.getElementById('soundbox-status');

    if (soundbox) {
      soundbox.classList.add('scale-110');
      setTimeout(() => soundbox.classList.remove('scale-110'), 800);
    }

    if (led) {
      led.classList.remove('bg-emerald-400', 'shadow-[0_0_14px_#10b981]');
      led.classList.add('bg-cyan-400', 'shadow-[0_0_20px_#00b9f1]', 'animate-ping');
      setTimeout(() => {
        led.classList.remove('animate-ping', 'bg-cyan-400', 'shadow-[0_0_20px_#00b9f1]');
        led.classList.add('bg-emerald-400', 'shadow-[0_0_14px_#10b981]');
      }, 3000);
    }

    if (waves) {
      waves.classList.remove('opacity-60');
      waves.classList.add('opacity-100');
      setTimeout(() => {
        waves.classList.remove('opacity-100');
        waves.classList.add('opacity-60');
      }, 3500);
    }

    if (statusText) {
      statusText.textContent = `₹${amount} Recv! 🔊`;
      setTimeout(() => {
        statusText.textContent = 'Tap to Test Voice 🔊';
      }, 4000);
    }

    // Play Voice Speech using Sarvam AI Bulbul v3 with fallback
    let msg = `Paytm par ${amount} rupaye prapt hue`;
    let ttsLang = 'hi-IN';
    if (lang === 'mr') {
      msg = `पेटीएम वर ${amount} रुपये मिळाले`;
      ttsLang = 'mr-IN';
    } else if (lang === 'en') {
      msg = `Rupees ${amount} received on Paytm`;
      ttsLang = 'en-IN';
    }

    const apiTarget = (typeof paytm !== 'undefined' && paytm.backendUrl !== undefined) 
      ? paytm.backendUrl 
      : ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port === '5500' ? 'http://localhost:8000' : '');
    fetch(`${apiTarget}/api/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: msg, language_code: ttsLang, speaker: 'priya' })
    })
    .then(r => r.json())
    .then(d => {
      if (d.audio_base64) {
        paytm.playSarvamAudio(d.audio_base64, msg, ttsLang);
      } else {
        paytm.speakTextFallback(msg, ttsLang);
      }
    })
    .catch(() => {
      paytm.speakTextFallback(msg, ttsLang);
    });

    paytm.playSound('paytm_success');
  }

  demoSoundbox() {
    this.triggerSoundbox(299, 'Sharma Kirana Store', this.activeLanguage);
    this.showWhatsAppNotification('Paytm Soundbox 4G Pro', 'Voice Alert Triggered: ₹299 received via Paytm UPI QR');
  }

  // Live WhatsApp / SMS Notification Toast
  showWhatsAppNotification(title, message) {
    const toast = document.getElementById('push-notification-toast');
    const titleEl = document.getElementById('push-toast-title');
    const msgEl = document.getElementById('push-toast-msg');
    if (!toast || !titleEl || !msgEl) return;

    paytm.playSound('chime');
    titleEl.textContent = title || 'Paytm Alert';
    msgEl.textContent = message || 'Transaction verified by NPCI.';

    toast.classList.remove('-translate-y-40');
    toast.classList.add('translate-y-0');

    setTimeout(() => {
      this.dismissPushToast();
    }, 5500);
  }

  dismissPushToast() {
    const toast = document.getElementById('push-notification-toast');
    if (toast) {
      toast.classList.remove('translate-y-0');
      toast.classList.add('-translate-y-40');
    }
  }

  // Official Printable PDF Receipt & Dispute Docket
  generateOfficialReceipt(item) {
    paytm.playSound('click');
    const modal = document.getElementById('receipt-modal');
    const area = document.getElementById('receipt-content-area');
    if (!modal || !area) return;

    const txnId = item.id || ('PTM' + Math.floor(100000000 + Math.random() * 900000000));
    const ref = item.ref || ('NPCI' + Math.floor(10000000 + Math.random() * 90000000));
    const isDispute = item.type && item.type.includes('Dispute');

    area.innerHTML = `
      <!-- Official Paytm Header -->
      <div class="border-b-2 border-[#002970] pb-4 flex items-center justify-between">
        <div>
          <div class="flex items-center gap-1.5">
            <span class="text-2xl font-black text-[#002970] tracking-tight">paytm</span>
            <span class="text-xs bg-[#00b9f1] text-[#002970] font-black px-2 py-0.5 rounded uppercase">ONE</span>
          </div>
          <p class="text-[11px] text-slate-500 font-medium mt-0.5">One97 Communications Ltd. • Official Transaction Docket</p>
        </div>
        <div class="text-right">
          <span class="text-xs font-black px-2.5 py-1 rounded-full ${item.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
            ${item.status}
          </span>
          <div class="text-[10px] text-slate-400 font-mono mt-1">${new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <!-- Core Details Table -->
      <div class="space-y-3 text-xs">
        <div class="bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-200">
          <div class="flex justify-between">
            <span class="text-slate-500 font-semibold">${isDispute ? 'Case Reference ID:' : 'Transaction ID:'}</span>
            <span class="font-bold text-slate-900 font-mono">#${txnId}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500 font-semibold">Gateway / Bank Ref:</span>
            <span class="font-bold text-slate-900 font-mono">${ref}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500 font-semibold">Service Description:</span>
            <span class="font-bold text-[#002970]">${item.title}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500 font-semibold">User Details:</span>
            <span class="font-bold text-slate-800">Akash (+91 98765 43210)</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500 font-semibold">Payment Channel:</span>
            <span class="font-bold text-slate-800">Paytm UPI • Verified Handle</span>
          </div>
        </div>

        <!-- Financial Breakdown -->
        <div class="p-3 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-1.5">
          <div class="flex justify-between font-bold text-slate-700">
            <span>Base Service Fee:</span>
            <span>₹${item.amount}</span>
          </div>
          <div class="flex justify-between text-slate-500 text-[11px]">
            <span>Convenience & Tax (GST 18%):</span>
            <span class="text-emerald-600 font-bold">₹0.00 (Waived)</span>
          </div>
          <div class="flex justify-between font-black text-sm text-[#002970] pt-1.5 border-t border-blue-200">
            <span>Total ${isDispute ? 'Claimed Amount' : 'Amount Paid'}:</span>
            <span class="text-base text-emerald-600">₹${item.amount}</span>
          </div>
        </div>

        <!-- Security & Legal Watermark -->
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[10px] text-slate-500 space-y-1">
          <div class="flex items-center gap-1 text-[#002970] font-bold">
            <span>🔒</span> <span>NPCI & RBI Regulatory SLA Compliance</span>
          </div>
          <p>This is a computer-generated docket issued under the Information Technology Act, 2000. Verified via Nexconn & You.com official regulatory feed.</p>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  closeReceiptModal() {
    paytm.playSound('click');
    const modal = document.getElementById('receipt-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      document.body.style.overflow = '';
    }
  }

  async processQuery(query) {
    const container = document.getElementById('workspace-dynamic-content');
    let stepTimer = null;
    if (container) {
      container.innerHTML = `
        <div class="bg-white/95 backdrop-blur-md rounded-2xl p-6 text-center shadow-lg border border-white/80 animate-in fade-in duration-200 max-w-md mx-auto">
          <div class="w-12 h-12 border-4 border-cyan-400 border-t-[#002970] rounded-full animate-spin mx-auto mb-3"></div>
          <p class="text-sm font-black text-[#002970]">Paytm Multi-Agent Squad Active...</p>
          <div id="loader-status-text" class="text-xs text-slate-600 font-semibold mt-1">🧠 Analyzing User Intent & Language...</div>
          <div class="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div id="loader-progress-bar" class="bg-gradient-to-r from-[#002970] to-[#00b9f1] h-1.5 w-1/4 transition-all duration-300"></div>
          </div>
          <div class="flex items-center justify-center gap-2 mt-3 text-[11px] text-slate-400 font-mono">
            <span>⚡ Groq Router</span> • <span>🔍 SerpApi Deals</span> • <span>🎙️ Sarvam AI</span>
          </div>
        </div>
      `;

      const statusEl = document.getElementById('loader-status-text');
      const barEl = document.getElementById('loader-progress-bar');
      let stepIndex = 0;
      const steps = [
        { text: '🔍 Querying Live Telecom & Utility Deals...', width: '60%' },
        { text: '⚖️ Verifying 3-Way Reconciliation Rails...', width: '85%' },
        { text: '🎙️ Synthesizing Voice Response...', width: '95%' }
      ];
      stepTimer = setInterval(() => {
        if (stepIndex < steps.length && statusEl && barEl) {
          statusEl.textContent = steps[stepIndex].text;
          barEl.style.width = steps[stepIndex].width;
          stepIndex++;
        }
      }, 400);
    }

    try {
      const apiBase = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port === '5500' ? 'http://localhost:8000' : '';
      
      let reqLang = 'auto';
      if (typeof paytm !== 'undefined' && paytm.currentLanguage) {
        if (paytm.currentLanguage.startsWith('en')) reqLang = 'en';
        else if (paytm.currentLanguage.startsWith('mr')) reqLang = 'mr';
        else if (paytm.currentLanguage.startsWith('hi')) reqLang = 'hi';
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout for reliable backend calls

      const resp = await fetch(`${apiBase}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query, user_id: 'paytm_user_01', language: reqLang }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (stepTimer) clearInterval(stepTimer);

      if (resp.ok) {
        const data = await resp.json();
        this.currentData = data;
        this.activeLanguage = data.language || 'hi';

        // Play Sarvam AI Speech or browser fallback
        const aiMsg = data.ai_message || '';
        const ttsLang = (data.language === 'mr' ? 'mr-IN' : (data.language === 'en' ? 'en-IN' : 'hi-IN'));
        paytm.playSarvamAudio(data.audio_base64, aiMsg, ttsLang);

        if (data.mode === 'CHAT' || data.service === 'chat') {
          this.renderChatMode(data);
        } else if (data.mode === 'RESOLVE' || data.service === 'dispute') {
          this.renderResolveMode(data);
        } else if (data.service === 'expense') {
          this.renderExpenseMode(data);
        } else if (data.service === 'merchant_summary') {
          this.renderMerchantSummaryMode(data);
        } else if (data.service === 'electricity') {
          this.renderElectricityMode(data);
        } else if (data.service === 'fastag') {
          this.renderFastagMode(data);
        } else if (data.service === 'dth') {
          this.renderDthMode(data);
        } else if (data.service === 'merchant') {
          this.renderMerchantMode(data);
        } else if (data.service === 'gold') {
          this.renderGoldMode(data);
        } else if (data.service === 'travel') {
          this.renderTravelMode(data);
        } else if (data.service === 'hotel') {
          this.renderHotelMode(data);
        } else if (data.service === 'shopping' || data.service === 'deals') {
          this.renderShoppingMode(data);
        } else if (data.service === 'movie' || data.service === 'movies') {
          this.renderMovieMode(data);
        } else {
          this.renderRechargeMode(data);
        }
        return;
      } else {
        throw new Error(`HTTP ${resp.status}`);
      }
    } catch (e) {
      if (stepTimer) clearInterval(stepTimer);
      console.warn('Backend call took too long or failed, activating instant client response:', e);
      this.renderInstantClientFallback(query);
    }
  }

  // 100% Instant Client-Side Fallback Engine
  renderInstantClientFallback(query) {
    const lower = query.toLowerCase();
    const cleanNum = lower.replace(/,/g, '');
    const nums = (cleanNum.match(/\b\d{2,4}\b/g) || []).map(Number).filter(n => n >= 50 && n <= 3999);
    const price = nums.length > 0 ? nums[0] : 857;

    let op = 'jio';
    if (lower.includes('airtel')) op = 'airtel';
    else if (lower.includes('vi') || lower.includes('vodafone') || lower.includes('idea')) op = 'vi';
    else if (lower.includes('bsnl')) op = 'bsnl';

    let lang = 'hi';
    if (typeof paytm !== 'undefined' && paytm.currentLanguage) {
      if (paytm.currentLanguage.startsWith('en')) lang = 'en';
      else if (paytm.currentLanguage.startsWith('mr')) lang = 'mr';
    } else {
      if (/मला|हवा|हवी|आहे|पाहिजे|करा|काय|किती|कापले|पैसे/.test(lower)) lang = 'mr';
      else if (/please|book|check|ticket|recharge|flight|refund|help|what|modes/.test(lower)) lang = 'en';
    }

    // Check Chat / Help queries first
    if (/what can you|help|who are you|kaise ho|aur kaise|kya help|madad|मदत|मदद|नमस्ते|नमस्कार|hello|hi|hey|modes/.test(lower)) {
      const mockChat = {
        mode: 'CHAT',
        service: 'chat',
        language: lang,
        ai_message: lang === 'en' 
          ? "Hello! I am Paytm ONE AI Commander. I can assist you across 2 core modes:\n\n• **Action Mode**: Autonomous 1-click execution for Mobile Recharge, Flight & Bus Tickets, Electricity Bills, and Shopping Deals.\n• **Resolve Mode**: Autonomous 3-Way Reconciliation for stuck payments, failed UPI debits, and refund tracking with 24H SLA.\n\nWhich mode would you like to explore?"
          : (lang === 'mr' 
            ? "नमस्कार! मी पेटीएम वन AI कमांडर आहे. मी तुम्हाला २ प्रमुख मोड्समध्ये मदत करू शकतो:\n\n• **Action Mode**: मोबाईल रिचार्ज, बस/ट्रेन/फ्लाइट तिकीट, वीज बिल आणि शॉपिंग डील्स १-क्लिकमध्ये.\n• **Resolve Mode**: अडकलेले पैसे, अयशस्वी UPI पेमेंट आणि रिफंडचे २४ तासांत जलद निवारण.\n\nतुम्हाला काय करायचे आहे?"
            : "नमस्ते! मैं पेटीएम वन (Paytm ONE) AI कमांडर हूँ। मैं आपकी 2 मुख्य मोड्स में मदद कर सकता हूँ:\n\n• **Action Mode**: मोबाइल रिचार्ज, बस/ट्रेन/फ्लाइट टिकट बुकिंग, बिजली बिल और डील्स 1-क्लिक में करें।\n• **Resolve Mode**: अटके हुए पैसे, फेल यूपीआई पेमेंट और रिफंड का 24 घंटे में समाधान।\n\nआप कौन सा मोड देखना चाहते हैं?"),
        suggested_replies: lang === 'en'
          ? ["Recharge Jio ₹299 ⚡", "Pune to Mumbai Flight ✈️", "Dispute Stuck Payment 🛡️", "Pay Electricity Bill 💡"]
          : (lang === 'mr'
            ? ["Jio ₹299 रिचार्ज करा ⚡", "पुणे ते मुंबई फ्लाईट ✈️", "अडकलेले पैसे रिफंड करा 🛡️", "वीज बिल भरा 💡"]
            : ["Jio ₹299 रिचार्ज करें ⚡", "पुणे से मुंबई फ्लाइट ✈️", "अटके पैसे की शिकायत 🛡️", "बिजली बिल भरें 💡"])
      };
      this.renderChatMode(mockChat);
      paytm.playSarvamAudio(null, mockChat.ai_message, lang === 'en' ? 'en-IN' : (lang === 'mr' ? 'mr-IN' : 'hi-IN'));
      return;
    }

    // Route service
    if (/कापले|cut|refund|pending|failed|तक्रार|रिफंड|मिळाले नाही|अडकले/.test(lower)) {
      this.currentMode = 'resolve';
      this.updateModeTabsUi('resolve');
      const mockResolve = {
        mode: 'RESOLVE',
        service: 'dispute',
        language: lang,
        ai_message: lang === 'mr' ? `तुमच्या ₹${price} च्या ट्रान्झॅक्शनची तक्रार नोंदवली आहे. 3-Way Reconciliation नुसार पैसे २४ तासांत खात्यात परत जमा होतील.` : `आपके ₹${price} के लेनदेन की जांच शुरू हो गई है। 3-Way Reconciliation के अनुसार 24 घंटे में रिफंड मिल जाएगा।`,
        resolve_data: {
          case_id: 'PTM' + Math.floor(1000000 + Math.random() * 9000000),
          amount: price,
          finding: 'Bank Core CBS status: DEBITED • NPCI Switch: DROP-OFF DETECTED'
        }
      };
      this.renderResolveMode(mockResolve);
      paytm.playSarvamAudio(null, mockResolve.ai_message, lang === 'mr' ? 'mr-IN' : 'hi-IN');
      return;
    }

    if (/flight|bus|train|ticket|तिकीट|टिकट|पुणे|मुंबई|pune|mumbai/.test(lower)) {
      this.currentMode = 'action';
      this.updateModeTabsUi('action');
      const mockTravel = {
        mode: 'ACTION',
        service: 'travel',
        language: lang,
        ai_message: lang === 'mr' ? `पुणे ते मुंबई प्रवासासाठी सर्वोत्कृष्ट शिवनेरी बस व इंडिगो फ्लाईट्स शोधल्या आहेत.` : `पुणे से मुंबई यात्रा के लिए सबसे अच्छी शिवनेरी बस और फ्लाइट्स उपलब्ध हैं।`,
        travel_data: { origin: 'Pune', destination: 'Mumbai' }
      };
      this.renderTravelMode(mockTravel);
      paytm.playSarvamAudio(null, mockTravel.ai_message, lang === 'mr' ? 'mr-IN' : 'hi-IN');
      return;
    }

    if (/खर्च|kharch|expense|spend|बचत|shopping/.test(lower)) {
      this.currentMode = 'smart_money';
      this.updateModeTabsUi('smart_money');
      const mockExpense = {
        mode: 'ACTION',
        service: 'expense',
        language: lang,
        ai_message: lang === 'mr' ? `या महिन्यात तुमचा एकूण खर्च ₹9,150 झाला असून ₹499/महिना सबस्क्रिप्शन बचत शक्य आहे.` : `इस महीने आपका कुल खर्च ₹9,150 हुआ है और ₹499/महीने की बचत संभव है।`
      };
      this.renderExpenseMode(mockExpense);
      paytm.playSarvamAudio(null, mockExpense.ai_message, lang === 'mr' ? 'mr-IN' : 'hi-IN');
      return;
    }

    // Default: Best Recharge Match around price
    let bestPlan = {
      id: `${op}-${price >= 700 ? 857 : (price >= 300 ? 349 : 299)}`,
      price: price >= 700 ? 857 : (price >= 300 ? 349 : 299),
      validity: price >= 700 ? '84 Days' : '28 Days',
      data: '2 GB / Day',
      badge: price >= 700 ? 'Amazon Prime 84D 📦' : 'Best 2GB 🌟',
      cashback: price >= 700 ? '₹50 Cashback' : '₹30 Cashback',
      ott: price >= 700 ? ['Amazon Prime', 'JioCinema'] : ['JioCinema Premium'],
      calls: 'Unlimited Calls',
      network: 'True Unlimited 5G'
    };

    const mockRecharge = {
      mode: 'ACTION',
      service: 'recharge',
      operator: op,
      budget: price,
      language: lang,
      ai_message: lang === 'mr' 
        ? `मी तुमच्यासाठी ${op.toUpperCase()} चा बेस्ट ₹${bestPlan.price} चा 2 GB/Day (${bestPlan.validity}) प्लॅन शोधला आहे! रिचार्ज मंजूर करायचा का?`
        : `मैंने आपके लिए ${op.toUpperCase()} का बेस्ट ₹${bestPlan.price} का 2 GB/Day (${bestPlan.validity}) प्लान चुना है! क्या आप रिचार्ज अप्रूव करना चाहते हैं?`,
      plan_data: {
        best: bestPlan,
        alternatives: [
          { id: `${op}-299`, price: 299, validity: '28 Days', data: '2 GB / Day', calls: 'Unlimited', cashback: '₹20 Cashback', badge: 'Popular ⭐' },
          { id: `${op}-349`, price: 349, validity: '28 Days', data: '2.5 GB / Day', calls: 'Unlimited', cashback: '₹30 Cashback', badge: 'Speed 5G ⚡' },
          { id: `${op}-749`, price: 749, validity: '72 Days', data: '2 GB / Day', calls: 'Unlimited', cashback: '₹40 Cashback', badge: 'Saver 🌟' }
        ]
      },
      suggested_replies: [
        `${op.toUpperCase()} 2GB Daily Data`,
        `${op.toUpperCase()} 84 Days Plan`,
        '₹299 28 Days Plan',
        'Netflix Hotstar OTT Pack'
      ]
    };
    this.renderRechargeMode(mockRecharge);
    paytm.playSarvamAudio(null, mockRecharge.ai_message, lang === 'mr' ? 'mr-IN' : 'hi-IN');
  }

  // 0. Render Conversational Chat Mode (ChatGPT / Gemini Grade)
  renderChatMode(data) {
    const steps = data.steps_log || [];
    const suggestions = data.suggested_replies || [];
    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    container.innerHTML = `
      <!-- ASTRA-STYLE AGENT THINKING & EXECUTION TRACE BOX -->
      <div class="bg-slate-900/90 text-white backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-xl border border-slate-700/80 text-left text-xs space-y-2 animate-in fade-in duration-200">
        <div class="flex items-center justify-between border-b border-slate-700/60 pb-2">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span class="font-mono text-cyan-300 font-bold uppercase tracking-wider text-[11px]">Paytm AI Hub • Multilingual Agent Trace</span>
          </div>
          <span class="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded-full font-bold">ChatGPT / Gemini Grade</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1 font-mono">
          ${steps.map(s => `
            <div class="flex items-start gap-1.5 bg-slate-800/60 p-2 rounded-lg border border-slate-700/50">
              <span class="text-cyan-400 font-bold">⚡ Step ${s.step}:</span>
              <div>
                <span class="font-bold text-white">${s.title}</span>
                <p class="text-[10px] text-slate-400 mt-0.5">${s.detail}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- MAIN CONVERSATIONAL CARD -->
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border border-sky-200 text-left space-y-4 animate-in fade-in duration-200">
        <div class="flex items-center justify-between border-b border-sky-100 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#002970] to-cyan-500 text-white flex items-center justify-center text-xl shadow-md">🤖</div>
            <div>
              <h3 class="text-base font-black text-[#002970]">Paytm AI Assistant</h3>
              <p class="text-xs text-slate-500 font-semibold">Universal Action Squad & Dispute Resolution Partner</p>
            </div>
          </div>
          <button onclick="paytm.replayAudio()" class="sarvam-voice-btn px-3 py-1.5 rounded-xl bg-cyan-50 text-cyan-800 font-bold text-xs border border-cyan-200 hover:bg-cyan-100 flex items-center gap-1.5 cursor-pointer shadow-xs transition-all">
            <span class="speaker-icon">🔊</span> <span>आवाज ऐका (Sarvam AI)</span>
          </button>
        </div>

        <!-- AI Message Bubble -->
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed whitespace-pre-line font-medium shadow-2xs">
          ${data.ai_message}
        </div>

        <!-- TWO PRIMARY MODE TILES -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button onclick="window.agentEngine.switchMode('action')" class="p-3.5 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50/80 border border-sky-200 hover:border-sky-400 hover:shadow-md transition-all text-left cursor-pointer group">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xl">⚡</span>
              <span class="font-black text-xs text-[#002970] group-hover:text-cyan-600">Action Mode (Do More)</span>
            </div>
            <p class="text-[11px] text-slate-600">Recharge, Bus/Train/Flight Tickets, Hotels, Electricity, Shopping Deals</p>
          </button>

          <button onclick="window.agentEngine.switchMode('resolve')" class="p-3.5 rounded-2xl bg-gradient-to-br from-rose-50 to-red-50/80 border border-rose-200 hover:border-rose-400 hover:shadow-md transition-all text-left cursor-pointer group">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xl">🛡️</span>
              <span class="font-black text-xs text-rose-900 group-hover:text-red-700">Resolve Mode (Get Help)</span>
            </div>
            <p class="text-[11px] text-slate-600">Stuck Money, Failed UPI, Refund Tracking, NPCI 3-Way Reconciliation</p>
          </button>
        </div>

        <!-- SUGGESTED QUESTIONS / ACTIONS -->
        <div class="pt-2 border-t border-slate-100">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">तुम्ही हे विचारू शकता (Suggested Prompts):</span>
          <div class="flex flex-wrap gap-2">
            ${suggestions.map(s => `
              <button onclick="window.agentEngine.processQuery('${s.replace(/'/g, "\\'")}')" class="px-3 py-1.5 bg-white hover:bg-cyan-50 text-slate-700 hover:text-cyan-800 text-xs font-semibold rounded-xl border border-slate-200 hover:border-cyan-300 transition-all cursor-pointer shadow-2xs">
                ${s}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // 1. Render Recharge Mode (Paytm ONE Action Squad)
  renderRechargeMode(data) {
    const best = data.plan_data.best;
    const alternatives = data.plan_data.alternatives || [];
    const serpResults = data.serp_verification?.live_web_matches || [];
    const steps = data.steps_log || [];
    this.activePlan = best;

    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    container.innerHTML = `
      <!-- ASTRA-STYLE AGENT THINKING & EXECUTION TRACE BOX -->
      <div class="bg-slate-900/90 text-white backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-xl border border-slate-700/80 text-left text-xs space-y-2 animate-in fade-in duration-200">
        <div class="flex items-center justify-between border-b border-slate-700/60 pb-2">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span class="font-black text-cyan-400 tracking-wide uppercase text-[11px]">Astra Multi-Agent Execution Trace</span>
          </div>
          <span class="text-[10px] text-slate-400 font-mono">Status: 200 OK • Groq + SerpApi + Sarvam</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
          <div class="flex items-center gap-1.5 text-emerald-300">
            <span>✓</span> <span>Step 1: Intent & Entity Extraction (Groq)</span>
          </div>
          <div class="flex items-center gap-1.5 text-cyan-300">
            <span>✓</span> <span>Step 2: SerpApi Live Google Deals Query</span>
          </div>
          <div class="flex items-center gap-1.5 text-blue-300">
            <span>✓</span> <span>Step 3: Telecom Plan Matching (${(data.operator || 'Jio').toUpperCase()} ₹${best.price})</span>
          </div>
          <div class="flex items-center gap-1.5 text-purple-300">
            <span>✓</span> <span>Step 4: Sarvam AI Bulbul v3 Voice Synthesized</span>
          </div>
        </div>
      </div>

      <!-- AI Verbal Response Bubble -->
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-lg border border-white/80 animate-in fade-in slide-in-from-top-2 duration-300">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-[#002970] to-[#00b9f1] flex items-center justify-center text-white text-xl shadow-md shrink-0">
            🤖
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between mb-1 flex-wrap gap-2">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs font-black tracking-wider text-[#002970] uppercase">Paytm ONE • AI Commander</span>
                <span class="text-[10px] font-bold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full">
                  🌐 ${data.language === 'hi' ? 'हिंदी (Hindi)' : (data.language === 'en' ? 'English' : 'मराठी')}
                </span>
                <span class="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                  🎙️ Sarvam AI Audio
                </span>
              </div>
              <button onclick="paytm.replayAudio()" class="sarvam-voice-btn px-2.5 py-1 bg-gradient-to-r from-purple-50 to-indigo-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-all">
                <span class="speaker-icon">🔊</span> <span>आवाज ऐका</span>
              </button>
            </div>
            <p class="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">${data.ai_message}</p>
          </div>
        </div>

        <!-- Filter Tags -->
        <div class="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span class="text-[11px] font-semibold text-slate-400">Filters:</span>
          <span class="inline-flex items-center gap-1 bg-[#002970]/10 text-[#002970] font-bold text-xs px-2.5 py-1 rounded-lg">
            📱 ${(data.operator || 'jio').toUpperCase()}
          </span>
          <span class="inline-flex items-center gap-1 bg-cyan-100 text-cyan-800 font-bold text-xs px-2.5 py-1 rounded-lg">
            💰 Budget: ~₹${data.budget || 300}
          </span>
          <span class="inline-flex items-center gap-1 bg-blue-100 text-blue-800 font-bold text-xs px-2.5 py-1 rounded-lg">
            📶 ${best.data}
          </span>
          <span class="inline-flex items-center gap-1 bg-purple-100 text-purple-800 font-bold text-xs px-2.5 py-1 rounded-lg">
            🍿 ${best.ott?.join(', ') || 'OTT Suite'}
          </span>
          <span class="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-1 rounded-lg">
            🎁 ${best.cashback}
          </span>
        </div>
      </div>

      <!-- Best Plan Highlight Card -->
      <div class="bg-gradient-to-br from-white via-cyan-50/40 to-blue-50/60 rounded-2xl p-5 sm:p-6 shadow-xl border-2 border-[#00b9f1]/40 relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div class="absolute top-0 right-0 bg-gradient-to-l from-[#002970] to-[#00b9f1] text-white text-[11px] font-black uppercase tracking-wider px-4 py-1.5 rounded-bl-xl shadow-md">
          ${best.badge}
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl sm:text-4xl font-black text-[#002970]">₹${best.price}</span>
              <span class="text-xs text-slate-400 line-through">₹${best.price + 50}</span>
              <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                100% Top Match
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-1 font-medium">${best.description}</p>
          </div>

          <div class="text-left sm:text-right">
            <span class="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Mobile Number</span>
            <span class="text-sm font-bold text-[#002970]">9820123456</span>
            <span class="text-[10px] text-slate-500 block">Prepaid • Mumbai / Maharashtra</span>
          </div>
        </div>

        <!-- Specifications Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
          <div class="bg-white/80 p-2.5 rounded-xl border border-slate-100 text-center">
            <span class="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Validity</span>
            <span class="text-sm sm:text-base font-black text-[#002970]">${best.validity}</span>
          </div>
          <div class="bg-white/80 p-2.5 rounded-xl border border-slate-100 text-center">
            <span class="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Daily Data</span>
            <span class="text-sm sm:text-base font-black text-[#00b9f1]">${best.data}</span>
          </div>
          <div class="bg-white/80 p-2.5 rounded-xl border border-slate-100 text-center">
            <span class="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Voice Calls</span>
            <span class="text-sm sm:text-base font-black text-[#002970]">Unlimited</span>
          </div>
          <div class="bg-white/80 p-2.5 rounded-xl border border-slate-100 text-center">
            <span class="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Speed</span>
            <span class="text-sm sm:text-base font-black text-emerald-600">${best.network}</span>
          </div>
        </div>

        <!-- SerpApi Live Search Verification Proof -->
        ${serpResults.length > 0 ? `
          <div class="mt-4 p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-left">
            <div class="flex items-center gap-1.5 text-xs font-bold text-[#002970] mb-1">
              <span>🔎 SerpApi Live Web Verification:</span>
              <span class="text-[10px] bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full font-mono">Status: 200 OK</span>
            </div>
            <p class="text-[11px] text-slate-600 italic truncate">"${serpResults[0].snippet}"</p>
          </div>
        ` : ''}

        <!-- Human Approval & PIN Action -->
        <div class="mt-6 pt-4 border-t border-slate-200/80">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-xs font-bold text-[#002970]">Human Approval Required (Zero-Trust Security)</span>
            </div>
            <span class="text-[11px] text-slate-400">NPCI 256-bit Secure</span>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-3">
            <button onclick="window.agentEngine.openPinModal(${best.price}, '${(data.operator || 'Jio').toUpperCase()}', '${best.validity}')"
                    class="interactive-btn w-full sm:flex-1 py-3.5 px-6 rounded-xl font-black text-sm text-white bg-gradient-to-r from-[#002970] via-[#0047a1] to-[#00b9f1] hover:brightness-110 shadow-lg shadow-blue-900/25 flex items-center justify-center gap-2 cursor-pointer">
              <span>✅</span>
              <span>${data.language === 'hi' ? 'स्वीकार करें और ₹' + best.price + ' भरें (Pay)' : (data.language === 'mr' ? 'मंजूर करा आणि ₹' + best.price + ' भरा' : 'Approve & Pay ₹' + best.price)}</span>
            </button>

            <div class="text-[11px] font-bold text-slate-500 bg-slate-100/90 py-2.5 px-4 rounded-xl border border-slate-200 flex items-center gap-1.5">
              <span>💡</span>
              <span>${data.language === 'mr' ? 'खालील टॉप 5 पैकी कोणताही प्लॅन क्लिक करून बदला' : (data.language === 'hi' ? 'नीचे दिए गए 5 प्लान्स में से किसी पर भी क्लिक करके चुनें' : 'Click any of top 5 plans below to switch instantly')}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top 5 Alternatives Row (Always Visible in a Clean Line) -->
      <div id="alternative-plans-row" class="animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div class="text-xs font-bold text-[#002970] mb-2 flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-[#00b9f1]"></span>
            <span>${data.language === 'mr' ? 'इतर टॉप 5 शोधलेले प्लॅन्स (' + (data.operator || 'Jio').toUpperCase() + '):' : 'Top 5 Matching Telecom Plans (' + (data.operator || 'Jio').toUpperCase() + '):'}</span>
          </div>
          <span class="text-[11px] text-slate-500 font-medium">🎯 Click any plan card to select</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          ${alternatives.slice(0, 5).map(alt => `
            <div onclick="window.agentEngine.switchPlan('${alt.id}', ${alt.price}, '${data.operator || 'jio'}')"
                 class="interactive-btn p-3 bg-white/95 hover:bg-sky-50/80 rounded-2xl border-2 ${alt.price === best.price ? 'border-[#002970] shadow-md ring-2 ring-blue-300' : 'border-slate-200 hover:border-[#00b9f1]'} cursor-pointer shadow-xs transition-all text-left flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-base font-black text-[#002970]">₹${alt.price}</span>
                  <span class="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">${alt.validity}</span>
                </div>
                <div class="text-xs font-bold text-[#00b9f1]">${alt.data}</div>
                <div class="text-[11px] text-slate-500 truncate mt-1">${alt.ott?.join(', ') || alt.badge || ''}</div>
              </div>
              <div class="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold">
                <span class="text-emerald-600">Select ➔</span>
                <span class="text-slate-400">5G Data</span>
              </div>
            </div>
          `).join('')}
        </div>

        ${this.renderSuggestedChips(data.suggested_replies)}
      </div>
    `;
  }

  showAlternativePlans() {
    const row = document.getElementById('alternative-plans-row');
    if (row) {
      row.scrollIntoView({ behavior: 'smooth' });
      paytm.playSound('click');
    }
  }

  switchPlan(planId, price, operator) {
    paytm.playSound('chime');
    if (!this.currentData || !this.currentData.plan_data) {
      this.processQuery(`${operator} ${price} plan recharge`);
      return;
    }
    const op = (operator || 'jio').toLowerCase();
    const allPlans = [
      this.currentData.plan_data.best,
      ...(this.currentData.plan_data.alternatives || [])
    ];
    const catalog = FRONTEND_PLANS[op] || [];
    const found = allPlans.find(p => p.id === planId || p.price === price) || catalog.find(p => p.id === planId || p.price === price);

    if (found) {
      const newAlts = catalog.filter(p => p.id !== found.id).slice(0, 5);
      this.currentData.plan_data.best = found;
      this.currentData.plan_data.alternatives = newAlts;
      this.currentData.budget = found.price;
      this.activePlan = found;

      if (this.activeLanguage === 'hi') {
        this.currentData.ai_message = `मैंने आपका प्लान बदलकर ${op.toUpperCase()} ₹${found.price} (${found.data}, ${found.validity}) कर दिया है। क्या आप इसे अप्रूव करना चाहते हैं?`;
      } else if (this.activeLanguage === 'mr') {
        this.currentData.ai_message = `मी तुमचा प्लॅन बदलून ${op.toUpperCase()} चा बेस्ट ₹${found.price} (${found.data}, ${found.validity}) निवडला आहे. मंजूर करायचा का?`;
      } else {
        this.currentData.ai_message = `Switched to ${op.toUpperCase()} ₹${found.price} plan with ${found.data} and ${found.validity} validity. Ready to approve?`;
      }

      this.renderRechargeMode(this.currentData);
      paytm.showToast(`✅ Selected ₹${found.price} Plan (${found.data}, ${found.validity})`, 'success', '📱');
      paytm.speakTextFallback(this.currentData.ai_message);
    } else {
      this.processQuery(`${operator} ${price} plan recharge`);
    }
  }

  // 2. Render Resolve Mode (Paytm Resolve Autonomous Investigation Squad)
  renderResolveMode(data) {
    const res = data.resolve_data || {};
    const cit = data.citations || res.citations || {};
    const nex = data.nexconn_chat || res.nexconn_chat || {};
    const recon = res.three_way_reconciliation || [];
    const journey = res.refund_journey || [];
    const draft = res.complaint_draft || {};
    const evidence = res.evidence_bundle || {};

    const caseId = res.transaction_id || ('PTM' + Math.floor(1000000 + Math.random() * 9000000));
    const caseTitle = res.summary || 'Payment Dispute Investigation';
    const caseRef = res.operator_reference || 'NPCI_AUTO_REVERSAL_24H';

    // 1. Save to Persistent Activity History
    this.saveToActivity({
      id: caseId,
      ref: caseRef,
      title: caseTitle,
      subtitle: res.resolution_path || 'Auto-reversal SLA: within 24h via NPCI Hub',
      amount: res.amount || (data.transaction ? data.transaction.amount : 500),
      type: 'Dispute Docket',
      status: 'INVESTIGATING',
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today'
    });

    // 2. Trigger WhatsApp Push Notification
    this.showWhatsAppNotification(
      'Paytm Resolve Alert',
      `Investigation Docket #${caseId} registered with NPCI. Auto-reversal SLA: 24h.`
    );

    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    container.innerHTML = `
      <!-- Quick Resolve Scenario Pills -->
      <div class="mb-3.5 p-3 bg-red-50/80 rounded-2xl border border-red-200">
        <div class="text-[11px] font-black uppercase text-red-800 tracking-wider mb-2 flex items-center justify-between">
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span>🚨 Select Dispute Scenario (Instant Multi-Agent Investigation):</span>
          </span>
          <span class="text-[10px] text-red-600 font-mono font-bold">Paytm Resolve Core</span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button onclick="window.agentEngine.processQuery('पैसे कट झाले पण Recharge झाला नाही')"
                  class="p-2 text-left bg-white hover:bg-red-100/50 rounded-xl border border-red-200 text-xs font-bold text-slate-800 transition-all flex items-center gap-1.5 cursor-pointer">
            <span>⚡</span> <span class="truncate">Recharge Pending</span>
          </button>
          <button onclick="window.agentEngine.processQuery('माझा ₹1200 चा refund अजून आला नाही')"
                  class="p-2 text-left bg-white hover:bg-red-100/50 rounded-xl border border-red-200 text-xs font-bold text-slate-800 transition-all flex items-center gap-1.5 cursor-pointer">
            <span>💰</span> <span class="truncate">Refund Tracking (₹1,200)</span>
          </button>
          <button onclick="window.agentEngine.processQuery('दुकानदार म्हणतो पैसे मिळाले नाहीत पण बँकेतून कट झाले')"
                  class="p-2 text-left bg-white hover:bg-red-100/50 rounded-xl border border-red-200 text-xs font-bold text-slate-800 transition-all flex items-center gap-1.5 cursor-pointer">
            <span>🏪</span> <span class="truncate">Merchant Reconciliation</span>
          </button>
          <button onclick="window.agentEngine.processQuery('Electricity bill paid पण अजून unpaid दिसते')"
                  class="p-2 text-left bg-white hover:bg-red-100/50 rounded-xl border border-red-200 text-xs font-bold text-slate-800 transition-all flex items-center gap-1.5 cursor-pointer">
            <span>📄</span> <span class="truncate">Bill Settlement Delay</span>
          </button>
          <button onclick="window.agentEngine.processQuery('मी चुकून चुकीच्या UPI ID वर पैसे पाठवले')"
                  class="p-2 text-left bg-white hover:bg-red-100/50 rounded-xl border border-red-200 text-xs font-bold text-slate-800 transition-all flex items-center gap-1.5 cursor-pointer">
            <span>🔄</span> <span class="truncate">Wrong UPI Transfer</span>
          </button>
          <button onclick="window.agentEngine.processQuery('दोनदा पैसे debit झाले duplicate payment')"
                  class="p-2 text-left bg-white hover:bg-red-100/50 rounded-xl border border-red-200 text-xs font-bold text-slate-800 transition-all flex items-center gap-1.5 cursor-pointer">
            <span>⚠️</span> <span class="truncate">Duplicate Debit Reversal</span>
          </button>
        </div>
      </div>

      <!-- Astra Autonomous Squad Execution Trace -->
      <div class="bg-slate-900/95 text-white backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-700/80 text-left text-xs space-y-2.5 animate-in fade-in duration-200">
        <div class="flex items-center justify-between border-b border-slate-700/60 pb-2">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping"></span>
            <span class="font-black text-red-400 tracking-wide uppercase text-[11px]">Paytm Resolve Multi-Agent Investigation Squad Active</span>
          </div>
          <span class="text-[10px] text-slate-400 font-mono">You.com Live Research + Nexconn SDK Singapore</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
          <div class="flex items-center gap-1.5 text-emerald-300">
            <span>✓</span> <span>Agent 1: Transaction Detective</span>
          </div>
          <div class="flex items-center gap-1.5 text-cyan-300">
            <span>✓</span> <span>Agent 2: 3-Way Reconciliation</span>
          </div>
          <div class="flex items-center gap-1.5 text-blue-300">
            <span>✓</span> <span>Agent 3: You.com Policy Research</span>
          </div>
          <div class="flex items-center gap-1.5 text-amber-300">
            <span>✓</span> <span>Agent 4: Evidence & SHA-256 Seal</span>
          </div>
          <div class="flex items-center gap-1.5 text-purple-300">
            <span>✓</span> <span>Agent 5: Nexconn Chat SDK Session</span>
          </div>
          <div class="flex items-center gap-1.5 text-pink-300">
            <span>✓</span> <span>Agent 6: Complaint Builder</span>
          </div>
        </div>
      </div>

      <!-- Main Case Dossier Container -->
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border-2 border-red-300 text-left space-y-5 animate-in fade-in duration-300">
        
        <!-- Case Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div class="flex items-start gap-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white text-2xl shadow-md shrink-0">
              🛡️
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs font-black tracking-wider text-red-600 uppercase font-mono">${res.case_id || '#CASE-PTM-10829'}</span>
                <span class="text-[10px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-300">
                  ${res.status_badge || 'Under Investigation'}
                </span>
                <span class="text-[10px] font-mono text-slate-400">NPCI SLA: 24h</span>
              </div>
              <h2 class="text-base sm:text-lg font-black text-[#002970] mt-0.5">${res.case_title || 'Payment Investigation'}</h2>
              <p class="text-xs text-slate-500 font-medium">${res.service_name || 'Paytm Transaction'} • 19 Nov 2026, 10:42 AM IST</p>
            </div>
          </div>

          <div class="text-left sm:text-right">
            <span class="text-xs uppercase text-slate-400 font-bold block">Disputed Amount</span>
            <span class="text-3xl font-black text-red-600">₹${res.amount || 500}</span>
            <span class="text-[10px] text-emerald-600 font-bold block">✓ 100% Escrow Protected</span>
          </div>
        </div>

        <!-- AI Investigation Verbal Finding -->
        <div class="p-4 bg-gradient-to-r from-red-50 via-rose-50 to-orange-50 rounded-2xl border-2 border-red-200">
          <div class="flex items-center justify-between mb-1 gap-2 flex-wrap">
            <div class="flex items-center gap-2">
              <span class="text-sm">🤖</span>
              <span class="text-xs font-black uppercase tracking-wider text-[#002970]">Paytm Resolve Commander Finding</span>
            </div>
            <button onclick="paytm.replayAudio()" class="sarvam-voice-btn px-2.5 py-1 bg-white hover:bg-red-50 text-red-700 border border-red-200 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer transition-all">
              <span class="speaker-icon">🔊</span> <span>आवाज ऐका (Sarvam AI)</span>
            </button>
          </div>
          <p class="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">${data.ai_message || res.finding}</p>
        </div>

        <!-- MODULE 1: 3-WAY RECONCILIATION MATRIX -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-xs font-black text-[#002970] uppercase tracking-wider flex items-center gap-1.5">
              <span>⚖️</span> <span>3-Way Transaction Reconciliation Matrix (Live Evidence)</span>
            </h4>
            <span class="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">Discrepancy Isolated</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            ${recon.map(r => `
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[10px] uppercase font-bold text-slate-400">${r.role}</span>
                  <span class="text-[10px] font-mono text-slate-400">${r.timestamp}</span>
                </div>
                <div class="font-black text-xs text-[#002970]">${r.party}</div>
                <div class="text-[11px] font-mono text-slate-600 mt-0.5">${r.reference}</div>
                <div class="mt-2 text-[10px] font-bold ${r.badge_color === 'emerald' ? 'text-emerald-700 bg-emerald-100' : (r.badge_color === 'cyan' ? 'text-blue-700 bg-blue-100' : 'text-amber-800 bg-amber-100')} px-2 py-0.5 rounded-md inline-block">
                  ${r.status}
                </div>
                <p class="text-[10px] text-slate-500 mt-1">${r.detail}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- MODULE 2: REFUND LIFECYCLE TRACKER (4 STAGES) -->
        <div class="p-4 bg-slate-50/90 rounded-2xl border border-slate-200">
          <h4 class="text-xs font-black text-[#002970] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span>🔄</span> <span>Refund & Reversal Lifecycle Journey</span>
          </h4>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            ${journey.map(j => `
              <div class="p-2.5 rounded-xl ${j.status === 'completed' ? 'bg-emerald-50 border border-emerald-300 text-emerald-900' : (j.status === 'active' ? 'bg-amber-50 border-2 border-amber-400 text-amber-900 shadow-sm animate-pulse' : 'bg-white border border-slate-200 text-slate-400')}">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-[10px] font-bold uppercase">Stage ${j.step}</span>
                  <span class="text-xs">${j.status === 'completed' ? '✓' : (j.status === 'active' ? '🔄' : '⏳')}</span>
                </div>
                <div class="text-xs font-bold">${j.title}</div>
                <div class="text-[10px] font-mono mt-0.5">${j.time}</div>
                <div class="text-[9px] mt-1 opacity-80">${j.desc || ''}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- MODULE 3: EVIDENCE BUNDLE & YOU.COM REGULATORY CITATIONS -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <!-- Evidence Bundle -->
          <div class="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs">
            <div class="flex items-center justify-between mb-2">
              <span class="font-black text-[#002970] flex items-center gap-1.5 uppercase text-[11px]">
                <span>🗂️</span> <span>Verified Evidence Bundle</span>
              </span>
              <span class="text-[10px] font-mono bg-blue-100 text-blue-900 px-2 py-0.5 rounded">SHA-256 Sealed</span>
            </div>
            <div class="space-y-1.5 font-mono text-[11px] text-slate-700">
              <div class="flex justify-between">
                <span class="text-slate-500">Receipt Ref:</span>
                <span class="font-bold text-[#002970]">${evidence.receipt_id || 'RCPT-PTM-10829'}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Bank UTR:</span>
                <span class="font-bold text-[#002970]">${evidence.utr || '432890182741'}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Terminal RRN:</span>
                <span class="font-bold text-[#002970]">${evidence.rrn || '9982019472'}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Audit Hash:</span>
                <span class="text-[9px] text-slate-400 truncate max-w-[140px]">${evidence.sha256 || 'e3b0c442...'}</span>
              </div>
            </div>
            <button onclick="paytm.showToast('📄 Downloaded Signed Evidence Receipt PDF', 'success', '🗂️')"
                    class="mt-3 w-full py-2 bg-white hover:bg-blue-100 text-[#002970] font-bold rounded-xl border border-blue-300 text-xs flex items-center justify-center gap-1.5 cursor-pointer">
              <span>📥</span> <span>Download Digital Proof Receipt</span>
            </button>
          </div>

          <!-- You.com Live Policy Verification -->
          <div class="p-3.5 bg-purple-50/70 rounded-2xl border border-purple-200 text-xs">
            <div class="flex items-center justify-between mb-1.5">
              <span class="font-black text-purple-900 flex items-center gap-1.5 uppercase text-[11px]">
                <span>🔍</span> <span>You.com Policy Research</span>
              </span>
              <span class="text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full font-mono">Live Cited</span>
            </div>
            <p class="italic text-slate-700 text-xs leading-relaxed">"${cit.snippet || 'Under NPCI Harmonisation Circular No. 81, failed UPI debits must be reversed within T+1 days with ₹100/day penalty for delay.'}"</p>
            <div class="mt-2 pt-2 border-t border-purple-200 flex items-center justify-between text-[10px]">
              <span class="text-slate-500 font-bold">${cit.source_title || 'NPCI Official Guidelines'}</span>
              <a href="${cit.url || 'https://www.npci.org.in'}" target="_blank" class="text-purple-700 font-black hover:underline">
                View Source Circular ↗
              </a>
            </div>
          </div>
        </div>

        <!-- MODULE 4: AUTOMATED FORMAL COMPLAINT BUILDER -->
        <div class="p-4 bg-slate-900 text-white rounded-2xl border border-slate-700">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-1.5">
              <span class="text-amber-400">📝</span>
              <span class="font-black text-xs uppercase tracking-wide text-amber-400">Automated Grievance Complaint Draft (Ready to File)</span>
            </div>
            <span class="text-[10px] text-slate-400 font-mono">RBI Ombudsman Compliant</span>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1.5">
            <div class="font-bold text-cyan-300">${draft.subject || 'Subject: Transaction Grievance'}</div>
            <div class="text-[10px] text-slate-400 whitespace-pre-wrap leading-relaxed max-h-28 overflow-y-auto">${draft.body || 'Draft body...'}</div>
          </div>

          <div class="mt-3 flex flex-col sm:flex-row items-center gap-2">
            <button onclick="navigator.clipboard.writeText('${(draft.body || '').replace(/\n/g, '\\n')}'); paytm.showToast('📋 Complaint Draft Copied to Clipboard!', 'success', '📝')"
                    class="interactive-btn w-full sm:flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-600 flex items-center justify-center gap-1.5 cursor-pointer">
              <span>📋</span> <span>Copy Complaint Draft</span>
            </button>
            <button onclick="paytm.showToast('🚀 Grievance Registered with Paytm Ombudsman (Ref: ${res.case_id})', 'success', '🛡️')"
                    class="interactive-btn w-full sm:flex-1 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer">
              <span>🚀</span> <span>File Official Escalation</span>
            </button>
          </div>
        </div>

        <!-- MODULE 5: NEXCONN CHAT SDK LIVE HUMAN SUPPORT -->
        <div class="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl border-2 border-emerald-300">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
              <span class="font-black text-xs uppercase text-emerald-950 tracking-wider">Nexconn Chat SDK Active (Singapore Cluster)</span>
            </div>
            <span class="text-[10px] font-mono bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded">AppKey: ${nex.app_key || 'm7ua80gbmcxrm'}</span>
          </div>

          <div class="flex items-center gap-3 my-2">
            <img src="${nex.assigned_agent?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop'}"
                 alt="Priya Sharma" class="w-10 h-10 rounded-full border-2 border-emerald-500 object-cover shrink-0 shadow-xs">
            <div>
              <div class="text-xs font-black text-slate-800">${nex.assigned_agent?.name || 'Priya Sharma (Senior Resolution Specialist)'}</div>
              <div class="text-[11px] text-emerald-700 font-medium">Online Now • Direct Session: <span class="font-mono font-bold">${nex.room_id || 'room_ptm_10829'}</span></div>
            </div>
          </div>

          <button onclick="window.agentEngine.openNexconnChatModal()"
                  class="interactive-btn mt-2.5 w-full py-3 px-4 rounded-xl font-black text-xs text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-[#00b9f1] hover:brightness-110 shadow-md flex items-center justify-center gap-2 cursor-pointer">
            <span>💬</span>
            <span>Open Real-Time Resolution Chat with Priya (Nexconn SDK)</span>
          </button>
        </div>

        <!-- Download Official Dispute Docket Button -->
        <button onclick="window.agentEngine.generateOfficialReceipt({
          id: '${caseId}',
          ref: '${caseRef}',
          title: '${caseTitle.replace(/'/g, "\\'")}',
          subtitle: 'Auto-reversal SLA: within 24h via NPCI Hub',
          amount: ${res.amount || 500},
          type: 'Dispute Investigation Docket',
          status: 'INVESTIGATING'
        })" class="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-[#002970] font-black text-xs border border-slate-300 flex items-center justify-center gap-2 cursor-pointer shadow-xs">
          <span>📄</span>
          <span>Download Official Dispute Docket & Investigation Report (PDF)</span>
        </button>

        ${this.renderSuggestedChips(data.suggested_replies)}
      </div>
    `;
  }

  // 3. Render Travel Mode (SerpApi Live Flights, IRCTC Trains, & Buses)
  renderTravelMode(data) {
    const opts = data.travel_data?.options || [];
    const fromCity = data.travel_data?.from_city || 'Pune';
    const toCity = data.travel_data?.to_city || 'Mumbai';
    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    const firstType = opts[0]?.type || 'Travel';
    const travelIcon = firstType === 'Bus' ? '🚌' : (firstType === 'Train' ? '🚆' : '✈️');
    const travelTitle = firstType === 'Bus' ? 'Paytm Bus Tickets (SerpApi Live)' : (firstType === 'Train' ? 'Paytm Trains & IRCTC' : 'Paytm Travel & Flights');

    container.innerHTML = `
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border border-blue-200 text-left animate-in fade-in duration-300">
        <div class="flex items-center justify-between mb-3 border-b pb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">${travelIcon}</div>
            <div>
              <h3 class="text-base sm:text-lg font-black text-[#002970]">${travelTitle}</h3>
              <span class="text-xs text-[#00b9f1] font-bold">${fromCity} ➔ ${toCity} • Live Timings & Fares</span>
            </div>
          </div>
          <span class="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">100% Refund Shield</span>
        </div>

        <p class="text-xs sm:text-sm text-slate-800 font-medium mb-3">${data.ai_message}</p>

        <!-- Interactive Filter Tabs -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none text-xs font-bold">
          <button onclick="window.agentEngine.filterTravelCards('all', this)" class="travel-filter-btn px-3 py-1 rounded-full bg-[#002970] text-white shadow-2xs shrink-0 cursor-pointer">All Options (${opts.length})</button>
          <button onclick="window.agentEngine.filterTravelCards('Bus', this)" class="travel-filter-btn px-3 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 shrink-0 cursor-pointer">🚌 Buses Only</button>
          <button onclick="window.agentEngine.filterTravelCards('Flight', this)" class="travel-filter-btn px-3 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 shrink-0 cursor-pointer">✈️ Flights Only</button>
          <button onclick="window.agentEngine.filterTravelCards('Train', this)" class="travel-filter-btn px-3 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 shrink-0 cursor-pointer">🚆 Trains Only</button>
        </div>

        <!-- Travel Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          ${opts.map((o, idx) => `
            <div data-type="${o.type}" class="travel-card-item p-3.5 bg-slate-50/90 hover:bg-white rounded-2xl border-2 ${idx === 0 ? 'border-[#002970] shadow-md ring-2 ring-blue-200' : 'border-slate-200 hover:border-[#00b9f1]'} flex flex-col justify-between transition-all">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">${o.type === 'Flight' ? '✈️ Flight' : (o.type === 'Train' ? '🚆 Train' : '🚌 Bus')}</span>
                  <span class="text-base font-black text-[#002970]">₹${o.price}</span>
                </div>
                <div class="font-black text-sm text-[#002970] mt-1">${o.name}</div>
                <div class="text-xs text-slate-600 font-medium mt-1">
                  🕒 <strong>${o.dep_time || o.time}</strong> ➔ ${o.arr_time || ''} <span class="text-slate-400">(${o.duration || 'Fastest'})</span>
                </div>
                <div class="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                  <span>✓</span> <span>${o.seats}</span>
                </div>
                <div class="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded mt-2 inline-block">${o.badge}</div>
              </div>
              <button onclick="window.agentEngine.openPinModal(${o.price}, '${o.name} (${fromCity}-${toCity})', '${o.dep_time || 'Confirmed Ticket'}')"
                      class="interactive-btn mt-3 w-full py-2.5 bg-gradient-to-r from-[#002970] to-[#00b9f1] text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer">
                <span>Book Now ₹${o.price}</span>
              </button>
            </div>
          `).join('')}
        </div>

        ${this.renderSuggestedChips(data.suggested_replies)}
      </div>
    `;
  }

  // 3B. Render Hotel Mode (SerpApi Budget Hotels Near Airport)
  renderHotelMode(data) {
    const hotels = data.hotel_data?.hotels || [];
    const city = data.hotel_data?.city || 'Mumbai';
    const loc = data.hotel_data?.location || 'Airport';
    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    container.innerHTML = `
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border-2 border-emerald-300 text-left animate-in fade-in duration-300">
        <div class="flex items-center justify-between mb-3 border-b border-emerald-100 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl">🏨</div>
            <div>
              <h3 class="text-base sm:text-lg font-black text-[#002970]">Paytm Hotels & Stays (SerpApi Verified)</h3>
              <span class="text-xs text-emerald-700 font-bold">Best Budget Hotels near ${city} ${loc}</span>
            </div>
          </div>
          <span class="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">Pay at Hotel Option</span>
        </div>

        <p class="text-xs sm:text-sm text-slate-800 font-medium mb-4">${data.ai_message}</p>

        <!-- Hotels Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          ${hotels.map((h, idx) => `
            <div class="p-4 bg-slate-50/90 hover:bg-white rounded-2xl border-2 ${idx === 0 ? 'border-emerald-600 shadow-md ring-2 ring-emerald-200' : 'border-slate-200 hover:border-emerald-400'} flex flex-col justify-between transition-all text-left">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">${h.badge}</span>
                  <span class="text-xl font-black text-[#002970]">₹${h.price} <span class="text-xs font-normal text-slate-400">/ night</span></span>
                </div>
                <div class="font-black text-sm text-[#002970] mt-1">${h.name}</div>
                <div class="text-xs text-slate-500 font-medium mt-0.5">📍 ${h.location} • <strong class="text-amber-600">${h.rating}</strong></div>
                
                <div class="flex flex-wrap gap-1 mt-2.5">
                  ${(h.amenities || []).map(a => `
                    <span class="text-[10px] font-semibold bg-white text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">${a}</span>
                  `).join('')}
                </div>
              </div>

              <button onclick="window.agentEngine.openPinModal(${h.price}, '${h.name} (Hotel Room Booking)', '${h.location}')"
                      class="interactive-btn mt-3.5 w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer">
                <span>🏨</span>
                <span>Book Room ₹${h.price} via Paytm UPI</span>
              </button>
            </div>
          `).join('')}
        </div>

        ${this.renderSuggestedChips(data.suggested_replies)}
      </div>
    `;
  }

  // 3C. Render Shopping Mode (Paytm Deals & Mall Discounts)
  renderShoppingMode(data) {
    const deals = data.shopping_data?.deals || [];
    const city = data.shopping_data?.city || 'Pune';
    const liveMatches = data.shopping_data?.live_matches || [];
    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    container.innerHTML = `
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border-2 border-pink-300 text-left animate-in fade-in duration-300">
        <div class="flex items-center justify-between mb-3 border-b border-pink-100 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-2xl">🛍️</div>
            <div>
              <h3 class="text-base sm:text-lg font-black text-[#002970]">Paytm Shopping Deals & Cashback</h3>
              <span class="text-xs text-pink-700 font-bold">Top Verified Offers & Mall Discounts in ${city}</span>
            </div>
          </div>
          <span class="text-xs font-bold bg-pink-100 text-pink-800 px-3 py-1 rounded-full">Paytm UPI Offers</span>
        </div>

        <p class="text-xs sm:text-sm text-slate-800 font-medium mb-3">${data.ai_message}</p>

        <!-- Interactive Category Filter Tabs -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none text-xs font-bold">
          <button onclick="window.agentEngine.filterShoppingCards('all', this)" class="shop-filter-btn px-3 py-1 rounded-full bg-pink-600 text-white shadow-2xs shrink-0 cursor-pointer">All Offers (${deals.length})</button>
          <button onclick="window.agentEngine.filterShoppingCards('Electronics', this)" class="shop-filter-btn px-3 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 shrink-0 cursor-pointer">📱 Electronics</button>
          <button onclick="window.agentEngine.filterShoppingCards('Clothing', this)" class="shop-filter-btn px-3 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 shrink-0 cursor-pointer">👗 Fashion & Malls</button>
          <button onclick="window.agentEngine.filterShoppingCards('Dining', this)" class="shop-filter-btn px-3 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 shrink-0 cursor-pointer">🍔 Food 50% Off</button>
          <button onclick="window.agentEngine.filterShoppingCards('Grocery', this)" class="shop-filter-btn px-3 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 shrink-0 cursor-pointer">🏪 Kirana 5% Back</button>
        </div>

        <!-- Live Web SerpApi Matches -->
        ${liveMatches.length > 0 ? `
          <div class="mb-4 p-3 bg-pink-50/70 rounded-xl border border-pink-200">
            <div class="text-[10px] uppercase font-bold text-pink-800 mb-1 flex items-center gap-1">
              <span>🔍</span> <span>SerpApi Live Google Shopping Insights (${city})</span>
            </div>
            <div class="space-y-1">
              ${liveMatches.map(m => `
                <div class="text-xs text-slate-700 flex items-start gap-1.5">
                  <span class="text-pink-600 font-bold">•</span>
                  <span class="truncate font-medium">${m.title} - <span class="text-slate-500 text-[11px]">${m.snippet}</span></span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Deals Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          ${deals.map((d, idx) => `
            <div data-category="${d.category}" class="shopping-card-item p-4 bg-slate-50/90 hover:bg-white rounded-2xl border-2 ${idx === 0 ? 'border-pink-500 shadow-md ring-2 ring-pink-100' : 'border-slate-200 hover:border-pink-300'} flex flex-col justify-between transition-all text-left">
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-[11px] font-bold bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full">${d.badge}</span>
                  <span class="text-xs font-mono font-bold text-slate-400">${d.rating}</span>
                </div>
                <div class="font-black text-base text-[#002970]">${d.brand}</div>
                <div class="text-xs text-slate-500 font-medium mt-0.5">📍 ${d.mall}</div>
                
                <div class="mt-2.5 p-2.5 bg-white rounded-xl border border-pink-100">
                  <div class="text-xs font-black text-pink-600">${d.discount}</div>
                  <div class="text-[11px] text-slate-600 mt-0.5">${d.title}</div>
                  <div class="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>${d.min_purchase}</span>
                    <span class="font-mono font-bold text-[#002970] bg-slate-100 px-1.5 py-0.5 rounded">CODE: ${d.code}</span>
                  </div>
                </div>
              </div>

              <button onclick="window.agentEngine.openPinModal(100, '${d.brand} (${d.code})', '${d.mall}')"
                      class="interactive-btn mt-3.5 w-full py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer">
                <span>🎁</span>
                <span>Claim Offer with Paytm UPI</span>
              </button>
            </div>
          `).join('')}
        </div>

        ${this.renderSuggestedChips(data.suggested_replies)}
      </div>
    `;
  }

  // 3D. Render Movie Mode (Paytm Movies & Multiplex Entertainment)
  renderMovieMode(data) {
    const movies = data.movie_data?.movies || [];
    const city = data.movie_data?.city || 'Pune';
    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    container.innerHTML = `
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border-2 border-indigo-300 text-left animate-in fade-in duration-300">
        <div class="flex items-center justify-between mb-3 border-b border-indigo-100 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-2xl">🎬</div>
            <div>
              <h3 class="text-base sm:text-lg font-black text-[#002970]">Paytm Movies & Multiplexes</h3>
              <span class="text-xs text-indigo-700 font-bold">Now Showing in Theatres (${city})</span>
            </div>
          </div>
          <span class="text-xs font-bold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">Instant M-Ticket</span>
        </div>

        <p class="text-xs sm:text-sm text-slate-800 font-medium mb-4">${data.ai_message}</p>

        <!-- Movies Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          ${movies.map((m, idx) => `
            <div class="p-4 bg-slate-50/90 hover:bg-white rounded-2xl border-2 ${idx === 0 ? 'border-indigo-600 shadow-md ring-2 ring-indigo-100' : 'border-slate-200 hover:border-indigo-300'} flex flex-col justify-between transition-all text-left">
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-[11px] font-bold bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-full">${m.badge}</span>
                  <span class="text-lg font-black text-[#002970]">₹${m.price}</span>
                </div>
                <div class="font-black text-base text-[#002970]">${m.title}</div>
                <div class="text-xs text-slate-500 font-medium mt-0.5">🏛️ ${m.theatre}</div>
                <div class="text-[11px] text-slate-400 font-semibold mt-0.5">🗣️ ${m.language} • <span class="text-emerald-600 font-bold">${m.seats}</span></div>

                <div class="flex flex-wrap gap-1.5 mt-3">
                  ${(m.times || []).map(t => `
                    <span class="text-xs font-mono font-bold bg-white text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-200">${t}</span>
                  `).join('')}
                </div>
              </div>

              <button onclick="window.agentEngine.openPinModal(${m.price}, '${m.title} (Movie Ticket)', '${m.theatre}')"
                      class="interactive-btn mt-3.5 w-full py-2.5 bg-gradient-to-r from-indigo-600 to-[#002970] text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer">
                <span>🎟️</span>
                <span>Book Ticket ₹${m.price} via Paytm UPI</span>
              </button>
            </div>
          `).join('')}
        </div>

        ${this.renderSuggestedChips(data.suggested_replies)}
      </div>
    `;
  }

  // 4. Render Electricity Bill Mode
  renderElectricityMode(data) {
    const s = data.service_data || {};
    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    container.innerHTML = `
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border-2 border-amber-300 text-left animate-in fade-in duration-300">
        <div class="flex items-center justify-between border-b border-amber-100 pb-3 mb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-2xl">⚡</div>
            <div>
              <h3 class="text-base sm:text-lg font-black text-[#002970]">Electricity Bill (BBPS Verified)</h3>
              <span class="text-xs text-amber-700 font-bold">${s.board}</span>
            </div>
          </div>
          <span class="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">Bharat BillPay</span>
        </div>

        <p class="text-xs sm:text-sm text-slate-800 font-medium mb-4">${data.ai_message}</p>

        <div class="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div class="text-[11px] font-bold text-slate-400 uppercase">Consumer Information</div>
            <div class="text-sm font-black text-[#002970]">${s.consumer_name}</div>
            <div class="text-xs text-slate-600">CA Number: <span class="font-mono font-bold">${s.consumer_id}</span></div>
          </div>
          <div class="text-left sm:text-right">
            <div class="text-3xl font-black text-[#002970]">₹${s.bill_amount}</div>
            <div class="text-xs font-bold text-red-600">Due Date: ${s.due_date}</div>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5 text-center">
          <div class="bg-white p-2.5 rounded-xl border border-slate-200">
            <span class="text-[10px] text-slate-400 font-bold block uppercase">Units</span>
            <span class="text-sm font-black text-[#002970]">${s.units}</span>
          </div>
          <div class="bg-white p-2.5 rounded-xl border border-slate-200">
            <span class="text-[10px] text-slate-400 font-bold block uppercase">Billing Period</span>
            <span class="text-sm font-black text-[#002970]">Current Month</span>
          </div>
          <div class="bg-white p-2.5 rounded-xl border border-slate-200">
            <span class="text-[10px] text-slate-400 font-bold block uppercase">Penalty</span>
            <span class="text-sm font-black text-emerald-600">₹0 (On Time)</span>
          </div>
          <div class="bg-white p-2.5 rounded-xl border border-slate-200">
            <span class="text-[10px] text-slate-400 font-bold block uppercase">Cashback</span>
            <span class="text-sm font-black text-emerald-600">₹50 Flat</span>
          </div>
        </div>

        <button onclick="window.agentEngine.openPinModal(${s.bill_amount}, 'Mahavitaran Electricity Bill (CA: ${s.consumer_id})', 'Due Date: ${s.due_date}')"
                class="interactive-btn w-full py-3.5 px-6 rounded-xl font-black text-sm text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:brightness-110 shadow-lg shadow-amber-900/25 flex items-center justify-center gap-2 cursor-pointer">
          <span>⚡</span>
          <span>Pay Electricity Bill ₹${s.bill_amount} via Paytm UPI</span>
        </button>
      </div>
    `;
  }

  // 5. Render FASTag Toll Mode
  renderFastagMode(data) {
    const s = data.service_data || {};
    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    container.innerHTML = `
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border-2 border-sky-300 text-left animate-in fade-in duration-300">
        <div class="flex items-center justify-between border-b border-sky-100 pb-3 mb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-2xl">🚗</div>
            <div>
              <h3 class="text-base sm:text-lg font-black text-[#002970]">NETC NHAI FASTag Recharge</h3>
              <span class="text-xs text-sky-700 font-bold">Vehicle: ${s.vehicle_no}</span>
            </div>
          </div>
          <span class="text-xs font-bold bg-sky-100 text-sky-800 px-3 py-1 rounded-full">NETC Certified</span>
        </div>

        <p class="text-xs sm:text-sm text-slate-800 font-medium mb-4">${data.ai_message}</p>

        <div class="bg-sky-50/60 rounded-2xl p-4 border border-sky-200/80 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div class="text-[11px] font-bold text-slate-400 uppercase">Registered Vehicle</div>
            <div class="text-lg font-black text-[#002970]">${s.vehicle_no}</div>
            <div class="text-xs text-slate-600">Issuer: <strong>${s.issuer}</strong></div>
          </div>
          <div class="text-left sm:text-right">
            <div class="text-xs font-bold text-red-600">Current Balance: ₹${s.current_balance}</div>
            <div class="text-2xl font-black text-emerald-600">Top-up: ₹${s.recharge_amount}</div>
          </div>
        </div>

        <!-- Quick Top-up Pills -->
        <div class="mb-4">
          <span class="text-[11px] font-bold text-slate-500 uppercase block mb-1.5">Select Top-up Amount:</span>
          <div class="grid grid-cols-4 gap-2">
            ${(s.quick_amounts || [300, 500, 1000, 2000]).map(amt => `
              <button onclick="window.agentEngine.updateFastagAmount(${amt})"
                      class="py-2 rounded-xl border ${amt === s.recharge_amount ? 'border-2 border-[#002970] bg-[#002970] text-white font-bold' : 'border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50'} text-xs">
                ₹${amt}
              </button>
            `).join('')}
          </div>
        </div>

        <button onclick="window.agentEngine.openPinModal(${s.recharge_amount}, 'FASTag Recharge (${s.vehicle_no})', 'NETC NHAI Toll Pass')"
                class="interactive-btn w-full py-3.5 px-6 rounded-xl font-black text-sm text-white bg-gradient-to-r from-sky-600 to-blue-700 hover:brightness-110 shadow-lg shadow-sky-900/25 flex items-center justify-center gap-2 cursor-pointer">
          <span>🚗</span>
          <span>Recharge FASTag ₹${s.recharge_amount} via Paytm UPI</span>
        </button>
      </div>
    `;
  }

  updateFastagAmount(amt) {
    paytm.playSound('click');
    if (this.currentData && this.currentData.service_data) {
      this.currentData.service_data.recharge_amount = amt;
      this.renderFastagMode(this.currentData);
    }
  }

  // 6. Render DTH Recharge Mode
  renderDthMode(data) {
    const s = data.service_data || {};
    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    container.innerHTML = `
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border-2 border-indigo-300 text-left animate-in fade-in duration-300">
        <div class="flex items-center justify-between border-b border-indigo-100 pb-3 mb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-2xl">📡</div>
            <div>
              <h3 class="text-base sm:text-lg font-black text-[#002970]">DTH Entertainment Recharge</h3>
              <span class="text-xs text-indigo-700 font-bold">${s.operator} • ID: ${s.subscriber_id}</span>
            </div>
          </div>
          <span class="text-xs font-bold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">Instant Activation</span>
        </div>

        <p class="text-xs sm:text-sm text-slate-800 font-medium mb-4">${data.ai_message}</p>

        <div class="bg-indigo-50/60 rounded-2xl p-4 border border-indigo-200/80 mb-4 flex justify-between items-center">
          <div>
            <div class="text-base font-black text-[#002970]">${s.pack_name}</div>
            <div class="text-xs text-slate-600 mt-1">${s.channels} • ${s.validity}</div>
            <div class="text-[11px] font-bold text-emerald-600 mt-1">🎁 ${s.cashback}</div>
          </div>
          <div class="text-right">
            <div class="text-3xl font-black text-[#002970]">₹${s.price}</div>
            <div class="text-xs text-slate-400">${s.validity}</div>
          </div>
        </div>

        <button onclick="window.agentEngine.openPinModal(${s.price}, '${s.operator} DTH Pack (#${s.subscriber_id})', '${s.validity}')"
                class="interactive-btn w-full py-3.5 px-6 rounded-xl font-black text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 shadow-lg shadow-indigo-900/25 flex items-center justify-center gap-2 cursor-pointer">
          <span>📡</span>
          <span>Recharge DTH ₹${s.price} via Paytm UPI</span>
        </button>
      </div>
    `;
  }

  // 7. Render Merchant & Soundbox Mode
  renderMerchantMode(data) {
    const s = data.service_data || {};
    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    container.innerHTML = `
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border-2 border-emerald-300 text-left animate-in fade-in duration-300">
        <div class="flex items-center justify-between border-b border-emerald-100 pb-3 mb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl">🏪</div>
            <div>
              <h3 class="text-base sm:text-lg font-black text-[#002970]">${s.merchant_name}</h3>
              <span class="text-xs text-emerald-700 font-bold">UPI: ${s.merchant_upi} • Paytm Verified</span>
            </div>
          </div>
          <span class="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">Paytm Merchant</span>
        </div>

        <p class="text-xs sm:text-sm text-slate-800 font-medium mb-4">${data.ai_message}</p>

        <!-- Soundbox Simulation Box -->
        <div class="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 rounded-2xl p-4 border border-emerald-200 mb-4">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-xs font-black text-[#002970]">${s.device}</span>
            </div>
            <button onclick="window.agentEngine.triggerSoundboxAudio('${data.language === 'mr' ? s.soundbox_prompt_mr : s.soundbox_prompt}')"
                    class="interactive-btn text-xs font-bold bg-white text-emerald-700 border border-emerald-300 px-3 py-1 rounded-lg hover:bg-emerald-50 flex items-center gap-1 shadow-xs cursor-pointer">
              <span>🔊</span> Test Soundbox Audio
            </button>
          </div>
          <p class="text-xs text-slate-600 italic">"Paytm Soundbox will announce payment instantly in Hindi & Marathi"</p>
        </div>

        <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4 flex justify-between items-center">
          <div>
            <span class="text-xs text-slate-400 uppercase font-bold block">Amount to Pay</span>
            <span class="text-3xl font-black text-[#002970]">₹${s.amount}</span>
          </div>
          <span class="text-xs font-bold bg-blue-100 text-blue-900 px-3 py-1.5 rounded-xl">0% UPI Fee</span>
        </div>

        <button onclick="window.agentEngine.openPinModal(${s.amount}, '${s.merchant_name} (Merchant QR)', 'Instant Soundbox Audio')"
                class="interactive-btn w-full py-3.5 px-6 rounded-xl font-black text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:brightness-110 shadow-lg shadow-emerald-900/25 flex items-center justify-center gap-2 cursor-pointer">
          <span>✅</span>
          <span>Pay ₹${s.amount} to Merchant via Paytm UPI</span>
        </button>
      </div>
    `;
  }

  triggerSoundboxAudio(text) {
    paytm.playSound('paytm_success');
    setTimeout(() => {
      paytm.speakTextFallback(text);
      paytm.showToast(`🔊 Soundbox: "${text}"`, 'success', '📢');
    }, 400);
  }

  // 8. Render Paytm 24K Digital Gold Mode
  renderGoldMode(data) {
    const s = data.service_data || {};
    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    container.innerHTML = `
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border-2 border-yellow-400 text-left animate-in fade-in duration-300">
        <div class="flex items-center justify-between border-b border-yellow-100 pb-3 mb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-2xl">🪙</div>
            <div>
              <h3 class="text-base sm:text-lg font-black text-[#002970]">Paytm 24K Digital Gold (99.99% Pure)</h3>
              <span class="text-xs text-yellow-800 font-bold">Live Rate: ₹${s.gold_price_per_gm}/gm • MMTC-PAMP Certified</span>
            </div>
          </div>
          <span class="text-xs font-bold bg-yellow-100 text-yellow-900 px-3 py-1 rounded-full">100% Insured</span>
        </div>

        <p class="text-xs sm:text-sm text-slate-800 font-medium mb-4">${data.ai_message}</p>

        <div class="bg-yellow-50/70 rounded-2xl p-4 border border-yellow-200 mb-4 flex justify-between items-center">
          <div>
            <div class="text-[11px] font-bold text-slate-400 uppercase">Allocated Gold Weight</div>
            <div class="text-2xl font-black text-[#002970]">${s.gold_grams} Grams</div>
            <div class="text-xs text-slate-600 mt-1">${s.vault}</div>
          </div>
          <div class="text-right">
            <div class="text-[11px] font-bold text-slate-400 uppercase">Investment Amount</div>
            <div class="text-3xl font-black text-[#002970]">₹${s.purchase_amount}</div>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 text-center text-xs font-bold mb-4">
          <div class="bg-white p-2 rounded-xl border border-slate-200">24K 999.9 Pure</div>
          <div class="bg-white p-2 rounded-xl border border-slate-200">0% Making Charges</div>
          <div class="bg-white p-2 rounded-xl border border-slate-200">Sell Anytime 24x7</div>
        </div>

        <button onclick="window.agentEngine.openPinModal(${s.purchase_amount}, 'Paytm 24K Digital Gold (${s.gold_grams}g)', 'MMTC-PAMP Insured Vault')"
                class="interactive-btn w-full py-3.5 px-6 rounded-xl font-black text-sm text-white bg-gradient-to-r from-yellow-600 to-amber-700 hover:brightness-110 shadow-lg shadow-yellow-900/25 flex items-center justify-center gap-2 cursor-pointer">
          <span>🪙</span>
          <span>Invest ₹${s.purchase_amount} in 24K Gold via Paytm UPI</span>
        </button>
      </div>
    `;
  }

  // 9. Render Smart Money Intelligence (Expense Analytics)
  renderExpenseMode(data) {
    const s = data.service_data || {};
    const categories = s.categories || [];
    const recurring = s.recurring_bills || [];
    const tip = s.savings_tip || {};
    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    container.innerHTML = `
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border-2 border-emerald-400 text-left animate-in fade-in duration-300">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-emerald-100 pb-3 mb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl shadow-xs">📊</div>
            <div>
              <h3 class="text-base sm:text-lg font-black text-[#002970]">Paytm Smart Money Intelligence</h3>
              <span class="text-xs text-emerald-800 font-bold">Autonomous Expense Patterns & Savings Advisor • ${s.month || 'November 2026'}</span>
            </div>
          </div>
          <span class="text-xs font-black bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full">AI Verified</span>
        </div>

        <!-- AI Spoken Finding -->
        <div class="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 rounded-2xl border border-emerald-200 mb-4 flex items-center justify-between gap-3">
          <div class="flex items-start gap-2.5">
            <span class="text-xl">🤖</span>
            <p class="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">${data.ai_message}</p>
          </div>
          <button onclick="paytm.replayAudio()" class="sarvam-voice-btn shrink-0 px-2.5 py-1.5 bg-white text-emerald-700 text-xs font-bold rounded-xl border border-emerald-300 hover:bg-emerald-50 shadow-xs cursor-pointer flex items-center gap-1.5 transition-all">
            <span class="speaker-icon">🔊</span> <span>आवाज ऐका</span>
          </button>
        </div>

        <!-- Total Spend Banner -->
        <div class="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 mb-4 shadow-lg border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span class="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">Total Monthly Outflow (Verified UPI & Bills)</span>
            <div class="text-3xl font-black text-white mt-0.5">₹${(s.total_spent || 14850).toLocaleString('en-IN')}</div>
            <div class="text-xs text-slate-400 mt-1">Across 38 payments • ₹480 below monthly planned budget</div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="paytm.showToast('📄 Passbook Detailed Statement Downloaded', 'success', '📑')" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer flex items-center gap-1.5">
              <span>📑</span> <span>Download Statement</span>
            </button>
          </div>
        </div>

        <!-- Category Progress Bars -->
        <div class="mb-4">
          <h4 class="text-xs font-black text-[#002970] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <span>📊</span> <span>Category-Wise Outflow Breakdown</span>
          </h4>
          <div class="space-y-2.5">
            ${categories.map(c => `
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div class="flex justify-between items-center text-xs font-bold mb-1">
                  <div class="flex items-center gap-2">
                    <span class="text-base">${c.icon}</span>
                    <span class="text-slate-800">${data.language === 'mr' ? (c.name_mr || c.name) : c.name}</span>
                  </div>
                  <div class="font-mono text-[#002970]">
                    ₹${c.amount.toLocaleString('en-IN')} <span class="text-slate-400 text-[10px]">(${c.percent}%)</span>
                  </div>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div class="bg-gradient-to-r from-[#002970] to-[#00b9f1] h-2 rounded-full" style="width: ${c.percent}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Recurring Bills & Subscriptions -->
        <div class="mb-4 p-4 bg-sky-50/70 rounded-2xl border border-sky-200">
          <h4 class="text-xs font-black text-[#002970] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <span>🔄</span> <span>Upcoming Detected Recurring Payments</span>
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            ${recurring.map(r => `
              <div class="p-2.5 bg-white rounded-xl border border-sky-100 flex justify-between items-center">
                <div>
                  <div class="text-xs font-bold text-slate-800">${r.name}</div>
                  <div class="text-[10px] text-amber-700 font-semibold">${r.due}</div>
                </div>
                <div class="text-right">
                  <div class="text-xs font-black text-[#002970]">₹${r.amount}</div>
                  <button onclick="window.agentEngine.processQuery('${r.name} pay')" class="text-[10px] text-[#00b9f1] font-bold hover:underline cursor-pointer">Pay ➔</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- AI Savings Recommendation Box -->
        <div class="p-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 rounded-2xl border border-emerald-300 flex items-center justify-between gap-3">
          <div class="flex items-start gap-2.5">
            <span class="text-2xl">💡</span>
            <div>
              <div class="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                <span>${data.language === 'mr' ? (tip.title_mr || tip.title) : tip.title}</span>
                <span class="bg-emerald-200 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full">Save ₹${tip.saving_amount || 580}</span>
              </div>
              <p class="text-xs text-slate-700 mt-1 leading-relaxed">${tip.desc || 'Link your RuPay Credit Card to Paytm UPI to save on monthly bills.'}</p>
            </div>
          </div>
          <button onclick="paytm.showToast('🎉 RuPay 5% Cashback Benefits Activated!', 'success', '💳')" class="shrink-0 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer">
            Activate
          </button>
        </div>
      </div>
    `;
  }

  // 10. Render Merchant Intelligence (Soundbox Collections & Settlement)
  renderMerchantSummaryMode(data) {
    const s = data.service_data || {};
    const payments = s.recent_payments || [];
    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    container.innerHTML = `
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-xl border-2 border-cyan-400 text-left animate-in fade-in duration-300">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-cyan-100 pb-3 mb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center text-2xl shadow-xs">🏪</div>
            <div>
              <h3 class="text-base sm:text-lg font-black text-[#002970]">${s.store_name || 'Paytm Merchant Dashboard'}</h3>
              <span class="text-xs text-cyan-800 font-bold">${s.soundbox_device || 'Paytm Soundbox 4G Pro'}</span>
            </div>
          </div>
          <span class="text-xs font-black bg-cyan-100 text-cyan-900 px-3 py-1 rounded-full">Live Terminal</span>
        </div>

        <!-- AI Audio Greeting -->
        <div class="p-3.5 bg-gradient-to-r from-cyan-50 via-sky-50 to-blue-50 rounded-2xl border border-cyan-200 mb-4 flex items-center justify-between gap-3">
          <div class="flex items-start gap-2.5">
            <span class="text-xl">🤖</span>
            <p class="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">${data.ai_message}</p>
          </div>
          <button onclick="paytm.replayAudio()" class="sarvam-voice-btn shrink-0 px-2.5 py-1.5 bg-white text-cyan-800 text-xs font-bold rounded-xl border border-cyan-300 hover:bg-cyan-50 shadow-xs cursor-pointer flex items-center gap-1.5 transition-all">
            <span class="speaker-icon">🔊</span> <span>आवाज ऐका</span>
          </button>
        </div>

        <!-- Live Metrics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <!-- Total Collections -->
          <div class="p-4 bg-slate-900 text-white rounded-2xl shadow-md border border-slate-800">
            <span class="text-[10px] font-mono uppercase text-cyan-400 font-bold">Today's Collections</span>
            <div class="text-3xl font-black text-white mt-1">₹${(s.today_total || 8450).toLocaleString('en-IN')}</div>
            <div class="text-[11px] text-slate-400 mt-1">${s.tx_count || 42} Customer Payments via QR</div>
          </div>

          <!-- Settled to Bank -->
          <div class="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <span class="text-[10px] font-bold uppercase text-emerald-800">Settled into Bank</span>
            <div class="text-2xl font-black text-emerald-900 mt-1">₹${(s.settled_amount || 7950).toLocaleString('en-IN')}</div>
            <div class="text-[11px] text-emerald-700 mt-1">Direct to ${s.settlement_bank || 'HDFC Bank'}</div>
          </div>

          <!-- Pending Settlement -->
          <div class="p-4 bg-amber-50 rounded-2xl border border-amber-200">
            <span class="text-[10px] font-bold uppercase text-amber-800">Pending Settlement</span>
            <div class="text-2xl font-black text-amber-900 mt-1">₹${(s.pending_amount || 500).toLocaleString('en-IN')}</div>
            <div class="text-[11px] text-amber-700 mt-1">${s.next_settlement || 'Auto-settle 11:00 PM'}</div>
          </div>
        </div>

        <!-- Recent Payments Table -->
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-4">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-xs font-black text-[#002970] uppercase tracking-wider flex items-center gap-1.5">
              <span>🧾</span> <span>Live In-Store Soundbox Payments</span>
            </h4>
            <span class="text-[10px] font-mono text-slate-500">Peak: ${s.peak_hours || '07:00 PM – 09:00 PM'}</span>
          </div>

          <div class="space-y-2 font-mono text-xs">
            ${payments.map(p => `
              <div class="p-2.5 bg-white rounded-xl border border-slate-200 flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] text-slate-400">${p.time}</span>
                  <span class="font-bold text-slate-800">${p.customer}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-black text-[#002970]">₹${p.amount}</span>
                  <span class="text-[10px] font-bold ${p.status === 'Success' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'} px-2 py-0.5 rounded-full">
                    ${p.status}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Action Controls -->
        <div class="flex flex-col sm:flex-row gap-2">
          <button onclick="window.agentEngine.triggerSoundboxAudio('पेटीएम पर 299 रुपये प्राप्त हुए')" class="flex-1 py-3 px-4 bg-gradient-to-r from-[#002970] to-[#00b9f1] text-white font-bold text-xs rounded-xl hover:brightness-110 shadow-xs flex items-center justify-center gap-2 cursor-pointer">
            <span>🔊</span> <span>Test Latest Soundbox Voice Announcement</span>
          </button>
          <button onclick="paytm.showToast('📑 Merchant Daily Tax Report PDF Downloaded', 'success', '📄')" class="py-3 px-4 bg-white border border-slate-300 text-slate-800 font-bold text-xs rounded-xl hover:bg-slate-100 shadow-xs flex items-center justify-center gap-2 cursor-pointer">
            <span>📄</span> <span>Export Daily Ledger</span>
          </button>
        </div>

        <!-- Launch AstraVoice POS Banner -->
        <div class="mt-3 p-3 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-blue-500/15 rounded-xl border border-emerald-300 flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="text-xl">🌾</span>
            <div>
              <div class="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                <span>AstraVoice — Paytm Business AI & Voice POS</span>
                <span class="text-[9px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.5 rounded">Live Teammate</span>
              </div>
              <div class="text-[10px] text-slate-600">Voice Billing • Handwritten Chitti Scan • 60 FPS AG Grid Ledger</div>
            </div>
          </div>
          <a href="https://astravoice-pos.vercel.app" target="_blank" rel="noopener noreferrer"
             onclick="paytm.playSound('chime'); paytm.showToast('🚀 Opening AstraVoice POS...', 'ai', '🌾')"
             class="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:brightness-110 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1">
            <span>Launch POS</span> <span>➔</span>
          </a>
        </div>
      </div>
    `;
  }

  // 4. PIN & Payment Flow
  openPinModal(amount, operator, validity) {
    paytm.playSound('click');
    const modal = document.getElementById('upi-pin-modal');
    if (!modal) return;

    this.lastPaidAmount = amount;
    this.lastPaidTitle = operator || 'Paytm Super Service';
    this.lastPaidSubtitle = validity || 'Instant Confirmation';

    document.getElementById('modal-pay-amount').textContent = `₹${amount}`;
    document.getElementById('modal-operator-name').textContent = `${this.lastPaidTitle} • ${this.lastPaidSubtitle}`;
    
    this.enteredPin = '';
    this.updatePinDisplay();

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  closePinModal() {
    const modal = document.getElementById('upi-pin-modal');
    if (!modal) return;
    paytm.playSound('click');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  handlePinKeypad(digit) {
    if (!this.enteredPin) this.enteredPin = '';
    paytm.playSound('keypad');

    if (digit === 'back') {
      this.enteredPin = this.enteredPin.slice(0, -1);
    } else if (this.enteredPin.length < 4) {
      this.enteredPin += digit;
    }

    this.updatePinDisplay();

    if (this.enteredPin.length === 4) {
      setTimeout(() => this.executeRechargePayment(), 250);
    }
  }

  updatePinDisplay() {
    const dots = document.querySelectorAll('.pin-dot');
    dots.forEach((dot, idx) => {
      if (this.enteredPin && idx < this.enteredPin.length) {
        dot.classList.add('bg-[#002970]', 'scale-110');
        dot.classList.remove('bg-slate-200');
      } else {
        dot.classList.remove('bg-[#002970]', 'scale-110');
        dot.classList.add('bg-slate-200');
      }
    });
  }

  executeRechargePayment() {
    this.closePinModal();
    paytm.showToast('Connecting to NPCI & Service Gateway...', 'ai', '🔄');

    setTimeout(() => {
      paytm.playSound('paytm_success');
      this.renderSuccessReceipt();
    }, 1200);
  }

  renderSuccessReceipt() {
    const container = document.getElementById('workspace-dynamic-content');
    if (!container) return;

    const txnId = 'PTM' + Math.floor(100000000 + Math.random() * 900000000);
    const opRef = 'NPCI' + Math.floor(10000000 + Math.random() * 90000000);
    const amount = this.lastPaidAmount || (this.activePlan ? this.activePlan.price : 299);
    const title = this.lastPaidTitle || 'Paytm Order';
    const subtitle = this.lastPaidSubtitle || 'Instant Confirmation';

    // 1. Save to Persistent Activity History
    this.saveToActivity({
      id: txnId,
      ref: opRef,
      title: title,
      subtitle: subtitle,
      amount: amount,
      type: 'Booking / Recharge',
      status: 'CONFIRMED',
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today'
    });

    // 2. Trigger Real-Time Soundbox Voice & Green LED Pulse
    this.triggerSoundbox(amount, title, this.activeLanguage);

    // 3. Trigger WhatsApp Push Notification Banner
    this.showWhatsAppNotification(
      'Payment Confirmed ✓',
      `₹${amount} paid for ${title}. Transaction ID #${txnId}`
    );

    const heading = this.activeLanguage === 'mr' ? 'पेमेंट यशस्वी झाले!' : (this.activeLanguage === 'hi' ? 'भुगतान सफल हुआ!' : 'Payment Successful!');
    const desc = this.activeLanguage === 'mr' ? `₹${amount} यशस्वीरित्या पूर्ण: ${title}` : (this.activeLanguage === 'hi' ? `₹${amount} सफलतापूर्वक भुगतान किया गया: ${title}` : `₹${amount} paid successfully for ${title}`);

    container.innerHTML = `
      <div class="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl border border-emerald-200 text-center animate-in zoom-in-95 duration-400">
        <div class="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-4xl text-emerald-600 shadow-md animate-bounce">
          ✓
        </div>

        <h2 class="text-2xl sm:text-3xl font-black text-[#002970] mt-4">
          ${heading}
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          ${desc}
        </p>

        <div class="bg-slate-50 rounded-xl p-4 mt-6 max-w-md mx-auto text-left text-xs space-y-2 border border-slate-200">
          <div class="flex justify-between py-1 border-b border-slate-200/60">
            <span class="text-slate-500">Transaction ID</span>
            <span class="font-bold text-slate-800 font-mono">#${txnId}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-slate-200/60">
            <span class="text-slate-500">Gateway Reference</span>
            <span class="font-bold text-slate-800 font-mono">${opRef}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-slate-200/60">
            <span class="text-slate-500">Service / Booking</span>
            <span class="font-bold text-[#002970] truncate max-w-[200px]">${title}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-slate-200/60">
            <span class="text-slate-500">Details / Validity</span>
            <span class="font-bold text-slate-700">${subtitle}</span>
          </div>
          <div class="flex justify-between py-1">
            <span class="text-slate-500">Paid Via</span>
            <span class="font-bold text-[#002970]">Paytm UPI • SBI XX4821</span>
          </div>

          <button onclick="window.agentEngine.generateOfficialReceipt({
            id: '${txnId}',
            ref: '${opRef}',
            title: '${title.replace(/'/g, "\\'")}',
            subtitle: '${subtitle.replace(/'/g, "\\'")}',
            amount: ${amount},
            type: 'Payment Receipt',
            status: 'CONFIRMED'
          })" class="w-full mt-3 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-[#002970] font-black text-xs border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs">
            <span>📄</span>
            <span>Download Official PDF Receipt</span>
          </button>
        </div>

        <!-- Scratch Card -->
        <div class="mt-6 max-w-md mx-auto">
          <div onclick="window.agentEngine.scratchCard(this)" 
               class="interactive-btn bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-2xl p-5 text-white shadow-lg cursor-pointer transform hover:scale-102 transition-all">
            <div id="scratch-front">
              <span class="text-2xl">🎁</span>
              <div class="text-base font-black mt-1">Tap to Scratch Your Cashback Card!</div>
              <div class="text-xs text-amber-100">Paytm Exclusive Hackathon Reward</div>
            </div>
            <div id="scratch-revealed" class="hidden">
              <span class="text-3xl">🎉</span>
              <div class="text-2xl font-black mt-1">₹25 Cashback Won!</div>
              <div class="text-xs text-amber-100">Credited directly to your Paytm Wallet</div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-center gap-3">
          <button onclick="window.agentEngine.processQuery('Jio 299 plan recharge')" 
                  class="interactive-btn px-5 py-2.5 rounded-xl font-bold text-xs bg-[#002970] text-white hover:bg-blue-900 shadow-md">
            Do Another Action
          </button>
          <a href="ai-hub.html" class="interactive-btn px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300">
            Back to AI Hub
          </a>
        </div>
      </div>
    `;
  }

  scratchCard(cardElem) {
    paytm.playSound('chime');
    const front = cardElem.querySelector('#scratch-front');
    const revealed = cardElem.querySelector('#scratch-revealed');
    if (front && revealed) {
      front.classList.add('hidden');
      revealed.classList.remove('hidden');
      cardElem.classList.remove('from-amber-400', 'to-amber-500');
      cardElem.classList.add('from-emerald-500', 'to-teal-600');
    }
  }

  openNexconnChatModal() {
    paytm.playSound('click');
    const modal = document.getElementById('nexconn-chat-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  closeNexconnChatModal() {
    paytm.playSound('click');
    const modal = document.getElementById('nexconn-chat-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  sendNexconnMessage() {
    const input = document.getElementById('nexconn-msg-input');
    const text = input.value.trim();
    if (!text) return;
    paytm.playSound('click');

    const msgBox = document.getElementById('nexconn-chat-messages');
    msgBox.innerHTML += `
      <div class="flex justify-end mb-2">
        <div class="bg-[#002970] text-white px-3 py-2 rounded-2xl rounded-tr-xs text-xs max-w-[80%]">
          ${text}
        </div>
      </div>
    `;
    input.value = '';
    msgBox.scrollTop = msgBox.scrollHeight;

    setTimeout(() => {
      paytm.playSound('chime');
      msgBox.innerHTML += `
        <div class="flex justify-start mb-2">
          <div class="bg-white text-slate-800 px-3 py-2 rounded-2xl rounded-tl-xs text-xs max-w-[80%] border border-slate-200">
            <span class="font-bold text-[10px] text-emerald-700 block">Priya Sharma (Resolution Specialist):</span>
            I have verified your transaction logs via Nexconn Real-Time Gateway. The amount is currently in reconciliation with the bank switch. A resolution token #RT-9481 has been issued.
          </div>
        </div>
      `;
      msgBox.scrollTop = msgBox.scrollHeight;
    }, 1000);
  }
}

window.agentEngine = new PaytmAgentOrchestrator();
