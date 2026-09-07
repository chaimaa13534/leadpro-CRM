import { motion } from 'framer-motion';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Icons } from '@/components/ui/icons';
import { activitiesMock } from '@/mocks/activities.mock';
import type { ActivityType } from '@/types/activity.types';
import { formatDate } from '@/utils/formatDate';
import { getInitials } from '@/utils/getInitials';

const ACTIVITY_ICONS: Record<ActivityType, typeof Icons.success> = {
  lead_created: Icons.leads,
  contact_updated: Icons.user,
  opportunity_won: Icons.success,
  meeting_completed: Icons.calendar,
};

/** Fil des dernières activités de l'équipe commerciale. */
export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activités récentes</CardTitle>
        <CardDescription>Dernières actions de l'équipe</CardDescription>
      </CardHeader>
      <ul className="flex flex-col px-2 pb-2">
        {activitiesMock.map((activity, index) => {
          const ActivityIcon = ACTIVITY_ICONS[activity.type];

          return (
            <motion.li
              key={activity.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              className="flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors duration-150 hover:bg-muted"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-caption font-semibold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
                {getInitials(activity.actorName)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-body text-text-primary">
                  <span className="font-medium">{activity.actorName}</span>{' '}
                  {activity.description}
                </p>
                <p className="text-caption text-text-secondary">
                  {formatDate(activity.occurredAt, 'datetime')}
                </p>
              </div>
              <ActivityIcon
                className="mt-0.5 size-4 shrink-0 text-text-secondary"
                aria-hidden="true"
              />
            </motion.li>
          );
        })}
      </ul>
    </Card>
  );
}
