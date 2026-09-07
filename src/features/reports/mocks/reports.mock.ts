/* ═════════════════════════════════════════════════════════════════════
   Reports & Analytics — Mock data
   36 months of realistic CRM statistics — 500 sales, 1000 leads, etc.
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
  TeamMemberPerformance,
  DistributionItem,
  SeriesDataPoint,
  ReportDataPoint,
} from '@/features/reports/types';

/* ── Helpers ── */

const MONTHS_SHORT = [
  'Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin',
  'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.',
];

function generateTrend(base: number, variance: number, months: number, growth = 0.012): number[] {
  const data: number[] = [];
  let current = base;
  for (let i = 0; i < months; i++) {
    const noise = (Math.random() - 0.5) * variance;
    const trend = current * growth;
    current = Math.max(0, current + trend + noise);
    data.push(Math.round(current * 100) / 100);
  }
  return data;
}

function cumulative(data: number[]): number[] {
  let sum = 0;
  return data.map((v) => (sum += v));
}

function safePrevious(arr: number[], i: number, offset = 12): number | undefined {
  return i >= offset ? arr[i - offset] : undefined;
}

/* ═══════════════════════════════════════════════════════
   36 Months of Revenue Data
   ═══════════════════════════════════════════════════════ */

const revenueBase = 280000;
const revenueVar = 85000;
const revenueMonths = generateTrend(revenueBase, revenueVar, 36);
const revenueCumulativeArr = cumulative(revenueMonths);
const revenueTargets = revenueMonths.map((v) => Math.round(v * 1.2));
const revenueForecastArr = revenueMonths.map((v) => Math.round(v * 1.08));

export const revenueByMonth36: SeriesDataPoint[] = revenueMonths.map((value, i) => {
  const year = Math.floor(i / 12);
  const monthIdx = i % 12;
  return {
    label: `${MONTHS_SHORT[monthIdx]} ${20 + year}`,
    value: Math.round(value),
    previous: safePrevious(revenueMonths, i),
    forecast: Math.round(revenueForecastArr[i]!),
    target: Math.round(revenueTargets[i]!),
  };
});

export const revenueCumulativeData: ReportDataPoint[] = revenueCumulativeArr.map((value, i) => {
  const year = Math.floor(i / 12);
  const monthIdx = i % 12;
  return {
    label: `${MONTHS_SHORT[monthIdx]} ${20 + year}`,
    value: Math.round(value),
    previousValue: safePrevious(revenueCumulativeArr, i),
  };
});

/* ═══════════════════════════════════════════════════════
   Deals Data — 500+ simulated sales
   ═══════════════════════════════════════════════════════ */

function generateDeals() {
  const won: number[] = [];
  const lost: number[] = [];
  let w = 28;
  let l = 12;
  for (let i = 0; i < 36; i++) {
    const wGrowth = Math.random() * 4 - 1;
    const lGrowth = Math.random() * 3 - 0.5;
    w = Math.max(15, Math.round(w + wGrowth));
    l = Math.max(5, Math.round(l + lGrowth));
    won.push(w);
    lost.push(l);
  }
  return { won, lost };
}

const deals = generateDeals();

export const wonDealsByMonth: SeriesDataPoint[] = deals.won.map((value, i) => {
  const year = Math.floor(i / 12);
  const monthIdx = i % 12;
  return {
    label: `${MONTHS_SHORT[monthIdx]} ${20 + year}`,
    value,
    target: Math.round(value * 1.15),
  };
});

export const lostDealsByMonth: SeriesDataPoint[] = deals.lost.map((value, i) => {
  const year = Math.floor(i / 12);
  const monthIdx = i % 12;
  return {
    label: `${MONTHS_SHORT[monthIdx]} ${20 + year}`,
    value,
  };
});

/* ═══════════════════════════════════════════════════════
   Pipeline Data
   ═══════════════════════════════════════════════════════ */

export const pipelineStageDistribution: DistributionItem[] = [
  { name: 'Prospection', value: 34, color: '#636af1', percentage: 24 },
  { name: 'Qualification', value: 26, color: '#7b8af8', percentage: 18 },
  { name: 'Proposition', value: 18, color: '#a3b1fc', percentage: 13 },
  { name: 'Négociation', value: 11, color: '#f59e0b', percentage: 8 },
  { name: 'Gagné', value: 38, color: '#10b981', percentage: 27 },
  { name: 'Perdu', value: 15, color: '#ef4444', percentage: 11 },
];

