import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icons } from '@/components/ui/icons';
import { getActivitiesForLead } from '@/features/leads/mocks/activities.mock';
import { formatDate } from '@/utils/formatDate';
import type { Lead } from '@/types/lead.types';
import type { LeadActivityType } from '@/features/leads/types';

export interface LeadActivitiesProps {
  lead: Lead;
}

const ACTIVITY_ICONS: Record<LeadActivityType, typeof Icons.success> = {
  call: Icons.phone,
  email: Icons.mail,
  task: Icons.check,
  meeting: Icons.calendar,
};

const ACTIVITY_LABELS: Record<LeadActivityType, string> = {
  call: 'Appel',
  email: 'Email',
  task: 'Tâche',
  meeting: 'Réunion',
};

/** Onglet "Activities" : appels, emails, tâches, réunions liés au lead. */
export function LeadActivities({ lead }: LeadActivitiesProps) {
  const activities = getActivitiesForLead(lead);

  if (activities.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<Icons.calendar className="size-6" aria-hidden="true" />}
          title="Aucune activité"
          description="Les appels, emails, tâches et réunions apparaîtront ici."
        />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activités récentes</CardTitle>
        <CardDescription>
          {activities.length} activités enregistrées
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-1">
          {activities.map((activity, index) => {
            const ActivityIcon = ACTIVITY_ICONS[activity.type];
            return (
              <motion.li
                key={activity.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.15,
                  delay: Math.min(index * 0.03, 0.3),
                }}
                className="flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors duration-150 hover:bg-muted"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300">
                  <ActivityIcon className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body text-text-primary">
                    {activity.title}
                  </p>
                  <p className="text-caption text-text-secondary">
                    {ACTIVITY_LABELS[activity.type]} · {activity.actorName}
                    {activity.durationMinutes
                      ? ` · ${activity.durationMinutes} min`
                      : ''}
                  </p>
                </div>
                <span className="shrink-0 text-caption text-text-secondary">
                  {formatDate(activity.occurredAt, 'short')}
                </span>
              </motion.li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
