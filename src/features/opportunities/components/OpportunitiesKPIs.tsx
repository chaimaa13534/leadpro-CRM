import { Target, Banknote, TrendingUp, TrendingDown, Percent, LineChart } from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import { formatCurrency } from '@/utils/formatCurrency';
import type { Opportunity } from '@/types/opportunity.types';

export interface OpportunitiesKPIsProps {
  opportunities: Opportunity[];
}

export function OpportunitiesKPIs({ opportunities }: OpportunitiesKPIsProps) {
  const total = opportunities.length;
  const active = opportunities.filter((o) => o.status === 'active').length;
  const won = opportunities.filter((o) => o.status === 'won').length;
  const lost = opportunities.filter((o) => o.status === 'lost').length;

  const totalPipelineValue = opportunities
    .filter((o) => o.stage !== 'closed_lost' && o.stage !== 'closed_won')
    .reduce((sum, o) => sum + o.amount, 0);

  const wonValue = opportunities
    .filter((o) => o.status === 'won')
    .reduce((sum, o) => sum + o.amount, 0);

  const averageDealSize =
    total > 0
      ? opportunities.reduce((sum, o) => sum + o.amount, 0) / total
      : 0;

  const winRate = total > 0 ? (won / (won + lost)) * 100 : 0;

  const forecastRevenue = opportunities
    .filter((o) => o.stage === 'negotiation' || o.stage === 'proposal')
    .reduce((sum, o) => sum + (o.amount * o.probability) / 100, 0);

  return (
    <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
      <KPICard
        icon={Target}
        label="Total Opportunités"
        value={total.toLocaleString('fr-FR')}
        description="Toutes les opportunités"
      />
      <KPICard
        icon={Banknote}
        label="Valeur du Pipeline"
        value={formatCurrency(totalPipelineValue)}
        change={12.5}
        description="Hors closes won/lost"
      />
      <KPICard
        icon={TrendingUp}
        label="Deal moyen"
        value={formatCurrency(averageDealSize)}
        change={-3.2}
        description="Montant moyen par opportunité"
      />
      <KPICard
        icon={Percent}
        label="Win Rate"
        value={`${winRate.toFixed(1)}%`}
        change={5.8}
        description="Taux de transformation"
      />
      <KPICard
        icon={TrendingDown}
        label="Pertes"
        value={lost.toLocaleString('fr-FR')}
        change={-8.1}
        description="Opportunités perdues"
      />
      <KPICard
        icon={LineChart}
        label="Prévisionnel"
        value={formatCurrency(forecastRevenue)}
        description="Revenu pondéré estimé"
      />
    </div>
  );
}