export const pipelineStageValues: DistributionItem[] = [
  { name: 'Prospection', value: 612000, color: '#636af1', percentage: 15 },
  { name: 'Qualification', value: 548000, color: '#7b8af8', percentage: 13 },
  { name: 'Proposition', value: 497000, color: '#a3b1fc', percentage: 12 },
  { name: 'Négociation', value: 386000, color: '#f59e0b', percentage: 9 },
  { name: 'Gagné', value: 1250000, color: '#10b981', percentage: 30 },
  { name: 'Perdu', value: 890000, color: '#ef4444', percentage: 21 },
];

export const pipelineEvolution: SeriesDataPoint[] = revenueByMonth36.map((d) => ({
  label: d.label,
  value: Math.round(d.value * 0.85),
  forecast: d.forecast ? Math.round(d.forecast * 0.85) : undefined,
}));

/* ═══════════════════════════════════════════════════════
   Lead Data — 1000+ leads
   ═══════════════════════════════════════════════════════ */

const leadBase = 22;
const leadVar = 8;
const leadMonths = generateTrend(leadBase, leadVar, 36, 0.02).map(Math.round);

export const leadsByMonth: ReportDataPoint[] = leadMonths.map((value, i) => {
  const year = Math.floor(i / 12);
  const monthIdx = i % 12;
  return {
    label: `${MONTHS_SHORT[monthIdx]} ${20 + year}`,
    value,
    previousValue: safePrevious(leadMonths, i),
  };
});

export const leadSourceDistribution: DistributionItem[] = [
  { name: 'Site Web', value: 320, color: '#636af1', percentage: 28 },
  { name: 'Référencement', value: 210, color: '#10b981', percentage: 18 },
  { name: 'Réseaux sociaux', value: 180, color: '#3b82f6', percentage: 16 },
  { name: 'Campagne Email', value: 150, color: '#8b5cf6', percentage: 13 },
  { name: 'Événement', value: 120, color: '#f59e0b', percentage: 11 },
  { name: 'Appel à froid', value: 85, color: '#ef4444', percentage: 7 },
  { name: 'Autre', value: 75, color: '#6b7280', percentage: 7 },
];

export const leadConversionMonth: ReportDataPoint[] = leadsByMonth.map((d) => ({
  label: d.label,
  value: Math.round(d.value * (0.25 + Math.random() * 0.15)),
}));

/* ═══════════════════════════════════════════════════════
   Contact Data — 500+ contacts
   ═══════════════════════════════════════════════════════ */

const contactBase = 18;
const contactVar = 6;
const contactMonths = generateTrend(contactBase, contactVar, 36, 0.018).map(Math.round);

export const newContactsByMonth: ReportDataPoint[] = contactMonths.map((value, i) => {
  const year = Math.floor(i / 12);
  const monthIdx = i % 12;
  return {
    label: `${MONTHS_SHORT[monthIdx]} ${20 + year}`,
    value,
    previousValue: safePrevious(contactMonths, i),
  };
});

export const contactsByCountry: DistributionItem[] = [
  { name: 'Maroc', value: 420, color: '#636af1', percentage: 65 },
  { name: 'France', value: 95, color: '#3b82f6', percentage: 15 },
  { name: 'Belgique', value: 45, color: '#10b981', percentage: 7 },
  { name: 'Canada', value: 35, color: '#8b5cf6', percentage: 5 },
  { name: 'Tunisie', value: 28, color: '#f59e0b', percentage: 4 },
  { name: 'Autres', value: 25, color: '#6b7280', percentage: 4 },
];

export const contactsByIndustry: DistributionItem[] = [
  { name: 'Technologie', value: 120, color: '#636af1', percentage: 18 },
  { name: 'Finance', value: 95, color: '#10b981', percentage: 15 },
  { name: 'Industrie', value: 85, color: '#f59e0b', percentage: 13 },
  { name: 'Télécoms', value: 72, color: '#3b82f6', percentage: 11 },
  { name: 'Services', value: 110, color: '#8b5cf6', percentage: 17 },
  { name: 'Distribution', value: 60, color: '#ef4444', percentage: 9 },
  { name: 'Autres', value: 108, color: '#6b7280', percentage: 17 },
];

