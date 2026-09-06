import type { IncomingMessage, ServerResponse } from 'http';
export default function conversationsHandler(req: IncomingMessage, res: ServerResponse): Promise<void | ServerResponse<IncomingMessage>>;
