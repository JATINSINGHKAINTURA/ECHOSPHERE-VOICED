import React from 'react';
import { Plus, MessageSquare, Trash2, GitBranch, Database, Shield, FileAudio, Radio } from 'lucide-react';
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
    <aside className="w-64 border-r border-zinc-800/80 bg-zinc-950/60 flex flex-col h-full shrink-0">
      <div className="p-3 border-b border-zinc-800/80 space-y-2">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 text-xs font-medium transition-colors"
        >
          <Plus size={14} />
          New Chat Session
        </button>

        {/* Quick feature shortcuts */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            onClick={onOpenLiveVoiceModal}
            className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-[11px] font-medium transition-colors"
          >
            <Radio size={12} className="animate-pulse" />
            <span>Live Voice</span>
          </button>
          <button
            onClick={onOpenTranscribeModal}
            className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/20 text-[11px] font-medium transition-colors"
          >
            <FileAudio size={12} />
            <span>Transcribe</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="px-2 py-1.5 text-[11px] font-medium text-zinc-500 uppercase tracking-wider flex items-center justify-between">
          <span>Sessions</span>
          {currentUser && (
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <Database size={10} />
              Firestore
            </span>
          )}
        </div>
        {conversations.map((c) => (
          <div
            key={c.id}
            className={`group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${
              c.id === activeConversationId
                ? 'bg-blue-600/15 text-blue-400 font-medium'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
            }`}
          >
            <button
              onClick={() => onSelectConversation(c.id)}
              className="flex items-center gap-2 flex-1 text-left truncate"
            >
              <MessageSquare size={13} className="shrink-0" />
              <span className="truncate">{c.title || 'Untitled Session'}</span>
            </button>
            {conversations.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(c.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer info */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/90 text-[11px] text-zinc-500 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Database size={12} className="text-blue-400" />
            Cloud Database
          </span>
          <span className="font-mono text-blue-400">Firestore</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <GitBranch size={12} className="text-zinc-400" />
            Branch
          </span>
          <span className="font-mono text-zinc-400">main</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Shield size={12} className="text-emerald-400" />
            Security
          </span>
          <span className="text-emerald-400">Enforced</span>
        </div>
      </div>
    </aside>
  );
};
