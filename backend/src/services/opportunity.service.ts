import { ApiError } from '../utils/api-error.js';
import { createNotification } from './notification.service.js';
import {
  companyExists,
  contactExists,
  createOpportunity,
  findById,
  listOpportunities,
  listPipelineOptions,
  listStageOptions,
  ownerExists,
  pipelineExists,
  softDeleteOpportunity,
  stageBelongsToPipeline,
  stageExists,
  updateOpportunity,
} from '../repositories/opportunity.repository.js';
import type {
  CreateOpportunityInput,
  OpportunityListQuery,
  OpportunityPipelineOption,
  OpportunityStageOption,
  OpportunityWithRelations,
  PaginatedResult,
  PublicOpportunity,
  UpdateOpportunityInput,
} from '../types/opportunity.types.js';

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 10;

const ALLOWED_SORT_FIELDS: string[] = [
  'company',
  'contact',
  'owner',
  'pipeline',
  'stage',
  'status',
  'value',
  'probability',
  'expected_close_date',
  'created_at',
  'updated_at',
];

export function toPublicOpportunity(opportunity: OpportunityWithRelations): PublicOpportunity {
  return {
    id: opportunity.id,
    company:
      opportunity.company_id !== null
        ? { id: opportunity.company_id, name: opportunity.company_name ?? '' }
        : null,
    contact:
      opportunity.contact_id !== null
        ? {
            id: opportunity.contact_id,
            firstName: opportunity.contact_first_name ?? '',
            lastName: opportunity.contact_last_name ?? '',
            email: opportunity.contact_email,
            phone: opportunity.contact_phone,
          }
        : null,
    owner: {
      id: opportunity.owner_id,
      firstName: opportunity.owner_first_name,
      lastName: opportunity.owner_last_name,
      email: opportunity.owner_email,
      avatar: opportunity.owner_avatar,
    },
    pipeline:
      opportunity.pipeline_id !== null
        ? {
            id: opportunity.pipeline_id,
            name: opportunity.pipeline_name,
            description: opportunity.pipeline_description,
          }
        : null,
    stage:
      opportunity.stage_id !== null
        ? {
            id: opportunity.stage_id,
            name: opportunity.stage_name,
            position: opportunity.stage_position,
            color: opportunity.stage_color,
            probability: opportunity.stage_probability,
          }
        : null,
    probability: Number(opportunity.probability),
    amount: Number(opportunity.value),
    expectedCloseDate: opportunity.expected_close_date,
    status: opportunity.status,
    createdAt: opportunity.created_at,
    updatedAt: opportunity.updated_at,
  };
}

function normalizeListQuery(query: {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  stage?: string;
  ownerId?: string;
  companyId?: string;
  contactId?: string;
  pipelineId?: string;
  sort?: string;
  order?: string;
}): OpportunityListQuery {
  const parsedPage = Number.parseInt(query.page ?? '1', 10);
  const parsedLimit = Number.parseInt(query.limit ?? String(DEFAULT_LIMIT), 10);

  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit = Number.isInteger(parsedLimit) && parsedLimit > 0
    ? Math.min(parsedLimit, MAX_LIMIT)
    : DEFAULT_LIMIT;

  const parseId = (value: string | undefined): number | undefined => {
    if (value === undefined || value === '') return undefined;
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
  };

  const status = query.status?.trim() || undefined;
  const order = query.order === 'asc' ? 'asc' : 'desc';
  const sortBy = ALLOWED_SORT_FIELDS.includes(query.sort ?? '')
    ? (query.sort as string)
    : 'created_at';

  return {
    page,
    limit,
    search: query.search?.trim() || undefined,
    status: (status as OpportunityListQuery['status']) || undefined,
    stage: parseId(query.stage),
    ownerId: parseId(query.ownerId),
    companyId: parseId(query.companyId),
    contactId: parseId(query.contactId),
    pipelineId: parseId(query.pipelineId),
    sortBy,
    order,
  };
}

export async function getOpportunities(query: {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  stage?: string;
  ownerId?: string;
  companyId?: string;
  contactId?: string;
  pipelineId?: string;
  owner?: string;
  company?: string;
  contact?: string;
  pipeline?: string;
  sort?: string;
  order?: string;
}): Promise<PaginatedResult<PublicOpportunity>> {
  const normalized = normalizeListQuery(query);
  const { rows, total } = await listOpportunities(normalized);

  const totalPages = Math.ceil(total / normalized.limit);

  return {
    items: rows.map(toPublicOpportunity),
    total,
    page: normalized.page,
    limit: normalized.limit,
    totalPages,
  };
}

export async function getOpportunityById(id: number): Promise<PublicOpportunity> {
  const opportunity = await findById(id);
  if (!opportunity) {
    throw ApiError.notFound('Opportunity not found');
  }

  return toPublicOpportunity(opportunity);
}

export async function getOpportunityFilterOptions(): Promise<{
  pipelines: OpportunityPipelineOption[];
  stages: OpportunityStageOption[];
}> {
  const [pipelines, stages] = await Promise.all([
    listPipelineOptions(),
    listStageOptions(),
  ]);

  return { pipelines, stages };
}

async function resolveCompanyId(companyId: number): Promise<number> {
  const exists = await companyExists(companyId);
  if (!exists) {
    throw ApiError.badRequest('The provided company does not exist');
  }
  return companyId;
}

async function resolveContactId(contactId: number | null | undefined): Promise<number | null|undefined> {
  if (contactId === undefined || contactId === null) {
    return undefined;
  }
  const exists = await contactExists(contactId);
  if (!exists) {
    throw ApiError.badRequest('The provided contact does not exist');
  }
  return contactId;
}

