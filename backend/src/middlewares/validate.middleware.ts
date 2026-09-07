import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ApiError } from '../utils/api-error.js';

/**
 * Validate a request against previously-registered express-validator rules.
 *
 * When validation fails it throws a 400 ApiError whose details carry the
 * per-field error messages. Otherwise it calls next().
 */
export function validate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const details = errors.array().map((error) => ({
      field: error.type === 'field' ? error.path : 'body',
      message: error.msg,
    }));

    next(ApiError.badRequest('Validation failed', details));
    return;
  }

  next();
}
