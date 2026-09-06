import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES, type Language } from '../../data/languages.js';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onSelectLanguage,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 border border-zinc-700/60 transition-colors"
      >
        <span className="text-sm">{currentLanguage.flag}</span>
        <span>{currentLanguage.name}</span>
        <ChevronDown size={14} className="text-zinc-500" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl py-1 z-50 overflow-hidden">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onSelectLanguage(lang);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors ${
                  lang.code === currentLanguage.code
                    ? 'bg-blue-600/15 text-blue-400 font-medium'
                    : 'text-zinc-300 hover:bg-zinc-800/70'
                }`}
              >
                <span className="text-sm">{lang.flag}</span>
                <span>{lang.nativeName}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
