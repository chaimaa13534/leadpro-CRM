import {
  CartesianGrid,
  Line,
  LineChart,
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
import { salesByMonthMock } from '@/mocks/analytics.mock';
import { formatCurrency } from '@/utils/formatCurrency';

/** Graphique des ventes conclues par mois. */
export function SalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventes</CardTitle>
        <CardDescription>Montant des ventes conclues par mois</CardDescription>
      </CardHeader>
      <div className="h-64 px-2 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesByMonthMock} margin={{ left: 4, right: 12 }}>
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
              width={48}
              tick={{ fontSize: 12, fill: COLORS.neutral[500] }}
              tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                borderColor: COLORS.neutral[200],
                fontSize: 13,
              }}
              formatter={(value) => [formatCurrency(Number(value)), 'Ventes']}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={COLORS.secondary[600]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
