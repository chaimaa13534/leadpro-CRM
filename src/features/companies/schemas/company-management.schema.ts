import { z } from 'zod';

/**
 * Schema for the add/edit company form.
 *
 * Mirrors the backend validation rules (name required, ownerId required,
 * optional fields bounded by length). Uses `z.coerce.number()` so the value
 * coming from a `<Select>` (string) is coerced to a number before validation.
 */
export const companyFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Le nom de l’entreprise est requis.')
    .max(190, 'Le nom ne doit pas dépasser 190 caractères.'),
  industry: z.string().trim().max(100, 'Secteur trop long (100 max).').optional(),
  website: z
    .string()
    .trim()
    .max(255, 'Site web trop long (255 max).')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .trim()
    .max(30, 'Téléphone trop long (30 max).')
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .trim()
    .email('Adresse email invalide.')
    .max(190, 'Email trop long (190 max).')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .trim()
    .max(255, 'Adresse trop longue (255 max).')
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .trim()
    .max(100, 'Ville trop longue (100 max).')
    .optional()
    .or(z.literal('')),
  country: z
    .string()
    .trim()
    .max(100, 'Pays trop long (100 max).')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .trim()
    .max(5000, 'Description trop longue (5000 max).')
    .optional()
    .or(z.literal('')),
  ownerId: z.coerce.number({ message: 'Un responsable est requis.' }).int('Responsable invalide.'),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;
