import type { IncomingMessage, ServerResponse } from 'http';
import { sendJson, parseJsonBody } from '../../lib/http.js';
import { generateChatResponse } from '../../lib/ai/gemini.js';
import { db, type Message } from '../../lib/db/index.js';
import { v4 as uuidv4 } from 'uuid';

export default async function chatHandler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    });
    return res.end();
  }

  if (req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const {
        message,
        conversationId = 'conv-welcome',
        language = 'en-US',
        model = 'gemini-3.5-flash',
        systemRole = 'copilot',
        useSearchGrounding = false,
      } = body;

      if (!message || typeof message !== 'string') {
        return sendJson(res, 400, { error: 'Message text is required' });
      }

      let conv = db.conversations.get(conversationId);
      if (!conv) {
        conv = {
          id: conversationId,
          title: message.slice(0, 40) + '...',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          language,
          messages: [],
        };
        db.conversations.set(conversationId, conv);
      }

      // Add user message
      const userMsg: Message = {
        id: uuidv4(),
        conversationId,
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };
      conv.messages.push(userMsg);

      // Detect if an action should be proposed (Human in the loop - Safe Action Verification)
      let actionRequired: Message['actionRequired'] = undefined;
      const lower = message.toLowerCase();

      if (lower.includes('create ticket') || lower.includes('jira ticket') || lower.includes('file bug') || lower.includes('add task')) {
        const actionId = `ACT-${Date.now().toString().slice(-4)}`;
        const action = {
          id: actionId,
          type: 'jira_issue_create' as const,
          title: 'Create Task or Ticket',
          description: `Action requested: "${message}"`,
          payload: { summary: message, priority: 'Medium' },
          status: 'pending' as const,
          createdAt: new Date().toISOString(),
        };
        db.actions.set(actionId, action);
        actionRequired = {
          id: actionId,
          actionType: 'jira_issue_create',
          summary: `EchoSphere is asking for your permission before creating this: "${message}". Click Authorize to proceed.`,
          status: 'pending',
        };
      } else if (lower.includes('merge') || lower.includes('deploy') || lower.includes('release')) {
        const actionId = `ACT-${Date.now().toString().slice(-4)}`;
        const action = {
          id: actionId,
          type: 'github_merge' as const,
          title: 'Deploy / Code Modification',
          description: `Deploy or merge request: "${message}"`,
          payload: { action: 'deploy', target: 'production' },
          status: 'pending' as const,
          createdAt: new Date().toISOString(),
        };
        db.actions.set(actionId, action);
        actionRequired = {
          id: actionId,
          actionType: 'github_merge',
          summary: `High-impact action: You requested to deploy or merge changes. For system safety, please authorize execution.`,
          status: 'pending',
        };
      } else if (lower.includes('delete') || lower.includes('remove') || lower.includes('close incident')) {
        const actionId = `ACT-${Date.now().toString().slice(-4)}`;
        const action = {
          id: actionId,
          type: 'incident_modify' as const,
          title: 'Incident Status Change / Deletion',
          description: `Action: "${message}"`,
          payload: { status: 'resolved' },
          status: 'pending' as const,
          createdAt: new Date().toISOString(),
        };
        db.actions.set(actionId, action);
        actionRequired = {
          id: actionId,
          actionType: 'incident_modify',
          summary: `Safety Confirmation: This will update or close active incident records. Confirm to proceed.`,
          status: 'pending',
        };
      }

      // Generate AI response
      const history = conv.messages.map((m) => ({ role: m.role, content: m.content }));
      const chatResult = await generateChatResponse(
        message,
        history,
        model,
        systemRole,
        useSearchGrounding
      );

      // Add assistant message
      const assistantMsg: Message & { searchSources?: Array<{ title: string; url: string }> } = {
        id: uuidv4(),
        conversationId,
        role: 'assistant',
        content: chatResult.text,
        timestamp: new Date().toISOString(),
        actionRequired,
        searchSources: chatResult.searchSources,
      };
      conv.messages.push(assistantMsg);
      conv.updatedAt = new Date().toISOString();

      return sendJson(res, 200, {
        conversationId,
        userMessage: userMsg,
        assistantMessage: assistantMsg,
        modelUsed: chatResult.modelUsed,
        searchSources: chatResult.searchSources,
        searchQueries: chatResult.searchQueries,
      });
    } catch (err: any) {
      console.error('Chat error:', err);
      return sendJson(res, 500, { error: err?.message || 'Failed to process chat' });
    }
  }

  // GET: return messages for conversation
  const url = new URL(req.url || '', 'http://localhost');
  const convId = url.searchParams.get('conversationId') || 'conv-welcome';
  const conv = db.conversations.get(convId);

  return sendJson(res, 200, {
    conversationId: convId,
    messages: conv ? conv.messages : [],
  });
}
