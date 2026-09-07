import { memo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { LeadAnalytics } from '@/features/reports/types';

interface LeadGrowthChartProps {
  data: LeadAnalytics;
}

export const LeadGrowthChart = memo(function LeadGrowthChart({ data }: LeadGrowthChartProps) {
  return (
    <div className="h-62.5 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data.byMonth.slice(-12)}>
          <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} interval="preserveStartEnd" />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} />
          <Tooltip />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#636af1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});
