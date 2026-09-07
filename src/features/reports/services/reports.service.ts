/* ═════════════════════════════════════════════════════════════════════
   Reports & Analytics — Service (simulated)
   ═════════════════════════════════════════════════════════════════════ */

import type {
  KPI,
  RevenueData,
  SalesPerformance,
  PipelineAnalytics,
  LeadAnalytics,
  ContactAnalytics,
  OpportunityAnalytics,
  TeamAnalytics,
  TopCompany,
  TopSales,
  TopOpportunity,
  RecentActivity,
  ReportFilters,
} from '@/features/reports/types';
import {
  kpiDataMock,
  revenueDataMock,
  salesPerformanceMock,
  pipelineAnalyticsMock,
  leadAnalyticsMock,
  contactAnalyticsMock,
  opportunityAnalyticsMock,
  teamAnalyticsMock,
  topCompaniesMock,
  topSalesMock,
  topOpportunitiesMock,
  recentActivitiesMock,
} from '@/features/reports/mocks';

/** Simulate network delay */
function delay<T>(data: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

/** Get all KPI data (with optional period filter) */
export async function getKPIs(filters?: Partial<ReportFilters>): Promise<KPI[]> {
  let data = [...kpiDataMock];
  if (filters?.period && filters.period !== '12m') {
    const factors: Record<string, number> = { '7d': 0.02, '30d': 0.08, '90d': 0.25, '6m': 0.5, '36m': 2.8 };
    const factor = factors[filters.period] ?? 1;
    data = data.map((kpi) => ({
      ...kpi,
      rawValue: Math.round(kpi.rawValue * factor),
      value: kpi.format === 'currency'
        ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(Math.round(kpi.rawValue * factor))
        : kpi.format === 'percent'
          ? `${(kpi.rawValue * (filters.period === '7d' ? 0.9 : 1)).toFixed(1)}%`
          : Math.round(kpi.rawValue * factor).toString(),
    }));
  }
  return delay(data);
}

/** Get revenue analytics data */
export async function getRevenueData(_filters?: Partial<ReportFilters>): Promise<RevenueData> {
  return delay(revenueDataMock);
}

/** Get sales performance data */
export async function getSalesPerformance(_filters?: Partial<ReportFilters>): Promise<SalesPerformance> {
  return delay(salesPerformanceMock);
}

/** Get pipeline analytics */
export async function getPipelineAnalytics(_filters?: Partial<ReportFilters>): Promise<PipelineAnalytics> {
  return delay(pipelineAnalyticsMock);
}

/** Get lead analytics */
export async function getLeadAnalytics(_filters?: Partial<ReportFilters>): Promise<LeadAnalytics> {
  return delay(leadAnalyticsMock);
}

/** Get contact analytics */
export async function getContactAnalytics(_filters?: Partial<ReportFilters>): Promise<ContactAnalytics> {
  return delay(contactAnalyticsMock);
}

/** Get opportunity analytics */
export async function getOpportunityAnalytics(_filters?: Partial<ReportFilters>): Promise<OpportunityAnalytics> {
  return delay(opportunityAnalyticsMock);
}

/** Get team analytics */
export async function getTeamAnalytics(_filters?: Partial<ReportFilters>): Promise<TeamAnalytics> {
  return delay(teamAnalyticsMock);
}

/** Get top companies table data */
export async function getTopCompanies(_filters?: Partial<ReportFilters>): Promise<TopCompany[]> {
  return delay(topCompaniesMock);
}

/** Get top sales table data */
export async function getTopSales(_filters?: Partial<ReportFilters>): Promise<TopSales[]> {
  return delay(topSalesMock);
}

/** Get top opportunities table data */
export async function getTopOpportunities(_filters?: Partial<ReportFilters>): Promise<TopOpportunity[]> {
  return delay(topOpportunitiesMock);
}

/** Get recent activities */
export async function getRecentActivities(_filters?: Partial<ReportFilters>): Promise<RecentActivity[]> {
  return delay(recentActivitiesMock);
}

/** Get all report data at once for a given set of filters */
export async function getAllReportData(filters?: Partial<ReportFilters>) {
  const [kpis, revenue, sales, pipeline, leads, contacts, opportunities, team, topCompanies, topSales, topOpps, activities] =
    await Promise.all([
      getKPIs(filters),
      getRevenueData(filters),
      getSalesPerformance(filters),
      getPipelineAnalytics(filters),
      getLeadAnalytics(filters),
      getContactAnalytics(filters),
      getOpportunityAnalytics(filters),
      getTeamAnalytics(filters),
      getTopCompanies(filters),
      getTopSales(filters),
      getTopOpportunities(filters),
      getRecentActivities(filters),
    ]);

  return {
    kpis,
    revenue,
    sales,
    pipeline,
    leads,
    contacts,
    opportunities,
    team,
    topCompanies,
    topSales,
    topOpps,
    activities,
  };
}
