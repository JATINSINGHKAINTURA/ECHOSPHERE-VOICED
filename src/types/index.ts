export * from './chat.js';
export * from './tools.js';

export type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'interrupted';

export interface VoiceSettings {
  speechRate: number; // e.g. 0.8 for elderly/slow, 1.0 default
  speechPitch: number; // 0.8 - 1.2
  speechVolume: number; // 0.0 - 1.0
  autoReadResponses: boolean; // auto-narrate answers for low-vision/elderly
  preferredVoice?: string;
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
