import { memo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TeamAnalytics } from '@/features/reports/types';
import { formatCurrency } from '@/features/reports/utils';

interface SalesChartProps {
  data: TeamAnalytics;
}

export const SalesChart = memo(function SalesChart({ data }: SalesChartProps) {
  const chartData = data.members.slice(0, 6).map((member) => ({ label: member.name.split(' ')[0], value: member.revenue }));

  return (
    <div className="h-62.5 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} tickFormatter={(value) => `${value / 1000}k`} />
          <Tooltip formatter={(value) => formatCurrency(typeof value === 'number' ? value : Number(value ?? 0))} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#636af1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});
