import { motion } from 'framer-motion';
import { Icons } from '@/components/ui/icons';
import { formatDate } from '@/utils/formatDate';
import type { TimelineEvent, TimelineEventType } from '@/features/leads/types';

export interface LeadTimelineItemProps {
  event: TimelineEvent;
  index: number;
  /** Dernier élément de la liste : masque le connecteur vertical. */
  isLast: boolean;
}

const EVENT_ICONS: Record<TimelineEventType, typeof Icons.success> = {
  created: Icons.leads,
  call: Icons.phone,
  email: Icons.mail,
  meeting: Icons.calendar,
  note: Icons.note,
  status_change: Icons.statusChange,
};

/** Un événement de la timeline, avec connecteur vertical vers le suivant. */
export function LeadTimelineItem({
  event,
  index,
  isLast,
}: LeadTimelineItemProps) {
  const EventIcon = EVENT_ICONS[event.type];

  return (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.04, 0.4) }}
      className="relative flex gap-4 pb-6"
    >
      {!isLast ? (
        <span
          className="absolute top-9 left-[15px] w-px bg-border"
          style={{ height: 'calc(100% - 2rem)' }}
          aria-hidden="true"
        />
      ) : null}

      <span className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600 ring-4 ring-surface dark:bg-primary-900/40 dark:text-primary-300">
        <EventIcon className="size-4" aria-hidden="true" />
      </span>

      <div className="flex-1 pt-1">
        <p className="text-body font-medium text-text-primary">{event.title}</p>
        {event.description ? (
          <p className="mt-0.5 text-body text-text-secondary">
            {event.description}
          </p>
        ) : null}
        <p className="mt-1 text-caption text-text-secondary">
          {event.actorName} · {formatDate(event.occurredAt, 'datetime')}
        </p>
      </div>
    </motion.li>
  );
}
