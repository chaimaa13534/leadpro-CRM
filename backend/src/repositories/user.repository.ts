import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/database.js';
import type {
  CreateUserInput,
  UpdateUserInput,
  UserListQuery,
  UserWithRole,
} from '../types/user.types.js';

/** Whitelist of allowed sort columns. Prevents SQL injection via ORDER BY. */
const SORTABLE_COLUMNS: Record<string, string> = {
  first_name: 'u.first_name',
  last_name: 'u.last_name',
  email: 'u.email',
  role: 'r.name',
  is_active: 'u.is_active',
  created_at: 'u.created_at',
  updated_at: 'u.updated_at',
};

interface UserRowPacket extends RowDataPacket {
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
  is_active: number;
  last_login: Date | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

const USER_SELECT = `
  SELECT
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    u.password_hash,
    u.avatar,
    u.phone,
    u.role_id,
    r.name  AS role_name,
    r.slug  AS role_slug,
    u.is_active,
    u.last_login,
    u.created_at,
    u.updated_at,
    u.deleted_at
  FROM users u
  INNER JOIN roles r ON r.id = u.role_id
`;

function mapRow(row: UserRowPacket): UserWithRole {
  return {
    id: row.id,
    first_name: row.first_name,
    last_name: row.last_name,
    email: row.email,
    password_hash: row.password_hash,
    avatar: row.avatar,
    phone: row.phone,
    role_id: row.role_id,
    role_name: row.role_name,
    role_slug: row.role_slug,
    is_active: row.is_active === 1,
    last_login: row.last_login,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  };
}

/**
 * Find a user (joined with its role) by email. Soft-deleted users are
 * excluded so they cannot authenticate.
 */
export async function findByEmailWithRole(
  email: string,
): Promise<UserWithRole | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const [rows] = await pool.query<UserRowPacket[]>(
    `${USER_SELECT} WHERE LOWER(TRIM(u.email)) = ? AND u.deleted_at IS NULL LIMIT 1`,
    [normalizedEmail],
  );

  const row = rows[0];
  return row ? mapRow(row) : null;
}

/**
 * Find a user (joined with its role) by id. Soft-deleted users are excluded.
 */
export async function findByIdWithRole(
  id: number,
): Promise<UserWithRole | null> {
  const [rows] = await pool.query<UserRowPacket[]>(
    `${USER_SELECT} WHERE u.id = ? AND u.deleted_at IS NULL LIMIT 1`,
    [id],
  );

  const row = rows[0];
  return row ? mapRow(row) : null;
}

/**
 * Update the `last_login` timestamp of a user.
 */
export async function updateLastLogin(id: number): Promise<void> {
  await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [id]);
}

/**
 * Resolve a role slug to its id. Returns null when the slug does not exist.
 */
export async function findRoleIdBySlug(slug: string): Promise<number | null> {
  const [rows] = await pool.query<Array<{ id: number }> & RowDataPacket[]>(
    'SELECT id FROM roles WHERE slug = ? LIMIT 1',
    [slug],
  );

  const row = rows[0];
  return row ? row.id : null;
}

/**
 * Find a user by email, including soft-deleted users. Used for uniqueness
 * checks during create / update.
 */
export async function findByEmail(
  email: string,
): Promise<UserWithRole | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const [rows] = await pool.query<UserRowPacket[]>(
    `${USER_SELECT} WHERE LOWER(TRIM(u.email)) = ? LIMIT 1`,
    [normalizedEmail],
  );

  const row = rows[0];
  return row ? mapRow(row) : null;
}

/**
 * Insert a new user. Returns the id of the created row.
 */
export async function createUser(
  input: CreateUserInput & { passwordHash: string; roleId: number },
): Promise<number> {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO users
      (first_name, last_name, email, password_hash, avatar, phone, role_id, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.firstName,
      input.lastName,
      input.email,
      input.passwordHash,
      input.avatar ?? null,
      input.phone ?? null,
      input.roleId,
      input.isActive ?? true ? 1 : 0,
    ],
  );

  return result.insertId;
}

