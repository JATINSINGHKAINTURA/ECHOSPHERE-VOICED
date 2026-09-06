import type { IncomingMessage, ServerResponse } from 'http';
export default function incidentsHandler(req: IncomingMessage, res: ServerResponse): Promise<void | ServerResponse<IncomingMessage>>;
