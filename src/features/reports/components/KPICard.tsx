import { memo } from 'react';
import { motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { ArrowDownRight, ArrowUpRight, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { KPI } from '@/features/reports/types';
import { formatCurrency, formatNumber, formatPercent } from '@/features/reports/utils';

interface KPICardProps {
  kpi: KPI;
}

function formatValue(kpi: KPI): string {
  switch (kpi.format) {
    case 'currency':
      return formatCurrency(kpi.rawValue);
    case 'number':
      return formatNumber(kpi.rawValue);
    case 'percent':
      return formatPercent(kpi.rawValue, 1);
    default:
      return kpi.value;
  }
}

export const KPICard = memo(function KPICard({ kpi }: KPICardProps) {
  const value = formatValue(kpi);
  const isPositive = kpi.change >= 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Card variant="elevated" padding="md" className="h-full">
        <CardContent className="flex h-full flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-text-tertiary">{kpi.label}</p>
              <p className="mt-2 text-[20px] font-semibold text-text-primary">{value}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface-hover p-2 text-accent">
              <TrendingUp className="size-4" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant={isPositive ? 'success' : 'danger'} size="sm">
              {isPositive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {Math.abs(kpi.change).toFixed(1)}%
            </Badge>
            <span className="text-[12px] text-text-tertiary">{kpi.description}</span>
          </div>

          <div className="h-12 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={kpi.sparklineData.map((value, index) => ({ value, index }))}>
                <Area type="monotone" dataKey="value" stroke="#636af1" fill="#636af1" fillOpacity={0.12} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
