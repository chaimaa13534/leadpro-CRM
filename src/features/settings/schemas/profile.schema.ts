/* ═════════════════════════════════════════════════════════════════════
   Settings — Profile Schema (Zod)
   ═════════════════════════════════════════════════════════════════════ */

import { z } from 'zod';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const optionalUrl = z
  .string()
  .trim()
  .refine(
    (value) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Veuillez saisir une URL valide (ex: https://…).' },
  )
  .optional();

/** Schéma de validation du profil utilisateur. */
export const profileSchema = z.object({
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
  phone: z
    .string()
    .trim()
    .regex(
      /^[+0-9 ()-]{6,20}$/,
      'Veuillez saisir un numéro de téléphone valide.',
    )
    .optional()
    .or(z.literal('')),
  jobTitle: z.string().trim().max(80).optional().or(z.literal('')),
  department: z.string().trim().max(80).optional().or(z.literal('')),
  bio: z.string().trim().max(300, 'La bio ne peut pas dépasser 300 caractères.').optional().or(z.literal('')),
  location: z.string().trim().max(100).optional().or(z.literal('')),
  website: optionalUrl.or(z.literal('')),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

