import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Au moins 8 caractères.')
      .regex(/[A-Z]/, 'Au moins une majuscule.')
      .regex(/[a-z]/, 'Au moins une minuscule.')
      .regex(/[0-9]/, 'Au moins un chiffre.'),
    confirmPassword: z.string().min(1, 'La confirmation est requise.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas.',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

/**
 * Calcule un score de force (0 à 4) pour l'indicateur visuel de
 * `PasswordStrengthMeter`. Volontairement séparé de la validation Zod
 * ci-dessus : un mot de passe peut être valide (règles minimales) tout
 * en étant "faible", l'indicateur donne un retour plus nuancé.
 */
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return 0;

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;

  return Math.min(score, 4) as PasswordStrength;
}

export const PASSWORD_STRENGTH_LABELS: Record<PasswordStrength, string> = {
  0: 'Très faible',
  1: 'Faible',
  2: 'Moyen',
  3: 'Bon',
  4: 'Excellent',
};
