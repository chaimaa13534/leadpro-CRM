import type { ManagedOpportunity, OpportunityStatus } from '@/features/opportunities/types/opportunity-management.types';
export interface Pipeline { id: number; name: string; description: string | null; isDefault: boolean; createdAt: string; updatedAt: string }
export interface PipelineStage { id: number; pipelineId: number; name: string; position: number; color: string | null; probability: number | null; createdAt: string; updatedAt: string }
export interface PipelineBoardData { pipeline: Pipeline; stages: PipelineStage[]; opportunities: ManagedOpportunity[] }
export interface PipelineBoardQuery { search?: string; ownerId?: number; companyId?: number; status?: OpportunityStatus }
