import { memo } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import type { CalendarView } from '@/types/calendar.types';

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onNewEvent: () => void;
  onNewTask: () => void;
  className?: string;
}

const viewsList: { value: CalendarView; label: string }[] = [
  { value: 'day', label: 'Jour' },
  { value: 'week', label: 'Semaine' },
  { value: 'month', label: 'Mois' },
  { value: 'agenda', label: 'Agenda' },
];

function CalendarHeaderComponent({
  currentDate,
  view,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onNewEvent,
  onNewTask,
  className,
}: CalendarHeaderProps) {
  const dateTitle = currentDate.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between', className)}
    >
      <div className="flex items-center gap-3">
        <h1 className="text-[18px] font-semibold text-text-primary">Calendrier</h1>
        <span className="hidden capitalize text-[13px] text-text-tertiary sm:inline">{dateTitle}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-lg border border-border bg-surface p-0.5">
          {viewsList.map((v) => (
            <button
              key={v.value}
              onClick={() => onViewChange(v.value)}
              className={cn(
                'px-3 py-1.5 text-[12px] font-medium rounded-md transition-all duration-150',
                view === v.value ? 'bg-accent text-text-inverse shadow-sm' : 'text-text-secondary hover:text-text-primary',
              )}
              aria-pressed={view === v.value}
              aria-label={`Vue ${v.label}`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={onPrev} aria-label="Précédent">
            <Icons.chevronLeft className="size-4" />
          </Button>
          <Button variant="ghost" size="xs" onClick={onToday}>
            Aujourd'hui
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={onNext} aria-label="Suivant">
            <Icons.chevronRight className="size-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 border-l border-border pl-2">
          <Button size="sm" onClick={onNewEvent}>
            <Icons.add className="size-4" />
            <span className="hidden sm:inline">Événement</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={onNewTask}>
            <Icons.checkCircle2 className="size-4" />
            <span className="hidden sm:inline">Tâche</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export const CalendarHeader = memo(CalendarHeaderComponent);
