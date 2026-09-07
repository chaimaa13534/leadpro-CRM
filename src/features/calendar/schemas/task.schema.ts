import { z } from 'zod/v4';
import type { TaskPriority, TaskStatus, TaskRelatedEntity } from '@/types/task.types';

export const taskSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  description: z.string().max(3000, 'La description ne peut pas dépasser 3000 caractères').optional(),
  assigneeId: z.string().min(1, "L'assigné est requis"),
  priority: z.enum(['low', 'medium', 'high', 'critical'] as const satisfies readonly TaskPriority[]),
  dueDate: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done', 'cancelled'] as const satisfies readonly TaskStatus[]).default('todo'),
  companyId: z.string().optional(),
  companyName: z.string().optional(),
  contactId: z.string().optional(),
  contactName: z.string().optional(),
  opportunityId: z.string().optional(),
  opportunityName: z.string().optional(),
  relatedEntity: z.union([z.enum(['lead', 'contact', 'company', 'opportunity'] as const satisfies readonly TaskRelatedEntity[]), z.literal('')]).optional(),
  relatedEntityId: z.string().optional(),
  relatedEntityName: z.string().optional(),
  tags: z.array(z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
  })).default([]),
  notes: z.string().max(5000).optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

