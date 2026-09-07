import type {
  CreateManagedContactInput,
  ManagedContact,
  ManagedContactsPage,
  ManagedContactsQuery,
  OwnerOption,
  UpdateManagedContactInput,
} from '../types/contact-management.types';

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
function buildQuery(query: ManagedContactsQuery): string {
  const params = new URLSearchParams();
  params.set('page', String(query.page));
  params.set('limit', String(query.limit));
  if (query.search?.trim()) params.set('search', query.search.trim());
  if (query.companyId !== undefined) params.set('companyId', String(query.companyId));
  if (query.ownerId !== undefined) params.set('ownerId', String(query.ownerId));
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

/** List contacts with pagination, search, filters and sorting. */
export async function listManagedContacts(
  query: ManagedContactsQuery,
): Promise<ManagedContactsPage> {
  return request<ManagedContactsPage>(`/api/contacts?${buildQuery(query)}`);
}

/** Fetch a single contact by id. */
export async function getManagedContact(id: number): Promise<ManagedContact> {
  return request<ManagedContact>(`/api/contacts/${id}`);
}

/** Create a new contact. */
export async function createManagedContact(
  input: CreateManagedContactInput,
): Promise<ManagedContact> {
  return request<ManagedContact>('/api/contacts', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/** Update a contact's mutable fields. */
export async function updateManagedContact(
  id: number,
  input: UpdateManagedContactInput,
): Promise<ManagedContact> {
  return request<ManagedContact>(`/api/contacts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

/** Soft-delete a contact. */
export async function deleteManagedContact(id: number): Promise<void> {
  await request<{ message: string }>(`/api/contacts/${id}`, {
    method: 'DELETE',
  });
}

/** Active users for the owner select (real API, auth-only endpoint). */
export async function listOwnerOptions(): Promise<OwnerOption[]> {
  return request<OwnerOption[]>('/api/users/options');
}
