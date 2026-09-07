import type { Request, Response } from 'express';

/**
 * 404 handler.
 *
 * Any request that does not match a defined route falls through to this
 * middleware and returns a consistent JSON error instead of the default
 * Express HTML page.
 */
export const notFoundMiddleware = (_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};
