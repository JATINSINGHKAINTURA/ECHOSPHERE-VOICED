export interface SearchSource {
  title: string;
  url: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  modelUsed?: string;
  searchSources?: SearchSource[];
  toolCalls?: Array<{
    name: string;
    params: Record<string, any>;
    result?: any;
  }>;
  actionRequired?: {
    id: string;
    actionType: string;
    summary: string;
    status: 'pending' | 'approved' | 'rejected';
  };
}

export interface Conversation {
  id: string;
  userId?: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  language?: string;
  model?: string;
  systemRole?: string;
  searchGrounding?: boolean;
  messages: Message[];
}
