import type { IncomingMessage, ServerResponse } from 'http';
import { sendJson } from '../../lib/http.js';

export default async function modelsHandler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    });
    return res.end();
  }

  const models = [
    {
      id: 'gemini-3.5-flash',
      name: 'Gemini 3.5 Flash',
      provider: 'Google',
      latency: 'Sub-second',
      isDefault: true,
      description: 'Default model for general multi-turn tasks & Google Search Grounding.',
      category: 'general',
    },
    {
      id: 'gemini-3.1-flash-lite',
      name: 'Gemini 3.1 Flash Lite',
      provider: 'Google',
      latency: 'Ultra-fast',
      isDefault: false,
      description: 'High-speed model optimized for tasks that should happen fast.',
      category: 'fast',
    },
    {
      id: 'gemini-3.1-pro-preview',
      name: 'Gemini 3.1 Pro',
      provider: 'Google',
      latency: 'High Reasoning',
      isDefault: false,
      description: 'Advanced reasoning for particularly complex tasks and architecture.',
      category: 'complex',
    },
    {
      id: 'gemini-3.1-flash-live-preview',
      name: 'Gemini 3.1 Flash Live',
      provider: 'Google',
      latency: 'Real-time Audio',
      isDefault: false,
      description: 'Live API model for conversational voice and real-time audio interaction.',
      category: 'live-voice',
    },
    {
      id: 'gemini-3.5-transcribe',
      name: 'Gemini 3.5 Transcribe',
      provider: 'Google',
      latency: 'Low',
      isDefault: false,
      description: 'Specialized speech-to-text audio transcription model.',
      category: 'transcribe',
    },
  ];

  return sendJson(res, 200, { models });
}
