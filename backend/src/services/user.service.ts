import { ApiError } from '../utils/api-error.js';
import { hashPassword } from '../utils/password.js';
import {
  changeStatus,
  createUser,
  findByEmailWithRole,
  findByIdWithRole,
  findRoleIdBySlug,
  listUserOptions,
  listUsers,
  softDeleteUser,
  updateUser,
} from '../repositories/user.repository.js';
import type {
  CreateUserInput,
  PaginatedResult,
  PublicUser,
  UpdateUserInput,
  UserListQuery,
  UserWithRole,
} from '../types/user.types.js';

/** Maximum value allowed for the `limit` query parameter. */
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 10;

/**
 * Map a DB user (with role) to the public API shape. Never exposes the
 * password hash or the internal role id.
 */
export function toPublicUser(user: UserWithRole): PublicUser {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    role: user.role_slug,
    roleName: user.role_name,
    isActive: user.is_active,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

/**
 * Normalize and validate the incoming list query. Applies safe defaults and
 * clamps the page/limit so the repository always receives valid values.
 */
function normalizeListQuery(query: {
  page?: string;
  limit?: string;
  search?: string;
  role?: string;
  is_active?: string;
  sort?: string;
  order?: string;
}): UserListQuery {
  const parsedPage = Number.parseInt(query.page ?? '1', 10);
  const parsedLimit = Number.parseInt(query.limit ?? String(DEFAULT_LIMIT), 10);

  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit =
    Number.isInteger(parsedLimit) && parsedLimit > 0
      ? Math.min(parsedLimit, MAX_LIMIT)
      : DEFAULT_LIMIT;

  let isActive: boolean | undefined;
  if (query.is_active !== undefined && query.is_active !== '') {
    isActive = query.is_active === 'true' || query.is_active === '1';
  }

  const order = query.order === 'asc' ? 'asc' : 'desc';

  return {
    page,
    limit,
    search: query.search?.trim() || undefined,
    role: query.role?.trim() || undefined,
    isActive,
    sortBy: query.sort?.trim() || 'created_at',
    order,
  };
}

/**
 * Lightweight list of active users used to populate owner/filter selects.
 * Returns a minimal, safe subset of each user.
 */
export async function getUserOptions(): Promise<
  Array<{ id: number; firstName: string; lastName: string; email: string; avatar: string | null }>
> {
  const rows = await listUserOptions();
  return rows.map((row) => ({
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    avatar: row.avatar,
  }));
}

/**
 * List users according to the query parameters, wrapped in a pagination
 * envelope. Only ever returns public user shapes.
 */
export async function getUsers(query: {
  page?: string;
  limit?: string;
  search?: string;
  role?: string;
  is_active?: string;
  sort?: string;
  order?: string;
}): Promise<PaginatedResult<PublicUser>> {
  const normalized = normalizeListQuery(query);
  const { rows, total } = await listUsers(normalized);

  const totalPages = Math.ceil(total / normalized.limit);

  return {
    items: rows.map(toPublicUser),
    total,
    page: normalized.page,
    limit: normalized.limit,
    totalPages,
  };
}

/**
 * Resolve a role slug to its id and throw a 400 when it does not exist.
 */
async function resolveRoleId(role: string): Promise<number> {
  const roleId = await findRoleIdBySlug(role);
  if (roleId === null) {
    throw ApiError.badRequest(`Unknown role: ${role}`);
  }
  return roleId;
}

/**
 * Create a new user. Hashes the password, enforces email uniqueness and
 * returns the created user's public shape.
 */
export async function createUserAccount(
  input: CreateUserInput,
): Promise<PublicUser> {
  const normalizedEmail = input.email.trim().toLowerCase();

  const existing = await findByEmailWithRole(normalizedEmail);
  if (existing) {
    throw ApiError.conflict('A user with this email already exists');
  }

  const roleId = await resolveRoleId(input.role);
  const passwordHash = await hashPassword(input.password);

  const id = await createUser({
    ...input,
    email: normalizedEmail,
    passwordHash,
    roleId,
  });

  const created = await findByIdWithRole(id);
  if (!created) {
    throw ApiError.badRequest('User created but could not be loaded');
  }

  return toPublicUser(created);
}

/**
 * Update mutable fields of a user. Returns the updated public shape.
 */
export async function updateUserAccount(
  id: number,
  input: UpdateUserInput,
): Promise<PublicUser> {
  const existing = await findByIdWithRole(id);
  if (!existing) {
    throw ApiError.notFound('User not found');
  }

  let roleId: number | undefined;
  if (input.role !== undefined) {
    roleId = await resolveRoleId(input.role);
  }

  await updateUser(id, { ...input, roleId });

  const updated = await findByIdWithRole(id);
  if (!updated) {
    throw ApiError.notFound('User not found');
  }

  return toPublicUser(updated);
}

/**
 * Activate or deactivate a user account. Returns the updated public shape.
 */
export async function setUserStatus(
  id: number,
  isActive: boolean,
): Promise<PublicUser> {
  const existing = await findByIdWithRole(id);
  if (!existing) {
    throw ApiError.notFound('User not found');
  }

  await changeStatus(id, isActive);

  const updated = await findByIdWithRole(id);
  if (!updated) {
    throw ApiError.notFound('User not found');
  }

  return toPublicUser(updated);
}

/**
 * Soft-delete a user (sets `deleted_at`). Confirms the user existed first.
 */
export async function deleteUserAccount(id: number): Promise<void> {
  const existing = await findByIdWithRole(id);
  if (!existing) {
    throw ApiError.notFound('User not found');
  }

  await softDeleteUser(id);
}

/**
 * Get a single user's public profile by id.
 */
export async function getUserById(id: number): Promise<PublicUser> {
  const user = await findByIdWithRole(id);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return toPublicUser(user);
}
