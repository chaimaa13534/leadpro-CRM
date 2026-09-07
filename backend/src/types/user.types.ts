/**
 * Domain types for the authentication / users module.
 */

export interface Role {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

/** Raw row shape of the `users` table. */
export interface UserRow {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  avatar: string | null;
  phone: string | null;
  role_id: number;
  is_active: boolean;
  last_login: Date | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

/** A user joined with its role. This is what the repository returns. */
export interface UserWithRole {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  avatar: string | null;
  phone: string | null;
  role_id: number;
  role_name: string;
  role_slug: string;
  is_active: boolean;
  last_login: Date | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

/**
 * Public shape of an authenticated user. This is the object attached to
 * `req.user` and returned by `GET /api/auth/me`. It never contains the
 * password hash.
 */
export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  role: string;
}

/** Payload embedded inside the signed JWT (useful info only). */
export interface JwtPayload {
  userId: number;
  role: string;
  email: string;
}

/** Decoded JWT including the claims added automatically by jsonwebtoken. */
export interface JwtClaims extends JwtPayload {
  iat: number;
  exp: number;
}

/** Success payload returned by `POST /api/auth/login`. */
export interface LoginData {
  user: AuthUser;
  token: string;
  expiresIn: number;
}

/**
 * Public shape of a user returned by the Users module. Never exposes the
 * password hash. This is the user object returned by list / get / create /
 * update / status endpoints.
 */
export interface PublicUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: string;
  roleName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Input payload for `POST /api/users`. */
export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  password: string;
  role: string;
  isActive?: boolean;
}

/** Input payload for `PUT /api/users/:id`. Password is intentionally absent. */
export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  role?: string;
  isActive?: boolean;
}

/** Normalized list query parameters for `GET /api/users`. */
export interface UserListQuery {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  isActive?: boolean;
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

