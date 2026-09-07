import type { PipelineStage } from '@/types/opportunity.types';

/** Répartition du nombre d'opportunités et de leur valeur par étape. */
export interface PipelineStageBreakdown {
  stage: PipelineStage;
  opportunityCount: number;
  totalValue: number;
}

/** Point de données pour les graphiques d'évolution (revenus, leads…). */
export interface TrendPoint {
  label: string;
  value: number;
}

/**
 * Agrégat de statistiques affiché sur le tableau de bord.
 * Ce type ne préjuge pas de la mise en page — uniquement des données.
 */
export interface DashboardStats {
  totalLeads: number;
  totalContacts: number;
  totalCompanies: number;
  openOpportunities: number;
  wonOpportunitiesValue: number;
  conversionRate: number;
  pipelineBreakdown: PipelineStageBreakdown[];
  revenueTrend: TrendPoint[];
}
