import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/database.js';
import type {
  CompanyListQuery,
  CompanyRow,
  CompanyWithOwner,
  CreateCompanyInput,
  UpdateCompanyInput,
} from '../types/company.types.js';

/** Whitelist of allowed sort columns. Prevents SQL injection via ORDER BY. */
const SORTABLE_COLUMNS: Record<string, string> = {
  name: 'c.name',
  industry: 'c.industry',
  city: 'c.city',
  country: 'c.country',
  created_at: 'c.created_at',
  updated_at: 'c.updated_at',
  owner: 'u.first_name',
};

interface CompanyRowPacket extends RowDataPacket {
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

/** Base SELECT joining the owner and aggregating related counts. */
const COMPANY_SELECT = `
  SELECT
    c.id,
    c.name,
    c.industry,
    c.website,
    c.phone,
    c.email,
    c.address,
    c.city,
    c.country,
    c.notes,
    c.owner_id,
    u.first_name AS owner_first_name,
    u.last_name  AS owner_last_name,
    u.email      AS owner_email,
    u.avatar     AS owner_avatar,
    (SELECT COUNT(*) FROM contacts ct WHERE ct.company_id = c.id AND ct.deleted_at IS NULL)      AS contact_count,
    (SELECT COUNT(*) FROM opportunities o WHERE o.company_id = c.id AND o.deleted_at IS NULL)   AS opportunity_count,
    (SELECT COUNT(*) FROM leads l WHERE l.company_id = c.id AND l.deleted_at IS NULL)           AS lead_count,
    c.created_at,
    c.updated_at,
    c.deleted_at
  FROM companies c
  INNER JOIN users u ON u.id = c.owner_id
`;

function mapRow(row: CompanyRowPacket): CompanyWithOwner {
  return {
    id: row.id,
    name: row.name,
    industry: row.industry,
    website: row.website,
    phone: row.phone,
    email: row.email,
    address: row.address,
    city: row.city,
    country: row.country,
    notes: row.notes,
    owner_id: row.owner_id,
    owner_first_name: row.owner_first_name,
    owner_last_name: row.owner_last_name,
    owner_email: row.owner_email,
    owner_avatar: row.owner_avatar,
    contact_count: row.contact_count,
    opportunity_count: row.opportunity_count,
    lead_count: row.lead_count,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  };
}

/** Find a single non-deleted company row by id. */
export async function findById(id: number): Promise<CompanyWithOwner | null> {
  const [rows] = await pool.query<CompanyRowPacket[]>(
    `${COMPANY_SELECT} WHERE c.id = ? AND c.deleted_at IS NULL LIMIT 1`,
    [id],
  );

  const row = rows[0];
  return row ? mapRow(row) : null;
}

/** Check whether a user id exists (used to validate the owner). */
export async function ownerExists(ownerId: number): Promise<boolean> {
  const [rows] = await pool.query<Array<{ id: number }> & RowDataPacket[]>(
    'SELECT id FROM users WHERE id = ? AND deleted_at IS NULL LIMIT 1',
    [ownerId],
  );
  return rows.length > 0;
}

/** Insert a new company row. Returns the new row id. */
export async function createCompany(
  input: CreateCompanyInput,
): Promise<number> {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO companies
      (name, industry, website, phone, email, address, city, country, notes, owner_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.name,
      input.industry ?? null,
      input.website ?? null,
      input.phone ?? null,
      input.email ?? null,
      input.address ?? null,
      input.city ?? null,
      input.country ?? null,
      input.notes ?? null,
      input.ownerId,
    ],
  );

  return result.insertId;
}

/** Update mutable fields of a company. Only the provided fields change. */
export async function updateCompany(
  id: number,
  input: UpdateCompanyInput,
): Promise<void> {
  const fields: string[] = [];
  const values: Array<string | number | null> = [];

  if (input.name !== undefined) {
    fields.push('name = ?');
    values.push(input.name);
  }
  if (input.industry !== undefined) {
    fields.push('industry = ?');
    values.push(input.industry);
  }
  if (input.website !== undefined) {
    fields.push('website = ?');
    values.push(input.website);
  }
  if (input.phone !== undefined) {
    fields.push('phone = ?');
    values.push(input.phone);
  }
  if (input.email !== undefined) {
    fields.push('email = ?');
    values.push(input.email);
  }
  if (input.address !== undefined) {
    fields.push('address = ?');
    values.push(input.address);
  }
  if (input.city !== undefined) {
    fields.push('city = ?');
    values.push(input.city);
  }
  if (input.country !== undefined) {
    fields.push('country = ?');
    values.push(input.country);
  }
  if (input.notes !== undefined) {
    fields.push('notes = ?');
    values.push(input.notes);
  }
  if (input.ownerId !== undefined) {
    fields.push('owner_id = ?');
    values.push(input.ownerId);
  }

  if (fields.length === 0) {
    return;
  }

  values.push(id);
  await pool.execute(
    `UPDATE companies SET ${fields.join(', ')} WHERE id = ? AND deleted_at IS NULL`,
    values,
  );
}

