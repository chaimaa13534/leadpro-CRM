import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/database.js';
import type {
  ContactListQuery,
  ContactWithRelations,
  CreateContactInput,
  UpdateContactInput,
} from '../types/contact.types.js';

/** Whitelist of allowed sort columns. Prevents SQL injection via ORDER BY. */
const SORTABLE_COLUMNS: Record<string, string> = {
  first_name: 'ct.first_name',
  last_name: 'ct.last_name',
  email: 'ct.email',
  position: 'ct.position',
  company: 'comp.name',
  owner: 'u.first_name',
  created_at: 'ct.created_at',
  updated_at: 'ct.updated_at',
};

interface ContactRowPacket extends RowDataPacket {
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

/** Base SELECT joining the company and the owner (user). */
const CONTACT_SELECT = `
  SELECT
    ct.id,
    ct.company_id,
    comp.name AS company_name,
    ct.first_name,
    ct.last_name,
    ct.email,
    ct.phone,
    ct.position,
    ct.owner_id,
    u.first_name AS owner_first_name,
    u.last_name  AS owner_last_name,
    u.email      AS owner_email,
    u.avatar     AS owner_avatar,
    ct.notes,
    ct.created_at,
    ct.updated_at,
    ct.deleted_at
  FROM contacts ct
  INNER JOIN companies comp ON comp.id = ct.company_id
  INNER JOIN users u ON u.id = ct.owner_id
`;

function mapRow(row: ContactRowPacket): ContactWithRelations {
  return {
    id: row.id,
    company_id: row.company_id,
    company_name: row.company_name,
    first_name: row.first_name,
    last_name: row.last_name,
    email: row.email,
    phone: row.phone,
    position: row.position,
    owner_id: row.owner_id,
    owner_first_name: row.owner_first_name,
    owner_last_name: row.owner_last_name,
    owner_email: row.owner_email,
    owner_avatar: row.owner_avatar,
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  };
}

/** Find a single non-deleted contact row by id. */
export async function findById(
  id: number,
): Promise<ContactWithRelations | null> {
  const [rows] = await pool.query<ContactRowPacket[]>(
    `${CONTACT_SELECT} WHERE ct.id = ? AND ct.deleted_at IS NULL LIMIT 1`,
    [id],
  );

  const row = rows[0];
  return row ? mapRow(row) : null;
}

/** Check whether a company id exists (used to validate `company_id`). */
export async function companyExists(companyId: number): Promise<boolean> {
  const [rows] = await pool.query<Array<{ id: number }> & RowDataPacket[]>(
    'SELECT id FROM companies WHERE id = ? AND deleted_at IS NULL LIMIT 1',
    [companyId],
  );
  return rows.length > 0;
}

/** Check whether a user id exists (used to validate `owner_id`). */
export async function ownerExists(ownerId: number): Promise<boolean> {
  const [rows] = await pool.query<Array<{ id: number }> & RowDataPacket[]>(
    'SELECT id FROM users WHERE id = ? AND deleted_at IS NULL LIMIT 1',
    [ownerId],
  );
  return rows.length > 0;
}

/** Insert a new contact row. Returns the new row id. */
export async function createContact(
  input: CreateContactInput,
): Promise<number> {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO contacts
      (company_id, first_name, last_name, email, phone, position, owner_id, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.companyId,
      input.firstName,
      input.lastName,
      input.email ?? null,
      input.phone ?? null,
      input.position ?? null,
      input.ownerId,
      input.notes ?? null,
    ],
  );

  return result.insertId;
}

/** Update mutable fields of a contact. Only the provided fields change. */
export async function updateContact(
  id: number,
  input: UpdateContactInput,
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
  if (input.email !== undefined) {
    fields.push('email = ?');
    values.push(input.email);
  }
  if (input.phone !== undefined) {
    fields.push('phone = ?');
    values.push(input.phone);
  }
  if (input.position !== undefined) {
    fields.push('position = ?');
    values.push(input.position);
  }
  if (input.companyId !== undefined) {
    fields.push('company_id = ?');
    values.push(input.companyId);
  }
  if (input.ownerId !== undefined) {
    fields.push('owner_id = ?');
    values.push(input.ownerId);
  }
  if (input.notes !== undefined) {
    fields.push('notes = ?');
    values.push(input.notes);
  }

  if (fields.length === 0) {
    return;
  }

  values.push(id);
  await pool.execute(
    `UPDATE contacts SET ${fields.join(', ')} WHERE id = ? AND deleted_at IS NULL`,
    values,
  );
}

/** Soft-delete a contact by setting `deleted_at`. */
export async function softDeleteContact(id: number): Promise<void> {
  await pool.execute(
    'UPDATE contacts SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
    [id],
  );
}

/**
 * List contacts with pagination, search, filters and sorting. Returns the
 * matching rows plus the total count (before pagination).
 */
export async function listContacts(
  query: ContactListQuery,
): Promise<{ rows: ContactWithRelations[]; total: number }> {
  const conditions: string[] = [
    'ct.deleted_at IS NULL',
    'comp.deleted_at IS NULL',
    'u.deleted_at IS NULL',
  ];
  const params: Array<string | number> = [];

  if (query.search) {
    const term = `%${query.search}%`;
    params.push(term, term, term, term);
    conditions.push(
      '(ct.first_name LIKE ? OR ct.last_name LIKE ? OR ct.email LIKE ? OR comp.name LIKE ?)',
    );
  }
  if (query.companyId !== undefined) {
    params.push(query.companyId);
    conditions.push('ct.company_id = ?');
  }
  if (query.ownerId !== undefined) {
    params.push(query.ownerId);
    conditions.push('ct.owner_id = ?');
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  const [countRows] = await pool.query<Array<{ total: number }> & RowDataPacket[]>(
    `SELECT COUNT(*) AS total
     FROM contacts ct
     INNER JOIN companies comp ON comp.id = ct.company_id
     INNER JOIN users u ON u.id = ct.owner_id
     ${whereClause}`,
    params,
  );
  const total = countRows[0]?.total ?? 0;

  const sortColumn = SORTABLE_COLUMNS[query.sortBy] ?? 'ct.created_at';
  const order = query.order === 'asc' ? 'ASC' : 'DESC';
  const offset = (query.page - 1) * query.limit;

  const [rows] = await pool.query<ContactRowPacket[]>(
    `${CONTACT_SELECT}
     ${whereClause}
     ORDER BY ${sortColumn} ${order}
     LIMIT ? OFFSET ?`,
    [...params, query.limit, offset],
  );

  return { rows: rows.map(mapRow), total };
}

