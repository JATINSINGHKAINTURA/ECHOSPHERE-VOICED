import { sendJson } from '../../lib/http.js';
export default async function statusHandler(req, res) {
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
        });
        return res.end();
    }
    const integrations = {
        agora: {
            name: 'Agora Real-Time Voice',
            configured: Boolean(process.env.AGORA_APP_ID && process.env.AGORA_APP_CERTIFICATE),
            status: 'active',
            details: process.env.AGORA_APP_ID ? 'Custom App ID connected' : 'Default RTC simulation mode active',
        },
        gemini: {
            name: 'Google Gemini AI',
            configured: Boolean(process.env.GEMINI_API_KEY),
            status: process.env.GEMINI_API_KEY ? 'active' : 'fallback-ready',
            details: process.env.GEMINI_API_KEY ? 'Gemini 2.5 Flash active' : 'Local responsive heuristic mode active',
        },
        jira: {
            name: 'Atlassian Jira',
            configured: Boolean(process.env.JIRA_API_TOKEN && process.env.JIRA_BASE_URL),
            status: process.env.JIRA_API_TOKEN ? 'connected' : 'sandbox',
            details: process.env.JIRA_BASE_URL || 'Sandbox Jira project ECHO-1',
        },
        github: {
            name: 'GitHub Enterprise / Cloud',
            configured: Boolean(process.env.GITHUB_TOKEN),
            status: process.env.GITHUB_TOKEN ? 'connected' : 'sandbox',
            details: 'Issue & PR workflow automation active',
        },
        notion: {
            name: 'Notion Workspace',
            configured: Boolean(process.env.NOTION_TOKEN),
            status: process.env.NOTION_TOKEN ? 'connected' : 'sandbox',
            details: 'Knowledge base and runbooks synced',
        },
    };
    sendJson(res, 200, { integrations });
}
