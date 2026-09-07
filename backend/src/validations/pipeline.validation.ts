import { body, param, query } from 'express-validator';
export const pipelineIdValidation = [param('id').isInt({ min: 1 })]; export const pipelineStageIdValidation = [param('id').isInt({ min: 1 })];
export const pipelineInputValidation = [body('name').trim().isLength({ min: 1, max: 100 }), body('description').optional({ values: 'null' }).isLength({ max: 255 }), body('isDefault').optional().isBoolean()];
export const stageInputValidation = [body('name').trim().isLength({ min: 1, max: 100 }), body('position').isInt({ min: 0 }), body('color').optional({ values: 'null' }).isLength({ max: 20 }), body('probability').optional({ values: 'null' }).isFloat({ min: 0, max: 100 })];
export const boardQueryValidation = [query('search').optional().trim().isLength({ max: 100 }), query('status').optional().isIn(['open', 'won', 'lost']), query('ownerId').optional().isInt({ min: 1 }), query('companyId').optional().isInt({ min: 1 })];
export const moveStageValidation = [param('id').isInt({ min: 1 }), body('stageId').isInt({ min: 1 })];
