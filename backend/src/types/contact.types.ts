/**
 * Domain types for the contacts module.
 *
 * These mirror the `contacts` table in the database plus the joined
 * company and owner (user) so the frontend can display the company name
 * and the responsible user's full name.
 */

/** Raw row shape of the `contacts` table. */
export interface ContactRow {
  id: number;
  company_id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  position: string | null;
  owner_id: number;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

/** A contact joined with its company and owner (user). */
export interface ContactWithRelations {
  id: number;
  company_id: number;
  company_name: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  position: string | null;
  owner_id: number;
  owner_first_name: string;
  owner_last_name: string;
  owner_email: string;
  owner_avatar: string | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

/**
 * Public shape of a contact returned by the API. Never exposes internal
 * foreign keys or the raw joined columns.
 */
export interface PublicContact {
  id: number;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  position: string | null;
  company: {
    id: number;
    name: string;
  };
  owner: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
  };
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/** Input payload for `POST /api/contacts`. */
export interface CreateContactInput {
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
export interface UpdateContactInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  position?: string;
  companyId?: number;
  ownerId?: number;
  notes?: string;
}

/** Normalized list query parameters for `GET /api/contacts`. */
export interface ContactListQuery {
  page: number;
  limit: number;
  search?: string;
  companyId?: number;
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

