import { z } from 'zod/v4';
import type { EventType, EventPriority, ReminderTime } from '@/types/calendar.types';

export const eventSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  description: z.string().max(2000, 'La description ne peut pas dépasser 2000 caractères').optional(),
  startDate: z.string().min(1, 'La date de début est requise'),
  startTime: z.string().min(1, "L'heure de début est requise"),
  duration: z.coerce.number().min(5, 'La durée minimum est de 5 minutes').max(1440, 'La durée maximum est de 1440 minutes').default(60),
  allDay: z.boolean().default(false),
  type: z.enum(['meeting', 'call', 'demo', 'appointment', 'reminder', 'deadline', 'lunch', 'other'] as const satisfies readonly EventType[]),
  priority: z.enum(['low', 'medium', 'high', 'critical'] as const satisfies readonly EventPriority[]),
  color: z.string().optional(),
  location: z.string().max(300).optional(),
  isOnline: z.boolean().default(false),
  meetingUrl: z.string().url('URL invalide').optional().or(z.literal('')),
  companyId: z.string().optional(),
  companyName: z.string().optional(),
  contactId: z.string().optional(),
  contactName: z.string().optional(),
  opportunityId: z.string().optional(),
  opportunityName: z.string().optional(),
  reminder: z.enum(['5min', '10min', '15min', '30min', '1hour', '2hours', '1day', '2days'] as const satisfies readonly ReminderTime[]).optional(),
  notes: z.string().max(5000).optional(),
  participants: z.array(z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    avatarUrl: z.string().optional(),
    responseStatus: z.enum(['pending', 'accepted', 'declined', 'tentative']).default('pending'),
  })).default([]),
});

export type EventFormValues = z.infer<typeof eventSchema>;

