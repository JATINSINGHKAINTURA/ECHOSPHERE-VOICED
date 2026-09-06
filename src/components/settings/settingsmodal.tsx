import React, { useState } from 'react';
import {
  X,
  Volume2,
  Shield,
  Radio,
  CheckCircle,
  Database,
  Sliders,
  Sparkles,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { voiceService } from '../../services/voiceservice.js';
import type { IntegrationStatus, DiagnosticsResult } from '../../types/index.js';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  integrations: Record<string, IntegrationStatus>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  integrations,
}) => {
  const [settings, setSettings] = useState(() => voiceService.getSettings());
  const [diagnostics, setDiagnostics] = useState<DiagnosticsResult | null>(null);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  if (!isOpen) return null;

  const handleRateChange = (rate: number) => {
    const updated = { ...settings, speechRate: rate };
    setSettings(updated);
    voiceService.updateSettings({ speechRate: rate });
    voiceService.speak('This is how EchoSphere will sound.', 'en-US');
  };

  const handleVoiceGenderChange = (gender: 'male' | 'female' | 'auto') => {
    const updated = { ...settings, voiceGender: gender };
    setSettings(updated);
    voiceService.updateSettings({ voiceGender: gender });
    voiceService.speak(gender === 'male' ? 'Male voice selected.' : gender === 'female' ? 'Female voice selected.' : 'Auto voice selected.', 'en-US');
  };

  const handleVoiceStyleChange = (style: 'natural' | 'clear' | 'warm' | 'energetic') => {
    const updated = { ...settings, voiceStyle: style };
    setSettings(updated);
    voiceService.updateSettings({ voiceStyle: style });
  };

  const handleToggleAutoRead = () => {
    const updated = { ...settings, autoReadResponses: !settings.autoReadResponses };
    setSettings(updated);
    voiceService.updateSettings({ autoReadResponses: updated.autoReadResponses });
  };

  const handleRunDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    try {
      const res = await voiceService.runDiagnostics();
      setDiagnostics(res);
    } finally {
      setIsRunningDiagnostics(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <Shield size={18} className="text-blue-400" />
            <h2 className="text-base font-semibold text-zinc-100">EchoSphere Settings</h2>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-200">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Accessible Audio & Speech Engine */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 size={14} className="text-blue-400" />
                Voice & Speech Pacing
              </h3>
              <span className="text-[11px] text-zinc-500">Accessible TTS</span>
            </div>

            <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4 space-y-3.5">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-zinc-300 font-medium">Speech Speed (Cadence)</span>
                  <span className="text-blue-400 font-mono font-semibold">
                    {settings.speechRate}x{' '}
                    {settings.speechRate <= 0.8
                      ? '(Gentle for Seniors/Kids)'
                      : settings.speechRate <= 0.95
                      ? '(Clear)'
                      : '(Standard)'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: '0.75x Slow', val: 0.75 },
                    { label: '0.85x Clear', val: 0.85 },
                    { label: '1.0x Normal', val: 1.0 },
                    { label: '1.15x Fast', val: 1.15 },
                  ].map((option) => (
                    <button
                      key={option.val}
                      type="button"
                      onClick={() => handleRateChange(option.val)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        settings.speechRate === option.val
                          ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                          : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-300 hover:bg-zinc-700/80'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Type Selection */}
              <div className="pt-3 border-t border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300 font-medium">Voice Type</span>
                  <span className="text-zinc-500 text-[11px]">Male / Female / Auto</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['male', 'female', 'auto'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleVoiceGenderChange(g)}
                      className={`px-2 py-2 rounded-lg text-xs font-medium border transition-all capitalize ${settings.voiceGender === g ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-300 hover:bg-zinc-700/80'}`}
                    >
                      {g === 'auto' ? 'Auto' : g}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {(['natural', 'clear', 'warm', 'energetic'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleVoiceStyleChange(s)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${settings.voiceStyle === s ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-300 hover:bg-zinc-700/80'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-zinc-500">Voice adapts to Hindi/Marathi etc. automatically. Try different styles!</p>
              </div>

              {/* Auto-read responses aloud toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <div>
                  <div className="text-xs font-medium text-zinc-200">
                    Read AI Answers Aloud Automatically
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Assists visually impaired & elderly users without clicking read aloud
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleAutoRead}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    settings.autoReadResponses ? 'bg-blue-600' : 'bg-zinc-800'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.autoReadResponses ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Agora & Audio Hardware Diagnostics (CLI Style) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={14} className="text-emerald-400" />
                Audio & Agora Diagnostics
              </h3>
              <button
                onClick={handleRunDiagnostics}
                disabled={isRunningDiagnostics}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-medium underline"
              >
                {isRunningDiagnostics ? 'Testing...' : 'Run Self-Test'}
              </button>
            </div>

            {diagnostics && (
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Microphone Hardware</span>
                  <span
                    className={
                      diagnostics.micAvailable ? 'text-emerald-400' : 'text-amber-400'
                    }
                  >
                    {diagnostics.micAvailable ? 'Ready' : 'Not detected'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Speech Synthesis (TTS)</span>
                  <span
                    className={
                      diagnostics.speechSynthAvailable ? 'text-emerald-400' : 'text-red-400'
                    }
                  >
                    {diagnostics.speechSynthAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Speech Recognition (STT)</span>
                  <span
                    className={
                      diagnostics.webSpeechAvailable ? 'text-emerald-400' : 'text-amber-400'
                    }
                  >
                    {diagnostics.webSpeechAvailable ? 'Supported' : 'Fallback only'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Agora RTC Endpoint</span>
                  <span
                    className={
                      diagnostics.agoraReady ? 'text-emerald-400' : 'text-amber-400'
                    }
                  >
                    {diagnostics.agoraReady ? 'Connected' : 'Mock/Fallback'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Connected Integrations */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Service Integrations
            </h3>
            <div className="space-y-2">
              {Object.entries(integrations).map(([key, item]) => (
                <div
                  key={key}
                  className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-medium text-zinc-200">{item.name}</div>
                    <div className="text-[11px] text-zinc-500">{item.details}</div>
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded font-mono font-medium ${
                      item.configured
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Data Storage */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Data Storage
            </h3>
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <Database size={14} className="text-blue-400" />
                <span>Cloud Firestore & Resilient Local Store</span>
              </div>
              <span className="text-emerald-400 font-mono">Synchronized</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-zinc-900/80 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
