import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { TeamAnalytics } from '@/features/reports/types';
import { formatCurrency } from '@/features/reports/utils';

interface LeaderboardProps {
  data: TeamAnalytics;
}

export const Leaderboard = memo(function Leaderboard({ data }: LeaderboardProps) {
  return (
    <Card variant="elevated" padding="md" className="h-full">
      <CardHeader className="mb-4">
        <CardTitle>Leaderboard commercial</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.members.slice(0, 5).map((member, index) => (
          <div key={member.id} className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-3">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-accent-subtle text-accent">
                {index + 1}
              </div>
              <div>
                <p className="text-[13px] font-medium text-text-primary">{member.name}</p>
                <p className="text-[12px] text-text-tertiary">{member.deals} deals • {member.conversionRate}%</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[13px] font-semibold text-text-primary">{formatCurrency(member.revenue)}</p>
              <Badge variant="success" size="sm">{member.achievement}%</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
});
