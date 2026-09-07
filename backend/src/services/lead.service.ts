import { ApiError } from '../utils/api-error.js';
import { createNotification } from './notification.service.js';
import {
  companyExists,
  contactExists,
  createLead,
  findById,
  listLeadSources,
  listLeads,
  ownerExists,
  softDeleteLead,
  sourceExists,
  updateLead,
} from '../repositories/lead.repository.js';
import type {
  CreateLeadInput,
  LeadListQuery,
  LeadSourceOption,
  LeadWithRelations,
  PaginatedResult,
  PublicLead,
  UpdateLeadInput,
} from '../types/lead.types.js';

/** Maximum value allowed for the `limit` query parameter. */
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 10;

/** Allowed values for the `sort` query parameter. */
const ALLOWED_SORT_FIELDS: string[] = [
  'company',
  'contact',
  'owner',
  'source',
  'status',
  'priority',
  'estimated_value',
  'created_at',
  'updated_at',
];

/**
 * Map a DB lead (with company, contact, source and owner) to the public API
 * shape. Never exposes the internal foreign keys or the raw joined columns.
 */
export function toPublicLead(lead: LeadWithRelations): PublicLead {
  return {
    id: lead.id,
    company:
      lead.company_id !== null
        ? { id: lead.company_id, name: lead.company_name ?? '' }
        : null,
    contact:
      lead.contact_id !== null
        ? {
            id: lead.contact_id,
            firstName: lead.contact_first_name ?? '',
            lastName: lead.contact_last_name ?? '',
            email: lead.contact_email,
            phone: lead.contact_phone,
          }
        : null,
    owner: {
      id: lead.owner_id,
      firstName: lead.owner_first_name,
      lastName: lead.owner_last_name,
      email: lead.owner_email,
      avatar: lead.owner_avatar,
    },
    source:
      lead.source_id !== null
        ? { id: lead.source_id, name: lead.source_name ?? '' }
        : null,
    status: lead.status,
    priority: lead.priority,
    estimatedValue: Number(lead.estimated_value),
    notes: lead.notes,
    createdAt: lead.created_at,
    updatedAt: lead.updated_at,
  };
}

/**
 * Normalize and validate the incoming list query. Applies safe defaults and
 * clamps page/limit so the repository always receives valid values.
 */
function normalizeListQuery(query: {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  priority?: string;
  sourceId?: string;
  ownerId?: string;
  companyId?: string;
  sort?: string;
  order?: string;
}): LeadListQuery {
  const parsedPage = Number.parseInt(query.page ?? '1', 10);
  const parsedLimit = Number.parseInt(query.limit ?? String(DEFAULT_LIMIT), 10);

  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit =
    Number.isInteger(parsedLimit) && parsedLimit > 0
      ? Math.min(parsedLimit, MAX_LIMIT)
      : DEFAULT_LIMIT;

  const parseId = (value: string | undefined): number | undefined => {
    if (value === undefined || value === '') return undefined;
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
  };

  const status = query.status?.trim() || undefined;
  const priority = query.priority?.trim() || undefined;

  const order = query.order === 'asc' ? 'asc' : 'desc';
  const sortBy = ALLOWED_SORT_FIELDS.includes(query.sort ?? '')
    ? (query.sort as string)
    : 'created_at';

  return {
    page,
    limit,
    search: query.search?.trim() || undefined,
    status: status as LeadListQuery['status'],
    priority: priority as LeadListQuery['priority'],
    sourceId: parseId(query.sourceId),
    ownerId: parseId(query.ownerId),
    companyId: parseId(query.companyId),
    sortBy,
    order,
  };
}

/**
 * List leads according to the query parameters, wrapped in a pagination
 * envelope. Only ever returns public lead shapes.
 */
export async function getLeads(query: {
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  priority?: string;
  sourceId?: string;
  ownerId?: string;
  companyId?: string;
  sort?: string;
  order?: string;
}): Promise<PaginatedResult<PublicLead>> {
  const normalized = normalizeListQuery(query);
  const { rows, total } = await listLeads(normalized);

  const totalPages = Math.ceil(total / normalized.limit);

  return {
    items: rows.map(toPublicLead),
    total,
    page: normalized.page,
    limit: normalized.limit,
    totalPages,
  };
}

