import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { COLORS } from '@/lib/constants/colors.constants';
import { leadsByMonthMock } from '@/mocks/analytics.mock';

/** Graphique des nouveaux leads par mois (12 derniers mois). */
export function LeadsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads par mois</CardTitle>
        <CardDescription>
          Nouveaux leads créés, 12 derniers mois
        </CardDescription>
      </CardHeader>
      <div className="h-64 px-2 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={leadsByMonthMock} margin={{ left: 4, right: 12 }}>
            <CartesianGrid vertical={false} stroke={COLORS.neutral[200]} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: COLORS.neutral[500] }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={32}
              tick={{ fontSize: 12, fill: COLORS.neutral[500] }}
            />
            <Tooltip
              cursor={{ fill: COLORS.neutral[100] }}
              contentStyle={{
                borderRadius: 8,
                borderColor: COLORS.neutral[200],
                fontSize: 13,
              }}
              formatter={(value) => [String(value), 'Leads']}
            />
            <Bar
              dataKey="value"
              fill={COLORS.primary[500]}
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
