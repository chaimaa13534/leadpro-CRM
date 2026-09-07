import { z } from 'zod';

const CONTACT_STATUS_VALUES = ['active', 'inactive', 'vip'] as const;

/** Accepte un champ vide OU une URL valide. */
const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || /^https?:\/\/.+\..+/.test(value), {
    message: 'URL invalide (ex: https://exemple.com).',
  });

/** Accepte un champ vide OU un numéro plausible. */
const optionalPhone = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || /^[\d+\s().-]{6,20}$/.test(value), {
    message: 'Numéro de téléphone invalide.',
  });

export const contactSchema = z.object({
  // Informations personnelles
  firstName: z.string().trim().min(1, 'Le prénom est requis.'),
  lastName: z.string().trim().min(1, 'Le nom est requis.'),
  email: z
    .string()
    .trim()
    .min(1, "L'email est requis.")
    .email('Adresse email invalide.'),
  phone: optionalPhone,
  mobile: optionalPhone,
  jobTitle: z.string().trim().optional(),

  // Entreprise
  company: z.string().trim().optional(),
  linkedIn: optionalUrl,
  website: optionalUrl,

  // Adresse
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  country: z.string().trim().optional(),

  // Organisation
  status: z.enum(CONTACT_STATUS_VALUES, {
    message: 'Sélectionnez un statut.',
  }),
  ownerId: z.string().trim().min(1, 'Le responsable est requis.'),

  // Notes & Tags
  notes: z
    .string()
    .trim()
    .max(500, 'Les notes ne peuvent pas dépasser 500 caractères.')
    .optional(),
  tags: z.array(z.string()).optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

