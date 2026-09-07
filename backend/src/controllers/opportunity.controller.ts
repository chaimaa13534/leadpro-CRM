import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import * as opportunityService from '../services/opportunity.service.js';
import type { ApiSuccessResponse } from '../types/api-response.js';
import type {
  CreateOpportunityInput,
  PaginatedResult,
  PublicOpportunity,
  UpdateOpportunityInput,
} from '../types/opportunity.types.js';

export const listOpportunities = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await opportunityService.getOpportunities({
      page: asQueryString(req.query.page),
      limit: asQueryString(req.query.limit),
      search: asQueryString(req.query.search),
      status: asQueryString(req.query.status),
      stage: asQueryString(req.query.stage),
      ownerId: asQueryString(req.query.ownerId ?? req.query.owner),
      companyId: asQueryString(req.query.companyId ?? req.query.company),
      contactId: asQueryString(req.query.contactId ?? req.query.contact),
      pipelineId: asQueryString(req.query.pipelineId ?? req.query.pipeline),
      sort: asQueryString(req.query.sort),
      order: asQueryString(req.query.order),
    });

    const body: ApiSuccessResponse<PaginatedResult<PublicOpportunity>> = {
      success: true,
      data: result,
    };

    res.status(200).json(body);
  },
);

export const getOpportunity = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseIntParam(req.params.id);

    const opportunity = await opportunityService.getOpportunityById(id);

    const body: ApiSuccessResponse<PublicOpportunity> = {
      success: true,
      data: opportunity,
    };

    res.status(200).json(body);
  },
);

export const getOpportunityFilters = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const options = await opportunityService.getOpportunityFilterOptions();

    const body: ApiSuccessResponse<typeof options> = {
      success: true,
      data: options,
    };

    res.status(200).json(body);
  },
);

export const createOpportunity = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const input: CreateOpportunityInput = {
      companyId: parseIntParam(String(req.body.companyId)),
      contactId:
        req.body.contactId !== undefined && req.body.contactId !== ''
          ? parseIntParam(String(req.body.contactId))
          : null,
      ownerId: parseIntParam(String(req.body.ownerId)),
      pipelineId: parseIntParam(String(req.body.pipelineId)),
      stageId: parseIntParam(String(req.body.stageId)),
      probability:
        req.body.probability !== undefined && req.body.probability !== ''
          ? Number(req.body.probability)
          : undefined,
      value:
        req.body.value !== undefined && req.body.value !== ''
          ? Number(req.body.value)
          : req.body.amount !== undefined && req.body.amount !== ''
            ? Number(req.body.amount)
            : undefined,
      expectedCloseDate: asOptionalString(req.body.expectedCloseDate),
      status: asOptionalString(req.body.status) as CreateOpportunityInput['status'],
    };

    const opportunity = await opportunityService.createOpportunityAccount(input);

    const body: ApiSuccessResponse<PublicOpportunity> = {
      success: true,
      data: opportunity,
    };

    res.status(201).json(body);
  },
);

export const updateOpportunity = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseIntParam(req.params.id);

    const input: UpdateOpportunityInput = {
      companyId:
        req.body.companyId !== undefined && req.body.companyId !== ''
          ? parseIntParam(String(req.body.companyId))
          : undefined,
      contactId:
        req.body.contactId !== undefined && req.body.contactId !== ''
          ? parseIntParam(String(req.body.contactId))
          : undefined,
      ownerId:
        req.body.ownerId !== undefined && req.body.ownerId !== ''
          ? parseIntParam(String(req.body.ownerId))
          : undefined,
      pipelineId:
        req.body.pipelineId !== undefined && req.body.pipelineId !== ''
          ? parseIntParam(String(req.body.pipelineId))
          : undefined,
      stageId:
        req.body.stageId !== undefined && req.body.stageId !== ''
          ? parseIntParam(String(req.body.stageId))
          : undefined,
      probability:
        req.body.probability !== undefined && req.body.probability !== ''
          ? Number(req.body.probability)
          : undefined,
      value:
        req.body.value !== undefined && req.body.value !== ''
          ? Number(req.body.value)
          : req.body.amount !== undefined && req.body.amount !== ''
            ? Number(req.body.amount)
            : undefined,
      expectedCloseDate:
        req.body.expectedCloseDate !== undefined
          ? asOptionalString(req.body.expectedCloseDate)
          : undefined,
      status: asOptionalString(req.body.status) as UpdateOpportunityInput['status'],
    };

    const opportunity = await opportunityService.updateOpportunityAccount(id, input);

    const body: ApiSuccessResponse<PublicOpportunity> = {
      success: true,
      data: opportunity,
    };

    res.status(200).json(body);
  },
);

export const deleteOpportunity = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseIntParam(req.params.id);

    await opportunityService.deleteOpportunityAccount(id);

    const body: ApiSuccessResponse<{ message: string }> = {
      success: true,
      data: { message: 'Opportunity deleted successfully' },
    };

    res.status(200).json(body);
  },
);

function asQueryString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }
  return undefined;
}

function asOptionalString(value: unknown): string | null | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseIntParam(value: string): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw ApiError.badRequest('A valid id is required');
  }
  return parsed;
}
