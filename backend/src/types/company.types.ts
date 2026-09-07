/**
 * Domain types for the companies module.
 *
 * These mirror the `companies` table in the database plus the joined
 * owner (user) and the aggregated contact / opportunity counts.
 */

/** Raw row shape of the `companies` table. */
export interface CompanyRow {
  id: number;
  name: string;
  industry: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  notes: string | null;
  owner_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

/** A company joined with its owner (user) and related counts. */
export interface CompanyWithOwner {
  id: number;
  name: string;
  industry: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  notes: string | null;
  owner_id: number;
  owner_first_name: string;
  owner_last_name: string;
  owner_email: string;
  owner_avatar: string | null;
  contact_count: number;
  opportunity_count: number;
  lead_count: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

/**
 * Public shape of a company returned by the API. Never exposes internal
 * owner ids or the raw joined columns.
 */
export interface PublicCompany {
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
  owner: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
  };
  contactCount: number;
  opportunityCount: number;
  leadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/** Input payload for `POST /api/companies`. */
export interface CreateCompanyInput {
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
  ownerId: number;
}

/** Input payload for `PUT /api/companies/:id`. */
export interface UpdateCompanyInput {
  name?: string;
  industry?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
  ownerId?: number;
}

/** Normalized list query parameters for `GET /api/companies`. */
export interface CompanyListQuery {
  page: number;
  limit: number;
  search?: string;
  industry?: string;
  country?: string;
  city?: string;
  ownerId?: number;
  sortBy: string;
  order: 'asc' | 'desc';
}

/** Generic pagination envelope used by the list endpoint. */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
