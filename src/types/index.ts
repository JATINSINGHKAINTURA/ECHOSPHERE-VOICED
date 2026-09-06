export * from './chat.js';
export * from './tools.js';

export type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'interrupted';

export interface VoiceSettings {
  speechRate: number; // 0.6 - 1.4, 0.85 ideal for seniors
  speechPitch: number; // 0.7 - 1.3
  speechVolume: number; // 0.1 - 1.0
  autoReadResponses: boolean; // auto-narrate answers for low-vision/elderly
  preferredVoice?: string;
  voiceGender?: 'male' | 'female' | 'auto'; // selectable voice type
  voiceStyle?: 'natural' | 'clear' | 'warm' | 'energetic'; // natural voice styles
}

export interface VoiceProfile {
  id: string;
  name: string;
  gender: 'male' | 'female';
  style: string;
  lang: string;
  description: string;
}

export interface AccessibilityPreferences {
  accessibleMode: boolean; // Easy Echo / Senior high-contrast large-touch UI
  simpleLanguage: boolean; // plain non-technical language mode
  highContrast: boolean;
  largeFont: boolean;
  hapticFeedback?: boolean;
}

export interface DiagnosticsResult {
  micAvailable: boolean;
  speechSynthAvailable: boolean;
  webSpeechAvailable: boolean;
  agoraReady: boolean;
  timestamp: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  latency: string;
  isDefault?: boolean;
  description: string;
}

export interface IntegrationStatus {
  name: string;
  configured: boolean;
  status: string;
  details: string;
}