/* ═══════════════════════════════════════════════════════
   Opportunity Data — 300+ opportunities
   ═══════════════════════════════════════════════════════ */

export const opportunityWinRate: DistributionItem[] = [
  { name: 'Gagnées', value: 185, color: '#10b981', percentage: 62 },
  { name: 'Perdues', value: 115, color: '#ef4444', percentage: 38 },
];

export const lostReasons: DistributionItem[] = [
  { name: 'Budget insuffisant', value: 32, color: '#ef4444', percentage: 28 },
  { name: 'Concurrent moins cher', value: 28, color: '#f59e0b', percentage: 24 },
  { name: 'Fonctionnalités manquantes', value: 18, color: '#8b5cf6', percentage: 16 },
  { name: 'Délai trop long', value: 12, color: '#3b82f6', percentage: 10 },
  { name: 'Relation existante', value: 15, color: '#6b7280', percentage: 13 },
  { name: 'Autre', value: 10, color: '#636af1', percentage: 9 },
];

export const dealSizeDistribution: DistributionItem[] = [
  { name: '< 25k MAD', value: 65, color: '#6b7280', percentage: 22 },
  { name: '25k - 50k', value: 80, color: '#3b82f6', percentage: 27 },
  { name: '50k - 100k', value: 60, color: '#636af1', percentage: 20 },
  { name: '100k - 250k', value: 45, color: '#8b5cf6', percentage: 15 },
  { name: '250k - 500k', value: 30, color: '#f59e0b', percentage: 10 },
  { name: '500k+', value: 18, color: '#10b981', percentage: 6 },
];

/* ═══════════════════════════════════════════════════════
   Team Performance
   ═══════════════════════════════════════════════════════ */

export const teamMembersMock: TeamMemberPerformance[] = [
  { id: 'user-1', name: 'Alex Martin', revenue: 1250000, deals: 42, conversionRate: 68, avgDealSize: 29762, target: 1500000, achievement: 83, trend: 'up' },
  { id: 'user-2', name: 'Sara Idrissi', revenue: 980000, deals: 35, conversionRate: 72, avgDealSize: 28000, target: 1200000, achievement: 82, trend: 'up' },
  { id: 'user-3', name: 'Yassine Bennani', revenue: 740000, deals: 28, conversionRate: 58, avgDealSize: 26429, target: 1000000, achievement: 74, trend: 'neutral' },
  { id: 'user-4', name: 'Omar Chraibi', revenue: 620000, deals: 22, conversionRate: 55, avgDealSize: 28182, target: 900000, achievement: 69, trend: 'down' },
  { id: 'user-5', name: 'Leila Kabiri', revenue: 1100000, deals: 38, conversionRate: 70, avgDealSize: 28947, target: 1300000, achievement: 85, trend: 'up' },
  { id: 'user-6', name: 'Hicham Sebti', revenue: 530000, deals: 20, conversionRate: 52, avgDealSize: 26500, target: 800000, achievement: 66, trend: 'down' },
  { id: 'user-7', name: 'Mounia Ouazzani', revenue: 890000, deals: 31, conversionRate: 65, avgDealSize: 28710, target: 1100000, achievement: 81, trend: 'up' },
  { id: 'user-8', name: 'Karim Tazi', revenue: 450000, deals: 18, conversionRate: 48, avgDealSize: 25000, target: 700000, achievement: 64, trend: 'neutral' },
];

export const teamAnalyticsMock: TeamAnalytics = {
  members: teamMembersMock,
  totalRevenue: 6560000,
  totalTarget: 8500000,
  averageConversion: 61,
  topPerformer: teamMembersMock[0]!,
};

/* ═══════════════════════════════════════════════════════
   Top Companies
   ═══════════════════════════════════════════════════════ */

