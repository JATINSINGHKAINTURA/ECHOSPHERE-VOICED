export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
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
  title: string;
  createdAt: string;
  updatedAt: string;
  language?: string;
  messages: Message[];
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  service: string;
  createdAt: string;
  updatedAt: string;
}

export interface PendingAction {
  id: string;
  type: 'jira_issue_create' | 'github_pr_review' | 'notion_page_update' | 'github_merge' | 'incident_modify' | string;
  title: string;
  description: string;
  payload: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// In-Memory Database Store (resilient, instant startup, mock-backed as per AI Studio guidelines)
class InMemoryStore {
  conversations: Map<string, Conversation> = new Map();
  incidents: Map<string, Incident> = new Map();
  actions: Map<string, PendingAction> = new Map();

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    const defaultConvId = 'conv-welcome';
    this.conversations.set(defaultConvId, {
      id: defaultConvId,
      title: 'EchoSphere System Setup',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      language: 'en-US',
      messages: [
        {
          id: 'msg-1',
          conversationId: defaultConvId,
          role: 'assistant',
          content: "Welcome to EchoSphere Agora AI! I'm your voice-first intelligence agent. I can monitor incidents, coordinate with Jira, inspect GitHub pull requests, and organize Notion documentation in real-time. Speak or type a command to begin.",
          timestamp: new Date().toISOString(),
        },
      ],
    });

    const incident1: Incident = {
      id: 'INC-8091',
      title: 'High Latency on User Authentication Gateway',
      description: 'API gateway reporting p99 latency spike > 1200ms across EU edge nodes.',
      status: 'investigating',
      priority: 'high',
      service: 'auth-gateway',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.incidents.set(incident1.id, incident1);

    const action1: PendingAction = {
      id: 'ACT-101',
      type: 'jira_issue_create',
      title: 'Create Jira Escalation Ticket',
      description: 'Create hotfix ticket for Authentication Gateway p99 degradation.',
      payload: {
        projectKey: process.env.JIRA_PROJECT_KEY || 'ECHO',
        issueType: 'Bug',
        summary: 'Hotfix: Auth Gateway Edge Routing Timeout',
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.actions.set(action1.id, action1);
  }
}

export const db = new InMemoryStore();
