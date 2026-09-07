import { body } from 'express-validator';

/**
 * Validation rules for POST /api/auth/login.
 * - email must be a valid email address
 * - password is required
 */
export const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('A valid email address is required')
    .normalizeEmail(),
  body('password')
    .isString()
    .withMessage('Password is required')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1 })
    .withMessage('Password is required'),
];