export const topCompaniesMock: TopCompany[] = [
  { id: 'comp-1', name: 'OCP Group', industry: 'Industrie chimique', revenue: 450000, deals: 12, contacts: 8, logoUrl: undefined },
  { id: 'comp-2', name: 'Attijariwafa Bank', industry: 'Banque / Finance', revenue: 380000, deals: 10, contacts: 6, logoUrl: undefined },
  { id: 'comp-3', name: 'Maroc Telecom', industry: 'Télécommunications', revenue: 320000, deals: 9, contacts: 7, logoUrl: undefined },
  { id: 'comp-4', name: 'Royal Air Maroc', industry: 'Transport aérien', revenue: 290000, deals: 8, contacts: 5, logoUrl: undefined },
  { id: 'comp-5', name: 'Lesieur Cristal', industry: 'Agroalimentaire', revenue: 260000, deals: 7, contacts: 4, logoUrl: undefined },
  { id: 'comp-6', name: 'Siemens Maroc', industry: 'Technologies', revenue: 240000, deals: 6, contacts: 5, logoUrl: undefined },
  { id: 'comp-7', name: 'LabelVie', industry: 'Grande distribution', revenue: 210000, deals: 6, contacts: 4, logoUrl: undefined },
  { id: 'comp-8', name: 'Wafa Assurance', industry: 'Assurances', revenue: 195000, deals: 5, contacts: 3, logoUrl: undefined },
  { id: 'comp-9', name: 'Marsa Maroc', industry: 'Logistique portuaire', revenue: 180000, deals: 5, contacts: 3, logoUrl: undefined },
  { id: 'comp-10', name: 'Akwa Group', industry: 'Holding', revenue: 165000, deals: 4, contacts: 3, logoUrl: undefined },
];

/* ═══════════════════════════════════════════════════════
   Top Sales / Opportunities / Activities
   ═══════════════════════════════════════════════════════ */

export const topSalesMock: TopSales[] = teamMembersMock
  .map((m) => ({
    id: m.id,
    name: m.name,
    revenue: m.revenue,
    deals: m.deals,
    conversionRate: m.conversionRate,
    achievement: m.achievement,
  }))
  .sort((a, b) => b.revenue - a.revenue);

export const topOpportunitiesMock: TopOpportunity[] = [
  { id: 'opp-1', name: 'Déploiement CRM Atlassian', companyName: 'OCP Group', amount: 450000, stage: 'negotiation', probability: 80, ownerName: 'Alex Martin' },
  { id: 'opp-2', name: 'Transformation Digitale', companyName: 'Attijariwafa Bank', amount: 380000, stage: 'proposal', probability: 65, ownerName: 'Sara Idrissi' },
  { id: 'opp-3', name: 'Infrastructure Cloud AWS', companyName: 'Maroc Telecom', amount: 320000, stage: 'negotiation', probability: 75, ownerName: 'Leila Kabiri' },
  { id: 'opp-4', name: 'Solution Data Warehouse', companyName: 'Royal Air Maroc', amount: 290000, stage: 'qualification', probability: 45, ownerName: 'Mounia Ouazzani' },
  { id: 'opp-5', name: 'ERP Oracle Migration', companyName: 'Lesieur Cristal', amount: 260000, stage: 'proposal', probability: 60, ownerName: 'Alex Martin' },
  { id: 'opp-6', name: 'Solution BI Power BI', companyName: 'Siemens Maroc', amount: 240000, stage: 'prospecting', probability: 30, ownerName: 'Yassine Bennani' },
  { id: 'opp-7', name: 'Cybersécurité SOC', companyName: 'LabelVie', amount: 210000, stage: 'qualification', probability: 40, ownerName: 'Sara Idrissi' },
  { id: 'opp-8', name: 'Service Desk Managé', companyName: 'Wafa Assurance', amount: 195000, stage: 'negotiation', probability: 70, ownerName: 'Leila Kabiri' },
];

