import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import * as companyService from '../services/company.service.js';
import type { ApiSuccessResponse } from '../types/api-response.js';
import type {
  CreateCompanyInput,
  PaginatedResult,
  PublicCompany,
  UpdateCompanyInput,
} from '../types/company.types.js';

/**
 * GET /api/companies
 * Lists companies with pagination, search, filters and sorting.
 * Protected by the permission middleware on the route.
 */
export const listCompanies = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await companyService.getCompanies({
      page: asQueryString(req.query.page),
      limit: asQueryString(req.query.limit),
      search: asQueryString(req.query.search),
      industry: asQueryString(req.query.industry),
      country: asQueryString(req.query.country),
      city: asQueryString(req.query.city),
      ownerId: asQueryString(req.query.ownerId),
      sort: asQueryString(req.query.sort),
      order: asQueryString(req.query.order),
    });

    const body: ApiSuccessResponse<PaginatedResult<PublicCompany>> = {
      success: true,
      data: result,
    };

    res.status(200).json(body);
  },
);

/**
 * GET /api/companies/:id
 * Returns a single company.
 */
export const getCompany = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseIntParam(req.params.id);

    const company = await companyService.getCompanyById(id);

    const body: ApiSuccessResponse<PublicCompany> = {
      success: true,
      data: company,
    };

    res.status(200).json(body);
  },
);

/**
 * GET /api/filters/companies
 * Returns the distinct filter options (industries, cities, countries)
 * used to populate the toolbar dropdowns.
 */
export const getCompanyFilters = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const options = await companyService.getCompanyFilterOptions();

    const body: ApiSuccessResponse<typeof options> = {
      success: true,
      data: options,
    };

    res.status(200).json(body);
  },
);

/**
 * POST /api/companies
 * Creates a new company.
 */
export const createCompany = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const input: CreateCompanyInput = {
      name: req.body.name,
      ownerId: parseIntParam(String(req.body.ownerId)),
      industry: asOptionalString(req.body.industry),
      website: asOptionalString(req.body.website),
      phone: asOptionalString(req.body.phone),
      email: asOptionalString(req.body.email),
      address: asOptionalString(req.body.address),
      city: asOptionalString(req.body.city),
      country: asOptionalString(req.body.country),
      notes: asOptionalString(req.body.notes),
    };

    const company = await companyService.createCompanyAccount(input);

    const body: ApiSuccessResponse<PublicCompany> = {
      success: true,
      data: company,
    };

    res.status(201).json(body);
  },
);

/**
 * PUT /api/companies/:id
 * Updates a company's mutable fields.
 */
export const updateCompany = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseIntParam(req.params.id);

    const input: UpdateCompanyInput = {
      name: asOptionalString(req.body.name),
      industry: asOptionalString(req.body.industry),
      website: asOptionalString(req.body.website),
      phone: asOptionalString(req.body.phone),
      email: asOptionalString(req.body.email),
      address: asOptionalString(req.body.address),
      city: asOptionalString(req.body.city),
      country: asOptionalString(req.body.country),
      notes: asOptionalString(req.body.notes),
      ownerId:
        req.body.ownerId !== undefined && req.body.ownerId !== ''
          ? parseIntParam(String(req.body.ownerId))
          : undefined,
    };

    const company = await companyService.updateCompanyAccount(id, input);

    const body: ApiSuccessResponse<PublicCompany> = {
      success: true,
      data: company,
    };

    res.status(200).json(body);
  },
);

/**
 * DELETE /api/companies/:id
 * Soft-deletes a company.
 */
export const deleteCompany = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseIntParam(req.params.id);

    await companyService.deleteCompanyAccount(id);

    const body: ApiSuccessResponse<{ message: string }> = {
      success: true,
      data: { message: 'Company deleted successfully' },
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
