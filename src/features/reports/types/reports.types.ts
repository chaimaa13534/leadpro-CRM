/* ═════════════════════════════════════════════════════════════════════
   Reports & Analytics — Types
   ═════════════════════════════════════════════════════════════════════ */

import type { ID, ISODateString } from '@/types/common.types';
import type { PipelineStage } from '@/types/opportunity.types';

/* ── Core data points ── */

export interface ReportDataPoint {
  label: string;
  value: number;
  previousValue?: number;
  percentage?: number;
}

export interface SeriesDataPoint {
  label: string;
  value: number;
  previous?: number;
  forecast?: number;
  target?: number;
}

export interface DistributionItem {
  name: string;
  value: number;
  color?: string;
  percentage?: number;
}

/* ── KPI ── */

export interface KPI {
  id: string;
  label: string;
  value: string;
  rawValue: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  sparklineData: number[];
  icon: string;
  description: string;
  format: 'currency' | 'number' | 'percent' | 'count';
}

/* ── Period ── */

export type ReportPeriod = '7d' | '30d' | '90d' | '6m' | '12m' | '36m' | 'custom';

export interface DateRange {
  start: ISODateString;
  end: ISODateString;
}

/* ── Filters ── */

export interface ReportFilters {
  period: ReportPeriod;
  dateRange: DateRange;
  ownerId: ID | 'all';
  companyId: ID | 'all';
  pipeline: string | 'all';
  stage: PipelineStage | 'all';
  status: string | 'all';
  country: string | 'all';
  source: string | 'all';
}

/* ── Revenue / Sales ── */

export interface RevenueData {
  monthly: SeriesDataPoint[];
  cumulative: ReportDataPoint[];
  byProduct: DistributionItem[];
  byRegion: DistributionItem[];
  forecast: SeriesDataPoint[];
}

export interface SalesPerformance {
  totalRevenue: number;
  totalDeals: number;
  wonDeals: number;
  lostDeals: number;
  avgDealSize: number;
  winRate: number;
  salesCycleDays: number;
  monthlyData: SeriesDataPoint[];
}

/* ── Pipeline ── */

export interface PipelineAnalytics {
  stageDistribution: DistributionItem[];
  stageValues: DistributionItem[];
  velocity: number;
  averageDealAge: number;
  conversionRates: ReportDataPoint[];
  evolution: SeriesDataPoint[];
}

/* ── Leads ── */

export interface LeadAnalytics {
  bySource: DistributionItem[];
  byStatus: DistributionItem[];
  byMonth: ReportDataPoint[];
  conversionRate: number;
  qualityScore: number;
  growthRate: number;
  totalLeads: number;
  convertedLeads: number;
  timeToConversion: number;
}

/* ── Contacts ── */

export interface ContactAnalytics {
  newContacts: ReportDataPoint[];
  activeContacts: number;
  byCountry: DistributionItem[];
  byIndustry: DistributionItem[];
  topCompanies: { name: string; contactCount: number; revenue: number }[];
  growth: ReportDataPoint[];
}

/* ── Opportunities ── */

export interface OpportunityAnalytics {
  pipelineDistribution: DistributionItem[];
  probabilityDistribution: DistributionItem[];
  winRate: number;
  lostReasons: DistributionItem[];
  dealSizeDistribution: DistributionItem[];
  byStage: DistributionItem[];
  totalPipelineValue: number;
  averageProbability: number;
  weightedValue: number;
}

/* ── Team ── */

export interface TeamMemberPerformance {
  id: ID;
  name: string;
  avatarUrl?: string;
  revenue: number;
  deals: number;
  conversionRate: number;
  avgDealSize: number;
  target: number;
  achievement: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface TeamAnalytics {
  members: TeamMemberPerformance[];
  totalRevenue: number;
  totalTarget: number;
  averageConversion: number;
  topPerformer: TeamMemberPerformance | null;
}

/* ── Tables ── */

export interface TopCompany {
  id: ID;
  name: string;
  industry: string;
  revenue: number;
  deals: number;
  contacts: number;
  logoUrl?: string;
}

export interface TopSales {
  id: ID;
  name: string;
  avatarUrl?: string;
  revenue: number;
  deals: number;
  conversionRate: number;
  achievement: number;
}

export interface TopOpportunity {
  id: ID;
  name: string;
  companyName: string;
  amount: number;
  stage: PipelineStage;
  probability: number;
  ownerName: string;
}

export interface RecentActivity {
  id: ID;
  type: 'deal_won' | 'deal_lost' | 'new_lead' | 'new_contact' | 'new_opportunity' | 'meeting';
  title: string;
  description: string;
  timestamp: ISODateString;
  userName: string;
  amount?: number;
}

/* ── Widgets ── */

export type WidgetType =
  | 'kpi-overview'
  | 'revenue-chart'
  | 'pipeline-chart'
  | 'lead-source'
  | 'conversion-chart'
  | 'sales-chart'
  | 'forecast-chart'
  | 'top-companies'
  | 'top-sales'
  | 'top-opportunities'
  | 'recent-activities'
  | 'leaderboard'
  | 'deals-chart'
  | 'team-performance';

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  visible: boolean;
  size: 'small' | 'medium' | 'large' | 'full';
  order: number;
}

export interface WidgetLayout {
  widgets: WidgetConfig[];
}

/* ── Export ── */

export type ExportFormat = 'pdf' | 'excel' | 'csv';

/* ── Tabs ── */

export type ReportTab =
  | 'overview'
  | 'sales'
  | 'leads'
  | 'contacts'
  | 'opportunities'
  | 'team'
  | 'tables';

