import { sendJson } from '../lib/http.js';
import { allTools } from '../lib/tools/registry.js';
export default async function docsHandler(req, res) {
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
        });
        return res.end();
    }
    sendJson(res, 200, {
        title: 'EchoSphere Agora Voice AI API',
        version: '1.0.0',
        description: 'Real-time conversational agent backend with Jira, GitHub, and Notion tool invocation.',
        endpoints: [
            { path: '/api/health', method: 'GET', description: 'Health and uptime probe' },
            { path: '/api/agora/token', method: 'GET', description: 'Retrieve Agora RTC session token' },
            { path: '/api/v1/chat', method: 'POST', description: 'Send voice/text chat turn' },
            { path: '/api/v1/conversations', method: 'GET/POST/DELETE', description: 'Manage chat threads' },
            { path: '/api/v1/models', method: 'GET', description: 'List available LLM engines' },
            { path: '/api/incidents', method: 'GET/POST/PATCH', description: 'Manage engineering incidents' },
            { path: '/api/actions/approve', method: 'GET/POST', description: 'Authorize tool actions' },
            { path: '/api/integrations/status', method: 'GET', description: 'Check external integrations' },
            { path: '/api/tools', method: 'GET/POST', description: 'List and execute tools' },
            { path: '/api/docs', method: 'GET', description: 'API reference documentation' },
        ],
        tools: allTools,
    });
}
