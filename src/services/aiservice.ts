import { request } from './httpclient.js';
import type { ModelInfo, IntegrationStatus } from '../types/index.js';

export async function fetchModels(): Promise<ModelInfo[]> {
  const res = await request<{ models: ModelInfo[] }>('/api/v1/models');
  return res.models || [];
}

export async function fetchIntegrations(): Promise<Record<string, IntegrationStatus>> {
  const res = await request<{ integrations: Record<string, IntegrationStatus> }>('/api/integrations/status');
  return res.integrations || {};
}
