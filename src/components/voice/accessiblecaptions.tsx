import React, { useEffect, useState } from 'react';
import { Volume2, Mic, X, Sparkles } from 'lucide-react';
import { voiceService } from '../../services/voiceservice.js';
import type { VoiceState } from '../../types/index.js';

interface AccessibleCaptionsProps {
  onDismiss?: () => void;
}

export const AccessibleCaptions: React.FC<AccessibleCaptionsProps> = ({ onDismiss }) => {
  const [caption, setCaption] = useState<string>('');
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubState = voiceService.onStateChange((state) => {
      setVoiceState(state);
      if (state === 'speaking' || state === 'listening' || state === 'thinking') {
        setIsVisible(true);
      } else if (state === 'idle') {
        // Leave caption briefly visible so it can be read, then fade
        const timer = setTimeout(() => {
          if (voiceService.getState() === 'idle') {
            setIsVisible(false);
          }
        }, 4000);
        return () => clearTimeout(timer);
      }
    });

    const unsubCaption = voiceService.onCaption((text, isSpeaking) => {
      if (text) {
        setCaption(text);
        setIsVisible(true);
      }
    });

    return () => {
      unsubState();
      unsubCaption();
    };
  }, []);

  if (!isVisible || !caption) return null;

  const isAssistantSpeaking = voiceState === 'speaking' || !caption.startsWith('You:');

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="pointer-events-auto bg-zinc-950/95 border-2 border-blue-500/40 rounded-2xl shadow-2xl backdrop-blur-xl p-4 text-zinc-100 flex items-start gap-3.5">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
            isAssistantSpeaking
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          }`}
        >
          {isAssistantSpeaking ? (
            <Volume2 size={20} className="animate-pulse" />
          ) : (
            <Mic size={20} className="animate-pulse" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold tracking-wide uppercase text-zinc-400">
              {isAssistantSpeaking ? 'EchoSphere Spoken Captions' : 'Voice Input Transcript'}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                voiceState === 'speaking'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                  : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
              }`}
            >
              {voiceState === 'speaking' ? 'Speaking now' : voiceState}
            </span>
          </div>
          <p className="text-sm md:text-base font-medium leading-relaxed text-zinc-100 selection:bg-blue-600">
            {caption}
          </p>
        </div>

        <button
          onClick={() => {
            setIsVisible(false);
            onDismiss?.();
          }}
          className="text-zinc-500 hover:text-zinc-200 p-1 -mr-1 -mt-1 rounded-lg transition-colors"
          title="Dismiss captions"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
