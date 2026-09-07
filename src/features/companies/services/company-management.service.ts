import type {
  CompanyFilterOptions,
  CreateManagedCompanyInput,
  ManagedCompaniesPage,
  ManagedCompaniesQuery,
  ManagedCompany,
  UpdateManagedCompanyInput,
} from '../types/company-management.types';

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
function buildQuery(query: ManagedCompaniesQuery): string {
  const params = new URLSearchParams();
  params.set('page', String(query.page));
  params.set('limit', String(query.limit));
  if (query.search?.trim()) params.set('search', query.search.trim());
  if (query.industry) params.set('industry', query.industry);
  if (query.country) params.set('country', query.country);
  if (query.city) params.set('city', query.city);
  if (query.ownerId !== undefined) params.set('ownerId', String(query.ownerId));
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

/** List companies with pagination, search, filters and sorting. */
export async function listManagedCompanies(
  query: ManagedCompaniesQuery,
): Promise<ManagedCompaniesPage> {
  return request<ManagedCompaniesPage>(
    `/api/companies?${buildQuery(query)}`,
  );
}

/** Fetch a single company by id. */
export async function getManagedCompany(id: number): Promise<ManagedCompany> {
  return request<ManagedCompany>(`/api/companies/${id}`);
}

/** Create a new company. */
export async function createManagedCompany(
  input: CreateManagedCompanyInput,
): Promise<ManagedCompany> {
  // The backend stores the free-text as `notes` and exposes it as
  // `description`; map the field before sending.
  const { description, ...rest } = input;
  return request<ManagedCompany>('/api/companies', {
    method: 'POST',
    body: JSON.stringify({ ...rest, notes: description }),
  });
}

/** Update a company's mutable fields. */
export async function updateManagedCompany(
  id: number,
  input: UpdateManagedCompanyInput,
): Promise<ManagedCompany> {
  const { description, ...rest } = input;
  return request<ManagedCompany>(`/api/companies/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...rest, notes: description }),
  });
}

/** Soft-delete a company. */
export async function deleteManagedCompany(id: number): Promise<void> {
  await request<{ message: string }>(`/api/companies/${id}`, {
    method: 'DELETE',
  });
}

/** Distinct filter values for the toolbar dropdowns. */
export async function getCompanyFilterOptions(): Promise<CompanyFilterOptions> {
  return request<CompanyFilterOptions>('/api/companies/filters');
}
