import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "L'adresse email est requise.")
    .email('Adresse email invalide.'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
