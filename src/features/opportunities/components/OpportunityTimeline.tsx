import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icons } from '@/components/ui/icons';
import { formatDate } from '@/utils/formatDate';
import type { OpportunityActivity } from '@/types/opportunity.types';

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  note: Icons.note,
  call: Icons.phone,
  email: Icons.mail,
  meeting: Icons.user,
  task: Icons.check,
  status_change: Icons.statusChange,
};

export interface OpportunityTimelineProps {
  activities?: OpportunityActivity[];
}

export function OpportunityTimeline({ activities = [] }: OpportunityTimelineProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <Icons.clock className="size-8 text-text-tertiary" aria-hidden="true" />
          <p className="text-body text-text-secondary">
            Aucune activité enregistrée pour le moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activités récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative flex flex-col gap-4 pl-6 before:absolute before:left-2 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-border/60">
          {activities.map((activity) => {
            const IconComponent = ACTIVITY_ICONS[activity.type] ?? Icons.note;

            return (
              <div key={activity.id} className="relative flex flex-col gap-1">
                <span className="absolute -left-6 flex size-4 items-center justify-center rounded-full bg-surface ring-2 ring-border">
                  <IconComponent className="size-2.5 text-text-secondary" aria-hidden="true" />
                </span>
                <p className="text-body font-medium text-text-primary">
                  {activity.title}
                </p>
                {activity.description ? (
                  <p className="text-caption text-text-secondary">
                    {activity.description}
                  </p>
                ) : null}
                <span className="text-caption text-text-secondary/60">
                  {formatDate(activity.createdAt, 'datetime')}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

