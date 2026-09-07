import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireContactPermission } from '../middlewares/contact-permission.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createContactValidation,
  idParamValidation,
  listContactsValidation,
  updateContactValidation,
} from '../validations/contact.validation.js';
import {
  createContact,
  deleteContact,
  getContact,
  listContacts,
  updateContact,
} from '../controllers/contact.controller.js';

const router = Router();

/**
 * All /api/contacts routes are protected.
 *
 * Contacts-specific permission model (see contact-permission.middleware.ts):
 *   - admin   → full CRUD
 *   - manager → read, create, update (no delete)
 *   - sales   → read, create, update (no delete)
 *   - support → read only
 *
 * This intentionally diverges from the shared permission middleware so that
 * the Sales role can create and update contacts without loosening the
 * permission rules of the other modules.
 */
router.use(requireAuth);

router.get(
  '/',
  requireContactPermission({ read: true }),
  listContactsValidation,
  validate,
  listContacts,
);
router.get(
  '/:id',
  requireContactPermission({ read: true }),
  idParamValidation,
  validate,
  getContact,
);
router.post(
  '/',
  requireContactPermission({ create: true }),
  createContactValidation,
  validate,
  createContact,
);
router.put(
  '/:id',
  requireContactPermission({ update: true }),
  updateContactValidation,
  validate,
  updateContact,
);
router.delete(
  '/:id',
  requireContactPermission({ delete: true }),
  idParamValidation,
  validate,
  deleteContact,
);

export default router;