/**
 * Update mutable fields of a user. Only the provided fields are changed.
 */
export async function updateUser(
  id: number,
  input: UpdateUserInput & { roleId?: number },
): Promise<void> {
  const fields: string[] = [];
  const values: Array<string | number | null> = [];

  if (input.firstName !== undefined) {
    fields.push('first_name = ?');
    values.push(input.firstName);
  }
  if (input.lastName !== undefined) {
    fields.push('last_name = ?');
    values.push(input.lastName);
  }
  if (input.phone !== undefined) {
    fields.push('phone = ?');
    values.push(input.phone);
  }
  if (input.avatar !== undefined) {
    fields.push('avatar = ?');
    values.push(input.avatar);
  }
  if (input.roleId !== undefined) {
    fields.push('role_id = ?');
    values.push(input.roleId);
  }
  if (input.isActive !== undefined) {
    fields.push('is_active = ?');
    values.push(input.isActive ? 1 : 0);
  }

  if (fields.length === 0) {
    return;
  }

  values.push(id);
  await pool.execute(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ? AND deleted_at IS NULL`,
    values,
  );
}

/**
 * Activate or deactivate a user account.
 */
export async function changeStatus(id: number, isActive: boolean): Promise<void> {
  await pool.execute(
    'UPDATE users SET is_active = ? WHERE id = ? AND deleted_at IS NULL',
    [isActive ? 1 : 0, id],
  );
}

/**
 * Soft-delete a user by setting `deleted_at`.
 */
export async function softDeleteUser(id: number): Promise<void> {
  await pool.execute(
    'UPDATE users SET deleted_at = NOW(), is_active = 0 WHERE id = ? AND deleted_at IS NULL',
    [id],
  );
}

/**
 * List active users as lightweight options (id, name, email, avatar) used to
 * populate owner/filter selects. Only non-deleted, active users are returned.
 */
export async function listUserOptions(): Promise<
  Array<{ id: number; first_name: string; last_name: string; email: string; avatar: string | null }>
> {
  const [rows] = await pool.query<
    Array<{
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      avatar: string | null;
    }> &
      RowDataPacket[]
  >(
    `SELECT u.id, u.first_name, u.last_name, u.email, u.avatar
     FROM users u
     WHERE u.deleted_at IS NULL AND u.is_active = 1
     ORDER BY u.first_name ASC, u.last_name ASC`,
  );

  return rows;
}

/**
 * List users with pagination, search, role & active filters and sorting.
 * Returns the matching rows plus the total count (before pagination).
 */
export async function listUsers(
  query: UserListQuery,
): Promise<{ rows: UserWithRole[]; total: number }> {
  const conditions: string[] = ['u.deleted_at IS NULL'];
  const params: Array<string | number> = [];

  if (query.search) {
    const term = `%${query.search}%`;
    params.push(term, term, term);
    conditions.push(
      '(u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)',
    );
  }

  if (query.role) {
    params.push(query.role);
    conditions.push('r.slug = ?');
  }

  if (query.isActive !== undefined) {
    params.push(query.isActive ? 1 : 0);
    conditions.push('u.is_active = ?');
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  const [countRows] = await pool.query<Array<{ total: number }> & RowDataPacket[]>(
    `SELECT COUNT(*) AS total
     FROM users u
     INNER JOIN roles r ON r.id = u.role_id
     ${whereClause}`,
    params,
  );
  const total = countRows[0]?.total ?? 0;

  const sortColumn = SORTABLE_COLUMNS[query.sortBy] ?? 'u.created_at';
  const order = query.order === 'asc' ? 'ASC' : 'DESC';
  const offset = (query.page - 1) * query.limit;

  const [rows] = await pool.query<UserRowPacket[]>(
    `${USER_SELECT}
     ${whereClause}
     ORDER BY ${sortColumn} ${order}
     LIMIT ? OFFSET ?`,
    [...params, query.limit, offset],
  );

  return { rows: rows.map(mapRow), total };
}
