import { request } from './httpclient.js';

export interface TranscribeResult {
  text: string;
  model: string;
  timestamp: string;
}

export async function transcribeAudio(
  base64Audio: string,
  mimeType = 'audio/webm'
): Promise<TranscribeResult> {
  return request<TranscribeResult>('/api/transcribe', {
    method: 'POST',
    body: JSON.stringify({ audio: base64Audio, mimeType }),
  });
}
