import type { ToolDefinition } from './types.js';

export const workspaceTools: ToolDefinition[] = [
  {
    name: 'workspace_incident_summary',
    category: 'workspace',
    description: 'Compile an incident retrospective and cross-reference Jira, GitHub PRs, and Notion docs.',
    parameters: {
      type: 'object',
      properties: {
        incidentId: { type: 'string', description: 'Incident reference ID' },
      },
      required: ['incidentId'],
    },
  },
];