async function resolveOwnerId(ownerId: number): Promise<number> {
  const exists = await ownerExists(ownerId);
  if (!exists) {
    throw ApiError.badRequest('The provided owner does not exist');
  }
  return ownerId;
}

async function resolvePipelineId(pipelineId: number): Promise<number> {
  const exists = await pipelineExists(pipelineId);
  if (!exists) {
    throw ApiError.badRequest('The provided pipeline does not exist');
  }
  return pipelineId;
}

async function resolveStageId(stageId: number): Promise<number> {
  const exists = await stageExists(stageId);
  if (!exists) {
    throw ApiError.badRequest('The provided stage does not exist');
  }
  return stageId;
}

async function assertStageMatchesPipeline(stageId: number, pipelineId: number): Promise<void> {
  const belongs = await stageBelongsToPipeline(stageId, pipelineId);
  if (!belongs) {
    throw ApiError.badRequest('The selected stage does not belong to the selected pipeline');
  }
}

export async function createOpportunityAccount(
  input: CreateOpportunityInput,
): Promise<PublicOpportunity> {
  const ownerId = await resolveOwnerId(input.ownerId);
  const companyId = await resolveCompanyId(input.companyId);
  const pipelineId = await resolvePipelineId(input.pipelineId);
  const stageId = await resolveStageId(input.stageId);
  await assertStageMatchesPipeline(stageId, pipelineId);

  const contactId = await resolveContactId(input.contactId);

  const id = await createOpportunity({
    ...input,
    ownerId,
    companyId,
    pipelineId,
    stageId,
    contactId,
  });

  const created = await findById(id);
  if (!created) {
    throw ApiError.badRequest('Opportunity created but could not be loaded');
  }

  const opportunity = toPublicOpportunity(created);
  try {
    await createNotification(ownerId, {
      type: 'OPPORTUNITY_CREATED',
      title: 'Nouvelle opportunité créée',
      message: `L'opportunité ${opportunity.company?.name ?? `#${opportunity.id}`} a été créée.`,
      entityType: 'opportunity',
      entityId: opportunity.id,
    });
  } catch {
    console.error('Notification creation failed', { event: 'opportunity_created', opportunityId: opportunity.id });
  }
  return opportunity;
}

export async function updateOpportunityAccount(
  id: number,
  input: UpdateOpportunityInput,
): Promise<PublicOpportunity> {
  const existing = await findById(id);
  if (!existing) {
    throw ApiError.notFound('Opportunity not found');
  }

  let ownerId: number | undefined;
  if (input.ownerId !== undefined) {
    ownerId = await resolveOwnerId(input.ownerId);
  }

  let companyId: number | undefined;
  if (input.companyId !== undefined) {
    companyId = await resolveCompanyId(input.companyId);
  }

  let pipelineId: number | undefined;
  if (input.pipelineId !== undefined) {
    pipelineId = await resolvePipelineId(input.pipelineId);
  }

  let stageId: number | undefined;
  if (input.stageId !== undefined) {
    stageId = await resolveStageId(input.stageId);
  }

  const effectivePipelineId = pipelineId ?? existing.pipeline_id;
  const effectiveStageId = stageId ?? existing.stage_id;
  await assertStageMatchesPipeline(effectiveStageId, effectivePipelineId);

  let contactId: number | null | undefined;
  if (input.contactId !== undefined) {
    contactId = await resolveContactId(input.contactId);
  }

  await updateOpportunity(id, {
    ...input,
    ownerId,
    companyId,
    pipelineId,
    stageId,
    contactId,
  });

  const updated = await findById(id);
  if (!updated) {
    throw ApiError.notFound('Opportunity not found');
  }

  const opportunity = toPublicOpportunity(updated);
  const label = opportunity.company?.name ?? `#${opportunity.id}`;
  try {
    if (ownerId !== undefined && ownerId !== existing.owner_id) {
      await createNotification(ownerId, { type: 'OPPORTUNITY_ASSIGNED', title: 'Nouvelle opportunité assignée', message: `L'opportunité ${label} vous a été assignée.`, entityType: 'opportunity', entityId: opportunity.id });
    } else if (input.status === 'won' && existing.status !== 'won') {
      await createNotification(opportunity.owner.id, { type: 'OPPORTUNITY_WON', title: 'Opportunité gagnée', message: `L'opportunité ${label} a été gagnée.`, entityType: 'opportunity', entityId: opportunity.id });
    } else if (input.status === 'lost' && existing.status !== 'lost') {
      await createNotification(opportunity.owner.id, { type: 'OPPORTUNITY_LOST', title: 'Opportunité perdue', message: `L'opportunité ${label} a été perdue.`, entityType: 'opportunity', entityId: opportunity.id });
    } else if (stageId !== undefined && stageId !== existing.stage_id) {
      await createNotification(opportunity.owner.id, { type: 'OPPORTUNITY_STAGE_CHANGED', title: 'Opportunité mise à jour', message: `L'opportunité ${label} est passée à l'étape ${opportunity.stage?.name ?? ''}.`, entityType: 'opportunity', entityId: opportunity.id });
    }
  } catch {
    console.error('Notification creation failed', { event: 'opportunity_updated', opportunityId: opportunity.id });
  }
  return opportunity;
}

export async function deleteOpportunityAccount(id: number): Promise<void> {
  const existing = await findById(id);
  if (!existing) {
    throw ApiError.notFound('Opportunity not found');
  }

  await softDeleteOpportunity(id);
}
