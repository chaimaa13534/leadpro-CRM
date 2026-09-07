import { body, param, query } from 'express-validator';

/** Allowed role slugs accepted when creating / updating a user. */
const ALLOWED_ROLES = ['admin', 'manager', 'sales', 'support'];

/** Allowed sort columns for the list endpoint. */
const ALLOWED_SORT_FIELDS = [
  'first_name',
  'last_name',
  'email',
  'role',
  'is_active',
  'created_at',
  'updated_at',
];

/**
 * Validation rules for POST /api/users (create).
 */
export const createUserValidation = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 100 })
    .withMessage('First name must not exceed 100 characters'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 100 })
    .withMessage('Last name must not exceed 100 characters'),
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
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('phone')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 30 })
    .withMessage('Phone must not exceed 30 characters'),
  body('avatar')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 255 })
    .withMessage('Avatar URL must not exceed 255 characters'),
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required')
    .isIn(ALLOWED_ROLES)
    .withMessage('Role must be one of: admin, manager, sales, support'),
  body('isActive')
    .optional({ values: 'null' })
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

/**
 * Validation rules for PUT /api/users/:id (update).
 */
export const updateUserValidation = [
  param('id').isInt({ min: 1 }).withMessage('A valid user id is required'),
  body('firstName')
    .optional({ values: 'null' })
    .trim()
    .notEmpty()
    .withMessage('First name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('First name must not exceed 100 characters'),
  body('lastName')
    .optional({ values: 'null' })
    .trim()
    .notEmpty()
    .withMessage('Last name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Last name must not exceed 100 characters'),
  body('phone')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 30 })
    .withMessage('Phone must not exceed 30 characters'),
  body('avatar')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 255 })
    .withMessage('Avatar URL must not exceed 255 characters'),
  body('role')
    .optional({ values: 'null' })
    .trim()
    .isIn(ALLOWED_ROLES)
    .withMessage('Role must be one of: admin, manager, sales, support'),
  body('isActive')
    .optional({ values: 'null' })
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

/**
 * Validation rules for PATCH /api/users/:id/status.
 */
export const changeStatusValidation = [
  param('id').isInt({ min: 1 }).withMessage('A valid user id is required'),
  body('isActive').isBoolean().withMessage('isActive must be a boolean'),
];

/**
 * Validation rules for route parameters that reference a user id.
 */
export const idParamValidation = [
  param('id').isInt({ min: 1 }).withMessage('A valid user id is required'),
];

/**
 * Validation rules for GET /api/users query parameters.
 */
export const listUsersValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be an integer between 1 and 100'),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('search must not exceed 100 characters'),
  query('role')
    .optional()
    .trim()
    .isIn(ALLOWED_ROLES)
    .withMessage('role must be one of: admin, manager, sales, support'),
  query('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean'),
  query('sort')
    .optional()
    .trim()
    .isIn(ALLOWED_SORT_FIELDS)
    .withMessage(
      'sort must be one of: first_name, last_name, email, role, is_active, created_at, updated_at',
    ),
  query('order')
    .optional()
    .trim()
    .isIn(['asc', 'desc'])
    .withMessage('order must be either asc or desc'),
];
