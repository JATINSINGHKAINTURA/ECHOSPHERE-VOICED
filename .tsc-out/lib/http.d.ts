import type { IncomingMessage, ServerResponse } from 'http';
export declare function parseJsonBody<T = any>(req: IncomingMessage): Promise<T>;
export declare function sendJson(res: ServerResponse, statusCode: number, data: any): void;
