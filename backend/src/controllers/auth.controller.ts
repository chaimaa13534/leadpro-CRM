import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import * as authService from '../services/auth.service.js';
import type { ApiSuccessResponse } from '../types/api-response.js';
import type { AuthUser, LoginData } from '../types/user.types.js';

/**
 * POST /api/auth/login
 * Authenticates a user and returns a JWT access token.
 */
export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const data = await authService.login({ email, password });

    const body: ApiSuccessResponse<LoginData> = {
      success: true,
      data,
    };

    res.status(200).json(body);
  },
);

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's public profile.
 */
export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;

    if (userId === undefined) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await authService.getCurrentUser(userId);

    const body: ApiSuccessResponse<AuthUser> = {
      success: true,
      data: user,
    };

    res.status(200).json(body);
  },
);

/**
 * POST /api/auth/logout
 * Stateless logout — acknowledges the client-side token discard.
 */
export const logout = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const data = await authService.logout();

    const body: ApiSuccessResponse<{ message: string }> = {
      success: true,
      data,
    };

    res.status(200).json(body);
  },
);
