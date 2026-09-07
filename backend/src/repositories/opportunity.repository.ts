import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/database.js';
import type {
  CreateOpportunityInput,
  OpportunityListQuery,
  OpportunityWithRelations,
  OpportunityPipelineOption,
  OpportunityStageOption,
  UpdateOpportunityInput,
} from '../types/opportunity.types.js';

const SORTABLE_COLUMNS: Record<string, string> = {
  company: 'company_name',
  contact: 'contact_last_name',
  owner: 'owner_last_name',
  pipeline: 'pipeline_name',
  stage: 'stage_name',
  status: 'op.status',
  value: 'op.value',
  probability: 'op.probability',
  expected_close_date: 'op.expected_close_date',
  created_at: 'op.created_at',
  updated_at: 'op.updated_at',
};

interface OpportunityRowPacket extends RowDataPacket {
  id: number;
  company_id: number;
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
  pipeline_id: number;
  pipeline_name: string;
  pipeline_description: string | null;
  stage_id: number;
  stage_name: string;
  stage_position: number;
  stage_color: string | null;
  stage_probability: number | null;
  probability: number;
  value: number;
  expected_close_date: string | null;
  status: 'open' | 'won' | 'lost';
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

const OPPORTUNITY_SELECT = `
  SELECT
    op.id,
    op.company_id,
    comp.name AS company_name,
    op.contact_id,
    contact.first_name AS contact_first_name,
    contact.last_name  AS contact_last_name,
    contact.email      AS contact_email,
    contact.phone      AS contact_phone,
    op.owner_id,
    u.first_name AS owner_first_name,
    u.last_name  AS owner_last_name,
    u.email      AS owner_email,
    u.avatar     AS owner_avatar,
    op.pipeline_id,
    pipe.name    AS pipeline_name,
    pipe.description AS pipeline_description,
    op.pipeline_stage_id AS stage_id,
    ps.name      AS stage_name,
    ps.position  AS stage_position,
    ps.color     AS stage_color,
    ps.probability AS stage_probability,
    op.probability,
    op.value,
    op.expected_close_date,
    op.status,
    op.created_at,
    op.updated_at,
    op.deleted_at
  FROM opportunities op
  LEFT JOIN companies comp ON comp.id = op.company_id AND comp.deleted_at IS NULL
  LEFT JOIN contacts contact ON contact.id = op.contact_id AND contact.deleted_at IS NULL
  INNER JOIN users u ON u.id = op.owner_id AND u.deleted_at IS NULL
  INNER JOIN pipelines pipe ON pipe.id = op.pipeline_id
  INNER JOIN pipeline_stages ps ON ps.id = op.pipeline_stage_id
`;

function mapRow(row: OpportunityRowPacket): OpportunityWithRelations {
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
    pipeline_id: row.pipeline_id,
    pipeline_name: row.pipeline_name,
    pipeline_description: row.pipeline_description,
    stage_id: row.stage_id,
    stage_name: row.stage_name,
    stage_position: row.stage_position,
    stage_color: row.stage_color,
    stage_probability: row.stage_probability,
    probability: row.probability,
    value: row.value,
    expected_close_date: row.expected_close_date,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  };
}

export async function findById(id: number): Promise<OpportunityWithRelations | null> {
  const [rows] = await pool.query<OpportunityRowPacket[]>(
    `${OPPORTUNITY_SELECT} WHERE op.id = ? AND op.deleted_at IS NULL LIMIT 1`,
    [id],
  );

  const row = rows[0];
  return row ? mapRow(row) : null;
}

export async function companyExists(companyId: number): Promise<boolean> {
  const [rows] = await pool.query<Array<{ id: number }> & RowDataPacket[]>(
    'SELECT id FROM companies WHERE id = ? AND deleted_at IS NULL LIMIT 1',
    [companyId],
  );
  return rows.length > 0;
}

export async function contactExists(contactId: number): Promise<boolean> {
  const [rows] = await pool.query<Array<{ id: number }> & RowDataPacket[]>(
    'SELECT id FROM contacts WHERE id = ? AND deleted_at IS NULL LIMIT 1',
    [contactId],
  );
  return rows.length > 0;
}

export async function ownerExists(ownerId: number): Promise<boolean> {
  const [rows] = await pool.query<Array<{ id: number }> & RowDataPacket[]>(
    'SELECT id FROM users WHERE id = ? AND deleted_at IS NULL LIMIT 1',
    [ownerId],
  );
  return rows.length > 0;
}

export async function pipelineExists(pipelineId: number): Promise<boolean> {
  const [rows] = await pool.query<Array<{ id: number }> & RowDataPacket[]>(
    'SELECT id FROM pipelines WHERE id = ? LIMIT 1',
    [pipelineId],
  );
  return rows.length > 0;
}

export async function stageExists(stageId: number): Promise<boolean> {
  const [rows] = await pool.query<Array<{ id: number }> & RowDataPacket[]>(
    'SELECT id FROM pipeline_stages WHERE id = ? LIMIT 1',
    [stageId],
  );
  return rows.length > 0;
}

/** Ensure the selected stage is actually part of the selected pipeline. */
export async function stageBelongsToPipeline(
  stageId: number,
  pipelineId: number,
): Promise<boolean> {
  const [rows] = await pool.query<Array<{ id: number }> & RowDataPacket[]>(
    'SELECT id FROM pipeline_stages WHERE id = ? AND pipeline_id = ? LIMIT 1',
    [stageId, pipelineId],
  );
  return rows.length > 0;
}

