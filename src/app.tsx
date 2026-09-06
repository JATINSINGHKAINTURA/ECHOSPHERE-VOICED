import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { auth, googleProvider } from './lib/firebase.js';
import {
  syncUserProfile,
  saveUserConversation,
  saveUserMessage,
  fetchUserConversations,
  deleteUserConversation,
  saveUserPreferences,
  fetchUserPreferences,
} from './services/firebaseservice.js';
import { AppLayout } from './components/layout/applayout.js';
import { HomePage } from './pages/home.js';
import { EasyEchoMode } from './components/accessible/easyechomode.js';
import { AccessibleCaptions } from './components/voice/accessiblecaptions.js';
import { CommandPalette } from './components/common/commandpalette.js';
import { SettingsModal } from './components/settings/settingsmodal.js';
import { TranscriptionModal } from './components/audio/transcriptionmodal.js';
import { LiveApiMode } from './components/voice/liveapimode.js';
import { ErrorBoundary } from './components/common/errorboundary.js';
import { useLanguage } from './hooks/uselanguage.js';
import {
  fetchConversations,
  createConversation,
  sendChatMessage,
  fetchMessages,
  approveAction,
} from './services/chatservice.js';
import { fetchModels, fetchIntegrations } from './services/aiservice.js';
import {
  fetchTools,
  fetchIncidents,
  fetchPendingActions,
  executeTool,
} from './services/toolservice.js';
import { voiceService } from './services/voiceservice.js';
import { isBrowserRequest, getBrowserIntent, browserClarificationReply, browserActionReply } from './lib/persona.js';
import { getSiteUrl, openBrowserTab } from './lib/browserHandler.js';
import { INITIAL_CONVERSATIONS } from './data/mockchats.js';
import type { Conversation, Message } from './types/chat.js';
import type { ModelInfo, IntegrationStatus } from './types/index.js';
import type { ToolDefinition, Incident, PendingAction } from './types/tools.js';

