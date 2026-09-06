import type { ToolDefinition } from './types.js';

export const githubTools: ToolDefinition[] = [
  {
    name: 'github_list_prs',
    category: 'github',
    description: 'List open pull requests for the configured repository.',
    parameters: {
      type: 'object',
      properties: {
        repo: { type: 'string', description: 'Repository name (e.g., owner/repo)' },
        state: { type: 'string', description: 'open, closed, or all', enum: ['open', 'closed', 'all'] },
      },
      required: [],
    },
  },
  {
    name: 'github_create_issue',
    category: 'github',
    description: 'Create a GitHub issue in the repository.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Issue title' },
        body: { type: 'string', description: 'Issue description' },
        labels: { type: 'string', description: 'Comma-separated labels' },
      },
      required: ['title'],
    },
  },
];
