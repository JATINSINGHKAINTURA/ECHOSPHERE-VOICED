// Re-export from canonical lib/voice/locale.ts for frontend
export { SUPPORTED_LOCALES, BCP47_MAP, getLocale, toBCP47, isLanguageSupported } from '../../lib/voice/locale.js';
export const bcp47: Record<string, string> = {
  en: 'en-US', 'en-US': 'en-US', 'en-GB': 'en-GB',
  hi: 'hi-IN', 'hi-IN': 'hi-IN',
  mr: 'mr-IN', 'mr-IN': 'mr-IN',
  ta: 'ta-IN', 'ta-IN': 'ta-IN',
  te: 'te-IN', 'te-IN': 'te-IN',
  bn: 'bn-IN', 'bn-IN': 'bn-IN',
  pa: 'pa-IN', 'pa-IN': 'pa-IN',
  gu: 'gu-IN', 'gu-IN': 'gu-IN',
  kn: 'kn-IN', 'kn-IN': 'kn-IN',
  ml: 'ml-IN', 'ml-IN': 'ml-IN',
  or: 'or-IN', 'or-IN': 'or-IN',
  as: 'as-IN', 'as-IN': 'as-IN',
  gbm: 'hi-IN', 'gbm-IN': 'hi-IN',
  bgc: 'hi-IN', 'bgc-IN': 'hi-IN',
  es: 'es-ES', 'es-ES': 'es-ES',
  fr: 'fr-FR', de: 'de-DE', ja: 'ja-JP', 'ja-JP': 'ja-JP',
};
export const ttsLang = (code: string) => bcp47[code] ?? bcp47[code.split('-')[0]] ?? 'en-US';
export const sttLang = ttsLang;
