import React from 'react';
import { Plus, MessageSquare, Trash2, GitBranch, Database, Shield, FileAudio, Radio, Sparkles } from 'lucide-react';
import type { Conversation } from '../../types/chat.js';
import type { User } from 'firebase/auth';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  currentUser?: User | null;
  onOpenTranscribeModal?: () => void;
  onOpenLiveVoiceModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  currentUser,
  onOpenTranscribeModal,
  onOpenLiveVoiceModal,
}) => {
  return (
    <aside className="w-64 border-r border-white/[0.08] bg-[#070c18] flex flex-col h-full shrink-0 select-none shadow-[2px_0_20px_rgba(0,0,0,0.4)]">
      {/* Top Action Header */}
      <div className="p-3 border-b border-white/[0.08] space-y-2">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#12192a] hover:bg-[#1a233a] text-white border border-white/10 hover:border-[#f4d06f]/40 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(244,208,111,0.15)]"
        >
          <Plus size={14} className="text-[#f4d06f]" />
          <span>New Voice Session</span>
        </button>

        {/* Quick Voice feature shortcuts */}
        <div className="grid grid-cols-2 gap-1.5 pt-0.5">
          <button
            onClick={onOpenLiveVoiceModal}
            className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/25 text-[11px] font-semibold transition-all cursor-pointer"
          >
            <Radio size={12} className="animate-pulse text-blue-400" />
            <span>Live Voice</span>
          </button>
          <button
            onClick={onOpenTranscribeModal}
            className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/25 text-[11px] font-semibold transition-all cursor-pointer"
          >
            <FileAudio size={12} className="text-purple-400" />
            <span>Transcribe</span>
          </button>
        </div>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
        <div className="px-2 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
          <span>Voice History</span>
          {currentUser && (
            <span className="text-[10px] text-[#f4d06f] font-mono flex items-center gap-1">
              <Database size={10} />
              Cloud Synced
            </span>
          )}
        </div>
        {conversations.map((c) => {
          const isActive = c.id === activeConversationId;
          return (
            <div
              key={c.id}
              className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#151d30] text-[#ffeecb] font-semibold border border-[#f4d06f]/30 shadow-[0_0_15px_rgba(244,208,111,0.1)]'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <button
                onClick={() => onSelectConversation(c.id)}
                className="flex items-center gap-2.5 flex-1 text-left truncate cursor-pointer"
              >
                <MessageSquare size={13} className={`shrink-0 ${isActive ? 'text-[#f4d06f]' : 'text-zinc-500'}`} />
                <span className="truncate">{c.title || 'Voice Conversation'}</span>
              </button>
              {conversations.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(c.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 transition-opacity cursor-pointer rounded-md hover:bg-white/5"
                  title="Delete Session"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-white/[0.08] bg-[#050913] text-[11px] text-zinc-400 space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <Sparkles size={12} className="text-[#f4d06f]" />
            Voice Intelligence
          </span>
          <span className="font-semibold text-zinc-200">Gemini 3.5</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <Shield size={12} className="text-emerald-400" />
            Safe Pacing
          </span>
          <span className="text-emerald-400 font-semibold">Active</span>
        </div>
      </div>
    </aside>
  );
};
