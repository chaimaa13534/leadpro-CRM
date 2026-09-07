import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/api-error.js';
import { extractBearerToken, verifyAccessToken } from '../utils/jwt.js';
import type { RequestHandler } from 'express';

/**
 * JWT authentication middleware.
 *
 * Reads the `Authorization: Bearer <token>` header, verifies the token and
 * attaches a minimal AuthUser to `req.user`. Returns 401 when the header is
 * missing, malformed, or the token is invalid/expired.
 */
export const requireAuth: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    next(ApiError.unauthorized('Authentication token is required'));
    return;
  }

  const claims = verifyAccessToken(token);

  req.user = {
    id: claims.userId,
    firstName: '',
    lastName: '',
    email: claims.email,
    avatar: null,
    role: claims.role,
  };

  next();
};
