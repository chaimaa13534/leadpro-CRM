import type { ID, ISODateString } from '@/types/common.types';
import type { ContactStatus } from '@/types/contact.types';

export type CompanySize =
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-500'
  | '501-1000'
  | '1000+';

export type CompanyStatus = 'active' | 'inactive' | 'lead';

export type CompanySource =
  | 'website'
  | 'referral'
  | 'social_media'
  | 'cold_call'
  | 'email_campaign'
  | 'event'
  | 'partner'
  | 'other';

export interface Company {
  id: ID;
  name: string;
  industry?: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  logoUrl?: string;

  // Adresse
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;

  // Informations commerciales
  size?: CompanySize;
  vatNumber?: string;
  employeeCount?: number;
  estimatedRevenue?: number;
  ownerId: ID;
  status: CompanyStatus;
  source?: CompanySource;

  // Relations
  linkedContactIds: ID[];
  linkedLeadIds: ID[];
  linkedOpportunityIds: ID[];

  // Metadata
  tags: string[];
  notes?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  lastActivityAt?: ISODateString;
}

/**
 * Interface simplifiée pour afficher rapidement une société dans une liste
 * (tableau, cartes), sans charger l'intégralité des relations.
 */
export interface CompanySummary {
  id: ID;
  name: string;
  industry?: string;
  city?: string;
  country?: string;
  logoUrl?: string;
  status: CompanyStatus;
  ownerId: ID;
  estimatedRevenue?: number;
  contactCount: number;
  opportunityCount: number;
  lastActivityAt?: ISODateString;
}
