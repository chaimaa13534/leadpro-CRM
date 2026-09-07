import type {
  CreateManagedUserInput,
  ManagedUser,
  ManagedUsersPage,
  ManagedUsersQuery,
  UpdateManagedUserInput,
} from '../types/user-management.types';

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
function buildQuery(query: ManagedUsersQuery): string {
  const params = new URLSearchParams();
  params.set('page', String(query.page));
  params.set('limit', String(query.limit));
  if (query.search?.trim()) params.set('search', query.search.trim());
  if (query.role) params.set('role', query.role);
  if (query.isActive !== undefined) params.set('is_active', String(query.isActive));
  if (query.sort) params.set('sort', query.sort);
  if (query.order) params.set('order', query.order);
  return params.toString();
}

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
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

/** List users with pagination, search, filters and sorting. */
export async function listManagedUsers(
  query: ManagedUsersQuery,
): Promise<ManagedUsersPage> {
  return request<ManagedUsersPage>(`/api/users?${buildQuery(query)}`);
}

/** Fetch a single user by id. */
export async function getManagedUser(id: number): Promise<ManagedUser> {
  return request<ManagedUser>(`/api/users/${id}`);
}

/** Create a new user (password provided). */
export async function createManagedUser(
  input: CreateManagedUserInput,
): Promise<ManagedUser> {
  return request<ManagedUser>('/api/users', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/** Update a user's mutable fields. */
export async function updateManagedUser(
  id: number,
  input: UpdateManagedUserInput,
): Promise<ManagedUser> {
  return request<ManagedUser>(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

/** Activate or deactivate a user account. */
export async function changeManagedUserStatus(
  id: number,
  isActive: boolean,
): Promise<ManagedUser> {
  return request<ManagedUser>(`/api/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });
}

/** Soft-delete a user. */
export async function deleteManagedUser(id: number): Promise<void> {
  await request<{ message: string }>(`/api/users/${id}`, {
    method: 'DELETE',
  });
}
