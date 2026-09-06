import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  HelpCircle,
  Newspaper,
  Calendar,
  Search,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { voiceService } from '../../services/voiceservice.js';
import type { Message } from '../../types/chat.js';

interface EasyEchoModeProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => Promise<void>;
  isRecording: boolean;
  onToggleRecording: () => void;
  onExitAccessibleMode: () => void;
}

export const EasyEchoMode: React.FC<EasyEchoModeProps> = ({
  messages,
  isLoading,
  onSendMessage,
  isRecording,
  onToggleRecording,
  onExitAccessibleMode,
}) => {
  const [inputText, setInputText] = useState('');

  // Find the last assistant message to highlight prominently for the senior user
  const assistantMessages = messages.filter((m) => m.role === 'assistant');
  const latestAssistantMessage = assistantMessages[assistantMessages.length - 1];

  const handleQuickPrompt = (prompt: string) => {
    onSendMessage(prompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const txt = inputText;
    setInputText('');
    onSendMessage(txt);
  };

  const handleReadAloud = () => {
    if (latestAssistantMessage) {
      voiceService.speak(latestAssistantMessage.content, 'en-US');
    }
  };

  const handleStopSpeaking = () => {
    voiceService.stopSpeaking();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950 text-zinc-100 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full">
      {/* Top Banner with High-Contrast Status & Exit */}
      <div className="flex items-center justify-between bg-zinc-900 border-2 border-emerald-500/40 rounded-2xl p-4 mb-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/30">
            👋
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Easy Echo Mode</h1>
            <p className="text-sm text-zinc-400">
              Large buttons, clear voice, and simplified answers for effortless communication
            </p>
          </div>
        </div>

        <button
          onClick={onExitAccessibleMode}
          className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-semibold border border-zinc-700 transition-colors"
        >
          Standard View
        </button>
      </div>

      {/* Main Assistant Speech Card (Highest Priority) */}
      <div className="bg-zinc-900/90 border-2 border-zinc-700/80 rounded-3xl p-6 mb-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-base font-bold text-emerald-400 uppercase tracking-wide">
              EchoSphere Assistant
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReadAloud}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all"
              title="Read this message out loud"
            >
              <Volume2 size={18} />
              <span>Read Aloud</span>
            </button>
            <button
              onClick={handleStopSpeaking}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all"
              title="Stop voice playback"
            >
              <VolumeX size={18} />
            </button>
          </div>
        </div>

        {/* Message Content */}
        <div className="min-h-[100px] flex items-center">
          {isLoading ? (
            <div className="flex items-center gap-3 text-lg font-medium text-blue-400 animate-pulse">
              <Sparkles size={24} />
              <span>EchoSphere is preparing a clear answer for you...</span>
            </div>
          ) : latestAssistantMessage ? (
            <p className="text-lg md:text-xl font-medium leading-relaxed text-zinc-100 selection:bg-blue-600">
              {latestAssistantMessage.content}
            </p>
          ) : (
            <p className="text-lg text-zinc-400">
              Hello! I am ready to help you. Click the big microphone button below or choose a topic to begin.
            </p>
          )}
        </div>
      </div>

      {/* Big Voice Button: Central interaction for elderly users */}
      <div className="flex flex-col items-center justify-center my-4 space-y-3">
        <button
          onClick={onToggleRecording}
          className={`w-28 h-28 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all transform active:scale-95 ${
            isRecording
              ? 'bg-red-600 ring-8 ring-red-500/30 animate-pulse scale-105'
              : 'bg-blue-600 hover:bg-blue-500 ring-4 ring-blue-500/20'
          }`}
          title={isRecording ? 'Stop speaking' : 'Tap to speak'}
        >
          {isRecording ? <MicOff size={44} /> : <Mic size={44} />}
          <span className="text-xs font-bold mt-1 tracking-wider uppercase">
            {isRecording ? 'Listening...' : 'Tap & Speak'}
          </span>
        </button>
        <span className="text-sm font-semibold text-zinc-400">
          {isRecording
            ? 'Speaking now... Tap again when you are finished'
            : 'Tap the microphone to speak your question'}
        </span>
      </div>

      {/* Quick Accessible Actions Grid (≥56px touch target buttons) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-6">
        {[
          {
            icon: Newspaper,
            title: 'Read the latest news',
            desc: 'Get today’s top headlines explained simply',
            prompt: 'Please search today’s latest news and give me a simple 3-point summary in plain words.',
            color: 'text-amber-400 border-amber-500/30 hover:border-amber-500/60',
          },
          {
            icon: Calendar,
            title: 'Schedule a reminder or task',
            desc: 'Create an easy reminder for medications or appointments',
            prompt: 'Help me set a reminder for my upcoming schedule.',
            color: 'text-emerald-400 border-emerald-500/30 hover:border-emerald-500/60',
          },
          {
            icon: Search,
            title: 'Search & explain simply',
            desc: 'Ask about any medical, science, or everyday question',
            prompt: 'What is the best way to stay healthy and active every day?',
            color: 'text-blue-400 border-blue-500/30 hover:border-blue-500/60',
          },
          {
            icon: HelpCircle,
            title: 'How do I use this app?',
            desc: 'Step-by-step guidance on talking to EchoSphere',
            prompt: 'Can you guide me on everything you can do for me in simple, friendly steps?',
            color: 'text-purple-400 border-purple-500/30 hover:border-purple-500/60',
          },
        ].map((item, i) => (
          <button
            key={i}
            onClick={() => handleQuickPrompt(item.prompt)}
            disabled={isLoading}
            className={`flex items-start gap-4 p-4 rounded-2xl bg-zinc-900 border-2 ${item.color} text-left hover:bg-zinc-800/80 transition-all min-h-[72px]`}
          >
            <item.icon size={28} className="shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-base font-bold text-zinc-100">{item.title}</div>
              <div className="text-xs text-zinc-400 mt-0.5">{item.desc}</div>
            </div>
            <ArrowRight size={18} className="text-zinc-600 shrink-0 self-center" />
          </button>
        ))}
      </div>

      {/* Large Input Bar for typing */}
      <form onSubmit={handleSubmit} className="mt-auto pt-4 flex items-center gap-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Or type what you need in plain words here..."
          className="flex-1 bg-zinc-900 border-2 border-zinc-700 rounded-2xl px-5 py-4 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-6 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base disabled:opacity-40 flex items-center gap-2 shadow-lg"
        >
          <span>Send</span>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};
