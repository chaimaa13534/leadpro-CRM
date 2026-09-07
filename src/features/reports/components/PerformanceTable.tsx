import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { TopCompany, TopOpportunity, TopSales, RecentActivity } from '@/features/reports/types';
import { formatCurrency } from '@/features/reports/utils';

interface PerformanceTableProps {
  title: string;
  items: Array<TopCompany | TopSales | TopOpportunity | RecentActivity>;
  kind: 'companies' | 'sales' | 'opportunities' | 'activities';
}

export const PerformanceTable = memo(function PerformanceTable({ title, items, kind }: PerformanceTableProps) {
  return (
    <Card variant="elevated" padding="md" className="h-full">
      <CardHeader className="mb-4">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="divide-y divide-border">
            {items.map((item) => {
              if (kind === 'companies') {
                const company = item as TopCompany;
                return (
                  <div key={company.id} className="flex items-center justify-between gap-3 px-3 py-3">
                    <div>
                      <p className="text-[13px] font-medium text-text-primary">{company.name}</p>
                      <p className="text-[12px] text-text-tertiary">{company.industry}</p>
                    </div>
                    <p className="text-[13px] font-semibold text-text-primary">{formatCurrency(company.revenue)}</p>
                  </div>
                );
              }

              if (kind === 'sales') {
                const sale = item as TopSales;
                return (
                  <div key={sale.id} className="flex items-center justify-between gap-3 px-3 py-3">
                    <div>
                      <p className="text-[13px] font-medium text-text-primary">{sale.name}</p>
                      <p className="text-[12px] text-text-tertiary">{sale.deals} deals • {sale.conversionRate}%</p>
                    </div>
                    <p className="text-[13px] font-semibold text-text-primary">{formatCurrency(sale.revenue)}</p>
                  </div>
                );
              }

              if (kind === 'opportunities') {
                const opportunity = item as TopOpportunity;
                return (
                  <div key={opportunity.id} className="flex items-center justify-between gap-3 px-3 py-3">
                    <div>
                      <p className="text-[13px] font-medium text-text-primary">{opportunity.name}</p>
                      <p className="text-[12px] text-text-tertiary">{opportunity.companyName} • {opportunity.stage}</p>
                    </div>
                    <p className="text-[13px] font-semibold text-text-primary">{formatCurrency(opportunity.amount ?? 0)}</p>
                  </div>
                );
              }

              const activity = item as RecentActivity;
              return (
                <div key={activity.id} className="flex items-center justify-between gap-3 px-3 py-3">
                  <div>
                    <p className="text-[13px] font-medium text-text-primary">{activity.title}</p>
                    <p className="text-[12px] text-text-tertiary">{activity.description}</p>
                  </div>
                  {activity.amount ? <p className="text-[13px] font-semibold text-text-primary">{formatCurrency(activity.amount)}</p> : null}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
