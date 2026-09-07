/* ═════════════════════════════════════════════════════════════════════
   Activity Center — TimelineCard
   Premium card wrapper for timeline entries
   ═════════════════════════════════════════════════════════════════════ */

import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface TimelineCardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}

export const TimelineCard = memo(function TimelineCard({
  children,
  className,
  interactive = false,
}: TimelineCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface p-4 transition-all duration-200',
        interactive && 'hover:border-border-hover hover:shadow-sm cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  );
});