/** Get a single lead's public shape by id. */
export async function getLeadById(id: number): Promise<PublicLead> {
  const lead = await findById(id);
  if (!lead) {
    throw ApiError.notFound('Lead not found');
  }
  return toPublicLead(lead);
}

/** List all lead sources for filters / form selects. */
export async function getLeadSources(): Promise<LeadSourceOption[]> {
  return listLeadSources();
}

/** Validate that a company id exists and throw a 400 otherwise. */
async function resolveCompanyId(companyId: number): Promise<number> {
  const exists = await companyExists(companyId);
  if (!exists) {
    throw ApiError.badRequest('The provided company does not exist');
  }
  return companyId;
}

/** Validate that a contact id exists and throw a 400 otherwise. */
async function resolveContactId(contactId: number): Promise<number> {
  const exists = await contactExists(contactId);
  if (!exists) {
    throw ApiError.badRequest('The provided contact does not exist');
  }
  return contactId;
}

/** Validate that an owner (user) id exists and throw a 400 otherwise. */
async function resolveOwnerId(ownerId: number): Promise<number> {
  const exists = await ownerExists(ownerId);
  if (!exists) {
    throw ApiError.badRequest('The provided owner does not exist');
  }
  return ownerId;
}

/** Validate that a source id exists and throw a 400 otherwise. */
async function resolveSourceId(sourceId: number): Promise<number> {
  const exists = await sourceExists(sourceId);
  if (!exists) {
    throw ApiError.badRequest('The provided source does not exist');
  }
  return sourceId;
}

/** Create a new lead and return its public shape. */
export async function createLeadAccount(
  input: CreateLeadInput,
): Promise<PublicLead> {
  const ownerId = await resolveOwnerId(input.ownerId);

  let companyId: number | undefined;
  if (input.companyId !== undefined) {
    companyId = await resolveCompanyId(input.companyId);
  }

  let contactId: number | undefined;
  if (input.contactId !== undefined) {
    contactId = await resolveContactId(input.contactId);
  }

  let sourceId: number | undefined;
  if (input.sourceId !== undefined) {
    sourceId = await resolveSourceId(input.sourceId);
  }

  const id = await createLead({
    ...input,
    companyId,
    contactId,
    ownerId,
    sourceId,
  });

  const created = await findById(id);
  if (!created) {
    throw ApiError.badRequest('Lead created but could not be loaded');
  }

  const lead = toPublicLead(created);
  try {
    await createNotification(ownerId, {
      type: 'LEAD_CREATED',
      title: 'Nouveau lead créé',
      message: `Le lead ${lead.company?.name ?? `#${lead.id}`} a été créé.`,
      entityType: 'lead',
      entityId: lead.id,
    });
  } catch {
    console.error('Notification creation failed', { event: 'lead_created', leadId: lead.id });
  }
  return lead;
}

/** Update mutable fields of a lead and return the updated public shape. */
export async function updateLeadAccount(
  id: number,
  input: UpdateLeadInput,
): Promise<PublicLead> {
  const existing = await findById(id);
  if (!existing) {
    throw ApiError.notFound('Lead not found');
  }

  let companyId: number | undefined;
  if (input.companyId !== undefined) {
    companyId = await resolveCompanyId(input.companyId);
  }

  let contactId: number | undefined;
  if (input.contactId !== undefined) {
    contactId = await resolveContactId(input.contactId);
  }

  let ownerId: number | undefined;
  if (input.ownerId !== undefined) {
    ownerId = await resolveOwnerId(input.ownerId);
  }

  let sourceId: number | undefined;
  if (input.sourceId !== undefined) {
    sourceId = await resolveSourceId(input.sourceId);
  }

  await updateLead(id, { ...input, companyId, contactId, ownerId, sourceId });

  const updated = await findById(id);
  if (!updated) {
    throw ApiError.notFound('Lead not found');
  }

  return toPublicLead(updated);
}

/** Soft-delete a lead (sets `deleted_at`). Confirms it exists first. */
export async function deleteLeadAccount(id: number): Promise<void> {
  const existing = await findById(id);
  if (!existing) {
    throw ApiError.notFound('Lead not found');
  }

  await softDeleteLead(id);
}
