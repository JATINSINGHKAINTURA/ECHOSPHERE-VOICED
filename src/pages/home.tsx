import React from 'react';
import { ChatWindow } from '../components/chat/chatwindow.js';
import type { Message } from '../types/chat.js';

interface HomePageProps {
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

export const HomePage: React.FC<HomePageProps> = (props) => {
  return <ChatWindow {...props} />;
};