export const recentActivitiesMock: RecentActivity[] = [
  { id: 'act-1', type: 'deal_won', title: 'Contrat signé avec OCP Group', description: 'Déploiement CRM Atlassian — 450 000 MAD', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), userName: 'Alex Martin', amount: 450000 },
  { id: 'act-2', type: 'new_lead', title: 'Nouveau lead : Nour Bennani', description: 'Directeur Général chez Sanad Pharma — Lead chaud', timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), userName: 'Sara Idrissi' },
  { id: 'act-3', type: 'deal_lost', title: 'Opportunité perdue : Projet SI', description: 'Budget insuffisant — Concurrent moins cher', timestamp: new Date(Date.now() - 8 * 3600000).toISOString(), userName: 'Yassine Bennani', amount: 180000 },
  { id: 'act-4', type: 'new_opportunity', title: 'Nouvelle opportunité : Cloud AWS', description: 'Maroc Telecom — 320 000 MAD — Phase négociation', timestamp: new Date(Date.now() - 12 * 3600000).toISOString(), userName: 'Leila Kabiri', amount: 320000 },
  { id: 'act-5', type: 'new_contact', title: 'Nouveau contact : Imane Zniber', description: 'Responsable Achats chez Cosumar', timestamp: new Date(Date.now() - 18 * 3600000).toISOString(), userName: 'Mounia Ouazzani' },
  { id: 'act-6', type: 'meeting', title: 'Réunion avec Attijariwafa Bank', description: 'Présentation solution BI — Très bonne réception', timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), userName: 'Alex Martin' },
  { id: 'act-7', type: 'deal_won', title: 'Signature contrat Lesieur Cristal', description: 'Migration ERP Oracle — 260 000 MAD', timestamp: new Date(Date.now() - 36 * 3600000).toISOString(), userName: 'Alex Martin', amount: 260000 },
  { id: 'act-8', type: 'new_lead', title: 'Lead entrant : Mehdi Cherkaoui', description: 'CTO chez Chaabi Pharm — Via site web', timestamp: new Date(Date.now() - 48 * 3600000).toISOString(), userName: 'Sara Idrissi' },
  { id: 'act-9', type: 'deal_won', title: 'Validation projet Wafa Assurance', description: 'Service Desk Managé — 195 000 MAD', timestamp: new Date(Date.now() - 72 * 3600000).toISOString(), userName: 'Leila Kabiri', amount: 195000 },
  { id: 'act-10', type: 'new_opportunity', title: 'Opportunité : Cybersécurité SOC', description: 'LabelVie — 210 000 MAD — Phase qualification', timestamp: new Date(Date.now() - 96 * 3600000).toISOString(), userName: 'Sara Idrissi', amount: 210000 },
];

/* ═══════════════════════════════════════════════════════
   KPI Data — 8 premium KPIs
   ═══════════════════════════════════════════════════════ */

const last12Revenue = revenueMonths.slice(-12);
const last12RevenuePrev = revenueMonths.slice(-24, -12);
const totalRevenue = Math.round(last12Revenue.reduce((a, b) => a + b, 0));
const prevRevenue = Math.round(last12RevenuePrev.reduce((a, b) => a + b, 0));
const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

const totalWon = deals.won.slice(-12).reduce((a, b) => a + b, 0);
const prevWon = deals.won.slice(-24, -12).reduce((a, b) => a + b, 0);
const wonChange = prevWon > 0 ? ((totalWon - prevWon) / prevWon) * 100 : 0;

const totalLost = deals.lost.slice(-12).reduce((a, b) => a + b, 0);
const prevLost = deals.lost.slice(-24, -12).reduce((a, b) => a + b, 0);
const lostChange = prevLost > 0 ? ((totalLost - prevLost) / prevLost) * 100 : 0;

const conversionRate = totalWon + totalLost > 0 ? (totalWon / (totalWon + totalLost)) * 100 : 0;
const prevConversion = prevWon + prevLost > 0 ? (prevWon / (prevWon + prevLost)) * 100 : 0;
const conversionChange = prevConversion > 0 ? conversionRate - prevConversion : 0;

const avgDeal = totalWon > 0 ? totalRevenue / totalWon : 0;
const prevAvgDeal = prevWon > 0 ? prevRevenue / prevWon : 0;
const avgDealChange = prevAvgDeal > 0 ? ((avgDeal - prevAvgDeal) / prevAvgDeal) * 100 : 0;

const totalLeads = leadMonths.slice(-12).reduce((a, b) => a + b, 0);
const prevLeads = leadMonths.slice(-24, -12).reduce((a, b) => a + b, 0);
const leadGrowth = prevLeads > 0 ? ((totalLeads - prevLeads) / prevLeads) * 100 : 0;

