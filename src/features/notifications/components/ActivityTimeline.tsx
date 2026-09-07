/* ═════════════════════════════════════════════════════════════════════
   Activity Center — ActivityTimeline
   Professional timeline container comparable to HubSpot
   ═════════════════════════════════════════════════════════════════════ */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { History, Inbox } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { TimelineGroup } from './TimelineGroup';
import { fadeVariants } from '@/lib/motion-variants';
import type { ActivityGroup } from '@/types/activity.types';

interface ActivityTimelineProps {
  groups: ActivityGroup[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

function TimelineSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="size-2.5 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="space-y-2 pl-6">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex gap-3">
                <Skeleton className="size-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export const ActivityTimeline = memo(function ActivityTimeline({
  groups,
  loading,
  error,
  page,
  totalPages,
  total,
  onPageChange,
}: ActivityTimelineProps) {
  if (loading) {
    return <TimelineSkeleton />;
  }

  if (error) {
    return (
      <EmptyState
        icon={History}
        title="Erreur de chargement"
        description={error}
        action={{ label: 'Réessayer', onClick: () => window.location.reload() }}
      />
    );
  }

  if (groups.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Aucune activité"
        description="Aucune activité récente n'a été trouvée. Les activités CRM apparaîtront ici."
      />
    );
  }

  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="space-y-6">
        {groups.map((group) => (
          <TimelineGroup key={group.date} group={group} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="text-[12px] text-text-tertiary tabular-nums">
            {total} activité{total > 1 ? 's' : ''} au total
          </p>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </motion.div>
  );
});

