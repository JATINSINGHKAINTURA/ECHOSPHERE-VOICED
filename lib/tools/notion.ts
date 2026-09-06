import type { ToolDefinition } from './types.js';

export const notionTools: ToolDefinition[] = [
  {
    name: 'notion_create_page',
    category: 'notion',
    description: 'Create a new documentation page or incident debrief in Notion.',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Page title' },
        content: { type: 'string', description: 'Markdown content for the page' },
        parentPageId: { type: 'string', description: 'Optional parent page ID' },
      },
      required: ['title', 'content'],
    },
  },
  {
    name: 'notion_search_docs',
    category: 'notion',
    description: 'Search documentation and playbooks in Notion.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search keywords' },
      },
      required: ['query'],
    },
  },
];
