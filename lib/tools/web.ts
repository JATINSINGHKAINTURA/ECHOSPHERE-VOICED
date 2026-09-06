import type { ToolDefinition } from './types.js';

export const webTools: ToolDefinition[] = [
  {
    name: 'web_search',
    category: 'system',
    description: 'Search the live web for facts, news, medical guidance, or general knowledge using grounded query routing.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'The search keywords or question.' },
        depth: { type: 'string', description: 'Quick search or deep search.', enum: ['quick', 'deep'] },
      },
      required: ['query'],
    },
  },
  {
    name: 'web_page_extract',
    category: 'system',
    description: 'Extract and summarize clean readability content from any web link or URL without ads or popups.',
    parameters: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'The web page URL to inspect and extract.' },
      },
      required: ['url'],
    },
  },
  {
    name: 'browser_action',
    category: 'system',
    description: 'Perform a safe automated browser action (navigate, click, or extract tabular content).',
    parameters: {
      type: 'object',
      properties: {
        action: { type: 'string', description: 'Action type', enum: ['navigate', 'extract_table', 'read_headings'] },
        targetUrl: { type: 'string', description: 'Target website URL.' },
      },
      required: ['action', 'targetUrl'],
    },
  },
];
