import React, { useState, useEffect } from 'react';
import {
  Globe,
  Mic,
  Volume2,
  ShieldCheck,
  Search,
  FileText,
  CheckCircle2,
  X,
  Play,
  ArrowRight,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';
import { voiceService } from '../../services/voiceservice.js';

interface VoiceBrowserOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onTryCommand?: (commandText: string) => void;
}

interface CommandExample {
  id: string;
  category: 'search' | 'extract' | 'safety';
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  spokenCommand: string;
  actionExplanation: string;
  sampleQuery: string;
}

const COMMAND_EXAMPLES: CommandExample[] = [
  {
    id: 'cmd-search',
    category: 'search',
    icon: Search,
    title: 'Live Web Intelligence Search',
    spokenCommand: '“Search the web for latest Mars rover discoveries”',
    actionExplanation: 'EchoSphere invokes real-time search grounding to fetch verified sources and brief you out loud.',
    sampleQuery: 'Search the web for latest Mars rover discoveries',
  },
  {
    id: 'cmd-extract',
    category: 'extract',
    icon: FileText,
    title: 'Clean Web Page Reading & Summary',
    spokenCommand: '“Extract and summarize the main points from Wikipedia AI”',
    actionExplanation: 'Strips ads and banners, extracting high-level headings and bullet points into accessible speech.',
    sampleQuery: 'Extract and summarize the main points from Wikipedia AI',
  },
  {
    id: 'cmd-safety',
    category: 'safety',
    icon: ShieldCheck,
    title: 'Safe Action Confirmation',
    spokenCommand: '“Deploy latest release to production”',
    actionExplanation: 'EchoSphere pauses for your safety, explains the action, and asks: “Would you like me to proceed?” Say “Yes, authorize” to execute.',
    sampleQuery: 'Deploy latest release to production',
  },
];

export const VoiceBrowserOnboarding: React.FC<VoiceBrowserOnboardingProps> = ({
  isOpen,
  onClose,
  onTryCommand,
}) => {
  const [selectedExample, setSelectedExample] = useState<string>(COMMAND_EXAMPLES[0].id);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (dontShowAgain && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('echosphere_has_seen_voice_onboarding', 'true');
    }
    onClose();
  };

  const handlePlayPrompt = (text: string) => {
    setIsPlayingAudio(true);
    voiceService.speak(text, 'en-US');
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 3000);
  };

  const activeCmd = COMMAND_EXAMPLES.find((c) => c.id === selectedExample) || COMMAND_EXAMPLES[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-onboarding-title"
    >
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Globe size={18} />
            </div>
            <div>
              <h2 id="voice-onboarding-title" className="text-base font-semibold text-zinc-100">
                Voice Commands for Browser Actions
              </h2>
              <p className="text-xs text-zinc-400">
                Learn how to search the web, read pages, and run browser tools by voice
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            aria-label="Close tutorial"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Step 1: Voice activation instruction */}
          <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-xl p-4 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
              <Mic size={18} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-zinc-200">Step 1: Activate Voice Input</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Click the <strong className="text-zinc-200">Microphone button</strong> in the chat bar or press the{' '}
                <strong className="text-zinc-200">Voice Channel</strong> button in the header. Speak naturally when the pulsing indicator appears.
              </p>
            </div>
          </div>

          {/* Step 2: Command selector cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Step 2: Choose a Browser Action to Learn
              </h3>
              <span className="text-[11px] text-zinc-500">Click a card to inspect</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {COMMAND_EXAMPLES.map((cmd) => {
                const Icon = cmd.icon;
                const isSelected = selectedExample === cmd.id;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => setSelectedExample(cmd.id)}
                    className={`p-3 text-left rounded-xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-zinc-800 border-sky-500/60 shadow-md ring-1 ring-sky-500/30'
                        : 'bg-zinc-950/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center ${
                          isSelected ? 'bg-sky-500/20 text-sky-400' : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        <Icon size={14} />
                      </div>
                      <span className="text-xs font-medium text-zinc-200 truncate">{cmd.title}</span>
                    </div>
                    <span className="text-[11px] text-zinc-400 line-clamp-2 italic">
                      {cmd.spokenCommand}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Interactive Inspector for Selected Command */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-sky-400 flex items-center gap-1.5">
                <activeCmd.icon size={14} />
                Selected Command Details
              </span>
              <button
                onClick={() => handlePlayPrompt(activeCmd.sampleQuery)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors border border-zinc-700"
                title="Hear how this command sounds aloud"
              >
                <Volume2 size={13} className={isPlayingAudio ? 'text-emerald-400 animate-pulse' : ''} />
                <span>Listen to sample</span>
              </button>
            </div>

            <div className="bg-zinc-900/80 rounded-lg p-3 border border-zinc-800">
              <div className="text-[11px] text-zinc-500 mb-1">What to speak:</div>
              <div className="text-sm font-semibold text-zinc-100 italic">{activeCmd.spokenCommand}</div>
            </div>

            <div className="text-xs text-zinc-400 leading-relaxed">
              <strong className="text-zinc-300">What EchoSphere does: </strong>
              {activeCmd.actionExplanation}
            </div>

            {onTryCommand && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    onTryCommand(activeCmd.sampleQuery);
                    handleClose();
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors shadow-sm"
                >
                  <span>Test this command in chat</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Safety note banner */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-emerald-300">
            <ShieldCheck size={18} className="shrink-0 mt-0.5 text-emerald-400" />
            <div className="text-xs space-y-1">
              <div className="font-medium text-emerald-200">Built-in Safety Guardrail</div>
              <div className="text-emerald-300/80 leading-relaxed">
                EchoSphere will never execute destructive modifications or open sensitive destinations without your explicit confirmation. You can authorize actions with your voice simply by saying <span className="text-emerald-200 font-semibold">“Yes, proceed”</span>.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-950/80 shrink-0">
          <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded border-zinc-700 bg-zinc-800 text-sky-600 focus:ring-0 focus:ring-offset-0"
            />
            <span>Don't show this overlay automatically</span>
          </label>

          <button
            onClick={handleClose}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 text-xs font-medium transition-colors shadow-sm"
          >
            <CheckCircle2 size={14} />
            <span>Got it, Let's Start</span>
          </button>
        </div>
      </div>
    </div>
  );
};
