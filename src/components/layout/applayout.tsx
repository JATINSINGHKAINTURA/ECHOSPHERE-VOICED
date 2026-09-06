import React, { type ReactNode } from 'react';
import { Header } from './header.js';
import { Sidebar } from '../sidebar/sidebar.js';
import { ToolsPanel } from '../tools/toolspanel.js';
import { OfflineBanner } from '../common/offlinebanner.js';
import type { Language } from '../../data/languages.js';
import type { ModelInfo } from '../../types/index.js';
import type { Conversation } from '../../types/chat.js';
import type { ToolDefinition, Incident, PendingAction } from '../../types/tools.js';
import type { User } from 'firebase/auth';

interface AppLayoutProps {
  children: ReactNode;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  models: ModelInfo[];
  selectedModel: string;
  onSelectModel: (m: string) => void;
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  tools: ToolDefinition[];
  incidents: Incident[];
  pendingActions: PendingAction[];
  onExecuteTool: (name: string, params: any) => Promise<void>;
  onApproveAction: (actionId: string, approved: boolean) => Promise<void>;
  showTools: boolean;
  onToggleTools: () => void;
  onOpenCommandPalette: () => void;
  onOpenSettings: () => void;
  isVoiceActive: boolean;
  onToggleVoice: () => void;
  currentUser: User | null;
  onSignInWithGoogle: () => Promise<void>;
  onSignOut: () => Promise<void>;
  isSigningIn: boolean;
  onOpenTranscribeModal: () => void;
  onOpenLiveVoiceModal: () => void;
  isAccessibleMode?: boolean;
  onToggleAccessibleMode?: () => void;
  onOpenVoiceGuide?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentLanguage,
  onSelectLanguage,
  models,
  selectedModel,
  onSelectModel,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  tools,
  incidents,
  pendingActions,
  onExecuteTool,
  onApproveAction,
  showTools,
  onToggleTools,
  onOpenCommandPalette,
  onOpenSettings,
  isVoiceActive,
  onToggleVoice,
  currentUser,
  onSignInWithGoogle,
  onSignOut,
  isSigningIn,
  onOpenTranscribeModal,
  onOpenLiveVoiceModal,
  isAccessibleMode,
  onToggleAccessibleMode,
  onOpenVoiceGuide,
}) => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans">
      <OfflineBanner />
      <Header
        currentLanguage={currentLanguage}
        onSelectLanguage={onSelectLanguage}
        models={models}
        selectedModel={selectedModel}
        onSelectModel={onSelectModel}
        onOpenCommandPalette={onOpenCommandPalette}
        onOpenSettings={onOpenSettings}
        onToggleTools={onToggleTools}
        isVoiceActive={isVoiceActive}
        onToggleVoice={onToggleVoice}
        currentUser={currentUser}
        onSignInWithGoogle={onSignInWithGoogle}
        onSignOut={onSignOut}
        isSigningIn={isSigningIn}
        isAccessibleMode={isAccessibleMode}
        onToggleAccessibleMode={onToggleAccessibleMode}
        onOpenVoiceGuide={onOpenVoiceGuide}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={onSelectConversation}
          onNewConversation={onNewConversation}
          onDeleteConversation={onDeleteConversation}
          currentUser={currentUser}
          onOpenTranscribeModal={onOpenTranscribeModal}
          onOpenLiveVoiceModal={onOpenLiveVoiceModal}
        />
        <main className="flex-1 flex overflow-hidden">{children}</main>
        {showTools && !isAccessibleMode && (
          <ToolsPanel
            tools={tools}
            incidents={incidents}
            pendingActions={pendingActions}
            onExecuteTool={onExecuteTool}
            onApproveAction={onApproveAction}
          />
        )}
      </div>
    </div>
  );
};
