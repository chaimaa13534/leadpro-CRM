import { body, param, query } from 'express-validator';

const ALLOWED_STATUS = ['open', 'won', 'lost'];

const ALLOWED_SORT_FIELDS = [
  'company',
  'contact',
  'owner',
  'pipeline',
  'stage',
  'status',
  'value',
  'probability',
  'expected_close_date',
  'created_at',
  'updated_at',
];

export const createOpportunityValidation = [
  body('companyId').isInt({ min: 1 }).withMessage('A valid company id is required'),
  body('contactId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('A valid contact id is required'),
  body('ownerId').isInt({ min: 1 }).withMessage('A valid owner id is required'),
  body('pipelineId').isInt({ min: 1 }).withMessage('A valid pipeline id is required'),
  body('stageId').isInt({ min: 1 }).withMessage('A valid pipeline stage id is required'),
  body('probability')
    .optional({ values: 'null' })
    .isFloat({ min: 0, max: 100 })
    .withMessage('probability must be between 0 and 100'),
  body('value')
    .optional({ values: 'null' })
    .isFloat({ min: 0 })
    .withMessage('value must be a non-negative number'),
  body('expectedCloseDate')
    .optional({ values: 'null' })
    .trim()
    .isISO8601()
    .withMessage('expectedCloseDate must be a valid ISO date'),
  body('status')
    .optional({ values: 'null' })
    .trim()
    .isIn(ALLOWED_STATUS)
    .withMessage('status must be one of: open, won, lost'),
];

export const updateOpportunityValidation = [
  param('id').isInt({ min: 1 }).withMessage('A valid opportunity id is required'),
  body('companyId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('A valid company id is required'),
  body('contactId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('A valid contact id is required'),
  body('ownerId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('A valid owner id is required'),
  body('pipelineId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('A valid pipeline id is required'),
  body('stageId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('A valid pipeline stage id is required'),
  body('probability')
    .optional({ values: 'null' })
    .isFloat({ min: 0, max: 100 })
    .withMessage('probability must be between 0 and 100'),
  body('value')
    .optional({ values: 'null' })
    .isFloat({ min: 0 })
    .withMessage('value must be a non-negative number'),
  body('expectedCloseDate')
    .optional({ values: 'null' })
    .trim()
    .isISO8601()
    .withMessage('expectedCloseDate must be a valid ISO date'),
  body('status')
    .optional({ values: 'null' })
    .trim()
    .isIn(ALLOWED_STATUS)
    .withMessage('status must be one of: open, won, lost'),
];

export const idParamValidation = [
  param('id').isInt({ min: 1 }).withMessage('A valid opportunity id is required'),
];

export const listOpportunitiesValidation = [
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
    .withMessage('status must be one of: open, won, lost'),
  query('stage')
    .optional()
    .isInt({ min: 1 })
    .withMessage('stage must be a positive integer'),
  query('ownerId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('ownerId must be a positive integer'),
  query('companyId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('companyId must be a positive integer'),
  query('contactId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('contactId must be a positive integer'),
  query('pipelineId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('pipelineId must be a positive integer'),
  query('sort')
    .optional()
    .trim()
    .isIn(ALLOWED_SORT_FIELDS)
    .withMessage(
      'sort must be one of: company, contact, owner, pipeline, stage, status, value, probability, expected_close_date, created_at, updated_at',
    ),
  query('order')
    .optional()
    .trim()
    .isIn(['asc', 'desc'])
    .withMessage('order must be either asc or desc'),
];
