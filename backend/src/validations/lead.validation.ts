import { body, param, query } from 'express-validator';

/** Allowed lead status values (mirrors the DB ENUM). */
const ALLOWED_STATUS = [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'won',
  'lost',
];

/** Allowed lead priority values (mirrors the DB ENUM). */
const ALLOWED_PRIORITY = ['low', 'medium', 'high'];

/** Allowed sort columns for the list endpoint. */
const ALLOWED_SORT_FIELDS = [
  'company',
  'contact',
  'owner',
  'source',
  'status',
  'priority',
  'estimated_value',
  'created_at',
  'updated_at',
];

/**
 * Validation rules for POST /api/leads (create).
 */
export const createLeadValidation = [
  body('ownerId').isInt({ min: 1 }).withMessage('A valid owner id is required'),
  body('companyId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('A valid company id is required'),
  body('contactId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('A valid contact id is required'),
  body('sourceId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('A valid source id is required'),
  body('status')
    .optional({ values: 'null' })
    .trim()
    .isIn(ALLOWED_STATUS)
    .withMessage('status must be one of: new, contacted, qualified, proposal, won, lost'),
  body('priority')
    .optional({ values: 'null' })
    .trim()
    .isIn(ALLOWED_PRIORITY)
    .withMessage('priority must be one of: low, medium, high'),
  body('estimatedValue')
    .optional({ values: 'null' })
    .isFloat({ min: 0 })
    .withMessage('estimatedValue must be a non-negative number'),
  body('notes')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Notes must not exceed 5000 characters'),
];

/**
 * Validation rules for PUT /api/leads/:id (update).
 */
export const updateLeadValidation = [
  param('id').isInt({ min: 1 }).withMessage('A valid lead id is required'),
  body('ownerId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('A valid owner id is required'),
  body('companyId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('A valid company id is required'),
  body('contactId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('A valid contact id is required'),
  body('sourceId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('A valid source id is required'),
  body('status')
    .optional({ values: 'null' })
    .trim()
    .isIn(ALLOWED_STATUS)
    .withMessage('status must be one of: new, contacted, qualified, proposal, won, lost'),
  body('priority')
    .optional({ values: 'null' })
    .trim()
    .isIn(ALLOWED_PRIORITY)
    .withMessage('priority must be one of: low, medium, high'),
  body('estimatedValue')
    .optional({ values: 'null' })
    .isFloat({ min: 0 })
    .withMessage('estimatedValue must be a non-negative number'),
  body('notes')
    .optional({ values: 'null' })
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Notes must not exceed 5000 characters'),
];

/**
 * Validation rules for route parameters referencing a lead id.
 */
export const idParamValidation = [
  param('id').isInt({ min: 1 }).withMessage('A valid lead id is required'),
];

/**
 * Validation rules for GET /api/leads query parameters.
 */
export const listLeadsValidation = [
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
  query('status')
    .optional()
    .trim()
    .isIn(ALLOWED_STATUS)
    .withMessage('status must be one of: new, contacted, qualified, proposal, won, lost'),
  query('priority')
    .optional()
    .trim()
    .isIn(ALLOWED_PRIORITY)
    .withMessage('priority must be one of: low, medium, high'),
  query('sourceId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('sourceId must be a positive integer'),
  query('ownerId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ownerId must be a positive integer'),
  query('companyId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('companyId must be a positive integer'),
  query('sort')
    .optional()
    .trim()
    .isIn(ALLOWED_SORT_FIELDS)
    .withMessage(
      'sort must be one of: company, contact, owner, source, status, priority, estimated_value, created_at, updated_at',
    ),
  query('order')
    .optional()
    .trim()
    .isIn(['asc', 'desc'])
    .withMessage('order must be either asc or desc'),
];
