import { memo } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { RevenueData } from '@/features/reports/types';
import { formatCurrency } from '@/features/reports/utils';

interface RevenueChartProps {
  data: RevenueData;
}

export const RevenueChart = memo(function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data.monthly}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#636af1" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#636af1" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} interval="preserveStartEnd" />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }} tickFormatter={(value) => `${value / 1000}k`} />
          <Tooltip
            formatter={(value) => formatCurrency(typeof value === 'number' ? value : Number(value ?? 0))}
            labelStyle={{ color: 'var(--color-text-primary)' }}
          />
          <Area type="monotone" dataKey="value" stroke="#636af1" fill="url(#revenueGradient)" strokeWidth={2.5} />
          <Area type="monotone" dataKey="forecast" stroke="#10b981" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});