export const kpiDataMock: KPI[] = [
  {
    id: 'kpi-revenue',
    label: 'Revenu Annuel',
    value: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(totalRevenue),
    rawValue: totalRevenue,
    change: Math.round(revenueChange * 10) / 10,
    trend: revenueChange >= 0 ? 'up' : 'down',
    sparklineData: last12Revenue,
    icon: 'dollarSign',
    description: 'Revenu total des 12 derniers mois',
    format: 'currency',
  },
  {
    id: 'kpi-pipeline',
    label: 'Valeur du Pipeline',
    value: '2 043 000 MAD',
    rawValue: 2043000,
    change: 12.5,
    trend: 'up',
    sparklineData: revenueMonths.slice(-12).map((v) => Math.round(v * 0.7)),
    icon: 'gitBranch',
    description: 'Valeur totale des opportunités ouvertes',
    format: 'currency',
  },
  {
    id: 'kpi-won',
    label: 'Affaires Gagnées',
    value: totalWon.toString(),
    rawValue: totalWon,
    change: Math.round(wonChange * 10) / 10,
    trend: wonChange >= 0 ? 'up' : 'down',
    sparklineData: deals.won.slice(-12),
    icon: 'checkCircle2',
    description: 'Nombre total de deals gagnés sur 12 mois',
    format: 'count',
  },
  {
    id: 'kpi-lost',
    label: 'Affaires Perdues',
    value: totalLost.toString(),
    rawValue: totalLost,
    change: Math.abs(Math.round(lostChange * 10) / 10),
    trend: lostChange <= 0 ? 'down' : 'up',
    sparklineData: deals.lost.slice(-12),
    icon: 'xCircle',
    description: 'Nombre total de deals perdus sur 12 mois',
    format: 'count',
  },
  {
    id: 'kpi-conversion',
    label: 'Taux de Conversion',
    value: `${Math.round(conversionRate * 10) / 10}%`,
    rawValue: Math.round(conversionRate * 10) / 10,
    change: Math.round(conversionChange * 10) / 10,
    trend: conversionChange >= 0 ? 'up' : 'down',
    sparklineData: deals.won.slice(-12).map((w, i) => {
      const l = deals.lost.slice(-12)[i] ?? 1;
      return Math.round((w / (w + l)) * 100);
    }),
    icon: 'percent',
    description: 'Ratio deals gagnés / deals conclus',
    format: 'percent',
  },
  {
    id: 'kpi-avg-deal',
    label: 'Panier Moyen',
    value: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(avgDeal),
    rawValue: Math.round(avgDeal),
    change: Math.round(avgDealChange * 10) / 10,
    trend: avgDealChange >= 0 ? 'up' : 'down',
    sparklineData: revenueMonths.slice(-12).map((r, i) => {
      const w = deals.won.slice(-12)[i] ?? 1;
      return Math.round(r / w);
    }),
    icon: 'dollarSign',
    description: 'Montant moyen par deal gagné',
    format: 'currency',
  },
  {
    id: 'kpi-new-leads',
    label: 'Nouveaux Leads',
    value: totalLeads.toString(),
    rawValue: totalLeads,
    change: Math.round(leadGrowth * 10) / 10,
    trend: leadGrowth >= 0 ? 'up' : 'down',
    sparklineData: leadMonths.slice(-12),
    icon: 'target',
    description: 'Nouveaux leads générés sur 12 mois',
    format: 'count',
  },
  {
    id: 'kpi-growth',
    label: 'Croissance',
    value: `${revenueChange >= 0 ? '+' : ''}${Math.round(revenueChange * 10) / 10}%`,
    rawValue: Math.round(revenueChange * 10) / 10,
    change: Math.round(revenueChange * 10) / 10,
    trend: revenueChange >= 0 ? 'up' : 'down',
    sparklineData: revenueMonths.slice(-12).map((v, i) => {
      if (i === 0) return 0;
      const prev = revenueMonths.slice(-12)[i - 1] ?? 1;
      return Math.round(((v - prev) / prev) * 100);
    }),
    icon: 'trendUp',
    description: 'Croissance du revenu vs année précédente',
    format: 'percent',
  },
];

/* ═══════════════════════════════════════════════════════
   Aggregated data objects
   ═══════════════════════════════════════════════════════ */

