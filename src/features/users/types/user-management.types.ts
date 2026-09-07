/**
 * Types for the Users management module (admin-only CRUD).
 *
 * These mirror the backend `PublicUser` / `PaginatedResult` shapes exposed
 * by the `/api/users` endpoints. The password hash is never present.
 */

export type UserManagementRole = 'admin' | 'manager' | 'sales' | 'support';

/** Public shape of a user returned by the backend API. */
export interface ManagedUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: UserManagementRole;
  roleName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Pagination envelope returned by `GET /api/users`. */
export interface ManagedUsersPage {
  items: ManagedUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Query parameters for `GET /api/users`. */
export interface ManagedUsersQuery {
  page: number;
  limit: number;
  search?: string;
  role?: UserManagementRole;
  isActive?: boolean;
  sort?: ManagedUsersSortField;
  order?: 'asc' | 'desc';
}

export type ManagedUsersSortField =
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'role'
  | 'is_active'
  | 'created_at'
  | 'updated_at';

/** Input payload for `POST /api/users`. */
export interface CreateManagedUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserManagementRole;
  phone?: string;
  avatar?: string;
  isActive?: boolean;
}

/** Input payload for `PUT /api/users/:id`. */
export interface UpdateManagedUserInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  role?: UserManagementRole;
  isActive?: boolean;
}
