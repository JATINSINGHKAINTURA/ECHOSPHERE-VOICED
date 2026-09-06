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
} from 'lucide-react';
import type { Message } from '../../types/chat.js';

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

  const roleLabels: Record<string, string> = {
    copilot: 'EchoSphere Copilot',
    incident_commander: 'Incident Commander',
    sre: 'SRE Specialist',
    developer: 'Staff Architect',
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950/40 relative">
      {/* Top Controls Bar */}
      <div className="px-4 py-2 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-sm flex flex-wrap items-center justify-between gap-2 z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
            <Bot size={13} className="text-blue-400" />
            <span className="text-zinc-400">Role:</span>
            <select
              value={systemRole}
              onChange={(e) => onSelectSystemRole(e.target.value)}
              className="bg-transparent text-zinc-200 text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="copilot" className="bg-zinc-900 text-zinc-200">
                EchoSphere Copilot
              </option>
              <option value="incident_commander" className="bg-zinc-900 text-zinc-200">
                Incident Commander
              </option>
              <option value="sre" className="bg-zinc-900 text-zinc-200">
                SRE Specialist
              </option>
              <option value="developer" className="bg-zinc-900 text-zinc-200">
                Staff Architect
              </option>
            </select>
          </div>

          {/* Model info pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>{selectedModel}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Grounding toggle */}
          <button
            onClick={onToggleSearchGrounding}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              useSearchGrounding
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
            }`}
            title="Use Google Search data (gemini-3.5-flash with googleSearch tool)"
          >
            <Search size={13} className={useSearchGrounding ? 'text-amber-400' : ''} />
            <span>Google Search</span>
            {useSearchGrounding && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          {/* Live API Voice Modal Button */}
          <button
            onClick={onOpenLiveVoiceModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 transition-all"
            title="Live API real-time voice conversations (gemini-3.1-flash-live-preview)"
          >
            <Radio size={13} className="text-blue-400 animate-pulse" />
            <span>Live Voice</span>
          </button>

          {/* Audio Transcribe Button */}
          <button
            onClick={onOpenTranscribeModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 transition-all"
            title="Transcribe audio with gemini-3.5-transcribe"
          >
            <FileAudio size={13} className="text-purple-400" />
            <span>Transcribe</span>
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
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
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-sm shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Google Search Grounding Sources */}
                  {msg.searchSources && msg.searchSources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400">
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
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-950/70 border border-zinc-700/60 text-[11px] text-zinc-300 hover:text-white hover:border-amber-500/40 transition-colors"
                          >
                            <span className="truncate max-w-[180px]">{source.title || source.url}</span>
                            <ExternalLink size={10} className="text-zinc-500 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action approval card inside assistant message */}
                  {msg.actionRequired && (
                    <div className="mt-3 p-3 rounded-xl bg-zinc-950/80 border border-amber-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                        <ShieldAlert size={14} />
                        <span>Action Verification Required</span>
                      </div>
                      <p className="text-xs text-zinc-300">{msg.actionRequired.summary}</p>
                      {msg.actionRequired.status === 'pending' ? (
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => onApproveAction(msg.actionRequired!.id, true)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
                          >
                            Authorize Execution
                          </button>
                          <button
                            onClick={() => onApproveAction(msg.actionRequired!.id, false)}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
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
                  className={`flex items-center gap-2 text-[11px] text-zinc-500 px-1 ${
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
                      className="text-zinc-500 hover:text-zinc-300 transition-colors"
                      title="Read aloud"
                    >
                      <Volume2 size={12} />
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
            <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]" />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs ml-1 text-zinc-500 font-medium">
                {useSearchGrounding
                  ? 'Grounded search in progress with Gemini 3.5 Flash...'
                  : 'EchoSphere is thinking...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
          {/* Quick Voice input toggle */}
          <button
            type="button"
            onClick={onToggleRecording}
            className={`p-2.5 rounded-xl border transition-all ${
              isRecording
                ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
            title={isRecording ? 'Stop listening' : 'Start voice input'}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
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
                : 'Ask EchoSphere to act on Jira, GitHub, or Notion...'
            }
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500/60 transition-colors"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-colors shadow-sm shadow-blue-500/20"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
