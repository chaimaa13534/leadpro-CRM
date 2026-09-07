/* ═════════════════════════════════════════════════════════════════════
   Notifications — NotificationBadge
   Animated badge with count display
   ═════════════════════════════════════════════════════════════════════ */

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';

interface NotificationBadgeProps {
  count: number;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'min-w-[14px] h-[14px] text-[9px] px-1',
  md: 'min-w-[18px] h-[18px] text-[10px] px-1.5',
  lg: 'min-w-[22px] h-[22px] text-[11px] px-2',
} as const;

export function NotificationBadge({
  count,
  size = 'md',
  dot = false,
  className,
}: NotificationBadgeProps) {
  if (dot && count === 0) return null;

  if (dot) {
    return (
      <span
        className={cn(
          'absolute right-1 top-1 h-2 w-2 rounded-full bg-accent ring-2 ring-surface',
          className,
        )}
        aria-label="Notifications non lues"
      />
    );
  }

  return (
    <AnimatePresence mode="wait">
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 25,
          }}
          className={cn(
            'inline-flex items-center justify-center rounded-full bg-danger-500 font-semibold text-white',
            sizeStyles[size],
            className,
          )}
          aria-label={`${count} notification${count > 1 ? 's' : ''} non lue${count > 1 ? 's' : ''}`}
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

