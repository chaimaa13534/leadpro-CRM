import { z } from 'zod';

const PIPELINE_STAGES = [
  'prospecting',
  'qualification',
  'proposal',
  'negotiation',
  'contract_sent',
  'closed_won',
  'closed_lost',
] as const;

const PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;
const STATUSES = ['active', 'on_hold', 'won', 'lost', 'abandoned'] as const;
const CURRENCIES = ['MAD', 'EUR', 'USD', 'GBP', 'CAD'] as const;
const SOURCES = [
  'inbound',
  'outbound',
  'referral',
  'website',
  'social_media',
  'event',
  'cold_call',
  'email_campaign',
  'partner',
  'existing_customer',
  'other',
] as const;

export const opportunitySchema = z.object({
  // Informations générales
  name: z
    .string()
    .trim()
    .min(1, 'Le nom de l\'opportunité est requis.')
    .max(200, 'Le nom ne peut pas dépasser 200 caractères.'),

  // Relations
  companyId: z.string().trim().min(1, "L'entreprise est requise."),
  contactId: z.string().trim().min(1, 'Le contact est requis.'),
  ownerId: z.string().trim().min(1, 'Le commercial est requis.'),

  // Valeur
  amount: z
    .number()
    .positive('La valeur doit être un montant positif.')
    .max(1_000_000_000, 'Le montant semble trop élevé.'),
  currency: z.enum(CURRENCIES, {
    message: 'Sélectionnez une devise valide.',
  }),
  probability: z
    .number()
    .min(0, 'La probabilité minimale est 0%.')
    .max(100, 'La probabilité maximale est 100%.'),

  // Pipeline
  pipeline: z.string().trim().min(1, 'Le pipeline est requis.'),
  stage: z.enum(PIPELINE_STAGES, {
    message: 'Sélectionnez une étape valide.',
  }),
  priority: z.enum(PRIORITIES, {
    message: 'Sélectionnez une priorité valide.',
  }),
  status: z.enum(STATUSES, {
    message: 'Sélectionnez un statut valide.',
  }),
  source: z.enum(SOURCES, {
    message: 'Sélectionnez une source valide.',
  }),

  // Dates
  expectedCloseDate: z.string().optional(),

  // Contenu
  description: z
    .string()
    .trim()
    .max(2000, 'La description ne peut pas dépasser 2000 caractères.')
    .optional(),
  notes: z
    .string()
    .trim()
    .max(1000, 'Les notes ne peuvent pas dépasser 1000 caractères.')
    .optional(),
  tags: z.array(z.string()).optional(),
});

export type OpportunityFormValues = z.infer<typeof opportunitySchema>;

