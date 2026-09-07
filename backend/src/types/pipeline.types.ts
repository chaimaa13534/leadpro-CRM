import type { PublicOpportunity } from './opportunity.types.js';
export interface PipelineRecord { id: number; name: string; description: string | null; isDefault: boolean; createdAt: Date; updatedAt: Date }
export interface PipelineStageRecord { id: number; pipelineId: number; name: string; position: number; color: string | null; probability: number | null; createdAt: Date; updatedAt: Date }
export interface PipelineBoard { pipeline: PipelineRecord; stages: PipelineStageRecord[]; opportunities: PublicOpportunity[] }
export interface PipelineInput { name: string; description?: string | null; isDefault?: boolean }
export interface PipelineStageInput { name: string; position: number; color?: string | null; probability?: number | null }
