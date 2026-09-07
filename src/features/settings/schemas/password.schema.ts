/* ═════════════════════════════════════════════════════════════════════
   Settings — Password Schema (Zod)
   ═════════════════════════════════════════════════════════════════════ */

import { z } from 'zod';

/** Vérifie qu’un mot de passe respecte les exigences de robustesse. */
export function getPasswordRequirements(value: string): {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
} {
  return {
    length: value.length >= 8,
    uppercase: /[A-Z]/.test(value),
    lowercase: /[a-z]/.test(value),
    number: /\d/.test(value),
    special: /[^A-Za-z0-9]/.test(value),
  };
}

/** Compte le nombre d’exigences satisfaites (0 à 5). */
export function countPasswordStrengths(value: string): number {
  const requirements = getPasswordRequirements(value);
  return Object.values(requirements).filter(Boolean).length;
}

/**
 * Schéma de changement de mot de passe.
 * Aucun mot de passe n’est jamais stocké — la validation est purement
 * simulée côté client, comme le reste de l’authentification de démo.
 */
export const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Le mot de passe actuel est requis.'),
    newPassword: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')
      .regex(/[A-Z]/, 'Doit contenir au moins une majuscule.')
      .regex(/[a-z]/, 'Doit contenir au moins une minuscule.')
      .regex(/\d/, 'Doit contenir au moins un chiffre.')
      .regex(/[^A-Za-z0-9]/, 'Doit contenir au moins un caractère spécial.'),
    confirmPassword: z
      .string()
      .min(1, 'La confirmation est requise.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas.',
    path: ['confirmPassword'],
  });

export type PasswordFormValues = z.infer<typeof passwordSchema>;

