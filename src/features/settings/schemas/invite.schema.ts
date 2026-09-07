/* ═════════════════════════════════════════════════════════════════════
   Settings — Invite Member Schema (Zod)
   ═════════════════════════════════════════════════════════════════════ */

import { z } from 'zod';
import type { TeamRole } from '@/features/settings/types';

const roleValues: TeamRole[] = [
  'admin',
  'manager',
  'sales_rep',
  'marketing',
  'viewer',
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Schéma d’invitation d’un membre d’équipe. */
export const inviteMemberSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'Le prénom doit contenir au moins 2 caractères.')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères.'),
  lastName: z
    .string()
    .trim()
    .min(2, 'Le nom doit contenir au moins 2 caractères.')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères.'),
  email: z
    .string()
    .trim()
    .regex(emailPattern, 'Veuillez saisir un email valide.'),
  role: z.enum(roleValues as [TeamRole, ...TeamRole[]]),
  department: z.string().trim().min(1, 'Le département est requis.'),
  message: z
    .string()
    .trim()
    .max(500, 'Le message ne peut pas dépasser 500 caractères.')
    .optional()
    .or(z.literal('')),
});

export type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;

