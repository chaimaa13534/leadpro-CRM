import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'adresse email est requise.")
    .email('Adresse email invalide.'),
  password: z.string().min(1, 'Le mot de passe est requis.'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
