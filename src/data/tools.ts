import type { ToolDefinition } from '../types/tools.js';

export const INITIAL_TOOLS: ToolDefinition[] = [
  {
    name: 'jira_create_issue',
    category: 'jira',
    description: 'Create an issue or bug escalation in Jira',
    parameters: {
      type: 'object',
      properties: {
        summary: { type: 'string', description: 'Ticket headline' },
        description: { type: 'string', description: 'Details' },
      },
      required: ['summary'],
    },
  },
  {
    name: 'github_list_prs',
    category: 'github',
    description: 'Inspect open pull requests and deployment statuses',
    parameters: {
      type: 'object',
      properties: {
        repo: { type: 'string', description: 'Repository' },
      },
      required: [],
    },
  },
  {
    name: 'notion_create_page',
    category: 'notion',
    description: 'Record incident notes and summaries to Notion',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Doc title' },
        content: { type: 'string', description: 'Markdown notes' },
      },
      required: ['title', 'content'],
    },
  },
];
