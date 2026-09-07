/**
 * Types spécifiques au module Pipeline Kanban.
 * Étend les types existants d'Opportunity pour les besoins du board.
 */
import type { Opportunity, PipelineStage } from '@/types/opportunity.types';
import type { ID } from '@/types/common.types';

/**
 * Colonne du Kanban — chaque colonne correspond à une étape du pipeline
 * et contient un ensemble d'opportunités.
 */
export interface PipelineColumn {
  /** Identifiant unique de la colonne (correspond à PipelineStage). */
  id: PipelineStage;
  /** Titre affiché dans l'en-tête de la colonne. */
  title: string;
  /** Icône Lucide associée à l'étape. */
  icon: string;
  /** Couleur d'accentuation de la colonne (classe CSS). */
  color: string;
  /** Couleur de fond légère pour l'en-tête. */
  bgColor: string;
  /** Opportunités dans cette colonne. */
  items: Opportunity[];
}

/**
 * Configuration complète du board Kanban.
 */
export interface PipelineBoard {
  columns: PipelineColumn[];
}

/**
 * Filtres disponibles dans la toolbar du pipeline.
 */
export interface PipelineFilters {
  search: string;
  ownerId: ID | 'all';
  pipeline: string | 'all';
  stage: string | 'all';
  priority: string | 'all';
  probabilityRange: string | 'all';
  valueRange: string | 'all';
  companyName: string | 'all';
  dateRange: string | 'all';
}

/**
 * Options de tri pour les cartes dans une colonne.
 */
export type PipelineSort = 'order' | 'value_desc' | 'value_asc' | 'probability' | 'name';

/**
 * Vue du pipeline.
 */
export type PipelineView = 'board' | 'list';

/**
 * Statistiques calculées pour le pipeline.
 */
export interface PipelineStats {
  totalOpportunities: number;
  totalValue: number;
  averageDeal: number;
  forecastRevenue: number;
  wonDeals: number;
  wonValue: number;
  lostDeals: number;
  lostValue: number;
  conversionRate: number;
  stageDistribution: Array<{
    stage: PipelineStage;
    count: number;
    value: number;
    percentage: number;
  }>;
}

/**
 * Type des colonnes prédéfinies du pipeline.
 */
export const PIPELINE_COLUMNS: Array<{
  id: PipelineStage;
  title: string;
  icon: string;
  color: string;
  bgColor: string;
}> = [
  {
    id: 'prospecting',
    title: 'Lead',
    icon: 'Target',
    color: 'text-neutral-500',
    bgColor: 'bg-neutral-50 dark:bg-neutral-900/50',
  },
  {
    id: 'qualification',
    title: 'Qualified',
    icon: 'UserCheck',
    color: 'text-info-500',
    bgColor: 'bg-info-50 dark:bg-info-900/20',
  },
  {
    id: 'proposal',
    title: 'Proposal',
    icon: 'FileText',
    color: 'text-primary-500',
    bgColor: 'bg-primary-50 dark:bg-primary-900/20',
  },
  {
    id: 'negotiation',
    title: 'Negotiation',
    icon: 'Handshake',
    color: 'text-warning-500',
    bgColor: 'bg-warning-50 dark:bg-warning-900/20',
  },
  {
    id: 'contract_sent',
    title: 'Contract Sent',
    icon: 'FileSignature',
    color: 'text-accent',
    bgColor: 'bg-accent-subtle dark:bg-accent-muted/10',
  },
  {
    id: 'closed_won',
    title: 'Won',
    icon: 'CheckCircle',
    color: 'text-success-500',
    bgColor: 'bg-success-50 dark:bg-success-900/20',
  },
  {
    id: 'closed_lost',
    title: 'Lost',
    icon: 'XCircle',
    color: 'text-danger-500',
    bgColor: 'bg-danger-50 dark:bg-danger-900/20',
  },
];

