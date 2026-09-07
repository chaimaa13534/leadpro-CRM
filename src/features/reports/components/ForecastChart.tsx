import { memo } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { RevenueData } from '@/features/reports/types';
import { formatCurrency } from '@/features/reports/utils';

interface ForecastChartProps {
  data: RevenueData;
}

export const ForecastChart = memo(function ForecastChart({ data }: ForecastChartProps) {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.forecast}>
          <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} interval="preserveStartEnd" />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} tickFormatter={(value) => `${value / 1000}k`} />
          <Tooltip formatter={(value) => formatCurrency(typeof value === 'number' ? value : Number(value ?? 0))} />
          <Line type="monotone" dataKey="value" stroke="#636af1" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});
