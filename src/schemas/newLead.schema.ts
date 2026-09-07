import { z } from 'zod';

/**
 * Tuples de valeurs littérales pour `z.enum()` — dupliquent volontairement
 * les unions de `types/lead.types.ts` et `types/company.types.ts` (Zod ne
 * peut pas dériver un enum depuis un type TypeScript, qui n'existe plus à
 * l'exécution). Garder en synchronisation manuelle si ces types évoluent.
 */
const LEAD_STATUS_VALUES = [
  'new',
  'contacted',
  'qualified',
  'unqualified',
  'converted',
] as const;

const LEAD_SOURCE_VALUES = [
  'website',
  'referral',
  'social_media',
  'cold_call',
  'email_campaign',
  'event',
  'other',
] as const;

const LEAD_PRIORITY_VALUES = ['low', 'medium', 'high'] as const;

const COMPANY_SIZE_VALUES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+',
] as const;

/** Accepte un champ vide OU une URL valide — un site web reste optionnel. */
const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || /^https?:\/\/.+\..+/.test(value), {
    message: 'URL invalide (ex: https://exemple.com).',
  });

/** Accepte un champ vide OU un numéro plausible (chiffres, espaces, +, -). */
const optionalPhone = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || /^[\d+\s().-]{6,20}$/.test(value), {
    message: 'Numéro de téléphone invalide.',
  });

export const newLeadSchema = z.object({
  // Informations personnelles
  firstName: z.string().trim().min(1, 'Le prénom est requis.'),
  lastName: z.string().trim().min(1, 'Le nom est requis.'),
  email: z
    .string()
    .trim()
    .min(1, "L'email est requis.")
    .email('Adresse email invalide.'),
  phone: optionalPhone,
  jobTitle: z.string().trim().optional(),

  // Entreprise
  companyName: z.string().trim().min(1, "Le nom de l'entreprise est requis."),
  companyWebsite: optionalUrl,
  industry: z.string().trim().optional(),
  companySize: z.enum(COMPANY_SIZE_VALUES).optional(),

  // Informations commerciales
  source: z.enum(LEAD_SOURCE_VALUES, {
    message: 'Sélectionnez une source.',
  }),
  status: z.enum(LEAD_STATUS_VALUES, {
    message: 'Sélectionnez un statut.',
  }),
  priority: z.enum(LEAD_PRIORITY_VALUES, {
    message: 'Sélectionnez une priorité.',
  }),
  ownerId: z.string().trim().min(1, 'Le responsable est requis.'),
  estimatedValue: z.coerce
    .number({ message: 'Montant invalide.' })
    .min(0, 'Le montant doit être positif.')
    .optional(),
  conversionProbability: z.coerce
    .number({ message: 'Probabilité invalide.' })
    .min(0, 'La probabilité doit être comprise entre 0 et 100.')
    .max(100, 'La probabilité doit être comprise entre 0 et 100.')
    .optional(),

  // Adresse
  country: z.string().trim().optional(),
  city: z.string().trim().optional(),
  address: z.string().trim().optional(),

  // Notes
  notes: z
    .string()
    .trim()
    .max(500, 'Les notes ne peuvent pas dépasser 500 caractères.')
    .optional(),
  tags: z.array(z.string()).optional(),
});

export type NewLeadFormValues = z.infer<typeof newLeadSchema>;
