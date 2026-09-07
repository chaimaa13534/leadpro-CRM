import type {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from 'express';
import { env } from '../config/env.js';
import { ApiError } from '../utils/api-error.js';

/**
 * Global error handling middleware.
 *
 * This is the single place where errors are converted into a consistent JSON
 * response. It handles:
 *  - ApiError (application errors carrying a status code and optional details)
 *  - any unexpected error (always 500, details hidden in production)
 */
export const errorMiddleware: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ApiError) {
    const body: Record<string, unknown> = {
      success: false,
      message: err.message,
    };

    if (err.details !== undefined) {
      body.details = err.details;
    }

    res.status(err.statusCode).json(body);
    return;
  }

  const message =
    err instanceof Error ? err.message : 'Internal server error';

  // In production, avoid leaking internal error details to clients.
  const responseMessage =
    env.nodeEnv === 'production' ? 'Internal server error' : message;

  res.status(500).json({
    success: false,
    message: responseMessage,
  });
};
