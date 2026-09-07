import { Router } from 'express';
import { loginValidation } from '../validations/auth.validation.js';
import { validate } from '../middlewares/validate.middleware.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import {
  getCurrentUser,
  login,
  logout,
} from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', loginValidation, validate, login);
router.get('/me', requireAuth, getCurrentUser);
router.post('/logout', requireAuth, logout);

export default router;
