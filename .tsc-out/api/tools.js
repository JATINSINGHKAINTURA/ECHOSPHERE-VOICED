import { sendJson, parseJsonBody } from '../lib/http.js';
import { allTools, getToolByName } from '../lib/tools/registry.js';
export default async function toolsHandler(req, res) {
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        });
        return res.end();
    }
    if (req.method === 'GET') {
        return sendJson(res, 200, { tools: allTools });
    }
    if (req.method === 'POST') {
        try {
            const body = await parseJsonBody(req);
            const { toolName, parameters } = body;
            const tool = getToolByName(toolName);
            if (!tool) {
                return sendJson(res, 404, { error: `Tool "${toolName}" not found` });
            }
            // Execute tool simulation or real integration
            let resultData = { message: `Executed ${toolName} successfully` };
            if (toolName === 'jira_create_issue') {
                const id = 'ECHO-' + Math.floor(100 + Math.random() * 900);
                resultData = {
                    issueKey: id,
                    summary: parameters?.summary || 'Untitled Issue',
                    status: 'Open',
                    link: `https://jira.atlassian.com/browse/${id}`,
                };
            }
            else if (toolName === 'github_list_prs') {
                resultData = {
                    prs: [
                        { number: 42, title: 'fix(auth): reduce gateway timeout to 300ms', author: 'dev-alex', status: 'open' },
                        { number: 41, title: 'feat(agora): add multi-channel noise suppression', author: 'voice-eng', status: 'merged' },
                    ],
                };
            }
            else if (toolName === 'notion_create_page') {
                resultData = {
                    pageId: 'notion-' + Date.now(),
                    title: parameters?.title || 'Incident Debrief',
                    status: 'created',
                    url: 'https://notion.so/workspace/debrief',
                };
            }
            return sendJson(res, 200, {
                success: true,
                tool: toolName,
                result: resultData,
            });
        }
        catch (err) {
            return sendJson(res, 500, { error: err?.message || 'Tool execution failed' });
        }
    }
    sendJson(res, 405, { error: 'Method not allowed' });
}