export const revenueDataMock: RevenueData = {
  monthly: revenueByMonth36,
  cumulative: revenueCumulativeData,
  byProduct: [
    { name: 'CRM Premium', value: 2800000, color: '#636af1', percentage: 38 },
    { name: 'Consulting', value: 1800000, color: '#10b981', percentage: 24 },
    { name: 'Support', value: 1200000, color: '#3b82f6', percentage: 16 },
    { name: 'Formation', value: 850000, color: '#8b5cf6', percentage: 11 },
    { name: 'Licences', value: 800000, color: '#f59e0b', percentage: 11 },
  ],
  byRegion: [
    { name: 'Casablanca', value: 3200000, color: '#636af1', percentage: 43 },
    { name: 'Rabat', value: 1500000, color: '#10b981', percentage: 20 },
    { name: 'Tanger', value: 980000, color: '#3b82f6', percentage: 13 },
    { name: 'Marrakech', value: 750000, color: '#8b5cf6', percentage: 10 },
    { name: 'Autres', value: 1050000, color: '#6b7280', percentage: 14 },
  ],
  forecast: revenueByMonth36.slice(-6).concat(
    Array.from({ length: 6 }, (_, i) => {
      const last = revenueByMonth36[revenueByMonth36.length - 1]!;
      return {
        label: `Prév. ${MONTHS_SHORT[(new Date().getMonth() + 1 + i) % 12]}`,
        value: Math.round(last.value * (1 + (i + 1) * 0.025)),
        forecast: Math.round(last.value * (1 + (i + 1) * 0.025)),
      };
    })
  ),
};

export const salesPerformanceMock: SalesPerformance = {
  totalRevenue,
  totalDeals: totalWon + totalLost,
  wonDeals: totalWon,
  lostDeals: totalLost,
  avgDealSize: Math.round(avgDeal),
  winRate: Math.round(conversionRate * 10) / 10,
  salesCycleDays: 45,
  monthlyData: revenueByMonth36.slice(-12),
};

export const pipelineAnalyticsMock: PipelineAnalytics = {
  stageDistribution: pipelineStageDistribution,
  stageValues: pipelineStageValues,
  velocity: 45,
  averageDealAge: 62,
  conversionRates: [
    { label: 'Prospection → Qualification', value: 68 },
    { label: 'Qualification → Proposition', value: 55 },
    { label: 'Proposition → Négociation', value: 42 },
    { label: 'Négociation → Gagné', value: 65 },
  ],
  evolution: pipelineEvolution,
};

export const leadAnalyticsMock: LeadAnalytics = {
  bySource: leadSourceDistribution,
  byStatus: [
    { name: 'Nouveau', value: 180, color: '#3b82f6', percentage: 18 },
    { name: 'Contacté', value: 290, color: '#636af1', percentage: 29 },
    { name: 'Qualifié', value: 220, color: '#8b5cf6', percentage: 22 },
    { name: 'Converti', value: 190, color: '#10b981', percentage: 19 },
    { name: 'Non qualifié', value: 120, color: '#6b7280', percentage: 12 },
  ],
  byMonth: leadsByMonth,
  conversionRate: 24.5,
  qualityScore: 78,
  growthRate: leadGrowth,
  totalLeads: totalLeads,
  convertedLeads: Math.round(totalLeads * 0.245),
  timeToConversion: 18,
};

export const contactAnalyticsMock: ContactAnalytics = {
  newContacts: newContactsByMonth,
  activeContacts: 520,
  byCountry: contactsByCountry,
  byIndustry: contactsByIndustry,
  topCompanies: [
    { name: 'OCP Group', contactCount: 8, revenue: 450000 },
    { name: 'Maroc Telecom', contactCount: 7, revenue: 320000 },
    { name: 'Attijariwafa Bank', contactCount: 6, revenue: 380000 },
    { name: 'Royal Air Maroc', contactCount: 5, revenue: 290000 },
    { name: 'Siemens Maroc', contactCount: 5, revenue: 240000 },
  ],
  growth: leadsByMonth.map((d) => ({
    label: d.label,
    value: Math.round(d.value * 0.85),
    previousValue: d.previousValue ? Math.round(d.previousValue * 0.85) : undefined,
  })),
};

export const opportunityAnalyticsMock: OpportunityAnalytics = {
  pipelineDistribution: pipelineStageDistribution,
  probabilityDistribution: [
    { name: '0-25%', value: 45, color: '#ef4444', percentage: 18 },
    { name: '25-50%', value: 65, color: '#f59e0b', percentage: 26 },
    { name: '50-75%', value: 80, color: '#636af1', percentage: 32 },
    { name: '75-100%', value: 60, color: '#10b981', percentage: 24 },
  ],
  winRate: 62,
  lostReasons: lostReasons,
  dealSizeDistribution: dealSizeDistribution,
  byStage: pipelineStageDistribution,
  totalPipelineValue: 2043000,
  averageProbability: 52,
  weightedValue: 1062360,
};

