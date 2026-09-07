import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import * as userService from '../services/user.service.js';
import type { ApiSuccessResponse } from '../types/api-response.js';
import type {
  CreateUserInput,
  PaginatedResult,
  PublicUser,
  UpdateUserInput,
} from '../types/user.types.js';

/**
 * GET /api/users
 * Lists users with pagination, search, filters and sorting. Admin only —
 * enforced by the requireRole('admin') middleware on the route.
 */
export const listUsers = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await userService.getUsers({
      page: asQueryString(req.query.page),
      limit: asQueryString(req.query.limit),
      search: asQueryString(req.query.search),
      role: asQueryString(req.query.role),
      is_active: asQueryString(req.query.is_active),
      sort: asQueryString(req.query.sort),
      order: asQueryString(req.query.order),
    });

    const body: ApiSuccessResponse<PaginatedResult<PublicUser>> = {
      success: true,
      data: result,
    };

    res.status(200).json(body);
  },
);

/**
 * GET /api/users/options
 * Lightweight list of active users used to populate owner/filter selects.
 * Auth-only (no admin requirement) so any logged-in CRM role can build the
 * responsible picker without needing the admin-only full user list.
 */
export const getUserOptions = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const options = await userService.getUserOptions();

    const body: ApiSuccessResponse<typeof options> = {
      success: true,
      data: options,
    };

    res.status(200).json(body);
  },
);

/**
 * GET /api/users/:id
 * Returns a single user's public profile. Reached either by an admin or by
 * the authenticated user requesting their own profile. The self-access check
 * lives in the route handler (see `getUser`).
 */
export const getUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseIntParam(req.params.id);

    // Self-access check: a non-admin may only read their own profile.
    if (req.user?.role !== 'admin' && req.user?.id !== id) {
      throw ApiError.forbidden('Access denied');
    }

    const user = await userService.getUserById(id);

    const body: ApiSuccessResponse<PublicUser> = {
      success: true,
      data: user,
    };

    res.status(200).json(body);
  },
);

/**
 * POST /api/users
 * Creates a new user. Admin only.
 */
export const createUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const input: CreateUserInput = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      phone: req.body.phone ?? undefined,
      avatar: req.body.avatar ?? undefined,
      isActive: req.body.isActive ?? undefined,
    };

    const user = await userService.createUserAccount(input);

    const body: ApiSuccessResponse<PublicUser> = {
      success: true,
      data: user,
    };

    res.status(201).json(body);
  },
);

/**
 * PUT /api/users/:id
 * Updates a user's mutable fields. Admin only.
 */
export const updateUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseIntParam(req.params.id);

    const input: UpdateUserInput = {
      firstName: asOptionalString(req.body.firstName),
      lastName: asOptionalString(req.body.lastName),
      phone: asOptionalString(req.body.phone),
      avatar: asOptionalString(req.body.avatar),
      role: asOptionalString(req.body.role),
      isActive: asOptionalBoolean(req.body.isActive),
    };

    const user = await userService.updateUserAccount(id, input);

    const body: ApiSuccessResponse<PublicUser> = {
      success: true,
      data: user,
    };

    res.status(200).json(body);
  },
);

/**
 * PATCH /api/users/:id/status
 * Activates or deactivates a user account. Admin only.
 */
export const changeStatus = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseIntParam(req.params.id);
    const isActive = Boolean(req.body.isActive);

    const user = await userService.setUserStatus(id, isActive);

    const body: ApiSuccessResponse<PublicUser> = {
      success: true,
      data: user,
    };

    res.status(200).json(body);
  },
);

/**
 * DELETE /api/users/:id
 * Soft-deletes a user. Admin only.
 */
export const deleteUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = parseIntParam(req.params.id);

    await userService.deleteUserAccount(id);

    const body: ApiSuccessResponse<{ message: string }> = {
      success: true,
      data: { message: 'User deleted successfully' },
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

/** Coerce a body value to a boolean or undefined. */
function asOptionalBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') {
    return value;
  }
  if (value === 'true' || value === '1') {
    return true;
  }
  if (value === 'false' || value === '0') {
    return false;
  }
  return undefined;
}

/** Parse a route param into a positive integer. */
function parseIntParam(value: string): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw ApiError.badRequest('A valid user id is required');
  }
  return parsed;
}
