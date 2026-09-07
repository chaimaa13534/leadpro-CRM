import {
  Area,
  AreaChart,
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
import { revenueTrendMock } from '@/mocks/analytics.mock';
import { formatCurrency } from '@/utils/formatCurrency';

/** Évolution du chiffre d'affaires cumulé. */
export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chiffre d'affaires</CardTitle>
        <CardDescription>Évolution cumulée, 12 derniers mois</CardDescription>
      </CardHeader>
      <div className="h-64 px-2 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueTrendMock} margin={{ left: 4, right: 12 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={COLORS.primary[500]}
                  stopOpacity={0.25}
                />
                <stop
                  offset="100%"
                  stopColor={COLORS.primary[500]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
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
              tickFormatter={(value: number) =>
                `${Math.round(value / 1000000)}M`
              }
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                borderColor: COLORS.neutral[200],
                fontSize: 13,
              }}
              formatter={(value) => [
                formatCurrency(Number(value)),
                'CA cumulé',
              ]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={COLORS.primary[600]}
              strokeWidth={2}
              fill="url(#revenueFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
