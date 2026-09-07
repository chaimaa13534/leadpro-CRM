import { Card, CardContent } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/formatCurrency';
import type { Opportunity } from '@/types/opportunity.types';

export interface OpportunityKPIsProps {
  opportunity: Opportunity;
}

export function OpportunityKPIs({ opportunity }: OpportunityKPIsProps) {
  const weightedValue = (opportunity.amount * opportunity.probability) / 100;

  const kpis = [
    {
      label: 'Montant',
      value: formatCurrency(opportunity.amount, opportunity.currency),
    },
    {
      label: 'Valeur pondérée',
      value: formatCurrency(weightedValue, opportunity.currency),
    },
    {
      label: 'Probabilité',
      value: `${opportunity.probability}%`,
    },
    {
      label: 'Devise',
      value: opportunity.currency,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 tablet:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label}>
          <CardContent className="flex flex-col gap-1 p-4">
            <p className="text-caption font-medium uppercase tracking-wide text-text-secondary/70">
              {kpi.label}
            </p>
            <p className="text-figure text-h3 text-text-primary tabular-nums leading-none">
              {kpi.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

