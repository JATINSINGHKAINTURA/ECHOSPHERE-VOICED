import type { Conversation } from '../types/chat.js';

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-welcome',
    title: 'EchoSphere System Setup',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    language: 'en-US',
    messages: [
      {
        id: 'msg-1',
        conversationId: 'conv-welcome',
        role: 'assistant',
        content: "Welcome to EchoSphere Agora AI! I'm your voice-first intelligence agent. I can monitor incidents, coordinate with Jira, inspect GitHub pull requests, and organize Notion documentation in real-time. Speak or type a command to begin.",
        timestamp: new Date().toISOString(),
      },
    ],
  },
];
