import type { ID, ISODateString } from '@/types/common.types';

/**
 * Étape du pipeline commercial.
 */
export type PipelineStage =
  | 'prospecting'
  | 'qualification'
  | 'proposal'
  | 'negotiation'
  | 'contract_sent'
  | 'closed_won'
  | 'closed_lost';

/**
 * Priorité d'une opportunité, utilisée pour le tri et le filtrage.
 */
export type OpportunityPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Statut général d'une opportunité (indépendant de l'étape pipeline).
 */
export type OpportunityStatus = 'active' | 'on_hold' | 'won' | 'lost' | 'abandoned';

/**
 * Source d'acquisition de l'opportunité.
 */
export type OpportunitySource =
  | 'inbound'
  | 'outbound'
  | 'referral'
  | 'website'
  | 'social_media'
  | 'event'
  | 'cold_call'
  | 'email_campaign'
  | 'partner'
  | 'existing_customer'
  | 'other';

/**
 * Devise supportée.
 */
export type OpportunityCurrency = 'MAD' | 'EUR' | 'USD' | 'GBP' | 'CAD';

/**
 * Entrée dans l'historique des modifications d'une opportunité.
 */
export interface OpportunityHistoryEntry {
  id: ID;
  field: string;
  oldValue: string;
  newValue: string;
  changedBy: ID;
  changedAt: ISODateString;
}

/**
 * Document lié à une opportunité.
 */
export interface OpportunityDocument {
  id: ID;
  name: string;
  type: string;
  url: string;
  uploadedBy: ID;
  uploadedAt: ISODateString;
  size?: number;
}

/**
 * Activité enregistrée sur une opportunité.
 */
export interface OpportunityActivity {
  id: ID;
  type: 'note' | 'call' | 'email' | 'meeting' | 'task' | 'status_change';
  title: string;
  description?: string;
  createdBy: ID;
  createdAt: ISODateString;
}

/**
 * Opportunité complète — représente une vente potentielle.
 * Liée à une entreprise, un contact et un commercial.
 */
export interface Opportunity {
  id: ID;
  name: string;

  // Relations
  companyId?: ID;
  companyName?: string;
  contactId?: ID;
  contactName?: string;
  ownerId: ID;

  // Valeur
  amount: number;
  currency: OpportunityCurrency;
  probability: number; // 0-100

  // Pipeline
  pipeline: string; // ex: "Sales Pipeline", "Partner Pipeline"
  stage: PipelineStage;
  priority: OpportunityPriority;
  status: OpportunityStatus;
  source: OpportunitySource;

  // Dates
  expectedCloseDate?: ISODateString;
  lastActivityAt?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;

  // Contenu
  description?: string;
  notes?: string;
  tags: string[];

  // Relations enrichies
  history: OpportunityHistoryEntry[];
  documents: OpportunityDocument[];
  activities: OpportunityActivity[];
}

