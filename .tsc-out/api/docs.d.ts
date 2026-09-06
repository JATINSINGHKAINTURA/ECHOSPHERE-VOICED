import type { IncomingMessage, ServerResponse } from 'http';
export default function docsHandler(req: IncomingMessage, res: ServerResponse): Promise<ServerResponse<IncomingMessage> | undefined>;
