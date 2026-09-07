/* ═════════════════════════════════════════════════════════════════════
   Reports & Analytics — Helper utilities
   ═════════════════════════════════════════════════════════════════════ */

import type { ReportPeriod } from '@/features/reports/types';

/** Format a number as currency (MAD) */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 0,
  }).format(value);
}

/** Format a number with separators */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value);
}

/** Format a percentage */
export function formatPercent(value: number, decimals = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

/** Format a compact number (e.g. 1.2M, 500K) */
export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

/** Get date range for a given period */
export function getPeriodDateRange(period: ReportPeriod): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();

  switch (period) {
    case '7d':
      start.setDate(start.getDate() - 7);
      break;
    case '30d':
      start.setDate(start.getDate() - 30);
      break;
    case '90d':
      start.setDate(start.getDate() - 90);
      break;
    case '6m':
      start.setMonth(start.getMonth() - 6);
      break;
    case '12m':
      start.setFullYear(start.getFullYear() - 1);
      break;
    case '36m':
      start.setFullYear(start.getFullYear() - 3);
      break;
    default:
      start.setFullYear(start.getFullYear() - 1);
  }

  return { start, end };
}

/** Get a human-readable label for a period */
export function getPeriodLabel(period: ReportPeriod): string {
  const labels: Record<ReportPeriod, string> = {
    '7d': '7 derniers jours',
    '30d': '30 derniers jours',
    '90d': '90 derniers jours',
    '6m': '6 derniers mois',
    '12m': '12 derniers mois',
    '36m': '36 derniers mois',
    custom: 'Période personnalisée',
  };
  return labels[period] ?? '12 derniers mois';
}

/** Aggregate data points by period */
export function aggregateByPeriod<T extends { label: string; value: number }>(
  data: T[],
  period: ReportPeriod,
): T[] {
  if (period === '12m' || period === '36m') return data;
  if (period === '6m') return data.slice(-6);
  if (period === '90d') return data.slice(-3);
  if (period === '30d') return data.slice(-1);
  if (period === '7d') return data.slice(-1);
  return data;
}

/** Calculate growth percentage between two values */
export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/** Calculate percentage of a part relative to a total */
export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return (part / total) * 100;
}

/** Get trend icon name based on change value */
export function getTrendFromChange(change: number): 'up' | 'down' | 'neutral' {
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'neutral';
}

/** Get a color for a trend direction */
export function getTrendColor(trend: 'up' | 'down' | 'neutral'): string {
  const colors = { up: 'text-success-500', down: 'text-danger-500', neutral: 'text-text-tertiary' };
  return colors[trend];
}

/** Get a background color for a trend badge */
export function getTrendBg(trend: 'up' | 'down' | 'neutral'): string {
  const colors = {
    up: 'bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-400',
    down: 'bg-danger-50 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400',
    neutral: 'bg-background-tertiary text-text-tertiary',
  };
  return colors[trend];
}
