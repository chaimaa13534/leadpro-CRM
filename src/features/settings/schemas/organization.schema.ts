/* ═════════════════════════════════════════════════════════════════════
   Settings — Organization Schema (Zod)
   ═════════════════════════════════════════════════════════════════════ */

import { z } from 'zod';
import type { CompanySize } from '@/features/settings/types';

const companySizeValues: CompanySize[] = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+',
];

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

/** Schéma de validation de l’organisation. */
export const organizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Le nom de l’organisation est requis.')
    .max(120, 'Le nom ne peut pas dépasser 120 caractères.'),
  industry: z.string().trim().max(100).optional().or(z.literal('')),
  website: optionalUrl.or(z.literal('')),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9 ()-]{6,20}$/, 'Veuillez saisir un numéro valide.')
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .trim()
    .regex(emailPattern, 'Veuillez saisir un email valide.')
    .optional()
    .or(z.literal('')),
  country: z.string().trim().max(80).optional().or(z.literal('')),
  city: z.string().trim().max(80).optional().or(z.literal('')),
  address: z.string().trim().max(160).optional().or(z.literal('')),
  postalCode: z.string().trim().max(20).optional().or(z.literal('')),
  companySize: z.enum(
    companySizeValues as [CompanySize, ...CompanySize[]],
  ),
  taxId: z.string().trim().max(40).optional().or(z.literal('')),
  description: z
    .string()
    .trim()
    .max(500, 'La description ne peut pas dépasser 500 caractères.')
    .optional()
    .or(z.literal('')),
});

export type OrganizationFormValues = z.infer<typeof organizationSchema>;

