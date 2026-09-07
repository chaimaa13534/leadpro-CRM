/**
 * Cartes KPI du Pipeline Kanban.
 * Affiche 7 indicateurs clés : opportunités, valeur, average deal, forecast, won, lost, conversion.
 * Réutilise le composant UI KPICard existant.
 */
import { useMemo } from 'react';
import { KPICard } from '@/components/ui/KPICard';
import { Icons } from '@/components/ui/icons';
import { formatCurrency } from '@/utils/formatCurrency';
import type { PipelineStats } from '@/features/pipeline/types/pipeline.types';

interface PipelineKPIsProps {
  stats: PipelineStats;
}

export function PipelineKPIs({ stats }: PipelineKPIsProps) {
  const kpiItems = useMemo(() => [
    {
      icon: Icons.opportunities,
      label: 'Opportunités',
      value: stats.totalOpportunities.toLocaleString('fr-FR'),
      description: 'Nombre total d\'opportunités dans le pipeline',
      change: undefined,
    },
    {
      icon: Icons.dollarSign,
      label: 'Pipeline Value',
      value: formatCurrency(stats.totalValue),
      description: 'Valeur totale des opportunités ouvertes',
      change: 12.5,
    },
    {
      icon: Icons.barChart3,
      label: 'Average Deal',
      value: formatCurrency(stats.averageDeal),
      description: 'Montant moyen par opportunité',
      change: 3.2,
    },
    {
      icon: Icons.percent,
      label: 'Forecast Revenue',
      value: formatCurrency(stats.forecastRevenue),
      description: 'Revenu prévisionnel pondéré',
      change: 8.7,
    },
    {
      icon: Icons.checkCircle2,
      label: 'Won Deals',
      value: stats.wonDeals.toLocaleString('fr-FR'),
      description: `${formatCurrency(stats.wonValue)} — Affaires gagnées`,
      change: 5.1,
    },
    {
      icon: Icons.xCircle,
      label: 'Lost Deals',
      value: stats.lostDeals.toLocaleString('fr-FR'),
      description: `${formatCurrency(stats.lostValue)} — Affaires perdues`,
      change: -2.3,
    },
    {
      icon: Icons.trendUp,
      label: 'Conversion Rate',
      value: `${stats.conversionRate.toFixed(1)}%`,
      description: 'Taux de conversion global',
      change: stats.conversionRate > 30 ? 1.8 : -0.5,
    },
  ], [stats]);

  return (
    <div className="grid grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4 desktop:grid-cols-7 gap-4">
      {kpiItems.map((kpi) => (
        <KPICard key={kpi.label} {...kpi} />
      ))}
    </div>
  );
}

