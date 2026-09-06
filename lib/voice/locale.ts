export interface VoiceLocale {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  defaultVoice: string;
  bcp47: string;
}

export const SUPPORTED_LOCALES: VoiceLocale[] = [
  { code: 'en-US', name: 'English (US)', nativeName: 'English (US)', flag: '🇺🇸', defaultVoice: 'Puck', bcp47: 'en-US' },
  { code: 'en-GB', name: 'English (UK)', nativeName: 'English (UK)', flag: '🇬🇧', defaultVoice: 'Charon', bcp47: 'en-GB' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', defaultVoice: 'Kore', bcp47: 'es-ES' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français', flag: '🇫🇷', defaultVoice: 'Aoede', bcp47: 'fr-FR' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', defaultVoice: 'Fenrir', bcp47: 'de-DE' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', defaultVoice: 'Kore', bcp47: 'ja-JP' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', defaultVoice: 'Puck', bcp47: 'hi-IN' },
  { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', defaultVoice: 'Puck', bcp47: 'mr-IN' },
  { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', defaultVoice: 'Kore', bcp47: 'ta-IN' },
  { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', defaultVoice: 'Kore', bcp47: 'te-IN' },
  { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', defaultVoice: 'Aoede', bcp47: 'bn-IN' },
  { code: 'pa-IN', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', defaultVoice: 'Puck', bcp47: 'pa-IN' },
  { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', defaultVoice: 'Charon', bcp47: 'gu-IN' },
  { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', defaultVoice: 'Kore', bcp47: 'kn-IN' },
  { code: 'ml-IN', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', defaultVoice: 'Aoede', bcp47: 'ml-IN' },
  { code: 'or-IN', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', defaultVoice: 'Puck', bcp47: 'or-IN' },
  { code: 'as-IN', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳', defaultVoice: 'Puck', bcp47: 'as-IN' },
  { code: 'gbm-IN', name: 'Garhwali', nativeName: 'गढवळि', flag: '🇮🇳', defaultVoice: 'Puck', bcp47: 'hi-IN' },
  { code: 'bgc-IN', name: 'Haryanvi', nativeName: 'हरियाणवी', flag: '🇮🇳', defaultVoice: 'Puck', bcp47: 'hi-IN' },
];

export const BCP47_MAP: Record<string, string> = Object.fromEntries(
  SUPPORTED_LOCALES.map(l => [l.code.split('-')[0], l.bcp47])
);
for (const l of SUPPORTED_LOCALES) BCP47_MAP[l.code] = l.bcp47;
BCP47_MAP['hi'] = 'hi-IN'; BCP47_MAP['mr'] = 'mr-IN'; BCP47_MAP['ta'] = 'ta-IN';
BCP47_MAP['te'] = 'te-IN'; BCP47_MAP['bn'] = 'bn-IN'; BCP47_MAP['pa'] = 'pa-IN';
BCP47_MAP['gu'] = 'gu-IN'; BCP47_MAP['kn'] = 'kn-IN'; BCP47_MAP['ml'] = 'ml-IN';
BCP47_MAP['or'] = 'or-IN'; BCP47_MAP['as'] = 'as-IN'; BCP47_MAP['en'] = 'en-US';

export function getLocale(code: string): VoiceLocale {
  return SUPPORTED_LOCALES.find((l) => l.code === code) 
      || SUPPORTED_LOCALES.find((l) => l.code.startsWith(code.split('-')[0])) 
      || SUPPORTED_LOCALES[0];
}
export function toBCP47(code: string): string {
  return BCP47_MAP[code] || BCP47_MAP[code.split('-')[0]] || 'en-US';
}
export function isLanguageSupported(code: string): boolean {
  return code in BCP47_MAP;
}