/** Soft-delete a company by setting `deleted_at`. */
export async function softDeleteCompany(id: number): Promise<void> {
  await pool.execute(
    'UPDATE companies SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
    [id],
  );
}

/**
 * List companies with pagination, search, filters and sorting. Returns the
 * matching rows plus the total count (before pagination).
 */
export async function listCompanies(
  query: CompanyListQuery,
): Promise<{ rows: CompanyWithOwner[]; total: number }> {
  const conditions: string[] = ['c.deleted_at IS NULL'];
  const params: Array<string | number> = [];

  if (query.search) {
    const term = `%${query.search}%`;
    params.push(term, term, term, term);
    conditions.push(
      '(c.name LIKE ? OR c.industry LIKE ? OR c.city LIKE ? OR c.country LIKE ?)',
    );
  }
  if (query.industry) {
    params.push(query.industry);
    conditions.push('c.industry = ?');
  }
  if (query.country) {
    params.push(query.country);
    conditions.push('c.country = ?');
  }
  if (query.city) {
    params.push(query.city);
    conditions.push('c.city = ?');
  }
  if (query.ownerId !== undefined) {
    params.push(query.ownerId);
    conditions.push('c.owner_id = ?');
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  const [countRows] = await pool.query<Array<{ total: number }> & RowDataPacket[]>(
    `SELECT COUNT(*) AS total
     FROM companies c
     INNER JOIN users u ON u.id = c.owner_id
     ${whereClause}`,
    params,
  );
  const total = countRows[0]?.total ?? 0;

  const sortColumn = SORTABLE_COLUMNS[query.sortBy] ?? 'c.created_at';
  const order = query.order === 'asc' ? 'ASC' : 'DESC';
  const offset = (query.page - 1) * query.limit;

  const [rows] = await pool.query<CompanyRowPacket[]>(
    `${COMPANY_SELECT}
     ${whereClause}
     ORDER BY ${sortColumn} ${order}
     LIMIT ? OFFSET ?`,
    [...params, query.limit, offset],
  );

  return { rows: rows.map(mapRow), total };
}

/**
 * Distinct industry values for the filter dropdown. Only non-null values
 * from non-deleted companies are returned.
 */
export async function listIndustries(): Promise<string[]> {
  const [rows] = await pool.query<Array<{ industry: string }> & RowDataPacket[]>(
    `SELECT DISTINCT c.industry AS industry
     FROM companies c
     WHERE c.industry IS NOT NULL AND c.industry <> '' AND c.deleted_at IS NULL
     ORDER BY c.industry ASC`,
  );
  return rows.map((row) => row.industry);
}

/**
 * Distinct city values for the filter dropdown.
 */
export async function listCities(): Promise<string[]> {
  const [rows] = await pool.query<Array<{ city: string }> & RowDataPacket[]>(
    `SELECT DISTINCT c.city AS city
     FROM companies c
     WHERE c.city IS NOT NULL AND c.city <> '' AND c.deleted_at IS NULL
     ORDER BY c.city ASC`,
  );
  return rows.map((row) => row.city);
}

/**
 * Distinct country values for the filter dropdown.
 */
export async function listCountries(): Promise<string[]> {
  const [rows] = await pool.query<Array<{ country: string }> & RowDataPacket[]>(
    `SELECT DISTINCT c.country AS country
     FROM companies c
     WHERE c.country IS NOT NULL AND c.country <> '' AND c.deleted_at IS NULL
     ORDER BY c.country ASC`,
  );
  return rows.map((row) => row.country);
}

/** Re-export the raw row type for external consumers. */
export type { CompanyRow };
