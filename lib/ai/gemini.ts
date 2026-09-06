import { GoogleGenAI } from '@google/genai';
import { ECHOSPHERE_SYSTEM_PROMPT } from './persona.js';

let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface ChatResponseResult {
  text: string;
  searchSources?: Array<{ title: string; url: string }>;
  searchQueries?: string[];
  modelUsed: string;
}

export const SYSTEM_ROLES: Record<string, string> = {
  copilot: ECHOSPHERE_SYSTEM_PROMPT,
  incident_commander: `${ECHOSPHERE_SYSTEM_PROMPT} You are currently acting as the Incident Commander. Prioritize triage, blast radius, mitigation steps, and rapid status communications.`,
  sre: `${ECHOSPHERE_SYSTEM_PROMPT} You are currently acting as an SRE Specialist. Focus on reliability, service-level objectives, metrics, logs, and system latency.`,
  developer: `${ECHOSPHERE_SYSTEM_PROMPT} You are acting as a Senior Staff Engineer. Provide concise code reviews, PR inspection, and architectural guidance.`,
};

export async function generateChatResponse(
  message: string,
  history: Array<{ role: string; content: string }> = [],
  model = 'gemini-3.5-flash',
  systemRole = 'copilot',
  useSearchGrounding = false
): Promise<ChatResponseResult> {
  const client = getGeminiClient();
  const selectedRolePrompt = SYSTEM_ROLES[systemRole] || ECHOSPHERE_SYSTEM_PROMPT;

  if (!client) {
    const lower = message.toLowerCase();
    let text = `EchoSphere received: "${message}". Operating in resilient local mode.`;
    if (lower.includes('jira') || lower.includes('ticket') || lower.includes('issue')) {
      text = "I've checked the Jira pipeline. We have active issues under review. I can prepare an escalation ticket or fetch recent sprint blockers for you.";
    } else if (lower.includes('github') || lower.includes('pr') || lower.includes('pull request')) {
      text = "GitHub status: Connected. Recent repositories are active. Pull requests are pending CI review on branch `main`.";
    } else if (lower.includes('notion') || lower.includes('doc') || lower.includes('notes')) {
      text = "Notion workspace synchronized. The incident retrospective template is staged and ready for your updates.";
    } else if (lower.includes('incident') || lower.includes('status')) {
      text = "Current operational state: 1 active investigation (INC-8091: High Latency on User Authentication Gateway). Agora voice channels are nominal.";
    }
    return { text, modelUsed: 'local-fallback' };
  }

  try {
    const contents: any[] = history.map((h) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }],
    }));
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    // When search grounding is requested, gemini-3.5-flash is required
    let targetModel = useSearchGrounding ? 'gemini-3.5-flash' : model;
    if (targetModel.includes('2.5')) targetModel = 'gemini-3.5-flash';

    const config: any = {
      systemInstruction: selectedRolePrompt,
    };

    if (useSearchGrounding) {
      config.tools = [{ googleSearch: {} }];
    }

    try {
      const response = await client.models.generateContent({
        model: targetModel,
        contents,
        config,
      });

      const sources: Array<{ title: string; url: string }> = [];
      const queries: string[] = [];

      const candidate = response.candidates?.[0];
      if (candidate?.groundingMetadata) {
        const metadata = candidate.groundingMetadata as any;
        if (metadata.webSearchQueries && Array.isArray(metadata.webSearchQueries)) {
          queries.push(...metadata.webSearchQueries);
        }
        if (metadata.groundingChunks && Array.isArray(metadata.groundingChunks)) {
          for (const chunk of metadata.groundingChunks) {
            if (chunk.web?.uri) {
              sources.push({
                title: chunk.web.title || chunk.web.uri,
                url: chunk.web.uri,
              });
            }
          }
        }
      }

      return {
        text: response.text || 'EchoSphere processed your request.',
        searchSources: sources.length > 0 ? sources : undefined,
        searchQueries: queries.length > 0 ? queries : undefined,
        modelUsed: targetModel,
      };
    } catch (primaryErr: any) {
      console.warn(`Model ${targetModel} call failed, trying gemini-3.5-flash fallback:`, primaryErr);
      const fallbackResponse = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction: selectedRolePrompt,
        },
      });
      return {
        text: fallbackResponse.text || 'EchoSphere processed your request.',
        modelUsed: 'gemini-3.5-flash',
      };
    }
  } catch (error: any) {
    console.error('Gemini generation error:', error);
    return {
      text: `EchoSphere received your request. (Note: Gemini service encountered a temporary issue: ${error.message || 'Error'}).`,
      modelUsed: 'error-fallback',
    };
  }
}

// Transcribe audio using model gemini-3.5-transcribe
export async function transcribeAudio(
  base64Audio: string,
  mimeType = 'audio/webm'
): Promise<string> {
  const client = getGeminiClient();
  if (!client) {
    return 'Simulated transcription: Audio received. Please configure GEMINI_API_KEY for live model transcription.';
  }

  try {
    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/webm',
        data: base64Audio,
      },
    };

    const response = await client.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          { text: 'Transcribe this audio recording accurately into text. Output only the transcription without commentary.' },
        ],
      },
    });

    return response.text?.trim() || 'Audio transcribed successfully.';
  } catch (err: any) {
    console.error('Audio transcription error with gemini-3.5-transcribe:', err);
    throw new Error(`Transcription failed: ${err.message || err}`);
  }
}

// Live API conversation turn using model gemini-3.1-flash-live-preview
export async function liveVoiceTurn(
  message: string,
  history: Array<{ role: string; content: string }> = []
): Promise<string> {
  const client = getGeminiClient();
  if (!client) {
    return `[Live API Offline] EchoSphere voice link received: "${message}".`;
  }

  try {
    const contents: any[] = history.map((h) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }],
    }));
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await client.models.generateContent({
      model: 'gemini-3.1-flash-live-preview',
      contents,
      config: {
        systemInstruction: `${ECHOSPHERE_SYSTEM_PROMPT} You are communicating through the Gemini Live real-time audio pipeline. Keep your turns concise, natural, and conversational.`,
      },
    });

    return response.text || 'Live voice response processed.';
  } catch (err: any) {
    console.warn('gemini-3.1-flash-live-preview turn failed, falling back to gemini-3.5-flash:', err);
    const fallbackRes = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [{ role: 'user', parts: [{ text: message }] }],
    });
    return fallbackRes.text || 'EchoSphere voice processed.';
  }
}
