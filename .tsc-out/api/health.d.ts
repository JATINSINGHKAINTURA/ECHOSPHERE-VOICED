import type { IncomingMessage, ServerResponse } from 'http';
export default function healthHandler(req: IncomingMessage, res: ServerResponse): Promise<ServerResponse<IncomingMessage> | undefined>;
