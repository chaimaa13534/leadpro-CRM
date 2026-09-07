import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { COLORS } from '@/lib/constants/colors.constants';
import { PIPELINE_STAGES } from '@/lib/constants/pipeline.constants';
import { opportunitiesDistributionMock } from '@/mocks/analytics.mock';

/** Répartition des opportunités par étape du pipeline (donut). */
export function OpportunitiesDistributionChart() {
  const data = opportunitiesDistributionMock.map((entry) => ({
    name: PIPELINE_STAGES[entry.stage].label,
    value: entry.opportunityCount,
    color: PIPELINE_STAGES[entry.stage].color,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition des opportunités</CardTitle>
        <CardDescription>Nombre d'opportunités par étape</CardDescription>
      </CardHeader>
      <div className="flex h-64 items-center gap-4 px-4 pb-4">
        <ResponsiveContainer width="60%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="60%"
              outerRadius="90%"
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                borderColor: COLORS.neutral[200],
                fontSize: 13,
              }}
              formatter={(value, name) => [String(value), String(name)]}
            />
          </PieChart>
        </ResponsiveContainer>

        <ul className="flex min-w-0 flex-1 flex-col gap-2">
          {data.map((entry) => (
            <li
              key={entry.name}
              className="flex items-center gap-2 text-caption text-text-secondary"
            >
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 truncate">{entry.name}</span>
              <span className="font-medium text-text-primary">
                {entry.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
