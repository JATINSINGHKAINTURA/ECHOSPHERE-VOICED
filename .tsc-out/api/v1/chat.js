import { sendJson, parseJsonBody } from '../../lib/http.js';
import { generateChatResponse } from '../../lib/ai/gemini.js';
import { db } from '../../lib/db/index.js';
import { v4 as uuidv4 } from 'uuid';
export default async function chatHandler(req, res) {
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
            const { message, conversationId = 'conv-welcome', language = 'en-US' } = body;
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
            const userMsg = {
                id: uuidv4(),
                conversationId,
                role: 'user',
                content: message,
                timestamp: new Date().toISOString(),
            };
            conv.messages.push(userMsg);
            // Detect if an action should be proposed (Human in the loop)
            let actionRequired = undefined;
            const lower = message.toLowerCase();
            if (lower.includes('create ticket') || lower.includes('jira ticket') || lower.includes('file bug')) {
                const actionId = `ACT-${Date.now().toString().slice(-4)}`;
                const action = {
                    id: actionId,
                    type: 'jira_issue_create',
                    title: 'Create Jira Ticket',
                    description: `Auto-generated from voice command: "${message}"`,
                    payload: { summary: message, priority: 'Medium' },
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                };
                db.actions.set(actionId, action);
                actionRequired = {
                    id: actionId,
                    actionType: 'jira_issue_create',
                    summary: 'Authorize Jira issue creation: ' + message,
                    status: 'pending',
                };
            }
            // Generate AI response
            const history = conv.messages.map((m) => ({ role: m.role, content: m.content }));
            const responseText = await generateChatResponse(message, history);
            // Add assistant message
            const assistantMsg = {
                id: uuidv4(),
                conversationId,
                role: 'assistant',
                content: responseText,
                timestamp: new Date().toISOString(),
                actionRequired,
            };
            conv.messages.push(assistantMsg);
            conv.updatedAt = new Date().toISOString();
            return sendJson(res, 200, {
                conversationId,
                userMessage: userMsg,
                assistantMessage: assistantMsg,
            });
        }
        catch (err) {
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
