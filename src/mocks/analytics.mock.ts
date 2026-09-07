import type {
  TrendPoint,
  PipelineStageBreakdown,
} from '@/types/dashboard.types';

/**
 * Données factices pour les graphiques du Dashboard. Toutes les valeurs
 * sont inventées mais cohérentes entre elles (montants, volumes, taux),
 * pour donner un rendu crédible en portfolio.
 */

/** Nombre de nouveaux leads par mois (12 derniers mois). */
export const leadsByMonthMock: TrendPoint[] = [
  { label: 'Août', value: 42 },
  { label: 'Sept.', value: 58 },
  { label: 'Oct.', value: 51 },
  { label: 'Nov.', value: 67 },
  { label: 'Déc.', value: 49 },
  { label: 'Janv.', value: 73 },
  { label: 'Févr.', value: 81 },
  { label: 'Mars', value: 76 },
  { label: 'Avr.', value: 92 },
  { label: 'Mai', value: 88 },
  { label: 'Juin', value: 104 },
  { label: 'Juil.', value: 97 },
];

/** Montant des ventes conclues par mois, en MAD. */
export const salesByMonthMock: TrendPoint[] = [
  { label: 'Août', value: 186000 },
  { label: 'Sept.', value: 214000 },
  { label: 'Oct.', value: 198000 },
  { label: 'Nov.', value: 241000 },
  { label: 'Déc.', value: 176000 },
  { label: 'Janv.', value: 259000 },
  { label: 'Févr.', value: 288000 },
  { label: 'Mars', value: 271000 },
  { label: 'Avr.', value: 312000 },
  { label: 'Mai', value: 295000 },
  { label: 'Juin', value: 348000 },
  { label: 'Juil.', value: 326000 },
];

/** Chiffre d'affaires cumulé par mois, en MAD — sert au graphique d'évolution. */
export const revenueTrendMock: TrendPoint[] = [
  { label: 'Août', value: 1240000 },
  { label: 'Sept.', value: 1454000 },
  { label: 'Oct.', value: 1652000 },
  { label: 'Nov.', value: 1893000 },
  { label: 'Déc.', value: 2069000 },
  { label: 'Janv.', value: 2328000 },
  { label: 'Févr.', value: 2616000 },
  { label: 'Mars', value: 2887000 },
  { label: 'Avr.', value: 3199000 },
  { label: 'Mai', value: 3494000 },
  { label: 'Juin', value: 3842000 },
  { label: 'Juil.', value: 4168000 },
];

/** Répartition des opportunités ouvertes par étape du pipeline. */
export const opportunitiesDistributionMock: PipelineStageBreakdown[] = [
  { stage: 'prospecting', opportunityCount: 34, totalValue: 612000 },
  { stage: 'qualification', opportunityCount: 26, totalValue: 548000 },
  { stage: 'proposal', opportunityCount: 18, totalValue: 497000 },
  { stage: 'negotiation', opportunityCount: 11, totalValue: 386000 },
  { stage: 'closed_won', opportunityCount: 9, totalValue: 326000 },
  { stage: 'closed_lost', opportunityCount: 7, totalValue: 154000 },
];
