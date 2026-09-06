import type { IncomingMessage, ServerResponse } from 'http';
export default function agoraTokenHandler(req: IncomingMessage, res: ServerResponse): Promise<ServerResponse<IncomingMessage> | undefined>;
