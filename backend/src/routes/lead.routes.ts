import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireLeadPermission } from '../middlewares/lead-permission.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createLeadValidation,
  idParamValidation,
  listLeadsValidation,
  updateLeadValidation,
} from '../validations/lead.validation.js';
import {
  createLead,
  deleteLead,
  getLead,
  listLeadSourceOptions,
  listLeads,
  updateLead,
} from '../controllers/lead.controller.js';

const router = Router();

/**
 * All /api/leads routes are protected.
 *
 * Leads-specific permission model (see lead-permission.middleware.ts):
 *   - admin   → full CRUD
 *   - manager → read, create, update (no delete)
 *   - sales   → read, create, update (no delete)
 *   - support → read only
 *
 * This intentionally mirrors the Contacts module so the Sales role can
 * create and update leads without loosening the global permission rules.
 */
router.use(requireAuth);

router.get(
  '/sources',
  listLeadsValidation,
  validate,
  listLeadSourceOptions,
);
router.get(
  '/',
  requireLeadPermission({ read: true }),
  listLeadsValidation,
  validate,
  listLeads,
);
router.get(
  '/:id',
  requireLeadPermission({ read: true }),
  idParamValidation,
  validate,
  getLead,
);
router.post(
  '/',
  requireLeadPermission({ create: true }),
  createLeadValidation,
  validate,
  createLead,
);
router.put(
  '/:id',
  requireLeadPermission({ update: true }),
  updateLeadValidation,
  validate,
  updateLead,
);
router.delete(
  '/:id',
  requireLeadPermission({ delete: true }),
  idParamValidation,
  validate,
  deleteLead,
);

export default router;