export async function listPipelineOptions(): Promise<OpportunityPipelineOption[]> {
  const [rows] = await pool.query<Array<{ id: number; name: string }> & RowDataPacket[]>(
    'SELECT id, name FROM pipelines ORDER BY name ASC',
  );
  return rows;
}

export async function listStageOptions(): Promise<OpportunityStageOption[]> {
  const [rows] = await pool.query<
    Array<{ id: number; pipeline_id: number; name: string; position: number }> & RowDataPacket[]
  >(
    'SELECT id, pipeline_id, name, position FROM pipeline_stages ORDER BY pipeline_id, position ASC',
  );

  return rows.map((row) => ({
    id: row.id,
    pipelineId: row.pipeline_id,
    name: row.name,
    position: row.position,
  }));
}

export async function createOpportunity(input: CreateOpportunityInput): Promise<number> {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO opportunities
      (company_id, contact_id, owner_id, pipeline_id, pipeline_stage_id, probability, value, expected_close_date, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.companyId,
      input.contactId ?? null,
      input.ownerId,
      input.pipelineId,
      input.stageId,
      input.probability ?? 0,
      input.value ?? 0,
      input.expectedCloseDate ?? null,
      input.status ?? 'open',
    ],
  );

  return result.insertId;
}

export async function updateOpportunity(
  id: number,
  input: UpdateOpportunityInput,
): Promise<void> {
  const fields: string[] = [];
  const values: Array<string | number | null> = [];

  if (input.companyId !== undefined) {
    fields.push('company_id = ?');
    values.push(input.companyId);
  }
  if (input.contactId !== undefined) {
    fields.push('contact_id = ?');
    values.push(input.contactId ?? null);
  }
  if (input.ownerId !== undefined) {
    fields.push('owner_id = ?');
    values.push(input.ownerId);
  }
  if (input.pipelineId !== undefined) {
    fields.push('pipeline_id = ?');
    values.push(input.pipelineId);
  }
  if (input.stageId !== undefined) {
    fields.push('pipeline_stage_id = ?');
    values.push(input.stageId);
  }
  if (input.probability !== undefined) {
    fields.push('probability = ?');
    values.push(input.probability);
  }
  if (input.value !== undefined) {
    fields.push('value = ?');
    values.push(input.value);
  }
  if (input.expectedCloseDate !== undefined) {
    fields.push('expected_close_date = ?');
    values.push(input.expectedCloseDate ?? null);
  }
  if (input.status !== undefined) {
    fields.push('status = ?');
    values.push(input.status);
  }

  if (fields.length === 0) {
    return;
  }

  values.push(id);
  await pool.execute(
    `UPDATE opportunities SET ${fields.join(', ')} WHERE id = ? AND deleted_at IS NULL`,
    values,
  );
}

export async function softDeleteOpportunity(id: number): Promise<void> {
  await pool.execute(
    'UPDATE opportunities SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
    [id],
  );
}

export async function listOpportunities(
  query: OpportunityListQuery,
): Promise<{ rows: OpportunityWithRelations[]; total: number }> {
  const conditions: string[] = ['op.deleted_at IS NULL'];
  const params: Array<string | number> = [];

  if (query.search) {
    const term = `%${query.search}%`;
    params.push(term, term, term, term, term);
    conditions.push(
      `(comp.name LIKE ? OR contact.first_name LIKE ? OR contact.last_name LIKE ? OR contact.email LIKE ? OR ps.name LIKE ?)`,
    );
  }

  if (query.status !== undefined) {
    params.push(query.status);
    conditions.push('op.status = ?');
  }
  if (query.stage !== undefined) {
    params.push(query.stage);
    conditions.push('op.pipeline_stage_id = ?');
  }
  if (query.ownerId !== undefined) {
    params.push(query.ownerId);
    conditions.push('op.owner_id = ?');
  }
  if (query.companyId !== undefined) {
    params.push(query.companyId);
    conditions.push('op.company_id = ?');
  }
  if (query.contactId !== undefined) {
    params.push(query.contactId);
    conditions.push('op.contact_id = ?');
  }
  if (query.pipelineId !== undefined) {
    params.push(query.pipelineId);
    conditions.push('op.pipeline_id = ?');
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  const [countRows] = await pool.query<Array<{ total: number }> & RowDataPacket[]>(
    `SELECT COUNT(*) AS total
     FROM opportunities op
     LEFT JOIN companies comp ON comp.id = op.company_id AND comp.deleted_at IS NULL
     LEFT JOIN contacts contact ON contact.id = op.contact_id AND contact.deleted_at IS NULL
     INNER JOIN users u ON u.id = op.owner_id AND u.deleted_at IS NULL
     INNER JOIN pipelines pipe ON pipe.id = op.pipeline_id
     INNER JOIN pipeline_stages ps ON ps.id = op.pipeline_stage_id
     ${whereClause}`,
    params,
  );

  const total = countRows[0]?.total ?? 0;

  const sortColumn = SORTABLE_COLUMNS[query.sortBy] ?? 'op.created_at';
  const order = query.order === 'asc' ? 'ASC' : 'DESC';
  const offset = (query.page - 1) * query.limit;

  const [rows] = await pool.query<OpportunityRowPacket[]>(
    `${OPPORTUNITY_SELECT}
     ${whereClause}
     ORDER BY ${sortColumn} ${order}
     LIMIT ? OFFSET ?`,
    [...params, query.limit, offset],
  );

  return { rows: rows.map(mapRow), total };
}
