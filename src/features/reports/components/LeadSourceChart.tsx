import { memo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { LeadAnalytics } from '@/features/reports/types';

interface LeadSourceChartProps {
  data: LeadAnalytics;
}

const COLORS = ['#636af1', '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#64748b'];

export const LeadSourceChart = memo(function LeadSourceChart({ data }: LeadSourceChartProps) {
  return (
    <div className="h-62.5 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data.bySource} dataKey="value" nameKey="name" innerRadius={50} outerRadius={84} paddingAngle={2}>
            {data.bySource.map((entry, index) => (
              <Cell key={`${entry.name}-${index}`} fill={entry.color ?? COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});
