import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  changeStatusValidation,
  createUserValidation,
  idParamValidation,
  listUsersValidation,
  updateUserValidation,
} from '../validations/user.validation.js';
import {
  changeStatus,
  createUser,
  deleteUser,
  getUser,
  getUserOptions,
  listUsers,
  updateUser,
} from '../controllers/user.controller.js';

const router = Router();

/**
 * All /api/users routes are protected.
 *
 * - GET   /                  admin only
 * - GET   /:id               admin or self (checked in the controller)
 * - POST  /                  admin only
 * - PUT   /:id               admin only
 * - PATCH /:id/status        admin only
 * - DELETE /:id              admin only
 */
router.use(requireAuth);

router.get('/', requireRole('admin'), listUsersValidation, validate, listUsers);
router.get('/options', getUserOptions);
router.get('/:id', idParamValidation, validate, getUser);
router.post('/', requireRole('admin'), createUserValidation, validate, createUser);
router.put(
  '/:id',
  requireRole('admin'),
  updateUserValidation,
  validate,
  updateUser,
);
router.patch(
  '/:id/status',
  requireRole('admin'),
  changeStatusValidation,
  validate,
  changeStatus,
);
router.delete('/:id', requireRole('admin'), idParamValidation, validate, deleteUser);

export default router;
