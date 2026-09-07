import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/permission.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createOpportunityValidation,
  idParamValidation,
  listOpportunitiesValidation,
  updateOpportunityValidation,
} from '../validations/opportunity.validation.js';
import {
  createOpportunity,
  deleteOpportunity,
  getOpportunity,
  getOpportunityFilters,
  listOpportunities,
  updateOpportunity,
} from '../controllers/opportunity.controller.js';
import { moveOpportunityStage } from '../controllers/pipeline.controller.js';
import { moveStageValidation } from '../validations/pipeline.validation.js';

const router = Router();

/**
 * Opportunities obey the same role matrix as the shared CRM permission model,
 * unless a dedicated module permission middleware exists. Default capability:
 * admin → full CRUD, manager → read/create/update, sales → read/create/update,
 * support → read only.
 */
router.use(requireAuth);

router.get(
  '/filters',
  requirePermission({ read: true }),
  getOpportunityFilters,
);
router.get(
  '/',
  requirePermission({ read: true }),
  listOpportunitiesValidation,
  validate,
  listOpportunities,
);
router.get(
  '/:id',
  requirePermission({ read: true }),
  idParamValidation,
  validate,
  getOpportunity,
);
router.post(
  '/',
  requirePermission({ create: true }),
  createOpportunityValidation,
  validate,
  createOpportunity,
);
router.put(
  '/:id',
  requirePermission({ update: true }),
  updateOpportunityValidation,
  validate,
  updateOpportunity,
);
router.patch('/:id/stage', requirePermission({ update: true }), moveStageValidation, validate, moveOpportunityStage);
router.delete(
  '/:id',
  requirePermission({ delete: true }),
  idParamValidation,
  validate,
  deleteOpportunity,
);

export default router;
