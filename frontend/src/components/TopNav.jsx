import React, { useState } from 'react';
import { 
  Layers, Globe, Check, ChevronDown, Activity, Sparkles, 
  Zap, ShieldCheck, User 
} from 'lucide-react';
import { playSound } from '../utils/audio';
import { translations } from '../data/translations';

export const TopNav = ({ 
  language = 'en', 
  onLanguageChange, 
  activeView = 'hub',
  onSelectView 
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const t = translations[language] || translations.en;

  const handleLangSelect = (code) => {
    playSound('click');
    setLangDropdownOpen(false);
    if (onLanguageChange) {
      onLanguageChange(code);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl h-full mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Brand Wordmark & Tag */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onSelectView('hub')}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            {/* Official High-Res Paytm Logo Asset */}
            <img 
              src="/assets/paytm_logo.png" 
              alt="Paytm" 
              className="h-6 sm:h-7 w-auto object-contain group-hover:scale-105 transition-transform"
            />
            <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider bg-gradient-to-r from-[#0052ff] to-[#00b9f1] px-2.5 py-0.5 rounded-full shadow-2xs">
              ONE
            </span>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-[13px] font-semibold text-slate-600">
            <button
              onClick={() => onSelectView('hub')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeView === 'hub' ? 'bg-slate-100 text-[#002970]' : 'hover:text-[#002970] hover:bg-slate-50'
              }`}
            >
              {t.navHub}
            </button>

            <button
              onClick={() => onSelectView('action')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeView === 'action' ? 'bg-blue-50 text-[#0052ff] font-bold shadow-2xs' : 'hover:text-[#0052ff] hover:bg-blue-50/50'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#0052ff]" />
              <span>{t.navAction}</span>
            </button>

            <button
              onClick={() => onSelectView('resolve')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeView === 'resolve' ? 'bg-emerald-50 text-[#05b169] font-bold shadow-2xs' : 'hover:text-[#05b169] hover:bg-emerald-50/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#05b169]" />
              <span>{t.navResolve}</span>
            </button>

            <button
              onClick={() => onSelectView('architecture')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'architecture' 
                  ? 'bg-gradient-to-r from-[#002970] to-[#0052ff] text-white shadow-xs' 
                  : 'text-[#0052ff] bg-blue-50 hover:bg-blue-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t.navArch}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>
          </nav>
        </div>

        {/* Right Controls: Engine Status, Language Dropdown & Presentation CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Live Engine Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{t.engineLive}</span>
          </div>

          {/* Clean 2-Language Dropdown (English & Hindi) */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs transition-colors cursor-pointer"
              title="Change Interface Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#0052ff]" />
              <span>{language === 'hi' ? 'हिन्दी (HI)' : 'English (EN)'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Select Language
                </div>

                <button
                  onClick={() => handleLangSelect('en')}
                  className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between hover:bg-blue-50 transition-colors cursor-pointer ${
                    language === 'en' ? 'text-[#0052ff] bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>English (EN)</span>
                  {language === 'en' && <Check className="w-3.5 h-3.5 text-[#0052ff]" />}
                </button>

                <button
                  onClick={() => handleLangSelect('hi')}
                  className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between hover:bg-blue-50 transition-colors cursor-pointer ${
                    language === 'hi' ? 'text-[#0052ff] bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>हिन्दी (HI)</span>
                  {language === 'hi' && <Check className="w-3.5 h-3.5 text-[#0052ff]" />}
                </button>
              </div>
            )}
          </div>

          {/* Presenter Mode Button (Quick Toggle) */}
          <button
            onClick={() => onSelectView(activeView === 'architecture' ? 'hub' : 'architecture')}
            className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
              activeView === 'architecture'
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-gradient-to-r from-[#002970] to-[#0052ff] hover:brightness-110 text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{activeView === 'architecture' ? 'Back to Hub' : 'Presenter View'}</span>
          </button>

        </div>

      </div>
    </header>
  );
};

export default TopNav;