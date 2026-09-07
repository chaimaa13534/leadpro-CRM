/**
 * Types for the Companies management module.
 *
 * These mirror the backend `PublicCompany` / `PaginatedResult` shapes exposed
 * by the `/api/companies` endpoints. The `owner` is embedded as a nested
 * object and the counts reflect the related contacts / opportunities / leads.
 */

/** Owner summary embedded in a company payload. */
export interface CompanyOwner {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
}

/** Public shape of a company returned by the backend API. */
export interface ManagedCompany {
  id: number;
  name: string;
  industry: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  description: string | null;
  owner: CompanyOwner;
  contactCount: number;
  opportunityCount: number;
  leadCount: number;
  createdAt: string;
  updatedAt: string;
}

/** Pagination envelope returned by `GET /api/companies`. */
export interface ManagedCompaniesPage {
  items: ManagedCompany[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Query parameters for `GET /api/companies`. */
export interface ManagedCompaniesQuery {
  page: number;
  limit: number;
  search?: string;
  industry?: string;
  country?: string;
  city?: string;
  ownerId?: number;
  sort?: ManagedCompaniesSortField;
  order?: 'asc' | 'desc';
}

export type ManagedCompaniesSortField =
  | 'name'
  | 'industry'
  | 'city'
  | 'country'
  | 'created_at'
  | 'updated_at'
  | 'owner';

/** Input payload for `POST /api/companies`. */
export interface CreateManagedCompanyInput {
  name: string;
  ownerId: number;
  industry?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  description?: string;
}

/** Input payload for `PUT /api/companies/:id`. */
export interface UpdateManagedCompanyInput {
  name?: string;
  ownerId?: number;
  industry?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  description?: string;
}

/** Distinct filter values exposed by the toolbar. */
export interface CompanyFilterOptions {
  industries: string[];
  cities: string[];
  countries: string[];
}
