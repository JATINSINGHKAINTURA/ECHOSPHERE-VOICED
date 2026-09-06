import React, { type ReactNode } from 'react';
import { Header, type EchoNavTab } from './header.js';
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
  activeTab: EchoNavTab;
  onSelectTab: (tab: EchoNavTab) => void;
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
  onStartVoiceModal?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  activeTab,
  onSelectTab,
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
  onStartVoiceModal,
}) => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#080d19] text-zinc-100 font-sans">
      <OfflineBanner />
      <Header
        activeTab={activeTab}
        onSelectTab={onSelectTab}
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
        onStartVoiceModal={onStartVoiceModal}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Only show side navigation panel when on 'talk' tab and not in accessible mode */}
        {activeTab === 'talk' && !isAccessibleMode && (
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
        )}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </main>
        {activeTab === 'talk' && showTools && !isAccessibleMode && (
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
