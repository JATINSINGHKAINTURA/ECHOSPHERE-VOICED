import { useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, type Language } from '../data/languages.js';

export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('echosphere_lang');
    return SUPPORTED_LANGUAGES.find((l) => l.code === saved) || SUPPORTED_LANGUAGES[0];
  });

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('echosphere_lang', lang.code);
  };

  return { currentLanguage, setLanguage, supportedLanguages: SUPPORTED_LANGUAGES };
}
