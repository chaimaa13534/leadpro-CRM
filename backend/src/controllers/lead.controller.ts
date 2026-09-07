import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import * as leadService from '../services/lead.service.js';
import type { ApiSuccessResponse } from '../types/api-response.js';
import type {
  CreateLeadInput,
  LeadSourceOption,
  PaginatedResult,
  PublicLead,
  UpdateLeadInput,
} from '../types/lead.types.js';

/**
 * GET /api/leads
 * Lists leads with pagination, search, filters and sorting.
 * Protected by the lead permission middleware on the route.
 */
export const listLeads = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await leadService.getLeads({
      page: asQueryString(req.query.page),
      limit: asQueryString(req.query.limit),
      search: asQueryString(req.query.search),
      status: asQueryString(req.query.status),
      priority: asQueryString(req.query.priority),
      sourceId: asQueryString(req.query.sourceId),
      ownerId: asQueryString(req.query.ownerId),
      companyId: asQueryString(req.query.companyId),
      sort: asQueryString(req.query.sort),
      order: asQueryString(req.query.order),
    });

    const body: ApiSuccessResponse<PaginatedResult<PublicLead>> = {
      success: true,
      data: result,
    };

    res.status(200).json(body);
  },
);

/**
 * GET /api/leads/sources
 * Lists all lead sources for filters / selects. Auth-only.
 */
export const listLeadSourceOptions = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const sources = await leadService.getLeadSources();

    const body: ApiSuccessResponse<LeadSourceOption[]> = {
      success: true,
      data: sources,
    };

    res.status(200).json(body);
  },
);

/**
 * GET /api/leads/:id
 * Returns a single lead.
 */
export const getLead = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseIntParam(req.params.id);

    const lead = await leadService.getLeadById(id);

    const body: ApiSuccessResponse<PublicLead> = {
      success: true,
      data: lead,
    };

    res.status(200).json(body);
  },
);

/**
 * POST /api/leads
 * Creates a new lead.
 */
export const createLead = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const input: CreateLeadInput = {
      ownerId: parseIntParam(String(req.body.ownerId)),
      companyId:
        req.body.companyId !== undefined && req.body.companyId !== ''
          ? parseIntParam(String(req.body.companyId))
          : undefined,
      contactId:
        req.body.contactId !== undefined && req.body.contactId !== ''
          ? parseIntParam(String(req.body.contactId))
          : undefined,
      sourceId:
        req.body.sourceId !== undefined && req.body.sourceId !== ''
          ? parseIntParam(String(req.body.sourceId))
          : undefined,
      status: asOptionalString(req.body.status) as CreateLeadInput['status'],
      priority: asOptionalString(
        req.body.priority,
      ) as CreateLeadInput['priority'],
      estimatedValue:
        req.body.estimatedValue !== undefined && req.body.estimatedValue !== ''
          ? Number(req.body.estimatedValue)
          : undefined,
      notes: asOptionalString(req.body.notes),
    };

    const lead = await leadService.createLeadAccount(input);

    const body: ApiSuccessResponse<PublicLead> = {
      success: true,
      data: lead,
    };

    res.status(201).json(body);
  },
);

/**
 * PUT /api/leads/:id
 * Updates a lead's mutable fields.
 */
export const updateLead = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseIntParam(req.params.id);

    const input: UpdateLeadInput = {
      ownerId:
        req.body.ownerId !== undefined && req.body.ownerId !== ''
          ? parseIntParam(String(req.body.ownerId))
          : undefined,
      companyId:
        req.body.companyId !== undefined && req.body.companyId !== ''
          ? parseIntParam(String(req.body.companyId))
          : undefined,
      contactId:
        req.body.contactId !== undefined && req.body.contactId !== ''
          ? parseIntParam(String(req.body.contactId))
          : undefined,
      sourceId:
        req.body.sourceId !== undefined && req.body.sourceId !== ''
          ? parseIntParam(String(req.body.sourceId))
          : undefined,
      status: asOptionalString(req.body.status) as UpdateLeadInput['status'],
      priority: asOptionalString(
        req.body.priority,
      ) as UpdateLeadInput['priority'],
      estimatedValue:
        req.body.estimatedValue !== undefined && req.body.estimatedValue !== ''
          ? Number(req.body.estimatedValue)
          : undefined,
      notes: asOptionalString(req.body.notes),
    };

    const lead = await leadService.updateLeadAccount(id, input);

    const body: ApiSuccessResponse<PublicLead> = {
      success: true,
      data: lead,
    };

    res.status(200).json(body);
  },
);

/**
 * DELETE /api/leads/:id
 * Soft-deletes a lead.
 */
export const deleteLead = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseIntParam(req.params.id);

    await leadService.deleteLeadAccount(id);

    const body: ApiSuccessResponse<{ message: string }> = {
      success: true,
      data: { message: 'Lead deleted successfully' },
    };

    res.status(200).json(body);
  },
);

/** Coerce an Express query value to its string form or undefined. */
function asQueryString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }
  return undefined;
}

/** Coerce a body value to a trimmed string or undefined. */
function asOptionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** Parse a route param into a positive integer. */
function parseIntParam(value: string): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw ApiError.badRequest('A valid id is required');
  }
  return parsed;
}
