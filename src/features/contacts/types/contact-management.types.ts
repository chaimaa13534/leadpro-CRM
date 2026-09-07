/**
 * Types for the Contacts management module.
 *
 * These mirror the backend `PublicContact` / `PaginatedResult` shapes
 * exposed by the `/api/contacts` endpoints. The `company` and `owner` are
 * embedded as nested objects.
 */

/** Company summary embedded in a contact payload. */
export interface ContactCompanySummary {
  id: number;
  name: string;
}

/** Owner summary embedded in a contact payload. */
export interface ContactOwner {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
}

/** Public shape of a contact returned by the backend API. */
export interface ManagedContact {
  id: number;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  position: string | null;
  company: ContactCompanySummary;
  owner: ContactOwner;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Pagination envelope returned by `GET /api/contacts`. */
export interface ManagedContactsPage {
  items: ManagedContact[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Query parameters for `GET /api/contacts`. */
export interface ManagedContactsQuery {
  page: number;
  limit: number;
  search?: string;
  companyId?: number;
  ownerId?: number;
  sort?: ManagedContactsSortField;
  order?: 'asc' | 'desc';
}

export type ManagedContactsSortField =
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'position'
  | 'company'
  | 'owner'
  | 'created_at'
  | 'updated_at';

/** Input payload for `POST /api/contacts`. */
export interface CreateManagedContactInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  position?: string;
  companyId: number;
  ownerId: number;
  notes?: string;
}

/** Input payload for `PUT /api/contacts/:id`. */
export interface UpdateManagedContactInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  position?: string;
  companyId?: number;
  ownerId?: number;
  notes?: string;
}

/** Lightweight user option used to populate owner selects. */
export interface OwnerOption {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
}

