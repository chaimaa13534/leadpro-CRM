import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/database.js';
import type {
  CreateLeadInput,
  LeadListQuery,
  LeadSourceOption,
  LeadWithRelations,
  UpdateLeadInput,
} from '../types/lead.types.js';

/** Whitelist of allowed sort columns. Prevents SQL injection via ORDER BY. */
const SORTABLE_COLUMNS: Record<string, string> = {
  company: 'comp.name',
  contact: 'contact.last_name',
  owner: 'u.first_name',
  source: 'src.name',
  status: 'ld.status',
  priority: 'ld.priority',
  estimated_value: 'ld.estimated_value',
  created_at: 'ld.created_at',
  updated_at: 'ld.updated_at',
};

interface LeadRowPacket extends RowDataPacket {
  id: number;
  company_id: number | null;
  company_name: string | null;
  contact_id: number | null;
  contact_first_name: string | null;
  contact_last_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  owner_id: number;
  owner_first_name: string;
  owner_last_name: string;
  owner_email: string;
  owner_avatar: string | null;
  source_id: number | null;
  source_name: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  priority: 'low' | 'medium' | 'high';
  estimated_value: number;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

/**
 * Base SELECT joining company, contact, source and owner. All relation
 * joins are LEFT so that a lead with no company / contact / source still
 * returns and the row is not dropped.
 */
const LEAD_SELECT = `
  SELECT
    ld.id,
    ld.company_id,
    comp.name AS company_name,
    ld.contact_id,
    contact.first_name AS contact_first_name,
    contact.last_name  AS contact_last_name,
    contact.email      AS contact_email,
    contact.phone      AS contact_phone,
    ld.owner_id,
    u.first_name AS owner_first_name,
    u.last_name  AS owner_last_name,
    u.email      AS owner_email,
    u.avatar     AS owner_avatar,
    ld.source_id,
    src.name     AS source_name,
    ld.status,
    ld.priority,
    ld.estimated_value,
    ld.notes,
    ld.created_at,
    ld.updated_at,
    ld.deleted_at
  FROM leads ld
  LEFT JOIN companies comp ON comp.id = ld.company_id AND comp.deleted_at IS NULL
  LEFT JOIN contacts contact ON contact.id = ld.contact_id AND contact.deleted_at IS NULL
  LEFT JOIN lead_sources src ON src.id = ld.source_id
  INNER JOIN users u ON u.id = ld.owner_id AND u.deleted_at IS NULL
`;

function mapRow(row: LeadRowPacket): LeadWithRelations {
  return {
    id: row.id,
    company_id: row.company_id,
    company_name: row.company_name,
    contact_id: row.contact_id,
    contact_first_name: row.contact_first_name,
    contact_last_name: row.contact_last_name,
    contact_email: row.contact_email,
    contact_phone: row.contact_phone,
    owner_id: row.owner_id,
    owner_first_name: row.owner_first_name,
    owner_last_name: row.owner_last_name,
    owner_email: row.owner_email,
    owner_avatar: row.owner_avatar,
    source_id: row.source_id,
    source_name: row.source_name,
    status: row.status,
    priority: row.priority,
    estimated_value: row.estimated_value,
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  };
}

/** Find a single non-deleted lead row by id. */
export async function findById(id: number): Promise<LeadWithRelations | null> {
  const [rows] = await pool.query<LeadRowPacket[]>(
    `${LEAD_SELECT} WHERE ld.id = ? AND ld.deleted_at IS NULL LIMIT 1`,
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

/** Check whether a contact id exists (used to validate `contact_id`). */
export async function contactExists(contactId: number): Promise<boolean> {
  const [rows] = await pool.query<Array<{ id: number }> & RowDataPacket[]>(
    'SELECT id FROM contacts WHERE id = ? AND deleted_at IS NULL LIMIT 1',
    [contactId],
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

/** Check whether a source id exists (used to validate `source_id`). */
export async function sourceExists(sourceId: number): Promise<boolean> {
  const [rows] = await pool.query<Array<{ id: number }> & RowDataPacket[]>(
    'SELECT id FROM lead_sources WHERE id = ? LIMIT 1',
    [sourceId],
  );
  return rows.length > 0;
}

/** List all lead sources for filters / selects. */
export async function listLeadSources(): Promise<LeadSourceOption[]> {
  const [rows] = await pool.query<Array<{ id: number; name: string }> & RowDataPacket[]>(
    'SELECT id, name FROM lead_sources ORDER BY name ASC',
  );
  return rows;
}

/** Insert a new lead row. Returns the new row id. */
export async function createLead(input: CreateLeadInput): Promise<number> {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO leads
      (company_id, contact_id, owner_id, source_id, status, priority, estimated_value, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.companyId ?? null,
      input.contactId ?? null,
      input.ownerId,
      input.sourceId ?? null,
      input.status ?? 'new',
      input.priority ?? 'medium',
      input.estimatedValue ?? 0,
      input.notes ?? null,
    ],
  );

  return result.insertId;
}

/** Update mutable fields of a lead. Only the provided fields change. */
export async function updateLead(
  id: number,
  input: UpdateLeadInput,
): Promise<void> {
  const fields: string[] = [];
  const values: Array<string | number | null> = [];

  if (input.companyId !== undefined) {
    fields.push('company_id = ?');
    values.push(input.companyId);
  }
  if (input.contactId !== undefined) {
    fields.push('contact_id = ?');
    values.push(input.contactId);
  }
  if (input.ownerId !== undefined) {
    fields.push('owner_id = ?');
    values.push(input.ownerId);
  }
  if (input.sourceId !== undefined) {
    fields.push('source_id = ?');
    values.push(input.sourceId);
  }
  if (input.status !== undefined) {
    fields.push('status = ?');
    values.push(input.status);
  }
  if (input.priority !== undefined) {
    fields.push('priority = ?');
    values.push(input.priority);
  }
  if (input.estimatedValue !== undefined) {
    fields.push('estimated_value = ?');
    values.push(input.estimatedValue);
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
    `UPDATE leads SET ${fields.join(', ')} WHERE id = ? AND deleted_at IS NULL`,
    values,
  );
}

/** Soft-delete a lead by setting `deleted_at`. */
export async function softDeleteLead(id: number): Promise<void> {
  await pool.execute(
    'UPDATE leads SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
    [id],
  );
}

/**
 * List leads with pagination, search, filters and sorting. Returns the
 * matching rows plus the total count (before pagination).
 */
export async function listLeads(
  query: LeadListQuery,
): Promise<{ rows: LeadWithRelations[]; total: number }> {
  const conditions: string[] = [
    'ld.deleted_at IS NULL',
    'u.deleted_at IS NULL',
  ];
  const params: Array<string | number> = [];

  if (query.search) {
    const term = `%${query.search}%`;
    params.push(term, term, term, term);
    conditions.push(
      `(contact.first_name LIKE ? OR contact.last_name LIKE ? OR contact.email LIKE ? OR comp.name LIKE ?)`,
    );
  }
  if (query.status !== undefined) {
    params.push(query.status);
    conditions.push('ld.status = ?');
  }
  if (query.priority !== undefined) {
    params.push(query.priority);
    conditions.push('ld.priority = ?');
  }
  if (query.sourceId !== undefined) {
    params.push(query.sourceId);
    conditions.push('ld.source_id = ?');
  }
  if (query.ownerId !== undefined) {
    params.push(query.ownerId);
    conditions.push('ld.owner_id = ?');
  }
  if (query.companyId !== undefined) {
    params.push(query.companyId);
    conditions.push('ld.company_id = ?');
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  const [countRows] =
    await pool.query<Array<{ total: number }> & RowDataPacket[]>(
      `SELECT COUNT(*) AS total
       FROM leads ld
       LEFT JOIN companies comp ON comp.id = ld.company_id AND comp.deleted_at IS NULL
       LEFT JOIN contacts contact ON contact.id = ld.contact_id AND contact.deleted_at IS NULL
       LEFT JOIN lead_sources src ON src.id = ld.source_id
       INNER JOIN users u ON u.id = ld.owner_id AND u.deleted_at IS NULL
       ${whereClause}`,
      params,
    );
  const total = countRows[0]?.total ?? 0;

  // Default sort: most recent first.
  const sortColumn = SORTABLE_COLUMNS[query.sortBy] ?? 'ld.created_at';
  const order = query.order === 'asc' ? 'ASC' : 'DESC';
  const offset = (query.page - 1) * query.limit;

  const [rows] = await pool.query<LeadRowPacket[]>(
    `${LEAD_SELECT}
     ${whereClause}
     ORDER BY ${sortColumn} ${order}
     LIMIT ? OFFSET ?`,
    [...params, query.limit, offset],
  );

  return { rows: rows.map(mapRow), total };
}
