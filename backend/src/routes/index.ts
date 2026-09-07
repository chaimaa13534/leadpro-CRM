import { Router } from 'express';
import { getHealth } from '../controllers/health.controller.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import companyRoutes from './company.routes.js';
import contactRoutes from './contact.routes.js';
import leadRoutes from './lead.routes.js';
import opportunityRoutes from './opportunity.routes.js';
import pipelineRoutes, { pipelineStageRouter } from './pipeline.routes.js';
import taskRoutes from './task.routes.js';
import notificationRoutes from './notification.routes.js';
import reportRoutes from './report.routes.js';
import profileRoutes from './profile.routes.js';

/**
 * Central route registry.
 *
 * All API routes are mounted under the `/api` prefix in app.ts.
 */
const router = Router();

router.get('/health', getHealth);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/companies', companyRoutes);
router.use('/contacts', contactRoutes);
router.use('/leads', leadRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/pipelines', pipelineRoutes);
router.use('/pipeline-stages', pipelineStageRouter);
router.use('/tasks', taskRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);
router.use('/profile', profileRoutes);

export default router;
