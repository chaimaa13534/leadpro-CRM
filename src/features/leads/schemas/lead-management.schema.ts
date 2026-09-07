import { z } from 'zod';

/**
 * Schema for the add/edit lead form.
 *
 * Mirrors the backend validation rules. `ownerId` is required and the
 * relations (company, contact, source) are optional. Relation ids come from
 * `<Select>` components (strings) so they are coerced to numbers.
 */
export const leadFormSchema = z.object({
  companyId: z.string().trim(),
  contactId: z.string().trim(),
  ownerId: z.string().trim().min(1, 'Un responsable est requis.'),
  sourceId: z.string().trim(),
  status: z.enum(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']),
  priority: z.enum(['low', 'medium', 'high']),
  estimatedValue: z
    .string()
    .trim()
    .refine((v) => v === '' || !Number.isNaN(Number(v)), {
      message: 'Valeur estimée invalide.',
    })
    .refine((v) => v === '' || Number(v) >= 0, {
      message: 'La valeur estimée doit être positive.',
    }),
  notes: z
    .string()
    .trim()
    .max(5000, 'Notes trop longues (5000 max).')
    .optional()
    .or(z.literal('')),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;
