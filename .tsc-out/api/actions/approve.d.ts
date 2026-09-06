import type { IncomingMessage, ServerResponse } from 'http';
export default function approveHandler(req: IncomingMessage, res: ServerResponse): Promise<void | ServerResponse<IncomingMessage>>;
