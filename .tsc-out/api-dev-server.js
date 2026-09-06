import healthHandler from './api/health.js';
import chatHandler from './api/v1/chat.js';
import conversationsHandler from './api/v1/conversations.js';
import incidentsHandler from './api/incidents.js';
import agoraTokenHandler from './api/agora/token.js';
import approveHandler from './api/actions/approve.js';
import statusHandler from './api/integrations/status.js';
import modelsHandler from './api/v1/models.js';
import toolsHandler from './api/tools.js';
import docsHandler from './api/docs.js';
export async function handleApiRequest(req, res, next) {
    const rawUrl = req.url || '';
    const url = new URL(rawUrl, 'http://localhost');
    const pathname = url.pathname;
    if (pathname === '/health' || pathname === '/api/health') {
        return healthHandler(req, res);
    }
    if (pathname === '/v1/chat' || pathname === '/api/v1/chat') {
        return chatHandler(req, res);
    }
    if (pathname === '/v1/conversations' || pathname === '/api/v1/conversations') {
        return conversationsHandler(req, res);
    }
    if (pathname === '/incidents' || pathname === '/api/incidents') {
        return incidentsHandler(req, res);
    }
    if (pathname === '/agora/token' || pathname === '/api/agora/token') {
        return agoraTokenHandler(req, res);
    }
    if (pathname === '/actions/approve' || pathname === '/api/actions/approve') {
        return approveHandler(req, res);
    }
    if (pathname === '/integrations/status' || pathname === '/api/integrations/status') {
        return statusHandler(req, res);
    }
    if (pathname === '/v1/models' || pathname === '/api/v1/models') {
        return modelsHandler(req, res);
    }
    if (pathname === '/tools' || pathname === '/api/tools') {
        return toolsHandler(req, res);
    }
    if (pathname === '/docs' || pathname === '/api/docs') {
        return docsHandler(req, res);
    }
    next();
}
