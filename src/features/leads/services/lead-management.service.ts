import type {
  CreateManagedLeadInput,
  LeadSourceOption,
  ManagedLead,
  ManagedLeadsPage,
  ManagedLeadsQuery,
  OwnerOption,
  UpdateManagedLeadInput,
} from '../types/lead-management.types';

const SESSION_STORAGE_KEY = 'leadpro-crm:session';

interface StoredSession {
  user: {
    id: string;
    role: string;
  };
  accessToken: string;
}

interface BackendEnvelope<T> {
  success: true;
  data: T;
}

/** Read the stored JWT access token from localStorage. */
function getAccessToken(): string {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return '';
    const session = JSON.parse(raw) as StoredSession;
    return session.accessToken ?? '';
  } catch {
    return '';
  }
}

/** Build the authorization header for an authenticated request. */
function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Serialize a query object into a URLSearchParams string, dropping empties. */
function buildQuery(query: ManagedLeadsQuery): string {
  const params = new URLSearchParams();
  params.set('page', String(query.page));
  params.set('limit', String(query.limit));
  if (query.search?.trim()) params.set('search', query.search.trim());
  if (query.status) params.set('status', query.status);
  if (query.priority) params.set('priority', query.priority);
  if (query.sourceId !== undefined) params.set('sourceId', String(query.sourceId));
  if (query.ownerId !== undefined) params.set('ownerId', String(query.ownerId));
  if (query.companyId !== undefined) params.set('companyId', String(query.companyId));
  if (query.sort) params.set('sort', query.sort);
  if (query.order) params.set('order', query.order);
  return params.toString();
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const payload = (await response.json().catch(() => null)) as
    | BackendEnvelope<T>
    | { message?: string }
    | null;

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload
        ? payload.message
        : 'Une erreur est survenue.';
    throw new Error(message ?? 'Une erreur est survenue.');
  }

  if (!payload || !('success' in payload) || !payload.success) {
    throw new Error('Réponse API invalide.');
  }

  return payload.data;
}

/** List leads with pagination, search, filters and sorting. */
export async function listManagedLeads(
  query: ManagedLeadsQuery,
): Promise<ManagedLeadsPage> {
  return request<ManagedLeadsPage>(`/api/leads?${buildQuery(query)}`);
}

/** Fetch a single lead by id. */
export async function getManagedLead(id: number): Promise<ManagedLead> {
  return request<ManagedLead>(`/api/leads/${id}`);
}

/** Create a new lead. */
export async function createManagedLead(
  input: CreateManagedLeadInput,
): Promise<ManagedLead> {
  return request<ManagedLead>('/api/leads', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/** Update a lead's mutable fields. */
export async function updateManagedLead(
  id: number,
  input: UpdateManagedLeadInput,
): Promise<ManagedLead> {
  return request<ManagedLead>(`/api/leads/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

/** Soft-delete a lead. */
export async function deleteManagedLead(id: number): Promise<void> {
  await request<{ message: string }>(`/api/leads/${id}`, {
    method: 'DELETE',
  });
}

/** Active users for the owner select (real API, auth-only endpoint). */
export async function listOwnerOptions(): Promise<OwnerOption[]> {
  return request<OwnerOption[]>('/api/users/options');
}

/** Lead sources for filters and form selects. */
export async function listLeadSourceOptions(): Promise<LeadSourceOption[]> {
  return request<LeadSourceOption[]>('/api/leads/sources');
}
