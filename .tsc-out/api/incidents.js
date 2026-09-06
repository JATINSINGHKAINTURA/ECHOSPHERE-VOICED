import { sendJson, parseJsonBody } from '../lib/http.js';
import { db } from '../lib/db/index.js';
export default async function incidentsHandler(req, res) {
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
        });
        return res.end();
    }
    if (req.method === 'GET') {
        const incidents = Array.from(db.incidents.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return sendJson(res, 200, { incidents });
    }
    if (req.method === 'POST') {
        try {
            const body = await parseJsonBody(req);
            const id = 'INC-' + Math.floor(1000 + Math.random() * 9000);
            const newIncident = {
                id,
                title: body.title || 'Untitled Incident',
                description: body.description || 'Reported via EchoSphere AI voice command.',
                status: body.status || 'open',
                priority: body.priority || 'medium',
                service: body.service || 'core-system',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            db.incidents.set(id, newIncident);
            return sendJson(res, 201, { incident: newIncident });
        }
        catch (err) {
            return sendJson(res, 500, { error: err?.message || 'Failed to create incident' });
        }
    }
    if (req.method === 'PATCH') {
        try {
            const body = await parseJsonBody(req);
            const incident = db.incidents.get(body.id);
            if (!incident) {
                return sendJson(res, 404, { error: 'Incident not found' });
            }
            if (body.status)
                incident.status = body.status;
            if (body.priority)
                incident.priority = body.priority;
            if (body.title)
                incident.title = body.title;
            incident.updatedAt = new Date().toISOString();
            return sendJson(res, 200, { incident });
        }
        catch (err) {
            return sendJson(res, 500, { error: err?.message || 'Failed to update incident' });
        }
    }
    sendJson(res, 405, { error: 'Method not allowed' });
}
