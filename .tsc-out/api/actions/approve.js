import { sendJson, parseJsonBody } from '../../lib/http.js';
import { db } from '../../lib/db/index.js';
export default async function approveHandler(req, res) {
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        });
        return res.end();
    }
    if (req.method === 'GET') {
        const actions = Array.from(db.actions.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return sendJson(res, 200, { actions });
    }
    if (req.method === 'POST') {
        try {
            const body = await parseJsonBody(req);
            const { actionId, approved, comment } = body;
            const action = db.actions.get(actionId);
            if (!action) {
                return sendJson(res, 404, { error: 'Action not found' });
            }
            action.status = approved ? 'approved' : 'rejected';
            // Update in conversations if present
            for (const conv of db.conversations.values()) {
                for (const msg of conv.messages) {
                    if (msg.actionRequired && msg.actionRequired.id === actionId) {
                        msg.actionRequired.status = action.status;
                    }
                }
            }
            return sendJson(res, 200, {
                success: true,
                action,
                executionResult: approved
                    ? `Action "${action.title}" executed successfully.`
                    : `Action "${action.title}" was declined by operator.`,
                comment,
            });
        }
        catch (err) {
            return sendJson(res, 500, { error: err?.message || 'Failed to process approval' });
        }
    }
    sendJson(res, 405, { error: 'Method not allowed' });
}
