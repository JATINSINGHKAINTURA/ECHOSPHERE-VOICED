import type { IncomingMessage, ServerResponse } from 'http';
import { sendJson } from '../lib/http.js';

export default async function healthHandler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    });
    return res.end();
  }

  sendJson(res, 200, {
    status: 'ok',
    service: 'EchoSphere Agora AI',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '0.1.0',
  });
}
