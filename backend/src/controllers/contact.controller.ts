import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import * as contactService from '../services/contact.service.js';
import type { ApiSuccessResponse } from '../types/api-response.js';
import type {
  CreateContactInput,
  PaginatedResult,
  PublicContact,
  UpdateContactInput,
} from '../types/contact.types.js';

/**
 * GET /api/contacts
 * Lists contacts with pagination, search, filters and sorting.
 * Protected by the contact permission middleware on the route.
 */
export const listContacts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await contactService.getContacts({
      page: asQueryString(req.query.page),
      limit: asQueryString(req.query.limit),
      search: asQueryString(req.query.search),
      companyId: asQueryString(req.query.companyId),
      ownerId: asQueryString(req.query.ownerId),
      sort: asQueryString(req.query.sort),
      order: asQueryString(req.query.order),
    });

    const body: ApiSuccessResponse<PaginatedResult<PublicContact>> = {
      success: true,
      data: result,
    };

    res.status(200).json(body);
  },
);

/**
 * GET /api/contacts/:id
 * Returns a single contact.
 */
export const getContact = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseIntParam(req.params.id);

    const contact = await contactService.getContactById(id);

    const body: ApiSuccessResponse<PublicContact> = {
      success: true,
      data: contact,
    };

    res.status(200).json(body);
  },
);

/**
 * POST /api/contacts
 * Creates a new contact.
 */
export const createContact = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const input: CreateContactInput = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      companyId: parseIntParam(String(req.body.companyId)),
      ownerId: parseIntParam(String(req.body.ownerId)),
      email: asOptionalString(req.body.email),
      phone: asOptionalString(req.body.phone),
      position: asOptionalString(req.body.position),
      notes: asOptionalString(req.body.notes),
    };

    const contact = await contactService.createContactAccount(input);

    const body: ApiSuccessResponse<PublicContact> = {
      success: true,
      data: contact,
    };

    res.status(201).json(body);
  },
);

/**
 * PUT /api/contacts/:id
 * Updates a contact's mutable fields.
 */
export const updateContact = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseIntParam(req.params.id);

    const input: UpdateContactInput = {
      firstName: asOptionalString(req.body.firstName),
      lastName: asOptionalString(req.body.lastName),
      email: asOptionalString(req.body.email),
      phone: asOptionalString(req.body.phone),
      position: asOptionalString(req.body.position),
      companyId:
        req.body.companyId !== undefined && req.body.companyId !== ''
          ? parseIntParam(String(req.body.companyId))
          : undefined,
      ownerId:
        req.body.ownerId !== undefined && req.body.ownerId !== ''
          ? parseIntParam(String(req.body.ownerId))
          : undefined,
      notes: asOptionalString(req.body.notes),
    };

    const contact = await contactService.updateContactAccount(id, input);

    const body: ApiSuccessResponse<PublicContact> = {
      success: true,
      data: contact,
    };

    res.status(200).json(body);
  },
);

/**
 * DELETE /api/contacts/:id
 * Soft-deletes a contact.
 */
export const deleteContact = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseIntParam(req.params.id);

    await contactService.deleteContactAccount(id);

    const body: ApiSuccessResponse<{ message: string }> = {
      success: true,
      data: { message: 'Contact deleted successfully' },
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

