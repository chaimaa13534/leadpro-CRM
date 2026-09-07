/* ═════════════════════════════════════════════════════════════════════
   Reports & Analytics — useReports Hook
   Central data fetching hook with filters and loading states
   ═════════════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback, useMemo } from 'react';
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
  ReportPeriod,
  ReportTab,
} from '@/features/reports/types';
import { getAllReportData } from '@/features/reports/services';

export interface ReportState {
  loading: boolean;
  error: string | null;
  kpis: KPI[];
  revenue: RevenueData | null;
  sales: SalesPerformance | null;
  pipeline: PipelineAnalytics | null;
  leads: LeadAnalytics | null;
  contacts: ContactAnalytics | null;
  opportunities: OpportunityAnalytics | null;
  team: TeamAnalytics | null;
  topCompanies: TopCompany[];
  topSales: TopSales[];
  topOpportunities: TopOpportunity[];
  activities: RecentActivity[];
}

const initialState: ReportState = {
  loading: true,
  error: null,
  kpis: [],
  revenue: null,
  sales: null,
  pipeline: null,
  leads: null,
  contacts: null,
  opportunities: null,
  team: null,
  topCompanies: [],
  topSales: [],
  topOpportunities: [],
  activities: [],
};

export function useReports() {
  const [activeTab, setActiveTab] = useState<ReportTab>('overview');
  const [filters, setFilters] = useState<ReportFilters>({
    period: '12m',
    dateRange: { start: '', end: '' },
    ownerId: 'all',
    companyId: 'all',
    pipeline: 'all',
    stage: 'all',
    status: 'all',
    country: 'all',
    source: 'all',
  });
  const [state, setState] = useState<ReportState>(initialState);

  const fetchData = useCallback(async (currentFilters: ReportFilters) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await getAllReportData(currentFilters);
      setState({
        loading: false,
        error: null,
        kpis: data.kpis,
        revenue: data.revenue,
        sales: data.sales,
        pipeline: data.pipeline,
        leads: data.leads,
        contacts: data.contacts,
        opportunities: data.opportunities,
        team: data.team,
        topCompanies: data.topCompanies,
        topSales: data.topSales,
        topOpportunities: data.topOpps,
        activities: data.activities,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Une erreur est survenue',
      }));
    }
  }, []);

  useEffect(() => {
    fetchData(filters);
  }, [filters, fetchData]);

  const updatePeriod = useCallback((period: ReportPeriod) => {
    setFilters((prev) => ({ ...prev, period }));
  }, []);

  const updateFilter = useCallback(<K extends keyof ReportFilters>(key: K, value: ReportFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      period: '12m',
      dateRange: { start: '', end: '' },
      ownerId: 'all',
      companyId: 'all',
      pipeline: 'all',
      stage: 'all',
      status: 'all',
      country: 'all',
      source: 'all',
    });
  }, []);

  const refresh = useCallback(() => {
    fetchData(filters);
  }, [fetchData, filters]);

  const tabData = useMemo(() => {
    return {
      overview: {
        kpis: state.kpis,
        revenue: state.revenue,
        pipeline: state.pipeline,
        activities: state.activities,
      },
      sales: {
        revenue: state.revenue,
        sales: state.sales,
        pipeline: state.pipeline,
        forecast: state.revenue?.forecast ?? [],
      },
      leads: {
        leads: state.leads,
      },
      contacts: {
        contacts: state.contacts,
      },
      opportunities: {
        opportunities: state.opportunities,
      },
      team: {
        team: state.team,
        topSales: state.topSales,
      },
      tables: {
        topCompanies: state.topCompanies,
        topSales: state.topSales,
        topOpportunities: state.topOpportunities,
        activities: state.activities,
      },
    } as const;
  }, [state]);

  return {
    ...state,
    filters,
    activeTab,
    tabData,
    setActiveTab,
    updatePeriod,
    updateFilter,
    resetFilters,
    refresh,
  };
}
