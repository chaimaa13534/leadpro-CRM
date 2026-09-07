import { z } from 'zod';

const COMPANY_STATUS_VALUES = ['active', 'inactive', 'lead'] as const;
const COMPANY_SOURCE_VALUES = [
  'website',
  'referral',
  'social_media',
  'cold_call',
  'email_campaign',
  'event',
  'partner',
  'other',
] as const;

const COMPANY_SIZE_VALUES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+',
] as const;

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

/** Code postal : chiffres uniquement, 3 à 10 caractères. */
const optionalZipCode = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || /^\d{3,10}$/.test(value), {
    message: 'Code postal invalide.',
  });

/** TVA intracommunautaire : format FRXX-999999999 ou vide. */
const optionalVat = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || /^[A-Z]{2}[A-Z0-9]{2,12}$/.test(value), {
    message: 'Numéro de TVA invalide (ex: FR12345678901).',
  });

export const companySchema = z.object({
  // Informations générales
  name: z.string().trim().min(1, "Le nom de l'entreprise est requis."),
  industry: z.string().trim().optional(),
  description: z
    .string()
    .trim()
    .max(1000, 'La description ne peut pas dépasser 1000 caractères.')
    .optional(),
  logoUrl: optionalUrl,

  // Coordonnées
  email: z
    .string()
    .trim()
    .email('Adresse email invalide.')
    .optional()
    .or(z.literal('')),
  phone: optionalPhone,
  website: optionalUrl,

  // Adresse
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  country: z.string().trim().optional(),
  zipCode: optionalZipCode,

  // Informations commerciales
  vatNumber: optionalVat,
  employeeCount: z
    .union([z.number().int().positive('Doit être un nombre positif.'), z.literal('')])
    .optional(),
  estimatedRevenue: z
    .union([z.number().nonnegative('Doit être un nombre positif ou nul.'), z.literal('')])
    .optional(),
  size: z.enum(COMPANY_SIZE_VALUES).optional(),
  status: z.enum(COMPANY_STATUS_VALUES, {
    message: 'Sélectionnez un statut.',
  }),
  source: z.enum(COMPANY_SOURCE_VALUES).optional(),

  // Responsable
  ownerId: z.string().trim().min(1, 'Le responsable est requis.'),

  // Notes & Tags
  notes: z
    .string()
    .trim()
    .max(500, 'Les notes ne peuvent pas dépasser 500 caractères.')
    .optional(),
  tags: z.array(z.string()).optional(),
});

export type CompanyFormValues = z.infer<typeof companySchema>;

