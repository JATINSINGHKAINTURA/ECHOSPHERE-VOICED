import type { IncomingMessage, ServerResponse } from 'http';
export default function modelsHandler(req: IncomingMessage, res: ServerResponse): Promise<ServerResponse<IncomingMessage> | undefined>;
