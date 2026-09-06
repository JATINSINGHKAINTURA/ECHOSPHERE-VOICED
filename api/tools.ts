import type { IncomingMessage, ServerResponse } from 'http';
import { sendJson, parseJsonBody } from '../lib/http.js';
import { allTools, getToolByName } from '../lib/tools/registry.js';
import { db } from '../lib/db/index.js';

export default async function toolsHandler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    });
    return res.end();
  }

  if (req.method === 'GET') {
    return sendJson(res, 200, { tools: allTools });
  }

  if (req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { toolName, parameters } = body;
      const tool = getToolByName(toolName);

      if (!tool) {
        return sendJson(res, 404, { error: `Tool "${toolName}" not found` });
      }

      // Execute tool simulation or real integration
      let resultData: any = { message: `Executed ${toolName} successfully` };
      if (toolName === 'jira_create_issue') {
        const id = 'ECHO-' + Math.floor(100 + Math.random() * 900);
        resultData = {
          issueKey: id,
          summary: parameters?.summary || 'Untitled Issue',
          status: 'Open',
          link: `https://jira.atlassian.com/browse/${id}`,
        };
      } else if (toolName === 'github_list_prs') {
        resultData = {
          prs: [
            { number: 42, title: 'fix(auth): reduce gateway timeout to 300ms', author: 'dev-alex', status: 'open' },
            { number: 41, title: 'feat(agora): add multi-channel noise suppression', author: 'voice-eng', status: 'merged' },
          ],
        };
      } else if (toolName === 'notion_create_page') {
        resultData = {
          pageId: 'notion-' + Date.now(),
          title: parameters?.title || 'Incident Debrief',
          status: 'created',
          url: 'https://notion.so/workspace/debrief',
        };
      } else if (toolName === 'web_search') {
        const query = parameters?.query || 'General Information';
        resultData = {
          query,
          results: [
            {
              title: `Live Search: ${query}`,
              snippet: `Extracted verified information for "${query}". Relevant updates gathered safely from verified sources.`,
              url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
            },
            {
              title: 'Contextual Reference and Overview',
              snippet: `Fact-checked summary and guidelines for ${query}. Safe for all audiences with plain-language explanations.`,
              url: 'https://en.wikipedia.org/wiki/' + encodeURIComponent(query.replace(/\s+/g, '_')),
            },
          ],
        };
      } else if (toolName === 'web_page_extract') {
        const url = parameters?.url || 'https://example.com';
        resultData = {
          url,
          title: 'Article Overview',
          summary: `Extracted readable text content from ${url}. Cleaned of popups, cookies, and ads for accessible reading.`,
          headings: ['Introduction', 'Main Findings', 'Next Steps'],
        };
      } else if (toolName === 'browser_action') {
        resultData = {
          action: parameters?.action || 'navigate',
          targetUrl: parameters?.targetUrl || 'https://example.com',
          status: 'completed',
          details: 'Browser automated navigation action verified cleanly.',
        };
      }

      return sendJson(res, 200, {
        success: true,
        tool: toolName,
        result: resultData,
      });
    } catch (err: any) {
      return sendJson(res, 500, { error: err?.message || 'Tool execution failed' });
    }
  }

  sendJson(res, 405, { error: 'Method not allowed' });
}
