export interface VoiceLocale {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  defaultVoice: string;
}

export const SUPPORTED_LOCALES: VoiceLocale[] = [
  { code: 'en-US', name: 'English (US)', nativeName: 'English (US)', flag: '🇺🇸', defaultVoice: 'Puck' },
  { code: 'en-GB', name: 'English (UK)', nativeName: 'English (UK)', flag: '🇬🇧', defaultVoice: 'Charon' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', defaultVoice: 'Kore' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français', flag: '🇫🇷', defaultVoice: 'Aoede' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', defaultVoice: 'Fenrir' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', defaultVoice: 'Kore' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', defaultVoice: 'Puck' },
];

export function getLocale(code: string): VoiceLocale {
  return SUPPORTED_LOCALES.find((l) => l.code === code) || SUPPORTED_LOCALES[0];
}
