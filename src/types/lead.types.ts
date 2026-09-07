import type { ID, ISODateString } from '@/types/common.types';
import type { CompanySize } from '@/types/company.types';

/**
 * Statut d'un lead dans le cycle de qualification.
 * La liste runtime correspondante vit dans
 * `lib/constants/statuses.constants.ts`.
 */
export type LeadStatus =
  'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';

export type LeadSource =
  | 'website'
  | 'referral'
  | 'social_media'
  | 'cold_call'
  | 'email_campaign'
  | 'event'
  | 'other';

/** Priorité commerciale d'un lead. Ajoutée au Jour 9 pour le formulaire de création. */
export type LeadPriority = 'low' | 'medium' | 'high';

export interface Lead {
  id: ID;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  email: string;
  phone?: string;
  jobTitle?: string;

  // Entreprise
  companyName?: string;
  companyWebsite?: string;
  industry?: string;
  companySize?: CompanySize;

  // Informations commerciales
  status: LeadStatus;
  source: LeadSource;
  priority: LeadPriority;
  score?: number;
  estimatedValue?: number;
  /** Probabilité de conversion estimée, en pourcentage (0-100). */
  conversionProbability?: number;
  ownerId: ID;

  // Adresse
  country?: string;
  city?: string;
  address?: string;

  notes?: string;
  tags?: string[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
  lastActivityAt?: ISODateString;
}
