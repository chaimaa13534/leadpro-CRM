import { body, param, query } from 'express-validator';

/** Allowed sort columns for the list endpoint. */
const ALLOWED_SORT_FIELDS = [
  'name',
  'industry',
  'city',
  'country',
  'created_at',
  'updated_at',
  'owner',
];

/**
 * Validation rules for POST /api/companies (create).
 */
export const createCompanyValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ max: 190 })
    .withMessage('Company name must not exceed 190 characters'),
  body('ownerId')
    .isInt({ min: 1 })
    .withMessage('A valid owner id is required'),
  body('industry')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Industry must not exceed 100 characters'),
  body('website')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 255 })
    .withMessage('Website must not exceed 255 characters'),
  body('phone')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 30 })
    .withMessage('Phone must not exceed 30 characters'),
  body('email')
    .optional({ values: 'null' })
    .trim()
    .isEmail()
    .withMessage('A valid email address is required')
    .isLength({ max: 190 })
    .withMessage('Email must not exceed 190 characters'),
  body('address')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 255 })
    .withMessage('Address must not exceed 255 characters'),
  body('city')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 100 })
    .withMessage('City must not exceed 100 characters'),
  body('country')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters'),
  body('notes')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Notes must not exceed 5000 characters'),
];

/**
 * Validation rules for PUT /api/companies/:id (update).
 */
export const updateCompanyValidation = [
  param('id').isInt({ min: 1 }).withMessage('A valid company id is required'),
  body('name')
    .optional({ values: 'null' })
    .trim()
    .notEmpty()
    .withMessage('Company name cannot be empty')
    .isLength({ max: 190 })
    .withMessage('Company name must not exceed 190 characters'),
  body('ownerId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('A valid owner id is required'),
  body('industry')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Industry must not exceed 100 characters'),
  body('website')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 255 })
    .withMessage('Website must not exceed 255 characters'),
  body('phone')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 30 })
    .withMessage('Phone must not exceed 30 characters'),
  body('email')
    .optional({ values: 'null' })
    .trim()
    .isEmail()
    .withMessage('A valid email address is required')
    .isLength({ max: 190 })
    .withMessage('Email must not exceed 190 characters'),
  body('address')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 255 })
    .withMessage('Address must not exceed 255 characters'),
  body('city')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 100 })
    .withMessage('City must not exceed 100 characters'),
  body('country')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters'),
  body('notes')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Notes must not exceed 5000 characters'),
];

/**
 * Validation rules for route parameters referencing a company id.
 */
export const idParamValidation = [
  param('id').isInt({ min: 1 }).withMessage('A valid company id is required'),
];

/**
 * Validation rules for GET /api/companies query parameters.
 */
export const listCompaniesValidation = [
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
  query('industry')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('industry must not exceed 100 characters'),
  query('country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('country must not exceed 100 characters'),
  query('city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('city must not exceed 100 characters'),
  query('ownerId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ownerId must be a positive integer'),
  query('sort')
    .optional()
    .trim()
    .isIn(ALLOWED_SORT_FIELDS)
    .withMessage(
      'sort must be one of: name, industry, city, country, created_at, updated_at, owner',
    ),
  query('order')
    .optional()
    .trim()
    .isIn(['asc', 'desc'])
    .withMessage('order must be either asc or desc'),
];