export function App() {
  const { currentLanguage, setLanguage } = useLanguage();

  // Firebase Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Chat & Session state
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string>('conv-welcome');
  const [messages, setMessages] = useState<Message[]>(INITIAL_CONVERSATIONS[0].messages);
  const [isLoading, setIsLoading] = useState(false);
  const [lastBrowserSite, setLastBrowserSite] = useState<string | null>(null);

  // Gemini Models & Features
  const [models, setModels] = useState<ModelInfo[]>([
    {
      id: 'gemini-3.5-flash',
      name: 'Gemini 3.5 Flash',
      provider: 'Google',
      latency: 'Sub-second',
      isDefault: true,
      description: 'Default fast model with Google Search Grounding support.',
    },
    {
      id: 'gemini-3.1-flash-lite',
      name: 'Gemini 3.1 Flash Lite',
      provider: 'Google',
      latency: 'Instant',
      isDefault: false,
      description: 'Extremely fast, lightweight multi-turn responses.',
    },
    {
      id: 'gemini-3.1-pro-preview',
      name: 'Gemini 3.1 Pro Preview',
      provider: 'Google',
      latency: 'Comprehensive',
      isDefault: false,
      description: 'Advanced reasoning, complex architecture & incident analysis.',
    },
    {
      id: 'gemini-3.1-flash-live-preview',
      name: 'Gemini Live Preview',
      provider: 'Google',
      latency: 'Real-time',
      isDefault: false,
      description: 'Bidirectional low-latency voice conversations.',
    },
  ]);
  const [selectedModel, setSelectedModel] = useState('gemini-3.5-flash');
  const [systemRole, setSystemRole] = useState('copilot');
  const [useSearchGrounding, setUseSearchGrounding] = useState(false);

  // Integrations & Tools
  const [tools, setTools] = useState<ToolDefinition[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [integrations, setIntegrations] = useState<Record<string, IntegrationStatus>>({});

  // Modals & Overlays
  const [showTools, setShowTools] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTranscribeModalOpen, setIsTranscribeModalOpen] = useState(false);
  const [isLiveVoiceModalOpen, setIsLiveVoiceModalOpen] = useState(false);

  // Audio & Accessibility state
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAccessibleMode, setIsAccessibleMode] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem('echosphere_accessible_mode') === 'true';
      }
    } catch {
      // ignore
    }
    return false;
  });

  // Firebase Auth listener with preferences sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await syncUserProfile(user);
        const [userConvs, userPrefs] = await Promise.all([
          fetchUserConversations(user.uid),
          fetchUserPreferences(user.uid),
        ]);
        if (userConvs.length > 0) {
          setConversations(userConvs);
          setActiveConversationId(userConvs[0].id);
          setMessages(userConvs[0].messages || []);
        }
        if (userPrefs && typeof userPrefs.accessibleMode === 'boolean') {
          setIsAccessibleMode(userPrefs.accessibleMode);
          try {
            window.localStorage?.setItem('echosphere_accessible_mode', String(userPrefs.accessibleMode));
          } catch {
            // ignore
          }
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Initialize data from dev server API
  useEffect(() => {
    async function loadData() {
      try {
        const [convs, mds, tls, incs, acts, ints] = await Promise.allSettled([
          fetchConversations(),
          fetchModels(),
          fetchTools(),
          fetchIncidents(),
          fetchPendingActions(),
          fetchIntegrations(),
        ]);

        if (convs.status === 'fulfilled' && convs.value.length > 0 && !currentUser) {
          setConversations(convs.value);
          setActiveConversationId(convs.value[0].id);
          setMessages(convs.value[0].messages || []);
        }
        if (mds.status === 'fulfilled' && mds.value.length > 0) {
          setModels(mds.value);
        }
        if (tls.status === 'fulfilled') setTools(tls.value);
        if (incs.status === 'fulfilled') setIncidents(incs.value);
        if (acts.status === 'fulfilled') setPendingActions(acts.value);
        if (ints.status === 'fulfilled') setIntegrations(ints.value);
      } catch (err) {
        console.warn('Backend hydration error, using initial data:', err);
      }
    }
    loadData();
  }, []);

  const handleSignInWithGoogle = async () => {
    setIsSigningIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await syncUserProfile(result.user);
        const userConvs = await fetchUserConversations(result.user.uid);
        if (userConvs.length > 0) {
          setConversations(userConvs);
          setActiveConversationId(userConvs[0].id);
          setMessages(userConvs[0].messages || []);
        }
      }
    } catch (err: any) {
      console.warn('Google Sign-In note:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (err) {
      console.warn('Sign out error:', err);
    }
  };

  const handleSelectConversation = async (id: string) => {
    setActiveConversationId(id);
    const found = conversations.find((c) => c.id === id);
    if (found && found.messages && found.messages.length > 0) {
      setMessages(found.messages);
    } else {
      try {
        const msgs = await fetchMessages(id);
        setMessages(msgs);
      } catch {
        setMessages([]);
      }
    }
  };

  const handleNewConversation = async () => {
    const newId = 'conv-' + Date.now();
    const newConv: Conversation = {
      id: newId,
      userId: currentUser?.uid,
      title: 'New Session',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      language: currentLanguage.code,
      model: selectedModel,
      systemRole,
      messages: [
        {
          id: 'msg-' + Date.now(),
          conversationId: newId,
          role: 'assistant',
          content: `Hello! I am your AI assistant running with role "${systemRole}" on ${selectedModel}. How can I help you today?`,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setMessages(newConv.messages);

    if (currentUser) {
      await saveUserConversation(currentUser.uid, newConv);
      await saveUserMessage(currentUser.uid, newConv.id, newConv.messages[0]);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (currentUser) {
      await deleteUserConversation(currentUser.uid, id);
    }
    if (activeConversationId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      if (remaining.length > 0) {
        setActiveConversationId(remaining[0].id);
        setMessages(remaining[0].messages || []);
      }
    }
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      conversationId: activeConversationId,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Voice-controlled browser navigation
    const lang = currentLanguage.code;
    const browserIntent = getBrowserIntent(text);
    const isBrowser = isBrowserRequest(text);
    let effectiveSite: string | null = browserIntent?.site || null;
    let effectiveQuery = browserIntent?.query || '';
    let needsClarification = browserIntent?.needsClarification || false;
    if (!isBrowser && lastBrowserSite && text.trim().split(' ').length <= 5 && text.length < 40 && text.length > 2) {
      effectiveSite = lastBrowserSite;
      effectiveQuery = text.trim();
      needsClarification = false;
    }
    if (isBrowser || (lastBrowserSite && effectiveSite)) {
      if (needsClarification) {
        const reply = browserClarificationReply(effectiveSite || 'youtube', lang);
        setLastBrowserSite(effectiveSite || 'youtube');
        const assistantMsg: Message = { id: 'ast-' + Date.now(), conversationId: activeConversationId, role: 'assistant', content: reply, timestamp: new Date().toISOString() };
        setMessages((prev) => [...prev, assistantMsg]);
        if (currentUser) { await saveUserMessage(currentUser.uid, activeConversationId, userMsg); await saveUserMessage(currentUser.uid, activeConversationId, assistantMsg); }
        voiceService.speak(reply, lang);
        setIsLoading(false);
        return;
      }
      if (effectiveSite) {
        const url = getSiteUrl(effectiveSite, effectiveQuery);
        const opened = openBrowserTab(url, effectiveSite);
        const reply = browserActionReply(effectiveSite, effectiveQuery, lang) + (opened ? '' : ' (Please allow pop-ups.)');
        const fullContent = reply + " Opened: " + url;
        const assistantMsg: Message = { id: 'ast-' + Date.now(), conversationId: activeConversationId, role: 'assistant', content: fullContent, timestamp: new Date().toISOString() };
        setMessages((prev) => [...prev, assistantMsg]);
        if (currentUser) { await saveUserMessage(currentUser.uid, activeConversationId, userMsg); await saveUserMessage(currentUser.uid, activeConversationId, assistantMsg); }
        voiceService.speak(reply, lang);
        setLastBrowserSite(null);
        setIsLoading(false);
        return;
      }
    } else if (lastBrowserSite && text.length > 5) {
      setLastBrowserSite(null);
    }

    if (currentUser) {
      await saveUserMessage(currentUser.uid, activeConversationId, userMsg);
    }

    try {
      const res = await sendChatMessage(
        text,
        activeConversationId,
        currentLanguage.code,
        selectedModel,
        systemRole,
        useSearchGrounding
      );

      const assistantMsg = {
        ...res.assistantMessage,
        searchSources: res.searchSources || res.assistantMessage.searchSources,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (currentUser) {
        await saveUserMessage(currentUser.uid, activeConversationId, assistantMsg);
        // Update conversation updated time
        const conv = conversations.find((c) => c.id === activeConversationId);
        if (conv) {
          const updatedConv = {
            ...conv,
            title: conv.title === 'New Session' || conv.title === 'Untitled Session'
              ? text.slice(0, 30) + '...'
              : conv.title,
            updatedAt: new Date().toISOString(),
          };
          await saveUserConversation(currentUser.uid, updatedConv);
        }
      }

      if (isVoiceActive || isAccessibleMode || voiceService.getSettings().autoReadResponses) {
        voiceService.speak(assistantMsg.content, currentLanguage.code);
      }

      // Refresh pending actions / incidents
      const [acts, incs] = await Promise.allSettled([fetchPendingActions(), fetchIncidents()]);
      if (acts.status === 'fulfilled') setPendingActions(acts.value);
      if (incs.status === 'fulfilled') setIncidents(incs.value);
    } catch (err: any) {
      const errorMsg: Message = {
        id: 'ast-' + Date.now(),
        conversationId: activeConversationId,
        role: 'assistant',
        content: `I've noted your input: "${text}". Query processed locally.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      if (isVoiceActive || isAccessibleMode || voiceService.getSettings().autoReadResponses) {
        voiceService.speak(errorMsg.content, currentLanguage.code);
      }
      if (currentUser) {
        await saveUserMessage(currentUser.uid, activeConversationId, errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveAction = async (actionId: string, approved: boolean) => {
    try {
      await approveAction(actionId, approved);
      setPendingActions((prev) =>
        prev.map((a) => (a.id === actionId ? { ...a, status: approved ? 'approved' : 'rejected' } : a))
      );
      setMessages((prev) =>
        prev.map((m) =>
          m.actionRequired && m.actionRequired.id === actionId
            ? {
                ...m,
                actionRequired: {
                  ...m.actionRequired,
                  status: approved ? 'approved' : 'rejected',
                },
              }
            : m
        )
      );
      // Spoken voice feedback for accessibility and safety confirmation
      voiceService.speak(
        approved ? 'Action authorized and executed safely.' : 'Action cancelled and declined.',
        currentLanguage.code
      );
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  const handleToggleAccessibleMode = async () => {
    const next = !isAccessibleMode;
    setIsAccessibleMode(next);
    try {
      window.localStorage?.setItem('echosphere_accessible_mode', String(next));
    } catch {
      // ignore
    }
    if (currentUser) {
      await saveUserPreferences(currentUser.uid, { accessibleMode: next });
    }
    voiceService.speak(
      next
        ? 'Easy Echo mode activated. Voice guidance is on and controls are simplified.'
        : 'Standard mode active.',
      currentLanguage.code
    );
  };

  const handleExecuteTool = async (name: string, params: any) => {
    try {
      await executeTool(name, params);
      const incs = await fetchIncidents();
      setIncidents(incs);
    } catch (err) {
      console.error('Tool execution error:', err);
    }
  };

  const handleToggleVoice = async () => {
    if (isVoiceActive) {
      await voiceService.stopAgoraSession();
      voiceService.stopSpeaking();
      setIsVoiceActive(false);
    } else {
      await voiceService.startAgoraSession();
      setIsVoiceActive(true);
      voiceService.speak('Voice channel link active.', currentLanguage.code);
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      voiceService.stopListening();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      voiceService.startListening(
        currentLanguage.code,
        (transcript) => {
          if (transcript.trim()) {
            setIsRecording(false);
            const lower = transcript.toLowerCase();
            const pending = pendingActions.find((a) => a.status === 'pending');
            if (
              pending &&
              (lower.includes('yes') ||
                lower.includes('authorize') ||
                lower.includes('confirm') ||
                lower.includes('proceed') ||
                lower.includes('approve') ||
                lower.includes('do it'))
            ) {
              handleApproveAction(pending.id, true);
              return;
            }
            if (
              pending &&
              (lower.includes('no') ||
                lower.includes('cancel') ||
                lower.includes('decline') ||
                lower.includes('reject') ||
                lower.includes('stop'))
            ) {
              handleApproveAction(pending.id, false);
              return;
            }
            handleSendMessage(transcript);
          }
        },
        (err) => {
          console.warn('Voice recognition error:', err);
          setIsRecording(false);
        }
      );
    }
  };

  const handleSpeakMessage = (text: string) => {
    voiceService.speak(text, currentLanguage.code);
  };

  const handleLiveTurnAddToChat = (userText: string, assistantText: string) => {
    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      conversationId: activeConversationId,
      role: 'user',
      content: userText,
      timestamp: new Date().toISOString(),
    };
    const astMsg: Message = {
      id: 'ast-' + (Date.now() + 1),
      conversationId: activeConversationId,
      role: 'assistant',
      content: assistantText,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg, astMsg]);
    if (currentUser) {
      saveUserMessage(currentUser.uid, activeConversationId, userMsg);
      saveUserMessage(currentUser.uid, activeConversationId, astMsg);
    }
  };

  return (
    <ErrorBoundary>
      <AppLayout
        currentLanguage={currentLanguage}
        onSelectLanguage={setLanguage}
        models={models}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        tools={tools}
        incidents={incidents}
        pendingActions={pendingActions}
        onExecuteTool={handleExecuteTool}
        onApproveAction={handleApproveAction}
        showTools={showTools}
        onToggleTools={() => setShowTools(!showTools)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isVoiceActive={isVoiceActive}
        onToggleVoice={handleToggleVoice}
        currentUser={currentUser}
        onSignInWithGoogle={handleSignInWithGoogle}
        onSignOut={handleSignOut}
        isSigningIn={isSigningIn}
        onOpenTranscribeModal={() => setIsTranscribeModalOpen(true)}
        onOpenLiveVoiceModal={() => setIsLiveVoiceModalOpen(true)}
        isAccessibleMode={isAccessibleMode}
        onToggleAccessibleMode={handleToggleAccessibleMode}
      >
        {isAccessibleMode ? (
          <EasyEchoMode
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            isRecording={isRecording}
            onToggleRecording={handleToggleRecording}
            onExitAccessibleMode={handleToggleAccessibleMode}
          />
        ) : (
          <HomePage
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onApproveAction={handleApproveAction}
            isRecording={isRecording}
            onToggleRecording={handleToggleRecording}
            onSpeakMessage={handleSpeakMessage}
            selectedModel={selectedModel}
            useSearchGrounding={useSearchGrounding}
            onToggleSearchGrounding={() => setUseSearchGrounding(!useSearchGrounding)}
            systemRole={systemRole}
            onSelectSystemRole={setSystemRole}
            onOpenTranscribeModal={() => setIsTranscribeModalOpen(true)}
            onOpenLiveVoiceModal={() => setIsLiveVoiceModalOpen(true)}
          />
        )}
      </AppLayout>

      <AccessibleCaptions />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectAction={(actionId) => {
          if (actionId === 'voice_start') {
            setIsLiveVoiceModalOpen(true);
          } else if (actionId === 'transcribe') {
            setIsTranscribeModalOpen(true);
          } else if (actionId === 'jira_create') {
            handleSendMessage('Please create a high-priority Jira ticket for current incident investigation.');
          } else if (actionId === 'github_prs') {
            handleSendMessage('Can you inspect our open GitHub pull requests and summarize review status?');
          } else if (actionId === 'notion_doc') {
            handleSendMessage('Generate a retrospective summary in Notion documenting recent system status.');
          }
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        integrations={integrations}
      />

      <TranscriptionModal
        isOpen={isTranscribeModalOpen}
        onClose={() => setIsTranscribeModalOpen(false)}
        currentUser={currentUser}
        onSendToChat={(text) => handleSendMessage(text)}
      />

      <LiveApiMode
        isOpen={isLiveVoiceModalOpen}
        onClose={() => setIsLiveVoiceModalOpen(false)}
        languageCode={currentLanguage.code}
        onAddToChatHistory={handleLiveTurnAddToChat}
      />
    </ErrorBoundary>
  );
}
