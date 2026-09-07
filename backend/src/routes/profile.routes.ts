import { Router } from 'express';
import { body } from 'express-validator';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { deleteProfile, getProfile, patchProfile, postAvatar } from '../controllers/profile.controller.js';

const router = Router();
router.use(requireAuth);
router.get('/', getProfile);
router.patch('/', [body('firstName').optional().trim().notEmpty().isLength({ max: 100 }), body('lastName').optional().trim().notEmpty().isLength({ max: 100 }), body('email').optional().trim().isEmail().normalizeEmail(), body('phone').optional().trim().isLength({ max: 30 })], validate, patchProfile);
router.post('/avatar', body('image').isString().isLength({ max: 1_400_000 }), validate, postAvatar);
router.delete('/', deleteProfile);
export default router;
