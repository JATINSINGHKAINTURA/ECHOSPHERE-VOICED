export interface ToolDefinition {
  name: string;
  category: 'jira' | 'github' | 'notion' | 'agora' | 'system' | 'workspace';
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, { type: string; description: string; enum?: string[] }>;
    required: string[];
  };
}

export interface PendingAction {
  id: string;
  type: string;
  title: string;
  description: string;
  payload: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
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
