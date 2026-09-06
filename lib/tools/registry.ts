import { jiraTools } from './jira.js';
import { githubTools } from './github.js';
import { notionTools } from './notion.js';
import { workspaceTools } from './workspace.js';
import { webTools } from './web.js';
import { browserTools } from './browser.js';
import type { ToolDefinition } from './types.js';

export const allTools: ToolDefinition[] = [
  ...jiraTools,
  ...githubTools,
  ...notionTools,
  ...workspaceTools,
  ...webTools,
  ...browserTools,
];

export function getToolByName(name: string): ToolDefinition | undefined {
  return allTools.find((t) => t.name === name);
}
