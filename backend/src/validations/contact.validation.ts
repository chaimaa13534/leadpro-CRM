import { body, param, query } from 'express-validator';

/** Allowed sort columns for the list endpoint. */
const ALLOWED_SORT_FIELDS = [
  'first_name',
  'last_name',
  'email',
  'position',
  'company',
  'owner',
  'created_at',
  'updated_at',
];

/**
 * Validation rules for POST /api/contacts (create).
 */
export const createContactValidation = [
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
  body('companyId')
    .isInt({ min: 1 })
    .withMessage('A valid company id is required'),
  body('ownerId')
    .isInt({ min: 1 })
    .withMessage('A valid owner id is required'),
  body('email')
    .optional({ values: 'null' })
    .trim()
    .isEmail()
    .withMessage('A valid email address is required')
    .isLength({ max: 190 })
    .withMessage('Email must not exceed 190 characters'),
  body('phone')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 30 })
    .withMessage('Phone must not exceed 30 characters'),
  body('position')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Position must not exceed 100 characters'),
  body('notes')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Notes must not exceed 5000 characters'),
];

/**
 * Validation rules for PUT /api/contacts/:id (update).
 */
export const updateContactValidation = [
  param('id').isInt({ min: 1 }).withMessage('A valid contact id is required'),
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
  body('companyId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('A valid company id is required'),
  body('ownerId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('A valid owner id is required'),
  body('email')
    .optional({ values: 'null' })
    .trim()
    .isEmail()
    .withMessage('A valid email address is required')
    .isLength({ max: 190 })
    .withMessage('Email must not exceed 190 characters'),
  body('phone')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 30 })
    .withMessage('Phone must not exceed 30 characters'),
  body('position')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Position must not exceed 100 characters'),
  body('notes')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Notes must not exceed 5000 characters'),
];

/**
 * Validation rules for route parameters referencing a contact id.
 */
export const idParamValidation = [
  param('id').isInt({ min: 1 }).withMessage('A valid contact id is required'),
];

/**
 * Validation rules for GET /api/contacts query parameters.
 */
export const listContactsValidation = [
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
  query('companyId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('companyId must be a positive integer'),
  query('ownerId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ownerId must be a positive integer'),
  query('sort')
    .optional()
    .trim()
    .isIn(ALLOWED_SORT_FIELDS)
    .withMessage(
      'sort must be one of: first_name, last_name, email, position, company, owner, created_at, updated_at',
    ),
  query('order')
    .optional()
    .trim()
    .isIn(['asc', 'desc'])
    .withMessage('order must be either asc or desc'),
];
