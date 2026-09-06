import AgoraRTC, { type IAgoraRTCClient, type IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { request } from './httpclient.js';
import type { VoiceState, VoiceSettings, DiagnosticsResult, VoiceProfile, VoiceStyleId, VoiceStyleConfig } from '../types/index.js';
import { toBCP47 } from '../../lib/voice/locale.js';
import { deviceService } from './deviceservice.js';

export interface AgoraSessionData {
  appId: string;
  channelName: string;
  token: string;
  uid: number;
  isMock: boolean;
}

export const VOICE_STYLES: VoiceStyleConfig[] = [
  { id: 'deep-male', label: 'Deep Male', gender: 'male', pitch: 0.72, rate: 0.88, description: 'Deep, resonant, and authoritative male tone' },
  { id: 'natural-male', label: 'Natural Male', gender: 'male', pitch: 1.0, rate: 0.95, description: 'Balanced, clear conversational everyday male voice' },
  { id: 'energetic-male', label: 'Energetic Male', gender: 'male', pitch: 1.08, rate: 1.12, description: 'Lively, upbeat, and fast-paced male voice' },
  { id: 'soft-female', label: 'Soft Female', gender: 'female', pitch: 0.95, rate: 0.82, description: 'Calm, gentle, soothing, and patient female voice' },
  { id: 'natural-female', label: 'Natural Female', gender: 'female', pitch: 1.0, rate: 0.95, description: 'Warm, clear conversational everyday female voice' },
];

const DEFAULT_SETTINGS: VoiceSettings = {
  speechRate: 0.95,
  speechPitch: 1.0,
  speechVolume: 1.0,
  autoReadResponses: true,
  voiceGender: 'auto',
  voiceStyle: 'natural',
  selectedVoiceStyle: 'natural-male',
};

export const VOICE_PROFILES: VoiceProfile[] = [
  { id: 'female-natural', name: 'Female Natural (Indian/Global)', gender: 'female', style: 'natural', lang: 'en-IN', description: 'Warm, clear conversational voice' },
  { id: 'male-natural', name: 'Male Natural (Indian/Global)', gender: 'male', style: 'natural', lang: 'en-IN', description: 'Deep, calm friendly voice' },
  { id: 'hindi-female', name: 'हिंदी - मधुर आवाज़ (Hindi Female)', gender: 'female', style: 'natural', lang: 'hi-IN', description: 'स्वाभाविक और स्पष्ट हिंदी आवाज़' },
  { id: 'hindi-male', name: 'हिंदी - शांत आवाज़ (Hindi Male)', gender: 'male', style: 'natural', lang: 'hi-IN', description: 'स्पष्ट और धीमा उच्चारण' },
  { id: 'female-warm', name: 'Female Gentle (Elderly Care)', gender: 'female', style: 'warm', lang: 'en-US', description: 'Slow-paced, clear enunciation' },
];

class VoiceService {
  private client: IAgoraRTCClient | null = null;
  private localAudioTrack: IMicrophoneAudioTrack | null = null;
  private isConnected = false;
  private recognition: any = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private mediaStream: MediaStream | null = null;

  // Voice AI State Machine
  private currentState: VoiceState = 'idle';
  private stateListeners: Set<(state: VoiceState) => void> = new Set();
  private captionListeners: Set<(caption: string, isSpeaking: boolean) => void> = new Set();

  // Voice Settings with LocalStorage persistence
  private settings: VoiceSettings = { ...DEFAULT_SETTINGS };
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private activeUtteranceQueue: SpeechSynthesisUtterance[] = [];
  private isInterruptedFlag = false;

  constructor() {
    this.loadSettings();
    this.prewarmVoices();
  }

  private prewarmVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const load = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length) this.cachedVoices = voices;
      };
      load();
      window.speechSynthesis.onvoiceschanged = load;
      try {
        window.speechSynthesis.getVoices();
      } catch {}
    }
  }

  private loadSettings() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('echosphere_voice_settings');
        if (saved) {
          this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        }
      }
    } catch {
      this.settings = { ...DEFAULT_SETTINGS };
    }
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) this.cachedVoices = voices;
    return this.cachedVoices.length ? this.cachedVoices : voices;
  }

  getBestVoice(lang: string): SpeechSynthesisVoice | null {
    const bcp47 = toBCP47(lang);
    const base = bcp47.split('-')[0].toLowerCase();
    const voices = this.getAvailableVoices();
    if (!voices.length) return null;

    const gender = this.settings.voiceGender || 'auto';
    const isHindiTarget = base === 'hi' || bcp47.toLowerCase().includes('hi-in') || lang.toLowerCase().startsWith('hi');

    // 1. Specialized Hindi Voice Matching: Ensure Hindi text uses native Hindi TTS voices
    if (isHindiTarget) {
      const hindiVoices = voices.filter((v) => {
        const vl = v.lang.toLowerCase();
        const vn = v.name.toLowerCase();
        return (
          vl.startsWith('hi') ||
          vl.includes('hi-in') ||
          vn.includes('hindi') ||
          vn.includes('हिन्दी') ||
          vn.includes('kalpana') ||
          vn.includes('hemant') ||
          vn.includes('swara') ||
          vn.includes('lekha') ||
          vn.includes('madhur')
        );
      });

      if (hindiVoices.length > 0) {
        if (gender === 'female') {
          const femaleHindi = hindiVoices.find((v) => {
            const vn = v.name.toLowerCase();
            return vn.includes('female') || vn.includes('kalpana') || vn.includes('swara') || vn.includes('lekha') || vn.includes('zira');
          });
          if (femaleHindi) return femaleHindi;
        } else if (gender === 'male') {
          const maleHindi = hindiVoices.find((v) => {
            const vn = v.name.toLowerCase();
            return vn.includes('male') || vn.includes('hemant') || vn.includes('madhur') || vn.includes('rishi');
          });
          if (maleHindi) return maleHindi;
        }
        // Prefer Google or Natural Hindi voice
        const naturalHindi = hindiVoices.find((v) => v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Neural'));
        return naturalHindi || hindiVoices[0];
      }
      // If no native Hindi voice is present, return null so browser doesn't force an English voice on Hindi script
      return null;
    }

    // 2. Standard Language Matching
    let candidates = voices.filter((v) => v.lang.toLowerCase() === bcp47.toLowerCase());
    if (!candidates.length) {
      candidates = voices.filter((v) => v.lang.toLowerCase().startsWith(base));
    }
    if (!candidates.length && base !== 'en') {
      candidates = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
    }
    if (!candidates.length) candidates = voices;

    // Filter by preferred gender if specified
    if (gender !== 'auto') {
      const keywords =
        gender === 'male'
          ? ['male', 'david', 'mark', 'alex', 'daniel', 'george', 'rishi', 'hemant', 'guy', 'james', 'google uk english male']
          : ['female', 'zira', 'susan', 'samantha', 'karen', 'victoria', 'swara', 'veena', 'kalpana', 'jenny', 'google uk english female'];
      const matched = candidates.filter((v) => keywords.some((k) => v.name.toLowerCase().includes(k)));
      if (matched.length) return matched[0];
      if (candidates.length > 1) return gender === 'male' ? candidates[0] : candidates[candidates.length - 1];
    }

    // Prefer Google or Natural voices if available
    const naturalVoice = candidates.find((v) => v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Neural'));
    if (naturalVoice) return naturalVoice;

    return candidates[0] || null;
  }

  getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<VoiceSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('echosphere_voice_settings', JSON.stringify(this.settings));
      }
    } catch {}
  }

  setVoiceStyle(styleId: VoiceStyleId) {
    const config = VOICE_STYLES.find((s) => s.id === styleId);
    if (!config) return;
    const updated: VoiceSettings = {
      ...this.settings,
      selectedVoiceStyle: styleId,
      voiceGender: config.gender,
      speechPitch: config.pitch,
      speechRate: config.rate,
    };
    this.updateSettings(updated);
  }

  getState(): VoiceState {
    return this.currentState;
  }

  setState(newState: VoiceState) {
    this.currentState = newState;
    this.stateListeners.forEach((fn) => {
      try {
        fn(newState);
      } catch (err) {
        console.warn('Voice state listener error:', err);
      }
    });
  }

  onStateChange(listener: (state: VoiceState) => void): () => void {
    this.stateListeners.add(listener);
    listener(this.currentState);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  onCaption(listener: (caption: string, isSpeaking: boolean) => void): () => void {
    this.captionListeners.add(listener);
    return () => {
      this.captionListeners.delete(listener);
    };
  }

  private broadcastCaption(caption: string, isSpeaking: boolean) {
    this.captionListeners.forEach((fn) => {
      try {
        fn(caption, isSpeaking);
      } catch (err) {
        console.warn('Caption listener error:', err);
      }
    });
  }

  async getAgoraToken(): Promise<AgoraSessionData> {
    return request<AgoraSessionData>('/api/agora/token');
  }

  async startAgoraSession(onUserAudio?: (user: any) => void): Promise<AgoraSessionData> {
    const session = await this.getAgoraToken();
    if (session.isMock) {
      this.isConnected = true;
      return session;
    }

    try {
      this.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      await this.client.join(session.appId, session.channelName, session.token, session.uid);
      this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      await this.client.publish([this.localAudioTrack]);

      if (onUserAudio && this.client) {
        this.client.on('user-published', async (user, mediaType) => {
          await this.client?.subscribe(user, mediaType);
          if (mediaType === 'audio') {
            user.audioTrack?.play();
            onUserAudio(user);
          }
        });
      }

      this.isConnected = true;
    } catch (err) {
      console.warn('Agora connection fallback to browser voice:', err);
      this.isConnected = true;
    }

    return session;
  }

  async stopAgoraSession() {
    if (this.localAudioTrack) {
      this.localAudioTrack.stop();
      this.localAudioTrack.close();
      this.localAudioTrack = null;
    }
    if (this.client) {
      await this.client.leave();
      this.client = null;
    }
    this.isConnected = false;
  }

  // Record audio with microphone for Gemini Transcribe
  async startRecordingAudio(
    onDataReady: (base64Audio: string, mimeType: string) => void,
    onError: (err: any) => void
  ): Promise<void> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone access is not supported in this browser.');
      }

      this.interrupt();
      deviceService.playChime('start');
      this.setState('listening');
      this.audioChunks = [];
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';

      this.mediaRecorder = new MediaRecorder(this.mediaStream, { mimeType });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        deviceService.playChime('stop');
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string) || '';
          onDataReady(base64, mimeType);
        };
        reader.readAsDataURL(audioBlob);

        if (this.mediaStream) {
          this.mediaStream.getTracks().forEach((track) => track.stop());
          this.mediaStream = null;
        }
        this.setState('idle');
      };

      this.mediaRecorder.start();
    } catch (err) {
      this.setState('idle');
      onError(err);
    }
  }

  stopRecordingAudio() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.mediaRecorder = null;
    }
  }

  // High Quality TTS with Instant Interrupt and zero lag
  speak(text: string, lang = 'en-US', onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }

    // Immediately cancel any previous speech
    this.isInterruptedFlag = false;
    window.speechSynthesis.cancel();
    this.activeUtteranceQueue = [];

    // Normalize text for speech (clean markdown, remove URLs, expand abbreviations)
    const clean = this.normalizeForSpeech(text);
    if (!clean) {
      onEnd?.();
      return;
    }

    // Check if Hindi script is present
    const hasHindi = /[ऀ-ॿ]/.test(clean);
    const targetLang = hasHindi ? 'hi-IN' : toBCP47(lang);

    this.setState('speaking');
    this.broadcastCaption(clean, true);

    // Break into natural sentence chunks for fluid cadence
    const chunks = clean.match(/[^.!?।॥\n]+[.!?।॥\n]+|[^.!?।॥\n]+$/g) || [clean];
    const queue = chunks.slice(0, 15);
    let idx = 0;

    const speakNext = () => {
      if (this.isInterruptedFlag || idx >= queue.length) {
        if (this.currentState === 'speaking') {
          this.setState('idle');
        }
        this.broadcastCaption('', false);
        onEnd?.();
        return;
      }

      const chunk = queue[idx].trim().slice(0, 300);
      idx++;
      if (!chunk) {
        speakNext();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.lang = targetLang;
      utterance.rate = Math.max(0.6, Math.min(1.35, this.settings.speechRate));
      utterance.pitch = Math.max(0.6, Math.min(1.45, this.settings.speechPitch));
      utterance.volume = Math.max(0.1, Math.min(1.0, this.settings.speechVolume));

      const bestVoice = this.getBestVoice(targetLang);
      if (bestVoice) utterance.voice = bestVoice;

      utterance.onend = () => {
        if (!this.isInterruptedFlag) {
          // Minimal 40ms pause between sentences for natural breathing rhythm
          setTimeout(speakNext, 40);
        }
      };

      utterance.onerror = (e) => {
        if (!this.isInterruptedFlag) {
          setTimeout(speakNext, 40);
        }
      };

      this.activeUtteranceQueue.push(utterance);
      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  }

  private normalizeForSpeech(text: string): string {
    return text
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/##+\s*/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/https?:\/\/\S+/g, 'link')
      .replace(/[-*•]\s+/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3000);
  }

  // Instant Interrupt: Stops all voice synthesis immediately
  interrupt() {
    this.isInterruptedFlag = true;
    this.stopSpeaking();
    this.stopListening();
    this.setState('interrupted');
    this.broadcastCaption('', false);
    setTimeout(() => {
      if (this.currentState === 'interrupted') {
        this.setState('idle');
      }
    }, 150);
  }

  stopSpeaking() {
    this.isInterruptedFlag = true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.activeUtteranceQueue = [];
      this.broadcastCaption('', false);
      if (this.currentState === 'speaking') {
        this.setState('idle');
      }
    }
  }

  // Fast Browser Speech Recognition (STT) with interim feedback and final processing
  startListening(
    lang = 'en-US',
    onResult: (transcript: string, isFinal?: boolean) => void,
    onError: (err: any) => void
  ) {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError(new Error('Speech recognition is not supported in this browser. Try Chrome or Edge.'));
      return;
    }

    try {
      this.interrupt();
      deviceService.playChime('start');
      this.setState('listening');
      this.recognition = new SpeechRecognition();
      this.recognition.lang = toBCP47(lang);
      this.recognition.interimResults = true;
      this.recognition.continuous = false;
      this.recognition.maxAlternatives = 1;

      let finalTranscript = '';

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += trans;
          } else {
            interimTranscript += trans;
          }
        }
        const currentText = (finalTranscript || interimTranscript).trim();
        if (currentText) {
          this.broadcastCaption(`You: ${currentText}`, false);
        }
        if (finalTranscript.trim()) {
          onResult(finalTranscript.trim(), true);
        } else if (interimTranscript.trim()) {
          onResult(interimTranscript.trim(), false);
        }
      };

      this.recognition.onend = () => {
        deviceService.playChime('stop');
        if (this.currentState === 'listening') {
          this.setState('idle');
        }
        // If recognition ended without isFinal triggered but we have captured final text
        if (finalTranscript.trim()) {
          onResult(finalTranscript.trim(), true);
        }
      };

      this.recognition.onerror = (e: any) => {
        if (e.error !== 'no-speech' && e.error !== 'aborted') {
          deviceService.playChime('stop');
        }
        this.setState('idle');
        onError(e);
      };

      this.recognition.start();
    } catch (err) {
      this.setState('idle');
      onError(err);
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
      this.recognition = null;
      if (this.currentState === 'listening') {
        this.setState('idle');
      }
    }
  }

  // Audio Diagnostic Self-Test
  async runDiagnostics(): Promise<DiagnosticsResult> {
    const result: DiagnosticsResult = {
      micAvailable: false,
      speechSynthAvailable: false,
      webSpeechAvailable: false,
      agoraReady: false,
      timestamp: new Date().toISOString(),
    };

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      result.speechSynthAvailable = true;
    }

    if (
      typeof window !== 'undefined' &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
    ) {
      result.webSpeechAvailable = true;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        result.micAvailable = devices.some((d) => d.kind === 'audioinput');
      }
    } catch {
      result.micAvailable = false;
    }

    try {
      const tokenRes = await this.getAgoraToken();
      if (tokenRes && tokenRes.appId) {
        result.agoraReady = true;
      }
    } catch {
      result.agoraReady = false;
    }

    return result;
  }
}

export const voiceService = new VoiceService();
