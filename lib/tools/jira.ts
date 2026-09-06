import type { ToolDefinition } from './types.js';

export const jiraTools: ToolDefinition[] = [
  {
    name: 'jira_create_issue',
    category: 'jira',
    description: 'Create a new issue or incident ticket in Jira.',
    parameters: {
      type: 'object',
      properties: {
        summary: { type: 'string', description: 'Summary or title of the ticket' },
        description: { type: 'string', description: 'Detailed problem description' },
        issueType: { type: 'string', description: 'Bug, Task, or Incident', enum: ['Bug', 'Task', 'Incident'] },
        priority: { type: 'string', description: 'Priority level', enum: ['Low', 'Medium', 'High', 'Critical'] },
      },
      required: ['summary'],
    },
  },
  {
    name: 'jira_search_issues',
    category: 'jira',
    description: 'Search Jira issues using JQL or keyword query.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Text or JQL search query' },
        limit: { type: 'string', description: 'Maximum number of results to return' },
      },
      required: ['query'],
    },
  },
];
