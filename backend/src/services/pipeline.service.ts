import { ApiError } from '../utils/api-error.js'; import * as r from '../repositories/pipeline.repository.js'; import { getOpportunities, getOpportunityById, updateOpportunityAccount } from './opportunity.service.js'; import type { PipelineInput, PipelineStageInput } from '../types/pipeline.types.js';
export async function getPipelines() { return r.listPipelines(); }
export async function getPipeline(id: number) { const x = await r.findPipeline(id); if (!x) throw ApiError.notFound('Pipeline not found'); return x; }
export async function getPipelineStages(pipelineId: number) { await getPipeline(pipelineId); return r.listStages(pipelineId); }
export async function getPipelineBoard(pipelineId: number, query: Parameters<typeof getOpportunities>[0]) { const [pipeline, stages, page] = await Promise.all([getPipeline(pipelineId), getPipelineStages(pipelineId), getOpportunities({ ...query, pipelineId: String(pipelineId), page: '1', limit: '100' })]); return { pipeline, stages, opportunities: page.items }; }
export async function createPipeline(x: PipelineInput) { return getPipeline(await r.createPipeline(x)); }
export async function updatePipeline(id: number, x: PipelineInput) { await getPipeline(id); await r.updatePipeline(id, x); return getPipeline(id); }
export async function removePipeline(id: number) { await getPipeline(id); await r.deletePipeline(id); }
export async function getPipelineStage(id: number) { const x = await r.findStage(id); if (!x) throw ApiError.notFound('Pipeline stage not found'); return x; }
export async function createPipelineStage(pipelineId: number, x: PipelineStageInput) { await getPipeline(pipelineId); return getPipelineStage(await r.createStage(pipelineId, x)); }
export async function updatePipelineStage(id: number, x: PipelineStageInput) { await getPipelineStage(id); await r.updateStage(id, x); return getPipelineStage(id); }
export async function removePipelineStage(id: number) { await getPipelineStage(id); await r.deleteStage(id); }
export async function moveOpportunityToStage(id: number, stageId: number) { const opportunity = await getOpportunityById(id); const stage = await getPipelineStage(stageId); if (!opportunity.pipeline || stage.pipelineId !== opportunity.pipeline.id) throw ApiError.badRequest('The selected stage does not belong to the opportunity pipeline'); return updateOpportunityAccount(id, { stageId }); }
