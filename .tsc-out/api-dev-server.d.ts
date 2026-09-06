import type { IncomingMessage, ServerResponse } from 'http';
export declare function handleApiRequest(req: IncomingMessage, res: ServerResponse, next: () => void): Promise<void | ServerResponse<IncomingMessage>>;
