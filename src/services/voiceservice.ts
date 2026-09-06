import AgoraRTC, { type IAgoraRTCClient, type IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { request } from './httpclient.js';
import type { VoiceState, VoiceSettings, DiagnosticsResult, VoiceProfile } from '../types/index.js';
import { toBCP47 } from '../../lib/voice/locale.js';

export interface AgoraSessionData {
  appId: string;
  channelName: string;
  token: string;
  uid: number;
  isMock: boolean;
}

const DEFAULT_SETTINGS: VoiceSettings = {
  speechRate: 0.85,
  speechPitch: 1.0,
  speechVolume: 1.0,
  autoReadResponses: false,
  voiceGender: 'auto',
  voiceStyle: 'natural',
};

export const VOICE_PROFILES: VoiceProfile[] = [
  { id: 'male-natural', name: 'Male Natural', gender: 'male', style: 'natural', lang: 'en-US', description: 'Warm male voice' },
  { id: 'female-natural', name: 'Female Natural', gender: 'female', style: 'natural', lang: 'en-US', description: 'Clear female voice' },
  { id: 'male-clear', name: 'Male Clear', gender: 'male', style: 'clear', lang: 'en-US', description: 'Crisp male voice' },
  { id: 'female-warm', name: 'Female Warm', gender: 'female', style: 'warm', lang: 'en-US', description: 'Warm female voice' },
];

class VoiceService {
  private client: IAgoraRTCClient | null = null;
  private localAudioTrack: IMicrophoneAudioTrack | null = null;
  private isConnected = false;
  private recognition: any = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private mediaStream: MediaStream | null = null;

  // Rapida-style Voice AI State Machine
  private currentState: VoiceState = 'idle';
  private stateListeners: Set<(state: VoiceState) => void> = new Set();
  private captionListeners: Set<(caption: string, isSpeaking: boolean) => void> = new Set();

  // Voice Settings with LocalStorage persistence
  private settings: VoiceSettings = { ...DEFAULT_SETTINGS };
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.loadSettings();
    this.prewarmVoices();
  }

  private prewarmVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const load = () => { this.cachedVoices = window.speechSynthesis.getVoices(); };
      load();
      window.speechSynthesis.onvoiceschanged = load;
      window.speechSynthesis.getVoices();
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
    let candidates = voices.filter(v => v.lang.toLowerCase() === bcp47.toLowerCase());
    if (!candidates.length) candidates = voices.filter(v => v.lang.toLowerCase().startsWith(base));
    if (!candidates.length) candidates = voices.filter(v => v.lang.toLowerCase().startsWith('en'));
    if (!candidates.length) candidates = voices;
    if (gender !== 'auto') {
      const keywords = gender === 'male' ? ['male', 'david', 'mark', 'alex', 'daniel'] : ['female', 'zira', 'susan', 'samantha', 'karen', 'victoria'];
      const matched = candidates.filter(v => keywords.some(k => v.name.toLowerCase().includes(k)));
      if (matched.length) return matched[0];
      if (candidates.length > 1) return gender === 'male' ? candidates[0] : candidates[candidates.length - 1];
    }
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
    } catch {
      // ignore
    }
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

      this.setState('listening');
      this.audioChunks = [];
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      this.mediaRecorder = new MediaRecorder(this.mediaStream, { mimeType });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string) || '';
          onDataReady(base64, mimeType);
        };
        reader.readAsDataURL(audioBlob);

        // Stop all audio tracks
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

  // Enhanced TTS with voice types, chunking, Indian language support, reduced glitches
  speak(text: string, lang = 'en-US', onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) { onEnd?.(); return; }
    window.speechSynthesis.cancel();
    // Brief pause to let cancel propagate and reduce glitches
    setTimeout(() => this.doSpeak(text, lang, onEnd), 50);
  }

  private doSpeak(text: string, lang: string, onEnd?: () => void) {
    const bcp47 = toBCP47(lang);
    const clean = text.replace(/```[\s\S]*?```/g, ' ').replace(/##+\s*/g, '').replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[-*•]\s*/g, '').replace(/\s+/g, ' ').trim().slice(0, 2000);
    if (!clean) { onEnd?.(); return; }
    this.setState('speaking');
    this.broadcastCaption(clean, true);
    const chunks = clean.match(/[^.!?।॥]+[.!?।॥]+|[^.!?।॥]+$/g) || [clean];
    const queue = chunks.slice(0, 12);
    let idx = 0;
    const speakNext = () => {
      if (idx >= queue.length) { this.setState('idle'); this.broadcastCaption('', false); onEnd?.(); return; }
      const chunk = queue[idx].trim().slice(0, 250);
      idx++;
      if (!chunk) { speakNext(); return; }
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.lang = bcp47;
      utterance.rate = Math.max(0.6, Math.min(1.4, this.settings.speechRate));
      utterance.pitch = Math.max(0.7, Math.min(1.3, this.settings.speechPitch));
      utterance.volume = Math.max(0.1, Math.min(1.0, this.settings.speechVolume));
      const best = this.getBestVoice(bcp47);
      if (best) utterance.voice = best;
      utterance.onend = () => setTimeout(speakNext, 80);
      utterance.onerror = (e) => { console.warn('TTS chunk error:', e); setTimeout(speakNext, 80); };
      window.speechSynthesis.speak(utterance);
    };
    speakNext();
  }

  interrupt() {
    this.stopSpeaking();
    this.stopListening();
    this.setState('interrupted');
    this.broadcastCaption('', false);
    setTimeout(() => {
      if (this.currentState === 'interrupted') {
        this.setState('idle');
      }
    }, 250);
  }

  stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.broadcastCaption('', false);
      if (this.currentState === 'speaking') {
        this.setState('idle');
      }
    }
  }

  // Browser Speech Recognition (STT) with state broadcasting
  startListening(
    lang = 'en-US',
    onResult: (transcript: string) => void,
    onError: (err: any) => void
  ) {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError(new Error('Speech recognition is not supported in this browser. Try Chrome/Edge.'));
      return;
    }

    try {
      this.interrupt();
      try { window.speechSynthesis?.cancel(); } catch {}
      this.setState('listening');
      this.recognition = new SpeechRecognition();
      this.recognition.lang = toBCP47(lang);
      this.recognition.interimResults = true;
      this.recognition.continuous = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        this.broadcastCaption(`You: ${transcript}`, false);
        onResult(transcript);
      };

      this.recognition.onend = () => {
        if (this.currentState === 'listening') {
          this.setState('idle');
        }
      };

      this.recognition.onerror = (e: any) => {
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
      } catch {
        // ignore
      }
      this.recognition = null;
      if (this.currentState === 'listening') {
        this.setState('idle');
      }
    }
  }

  // Agora CLI-style & Audio Diagnostic Self-Test
  async runDiagnostics(): Promise<DiagnosticsResult> {
    const result: DiagnosticsResult = {
      micAvailable: false,
      speechSynthAvailable: false,
      webSpeechAvailable: false,
      agoraReady: false,
      timestamp: new Date().toISOString(),
    };

    // 1. Check Speech Synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      result.speechSynthAvailable = true;
    }

    // 2. Check Speech Recognition
    if (
      typeof window !== 'undefined' &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
    ) {
      result.webSpeechAvailable = true;
    }

    // 3. Check Microphone Hardware Availability
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        result.micAvailable = devices.some((d) => d.kind === 'audioinput');
      }
    } catch {
      result.micAvailable = false;
    }

    // 4. Check Agora RTC backend endpoint
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
