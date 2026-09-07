/* ═════════════════════════════════════════════════════════════════════
   Activity Center — TimelineGroup
   Groups activities by date with a date header
   ═════════════════════════════════════════════════════════════════════ */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { TimelineDate } from './TimelineDate';
import { ActivityItem } from './ActivityItem';
import { staggerContainer } from '@/lib/motion-variants';
import type { ActivityGroup } from '@/types/activity.types';

interface TimelineGroupProps {
  group: ActivityGroup;
}

export const TimelineGroup = memo(function TimelineGroup({
  group,
}: TimelineGroupProps) {
  return (
    <div className="space-y-2">
      <TimelineDate
        label={group.label}
        count={group.activities.length}
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-1"
      >
        {group.activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </motion.div>
    </div>
  );
});

