import type { ContactOption, CreateManagedOpportunityInput, ManagedOpportunitiesPage, ManagedOpportunitiesQuery, ManagedOpportunity, OwnerOption, PipelineOption, StageOption, UpdateManagedOpportunityInput } from '../types/opportunity-management.types';

const SESSION_STORAGE_KEY = 'leadpro-crm:session';
interface Envelope<T> { success: true; data: T }
function headers(): Record<string, string> {
  try { const raw = localStorage.getItem(SESSION_STORAGE_KEY); const token = raw ? (JSON.parse(raw) as { accessToken?: string }).accessToken : ''; return token ? { Authorization: `Bearer ${token}` } : {}; } catch { return {}; }
}
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...init, headers: { 'Content-Type': 'application/json', ...headers(), ...(init?.headers ?? {}) } });
  const payload = await response.json().catch(() => null) as Envelope<T> | { message?: string } | null;
  if (!response.ok) throw new Error(payload && 'message' in payload ? payload.message || 'Une erreur est survenue.' : 'Une erreur est survenue.');
  if (!payload || !('success' in payload) || !payload.success) throw new Error('Réponse API invalide.');
  return payload.data;
}
function queryString(query: ManagedOpportunitiesQuery) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => { if (value !== undefined && value !== '') params.set(key, String(value)); });
  return params.toString();
}
export const listManagedOpportunities = (query: ManagedOpportunitiesQuery) => request<ManagedOpportunitiesPage>(`/api/opportunities?${queryString(query)}`);
export const getManagedOpportunity = (id: number) => request<ManagedOpportunity>(`/api/opportunities/${id}`);
export const createManagedOpportunity = (input: CreateManagedOpportunityInput) => request<ManagedOpportunity>('/api/opportunities', { method: 'POST', body: JSON.stringify(input) });
export const updateManagedOpportunity = (id: number, input: UpdateManagedOpportunityInput) => request<ManagedOpportunity>(`/api/opportunities/${id}`, { method: 'PUT', body: JSON.stringify(input) });
export const deleteManagedOpportunity = (id: number) => request<{ message: string }>(`/api/opportunities/${id}`, { method: 'DELETE' }).then(() => undefined);
export const listOpportunityFilters = () => request<{ pipelines: PipelineOption[]; stages: StageOption[] }>('/api/opportunities/filters');
export const listOwners = () => request<OwnerOption[]>('/api/users/options');
export const listCompanies = () => request<{ items: OpportunityOption[] }>('/api/companies?page=1&limit=100&sort=name&order=asc').then((page) => page.items);
export const listContacts = () => request<{ items: ContactOption[] }>('/api/contacts?page=1&limit=100&sort=first_name&order=asc').then((page) => page.items);
