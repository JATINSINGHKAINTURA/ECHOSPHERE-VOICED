import type { IncomingMessage, ServerResponse } from 'http';
export default function toolsHandler(req: IncomingMessage, res: ServerResponse): Promise<void | ServerResponse<IncomingMessage>>;
