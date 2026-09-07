import type { DashboardStats } from '@/types/dashboard.types';
import {
  revenueTrendMock,
  opportunitiesDistributionMock,
} from '@/mocks/analytics.mock';

/**
 * Statistiques agrégées du Dashboard. Les valeurs sont cohérentes avec
 * `analytics.mock.ts` (mêmes séries de données) plutôt que dupliquées
 * indépendamment, pour que KPI Cards et graphiques racontent la même
 * histoire.
 */
export const dashboardStatsMock: DashboardStats = {
  totalLeads: 412,
  totalContacts: 356,
  totalCompanies: 128,
  openOpportunities: 89,
  wonOpportunitiesValue: 3842000,
  conversionRate: 24.6,
  pipelineBreakdown: opportunitiesDistributionMock,
  revenueTrend: revenueTrendMock,
};
