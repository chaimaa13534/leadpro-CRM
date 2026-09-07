/* ═════════════════════════════════════════════════════════════════════
   Activity Center — TimelineDate
   Date separator for the activity timeline
   ═════════════════════════════════════════════════════════════════════ */

import { memo } from 'react';
import { cn } from '@/lib/cn';

interface TimelineDateProps {
  label: string;
  count: number;
  className?: string;
}

export const TimelineDate = memo(function TimelineDate({
  label,
  count,
  className,
}: TimelineDateProps) {
  return (
    <div className={cn('flex items-center gap-3 py-2', className)}>
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full border-2 border-accent bg-accent/20 shrink-0" />
        <h3 className="text-[13px] font-semibold text-text-primary">{label}</h3>
      </div>
      <div className="h-px flex-1 bg-border/50" />
      <span className="text-[11px] font-medium tabular-nums text-text-tertiary">
        {count} activité{count > 1 ? 's' : ''}
      </span>
    </div>
  );
});

