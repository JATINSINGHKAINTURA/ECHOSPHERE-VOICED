import type { IncomingMessage, ServerResponse } from 'http';
import { sendJson, parseJsonBody } from '../lib/http.js';
import { transcribeAudio } from '../lib/ai/gemini.js';

export default async function transcribeHandler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { audio, mimeType = 'audio/webm' } = body;

      if (!audio || typeof audio !== 'string') {
        return sendJson(res, 400, { error: 'Base64 audio data is required' });
      }

      // Strip data url prefix if provided (e.g. data:audio/webm;base64,...)
      const base64Data = audio.replace(/^data:[^;]+;base64,/, '');

      const text = await transcribeAudio(base64Data, mimeType);
      return sendJson(res, 200, {
        text,
        model: 'gemini-3.5-transcribe',
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('Transcribe endpoint error:', err);
      return sendJson(res, 500, {
        error: err.message || 'Audio transcription failed',
      });
    }
  }

  return sendJson(res, 405, { error: 'Method not allowed' });
}
