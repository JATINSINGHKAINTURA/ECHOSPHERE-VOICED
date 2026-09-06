import { sendJson } from '../../lib/http.js';
export default async function modelsHandler(req, res) {
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
        });
        return res.end();
    }
    const models = [
        {
            id: 'gemini-2.5-flash',
            name: 'Gemini 2.5 Flash',
            provider: 'Google',
            latency: 'Sub-second',
            isDefault: true,
            description: 'Optimized for high-speed voice and real-time interaction.',
        },
        {
            id: 'gemini-2.5-pro',
            name: 'Gemini 2.5 Pro',
            provider: 'Google',
            latency: 'High Reasoning',
            isDefault: false,
            description: 'Advanced reasoning for complex incident retrospectives and code analysis.',
        },
    ];
    sendJson(res, 200, { models });
}
