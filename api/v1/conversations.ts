import type { IncomingMessage, ServerResponse } from 'http';
import { sendJson, parseJsonBody } from '../../lib/http.js';
import { db } from '../../lib/db/index.js';
import { v4 as uuidv4 } from 'uuid';

export default async function conversationsHandler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    });
    return res.end();
  }

  if (req.method === 'GET') {
    const list = Array.from(db.conversations.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    return sendJson(res, 200, { conversations: list });
  }

  if (req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const id = 'conv-' + uuidv4().slice(0, 8);
      const newConv = {
        id,
        title: body.title || 'New Voice Session',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        language: body.language || 'en-US',
        messages: [
          {
            id: 'msg-' + Date.now(),
            conversationId: id,
            role: 'assistant' as const,
            content: "I'm listening. Speak or type your request.",
            timestamp: new Date().toISOString(),
          },
        ],
      };
      db.conversations.set(id, newConv);
      return sendJson(res, 201, { conversation: newConv });
    } catch (err: any) {
      return sendJson(res, 500, { error: err?.message || 'Failed to create conversation' });
    }
  }

  if (req.method === 'DELETE') {
    const url = new URL(req.url || '', 'http://localhost');
    const id = url.searchParams.get('id');
    if (id) {
      db.conversations.delete(id);
    }
    return sendJson(res, 200, { success: true });
  }

  sendJson(res, 405, { error: 'Method not allowed' });
}
