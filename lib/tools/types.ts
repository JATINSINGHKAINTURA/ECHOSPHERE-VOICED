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

export interface ToolExecutionResult {
  tool: string;
  success: boolean;
  data?: any;
  error?: string;
  requiresApproval?: boolean;
}
