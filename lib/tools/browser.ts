import type { ToolDefinition } from './types.js';

export const browserTools: ToolDefinition[] = [
  {
    name: 'open_website',
    category: 'system',
    description: 'Open a website in a new browser tab via voice command. Handles YouTube, Google, Wikipedia, and any URL. For ambiguous requests, the agent should first ask for clarification rather than guessing. Supports search queries.',
    parameters: {
      type: 'object',
      properties: {
        site: { type: 'string', description: 'Website name or URL (e.g., youtube, google, wikipedia, or https://youtube.com). Supported: youtube, google, wikipedia, github, notion, or any URL.' },
        query: { type: 'string', description: 'Search query or content to find after opening (e.g., football highlights, quantum computing). Leave empty to just open homepage.' },
        action: { type: 'string', description: 'Action to perform', enum: ['open', 'search', 'play'] },
      },
      required: ['site'],
    },
  },
  {
    name: 'browser_navigate',
    category: 'system',
    description: 'Voice-controlled browser navigation. Opens a new tab, navigates to a site, searches for content, and reports result via voice. Use when user says "open YouTube and play X" or "search for Y" or "go to Z". Always ask for missing specifics before executing. Requires user confirmation for new tabs.',
    parameters: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Full URL to open (constructed from site + query). For YouTube search: https://www.youtube.com/results?search_query=QUERY' },
        site: { type: 'string', description: 'Site name for voice feedback' },
        query: { type: 'string', description: 'Search term for voice feedback' },
        voiceConfirm: { type: 'string', description: 'Voice confirmation message to speak after opening' },
      },
      required: ['url', 'site'],
    },
  },
];
