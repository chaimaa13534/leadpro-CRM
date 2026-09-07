import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { CalendarEvent, EventType } from '@/types/calendar.types';
import { cn } from '@/lib/cn';
import { Icons } from '@/components/ui/icons';
import { Badge } from '@/components/ui/Badge';
import { EVENT_COLORS } from '@/features/calendar/mocks/calendar.mock';

interface EventCardProps {
  event: CalendarEvent;
  compact?: boolean;
  onClick?: (event: CalendarEvent) => void;
  className?: string;
}

const typeLabels: Record<EventType, string> = {
  meeting: 'Réunion',
  call: 'Appel',
  demo: 'Démo',
  appointment: 'RDV',
  reminder: 'Rappel',
  deadline: 'Échéance',
  lunch: 'Déjeuner',
  other: 'Autre',
};

function EventCardComponent({ event, compact = false, onClick, className }: EventCardProps) {
  const startTime = useMemo(() => {
    try {
      const d = new Date(event.startTime);
      return d.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  }, [event.startTime]);

  const endTime = useMemo(() => {
    if (!event.endTime) return null;
    try {
      const d = new Date(event.endTime);
      return d.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return null;
    }
  }, [event.endTime]);

  const color = event.color || EVENT_COLORS.meeting;

  const typeIcon = useMemo(() => {
    const icons: Record<EventType, React.ReactNode> = {
      meeting: <Icons.userCheck className="size-3" />,
      call: <Icons.phone className="size-3" />,
      demo: <Icons.monitor className="size-3" />,
      appointment: <Icons.calendarDays className="size-3" />,
      reminder: <Icons.clock className="size-3" />,
      deadline: <Icons.flag className="size-3" />,
      lunch: <Icons.coffee className="size-3" />,
      other: <Icons.circle className="size-3" />,
    };
    return icons[event.type];
  }, [event.type]);

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onClick?.(event)}
      className={cn(
        'w-full text-left rounded-lg border border-border bg-surface p-2.5 transition-all duration-150',
        'hover:border-border-hover hover:shadow-sm',
        'focus-visible:outline-none focus-visible:shadow-ring',
        compact && 'p-1.5',
        className,
      )}
      aria-label={`${event.title} - ${startTime}`}
    >
      <div className="flex items-start gap-2">
        <div
          className="mt-0.5 shrink-0 rounded-full"
          style={{
            width: compact ? 2 : 3,
            height: compact ? 28 : 40,
            backgroundColor: color,
          }}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Icons.clock
              className="size-3 shrink-0 text-text-tertiary"
              aria-hidden="true"
            />
            <span className="text-[11px] font-medium tabular-nums text-text-tertiary">
              {startTime}
              {endTime ? ` - ${endTime}` : ''}
            </span>
          </div>
          <p
            className={cn(
              'font-medium text-text-primary leading-snug',
              compact
                ? 'text-[12px] mt-0.5'
                : 'text-[13px] mt-1',
            )}
          >
            {event.title}
          </p>
          {!compact && (
            <div className="mt-1.5 flex items-center gap-2">
              <Badge variant="neutral" size="sm">
                {typeIcon}
                <span className="ml-1">{typeLabels[event.type]}</span>
              </Badge>
              <span className="text-[11px] text-text-tertiary truncate">
                {event.ownerName}
              </span>
            </div>
          )}
          {event.location && !compact && (
            <div className="mt-1 flex items-center gap-1">
<Icons.mapPin
                className="size-3 shrink-0 text-text-tertiary"
                aria-hidden="true"
              />
              <span className="text-[11px] text-text-tertiary truncate">
                {event.location}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}

export const EventCard = memo(EventCardComponent);
