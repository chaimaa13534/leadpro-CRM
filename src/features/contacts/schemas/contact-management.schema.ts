import { z } from 'zod';

/**
 * Schema for the add/edit contact form.
 *
 * Mirrors the backend validation rules (firstName and lastName required,
 * companyId and ownerId required, optional fields bounded by length).
 * Uses `z.coerce.number()` so the value coming from a `<Select>` (string)
 * is coerced to a number before validation.
 */
export const contactFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'Le prénom est requis.')
    .max(100, 'Le prénom ne doit pas dépasser 100 caractères.'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Le nom est requis.')
    .max(100, 'Le nom ne doit pas dépasser 100 caractères.'),
  email: z
    .string()
    .trim()
    .email('Adresse email invalide.')
    .max(190, 'Email trop long (190 max).')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .trim()
    .max(30, 'Téléphone trop long (30 max).')
    .optional()
    .or(z.literal('')),
  position: z
    .string()
    .trim()
    .max(100, 'Poste trop long (100 max).')
    .optional()
    .or(z.literal('')),
  companyId: z.coerce
    .number({ message: 'Une entreprise est requise.' })
    .int('Entreprise invalide.'),
  ownerId: z.coerce
    .number({ message: 'Un responsable est requis.' })
    .int('Responsable invalide.'),
  notes: z
    .string()
    .trim()
    .max(5000, 'Notes trop longues (5000 max).')
    .optional()
    .or(z.literal('')),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
