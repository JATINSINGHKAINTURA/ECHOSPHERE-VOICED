import type { IncomingMessage, ServerResponse } from 'http';
import { sendJson, parseJsonBody } from '../../lib/http.js';
import { liveVoiceTurn } from '../../lib/ai/gemini.js';

export default async function liveTurnHandler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { message, history = [] } = body;

      if (!message || typeof message !== 'string') {
        return sendJson(res, 400, { error: 'Message text is required' });
      }

      const responseText = await liveVoiceTurn(message, history);
      return sendJson(res, 200, {
        response: responseText,
        model: 'gemini-3.1-flash-live-preview',
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('Live voice turn error:', err);
      return sendJson(res, 500, {
        error: err.message || 'Live voice conversation failed',
      });
    }
  }

  return sendJson(res, 405, { error: 'Method not allowed' });
}
