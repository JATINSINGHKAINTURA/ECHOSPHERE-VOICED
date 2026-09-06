import { request } from './httpclient.js';
import type { Conversation, Message } from '../types/chat.js';

export async function fetchConversations(): Promise<Conversation[]> {
  const res = await request<{ conversations: Conversation[] }>('/api/v1/conversations');
  return res.conversations || [];
}

export async function createConversation(title?: string, language?: string): Promise<Conversation> {
  const res = await request<{ conversation: Conversation }>('/api/v1/conversations', {
    method: 'POST',
    body: JSON.stringify({ title, language }),
  });
  return res.conversation;
}

export async function sendChatMessage(
  message: string,
  conversationId: string,
  language = 'en-US',
  model = 'gemini-3.5-flash',
  systemRole = 'copilot',
  useSearchGrounding = false
): Promise<{
  userMessage: Message;
  assistantMessage: Message & { searchSources?: Array<{ title: string; url: string }> };
  modelUsed?: string;
  searchSources?: Array<{ title: string; url: string }>;
  searchQueries?: string[];
}> {
  return request('/api/v1/chat', {
    method: 'POST',
    body: JSON.stringify({
      message,
      conversationId,
      language,
      model,
      systemRole,
      useSearchGrounding,
    }),
  });
}

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  const res = await request<{ messages: Message[] }>(`/api/v1/chat?conversationId=${conversationId}`);
  return res.messages || [];
}

export async function approveAction(actionId: string, approved: boolean): Promise<any> {
  return request('/api/actions/approve', {
    method: 'POST',
    body: JSON.stringify({ actionId, approved }),
  });
}

export async function sendLiveTurn(
  message: string,
  history: Array<{ role: string; content: string }> = []
): Promise<{ response: string; model: string }> {
  return request<{ response: string; model: string }>('/api/live/turn', {
    method: 'POST',
    body: JSON.stringify({ message, history }),
  });
}
