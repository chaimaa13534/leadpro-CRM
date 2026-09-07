import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/permission.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createCompanyValidation,
  idParamValidation,
  listCompaniesValidation,
  updateCompanyValidation,
} from '../validations/company.validation.js';
import {
  createCompany,
  deleteCompany,
  getCompany,
  getCompanyFilters,
  listCompanies,
  updateCompany,
} from '../controllers/company.controller.js';

const router = Router();

/**
 * All /api/companies routes are protected.
 *
 * Permission model:
 *   - admin   → full CRUD
 *   - manager → read, create, update
 *   - sales   → read only
 *   - support → read only
 */
router.use(requireAuth);

router.get(
  '/',
  requirePermission({ read: true }),
  listCompaniesValidation,
  validate,
  listCompanies,
);
router.get(
  '/filters',
  requirePermission({ read: true }),
  getCompanyFilters,
);
router.get(
  '/:id',
  requirePermission({ read: true }),
  idParamValidation,
  validate,
  getCompany,
);
router.post(
  '/',
  requirePermission({ create: true }),
  createCompanyValidation,
  validate,
  createCompany,
);
router.put(
  '/:id',
  requirePermission({ update: true }),
  updateCompanyValidation,
  validate,
  updateCompany,
);
router.delete(
  '/:id',
  requirePermission({ delete: true }),
  idParamValidation,
  validate,
  deleteCompany,
);

export default router;
