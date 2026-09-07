import { memo } from 'react';
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { PipelineAnalytics } from '@/features/reports/types';
import { formatCurrency } from '@/features/reports/utils';

interface PipelineChartProps {
  data: PipelineAnalytics;
}

export const PipelineChart = memo(function PipelineChart({ data }: PipelineChartProps) {
  const chartData = data.evolution.map((entry) => ({
    label: entry.label,
    value: entry.value,
    forecast: entry.forecast ?? entry.value,
  }));

  return (
    <div className="h-65 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} interval="preserveStartEnd" />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} tickFormatter={(value) => `${value / 1000}k`} />
          <Tooltip formatter={(value) => formatCurrency(typeof value === 'number' ? value : Number(value ?? 0))} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#636af1" opacity={0.9} />
          <Line type="monotone" dataKey="forecast" stroke="#10b981" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
});
