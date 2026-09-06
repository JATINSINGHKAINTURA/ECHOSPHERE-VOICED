import type { IncomingMessage, ServerResponse } from 'http';
export default function chatHandler(req: IncomingMessage, res: ServerResponse): Promise<void | ServerResponse<IncomingMessage>>;
