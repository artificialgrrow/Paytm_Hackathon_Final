// Web Speech API with strict Female / Lady Voice Enforcement across English & Hindi

let currentUtterance = null;

// Helper to reliably find a high-quality female voice
export const getFemaleVoice = (lang = 'hi-IN') => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const prefix = lang.split('-')[0].toLowerCase();
  const langVoices = voices.filter(v => v.lang.toLowerCase().startsWith(prefix));

  // Known feminine voice identifiers on Windows, macOS, Android & Chrome
  const femaleKeywords = [
    'zira', 'heera', 'kalpana', 'swara', 'neerja', 'geeta', 'female', 
    'priya', 'sangeeta', 'veena', 'girl', 'woman', 'samantha', 'victoria', 
    'karen', 'moira', 'tessa', 'fiona', 'google हिन्दी', 'google uk english female',
    'google us english'
  ];

  const maleKeywords = ['david', 'ravi', 'george', 'mark', 'male', 'guy', 'richard', 'sean'];

  // 1. Look for language-matching female voice
  let femaleVoice = langVoices.find(v => 
    femaleKeywords.some(kw => v.name.toLowerCase().includes(kw))
  );

  // 2. Look for language-matching voice that is NOT explicitly male
  if (!femaleVoice) {
    femaleVoice = langVoices.find(v => 
      !maleKeywords.some(kw => v.name.toLowerCase().includes(kw))
    );
  }

  // 3. Fallback to any female voice installed on the system
  if (!femaleVoice) {
    femaleVoice = voices.find(v => 
      femaleKeywords.some(kw => v.name.toLowerCase().includes(kw))
    );
  }

  return femaleVoice || (langVoices.length > 0 ? langVoices[0] : voices[0]);
};

export const speak = (text, lang = 'hi-IN', onStart, onEnd) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    
    // Clean formatting characters and strip all Unicode symbols, variation selectors & emojis (so TTS never pronounces "High voltage", "Shield", etc.)
    const cleanText = text
      .replace(/[\*\#\_\[\]\(\)\{\}\<\>•–—\|~`]/g, ' ')
      .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang;
    utterance.rate = 0.98;
    utterance.pitch = 1.15; // Set higher pitch for a clear feminine cadence

    const femaleVoice = getFemaleVoice(lang);
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error:', e);
  }
};

export const pauseSpeech = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.pause();
  }
};

export const resumeSpeech = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.resume();
  }
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

export const isSpeaking = () => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  return window.speechSynthesis.speaking;
};

// Ensure voices are loaded
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    // Warm up voice list
    window.speechSynthesis.getVoices();
  };
}

export class VoiceRecognition {
  constructor(onResult, onStatusChange) {
    this.recognition = null;
    this.isListening = false;
    this.onResult = onResult;
    this.onStatusChange = onStatusChange;

    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;

        this.recognition.onstart = () => {
          this.isListening = true;
          if (this.onStatusChange) this.onStatusChange(true);
        };

        this.recognition.onresult = (event) => {
          let interim = '';
          let final = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          if (this.onResult) this.onResult(final || interim, Boolean(final));
        };

        this.recognition.onerror = () => {
          this.isListening = false;
          if (this.onStatusChange) this.onStatusChange(false);
        };

        this.recognition.onend = () => {
          this.isListening = false;
          if (this.onStatusChange) this.onStatusChange(false);
        };
      }
    }
  }

  start(lang = 'hi-IN') {
    if (!this.recognition) return false;
    this.recognition.lang = lang;
    try {
      this.recognition.start();
      return true;
    } catch {
      return false;
    }
  }

  stop() {
    if (!this.recognition) return;
    try {
      this.recognition.stop();
    } catch {}
  }
}
