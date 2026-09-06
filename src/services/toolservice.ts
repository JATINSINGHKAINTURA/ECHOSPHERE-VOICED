import { request } from './httpclient.js';
import type { ToolDefinition, Incident, PendingAction } from '../types/tools.js';

export async function fetchTools(): Promise<ToolDefinition[]> {
  const res = await request<{ tools: ToolDefinition[] }>('/api/tools');
  return res.tools || [];
}

export async function executeTool(toolName: string, parameters: Record<string, any>): Promise<any> {
  return request('/api/tools', {
    method: 'POST',
    body: JSON.stringify({ toolName, parameters }),
  });
}

export async function fetchIncidents(): Promise<Incident[]> {
  const res = await request<{ incidents: Incident[] }>('/api/incidents');
  return res.incidents || [];
}

export async function createIncident(incident: Partial<Incident>): Promise<Incident> {
  const res = await request<{ incident: Incident }>('/api/incidents', {
    method: 'POST',
    body: JSON.stringify(incident),
  });
  return res.incident;
}

export async function fetchPendingActions(): Promise<PendingAction[]> {
  const res = await request<{ actions: PendingAction[] }>('/api/actions/approve');
  return res.actions || [];
}
