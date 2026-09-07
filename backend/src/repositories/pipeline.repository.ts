import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../config/database.js';
import type { PipelineInput, PipelineRecord, PipelineStageInput, PipelineStageRecord } from '../types/pipeline.types.js';
type PipelineRow = RowDataPacket & { id: number; name: string; description: string | null; is_default: number; created_at: Date; updated_at: Date };
type StageRow = RowDataPacket & { id: number; pipeline_id: number; name: string; position: number; color: string | null; probability: number | null; created_at: Date; updated_at: Date };
const pipeline = (x: PipelineRow): PipelineRecord => ({ id: x.id, name: x.name, description: x.description, isDefault: Boolean(x.is_default), createdAt: x.created_at, updatedAt: x.updated_at });
const stage = (x: StageRow): PipelineStageRecord => ({ id: x.id, pipelineId: x.pipeline_id, name: x.name, position: x.position, color: x.color, probability: x.probability === null ? null : Number(x.probability), createdAt: x.created_at, updatedAt: x.updated_at });
export async function listPipelines() { const [rows] = await pool.query<PipelineRow[]>('SELECT * FROM pipelines ORDER BY is_default DESC, name ASC'); return rows.map(pipeline); }
export async function findPipeline(id: number) { const [rows] = await pool.query<PipelineRow[]>('SELECT * FROM pipelines WHERE id = ?', [id]); return rows[0] ? pipeline(rows[0]) : null; }
export async function createPipeline(x: PipelineInput) { const [r] = await pool.execute<ResultSetHeader>('INSERT INTO pipelines (name, description, is_default) VALUES (?, ?, ?)', [x.name, x.description ?? null, x.isDefault ? 1 : 0]); return r.insertId; }
export async function updatePipeline(id: number, x: PipelineInput) { await pool.execute('UPDATE pipelines SET name = ?, description = ?, is_default = ? WHERE id = ?', [x.name, x.description ?? null, x.isDefault ? 1 : 0, id]); }
export async function deletePipeline(id: number) { await pool.execute('DELETE FROM pipelines WHERE id = ?', [id]); }
export async function listStages(pipelineId: number) { const [rows] = await pool.query<StageRow[]>('SELECT * FROM pipeline_stages WHERE pipeline_id = ? ORDER BY position ASC', [pipelineId]); return rows.map(stage); }
export async function findStage(id: number) { const [rows] = await pool.query<StageRow[]>('SELECT * FROM pipeline_stages WHERE id = ?', [id]); return rows[0] ? stage(rows[0]) : null; }
export async function createStage(pipelineId: number, x: PipelineStageInput) { const [r] = await pool.execute<ResultSetHeader>('INSERT INTO pipeline_stages (pipeline_id, name, position, color, probability) VALUES (?, ?, ?, ?, ?)', [pipelineId, x.name, x.position, x.color ?? null, x.probability ?? null]); return r.insertId; }
export async function updateStage(id: number, x: PipelineStageInput) { await pool.execute('UPDATE pipeline_stages SET name = ?, position = ?, color = ?, probability = ? WHERE id = ?', [x.name, x.position, x.color ?? null, x.probability ?? null, id]); }
export async function deleteStage(id: number) { await pool.execute('DELETE FROM pipeline_stages WHERE id = ?', [id]); }
