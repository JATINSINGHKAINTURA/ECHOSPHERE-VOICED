import { sendJson } from '../../lib/http.js';
import agoraPkg from 'agora-token';
const { RtcTokenBuilder, RtcRole } = agoraPkg;
export default async function agoraTokenHandler(req, res) {
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        });
        return res.end();
    }
    const appId = process.env.AGORA_APP_ID || 'mock-agora-app-id';
    const appCertificate = process.env.AGORA_APP_CERTIFICATE || '';
    const channelName = 'echosphere-main';
    const uid = 0; // standard 0 for RTC dynamic UID
    const role = RtcRole?.PUBLISHER ?? 1;
    const privilegeExpireTime = Math.floor(Date.now() / 1000) + 3600;
    let token = 'mock_agora_rtc_token_for_preview';
    if (appId && appCertificate && RtcTokenBuilder) {
        try {
            token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpireTime);
        }
        catch (err) {
            console.warn('Agora token generation failed, using mock token:', err);
        }
    }
    sendJson(res, 200, {
        appId,
        channelName,
        token,
        uid,
        isMock: !appCertificate || appId === 'mock-agora-app-id',
    });
}
