import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from '../common/avatar.js';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  ShieldAlert,
  Search,
  ExternalLink,
  Sparkles,
  Radio,
  FileAudio,
  Bot,
  Compass,
  GraduationCap,
  HeartHandshake,
  Accessibility,
} from 'lucide-react';
import type { Message } from '../../types/chat.js';
import { voiceService } from '../../services/voiceservice.js';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => Promise<void>;
  onApproveAction: (actionId: string, approved: boolean) => Promise<void>;
  isRecording: boolean;
  onToggleRecording: () => void;
  onSpeakMessage: (text: string) => void;
  selectedModel: string;
  useSearchGrounding: boolean;
  onToggleSearchGrounding: () => void;
  systemRole: string;
  onSelectSystemRole: (role: string) => void;
  onOpenTranscribeModal: () => void;
  onOpenLiveVoiceModal: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onApproveAction,
  isRecording,
  onToggleRecording,
  onSpeakMessage,
  selectedModel,
  useSearchGrounding,
  onToggleSearchGrounding,
  systemRole,
  onSelectSystemRole,
  onOpenTranscribeModal,
  onOpenLiveVoiceModal,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    await onSendMessage(text);
  };

  const companionRoles: { id: string; name: string; icon: React.ReactNode }[] = [
    { id: 'browser_navigator', name: 'Internet Guide', icon: <Compass size={13} className="text-blue-400" /> },
    { id: 'educator', name: 'Learning Guide', icon: <GraduationCap size={13} className="text-emerald-400" /> },
    { id: 'senior_companion', name: 'Senior Guide', icon: <HeartHandshake size={13} className="text-[#f4d06f]" /> },
    { id: 'accessibility_expert', name: 'Accessibility Guide', icon: <Accessibility size={13} className="text-purple-400" /> },
    { id: 'copilot', name: 'Everyday Helper', icon: <Bot size={13} className="text-amber-300" /> },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#080d19] relative select-none">
      {/* Top Controls Bar */}
      <div className="px-4 py-2.5 border-b border-white/[0.08] bg-[#0c1222]/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141b2c] border border-white/10 text-xs">
            <span className="text-zinc-400">Companion:</span>
            <select
              value={systemRole}
              onChange={(e) => onSelectSystemRole(e.target.value)}
              className="bg-transparent text-[#ffeecb] font-bold text-xs focus:outline-none cursor-pointer"
            >
              {companionRoles.map((r) => (
                <option key={r.id} value={r.id} className="bg-[#0e1424] text-white">
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Model info pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141b2c]/80 border border-white/10 text-[11px] font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f4d06f] shadow-[0_0_6px_#f4d06f]" />
            <span>{selectedModel}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Grounding toggle */}
          <button
            onClick={onToggleSearchGrounding}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              useSearchGrounding
                ? 'bg-[#f4d06f]/20 text-[#f4d06f] border border-[#f4d06f]/50 shadow-[0_0_15px_rgba(244,208,111,0.2)]'
                : 'bg-[#141b2c] text-zinc-400 border border-white/10 hover:text-white'
            }`}
            title="Search the live web with Google Search Grounding"
          >
            <Search size={13} className={useSearchGrounding ? 'text-[#f4d06f]' : ''} />
            <span>Google Search</span>
            {useSearchGrounding && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#f4d06f] animate-pulse" />
            )}
          </button>

          {/* Live API Voice Modal Button */}
          <button
            onClick={onOpenLiveVoiceModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 transition-all cursor-pointer"
            title="Real-time Live Audio"
          >
            <Radio size={13} className="text-blue-400 animate-pulse" />
            <span>Live Voice</span>
          </button>

          {/* Audio Transcribe Button */}
          <button
            onClick={onOpenTranscribeModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 transition-all cursor-pointer"
            title="Transcribe Audio File"
          >
            <FileAudio size={13} className="text-purple-400" />
            <span>Transcribe</span>
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-12">
            <div className="w-16 h-16 rounded-full bg-[#161f33] border border-[#f4d06f]/40 flex items-center justify-center text-[#f4d06f] shadow-[0_0_30px_rgba(244,208,111,0.25)] mb-4">
              <Mic size={28} />
            </div>
            <h3 className="text-xl font-bold text-white font-headline mb-2">
              Start Speaking or Typing
            </h3>
            <p className="text-sm text-zinc-400 mb-6">
              Ask any question, search the web, or tap the mic for a natural voice conversation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
              {[
                'Read today\'s top news',
                'Teach me how photos work',
                'What is the weather outside?',
                'Help me explore internet tools',
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage(prompt)}
                  className="px-3 py-2.5 rounded-xl bg-[#12192a] hover:bg-[#1a243c] border border-white/10 hover:border-[#f4d06f]/40 text-xs font-semibold text-zinc-200 hover:text-white text-left transition-all cursor-pointer"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-3xl ${
                isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <Avatar role={msg.role} />
              <div className="flex flex-col space-y-1.5 max-w-[85%]">
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#f4d06f] text-[#241a00] font-medium rounded-tr-sm shadow-[0_0_20px_rgba(244,208,111,0.25)]'
                      : 'bg-[#111728] border border-white/10 text-zinc-100 rounded-tl-sm shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Google Search Grounding Sources */}
                  {msg.searchSources && msg.searchSources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#f4d06f]">
                        <Search size={12} />
                        <span>Google Search Grounded Sources:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {msg.searchSources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0a0f1d] border border-white/10 text-[11px] text-zinc-300 hover:text-white hover:border-[#f4d06f]/40 transition-colors"
                          >
                            <span className="truncate max-w-[180px]">{source.title || source.url}</span>
                            <ExternalLink size={10} className="text-zinc-400 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action approval card */}
                  {msg.actionRequired && (
                    <div className="mt-3 p-3 rounded-xl bg-[#090d18] border border-[#f4d06f]/30 space-y-2">
                      <div className="flex items-center gap-2 text-[#f4d06f] text-xs font-semibold">
                        <ShieldAlert size={14} />
                        <span>Action Verification Required</span>
                      </div>
                      <p className="text-xs text-zinc-300">{msg.actionRequired.summary}</p>
                      {msg.actionRequired.status === 'pending' ? (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => onApproveAction(msg.actionRequired!.id, true)}
                            className="px-3 py-1.5 rounded-lg bg-[#f4d06f] hover:bg-[#ffeecb] text-[#241a00] text-xs font-bold transition-colors cursor-pointer"
                          >
                            Authorize Execution
                          </button>
                          <button
                            onClick={() => onApproveAction(msg.actionRequired!.id, false)}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <div className="text-[11px] font-mono text-zinc-400 capitalize">
                          Status: {msg.actionRequired.status}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div
                  className={`flex items-center gap-2 text-[11px] text-zinc-400 px-1 ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {!isUser && (
                    <button
                      onClick={() => onSpeakMessage(msg.content)}
                      className="text-zinc-400 hover:text-[#f4d06f] transition-colors cursor-pointer"
                      title="Read aloud"
                    >
                      <Volume2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3 max-w-3xl mr-auto">
            <Avatar role="assistant" />
            <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-[#111728] border border-white/10 text-zinc-400 text-sm flex items-center gap-2 shadow-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-[#f4d06f] animate-bounce" />
              <span className="inline-block w-2 h-2 rounded-full bg-[#f4d06f] animate-bounce [animation-delay:0.2s]" />
              <span className="inline-block w-2 h-2 rounded-full bg-[#f4d06f] animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs ml-1.5 text-zinc-300 font-medium">
                {useSearchGrounding
                  ? 'Searching Google in real time with Gemini 3.5...'
                  : 'EchoSphere is thinking...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-white/[0.08] bg-[#070c18]/90 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
          {/* Quick Voice input toggle */}
          <button
            type="button"
            onClick={onToggleRecording}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              isRecording
                ? 'bg-red-500/20 text-red-400 border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse'
                : 'bg-[#12192a] border-white/10 text-[#f4d06f] hover:border-[#f4d06f]/40 hover:bg-[#1a233a]'
            }`}
            title={isRecording ? 'Stop listening' : 'Start voice input'}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isRecording
                ? 'Listening to your voice...'
                : useSearchGrounding
                ? 'Ask anything with Google Search Grounding...'
                : 'Ask EchoSphere anything or request voice guidance...'
            }
            className="flex-1 bg-[#101728] border border-white/10 rounded-2xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-[#f4d06f]/60 transition-colors"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3 rounded-2xl bg-[#f4d06f] hover:bg-[#ffeecb] text-[#241a00] font-bold disabled:opacity-30 transition-all cursor-pointer shadow-[0_0_15px_rgba(244,208,111,0.25)]"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
