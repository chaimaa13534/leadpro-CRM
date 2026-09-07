import { memo, useMemo } from 'react';
import { cn } from '@/lib/cn';
import { Icons } from '@/components/ui/icons';
import { Card, CardContent } from '@/components/ui/Card';

interface CalendarMiniProps {
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  className?: string;
}

function CalendarMiniComponent({ currentDate, selectedDate, onDateSelect, className }: CalendarMiniProps) {
  const { year, month, days } = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const firstDay = new Date(y, m, 1).getDay(); // 0=Sun
    const daysIn = new Date(y, m + 1, 0).getDate();

    // Adjust for Monday start
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    const days: (number | null)[] = [];
    for (let i = 0; i < adjustedFirstDay; i++) days.push(null);
    for (let i = 1; i <= daysIn; i++) days.push(i);

    return { year: y, month: m, days };
  }, [currentDate]);

  const monthName = useMemo(
    () => currentDate.toLocaleDateString('fr-FR', { month: 'long' }),
    [currentDate],
  );

  const isToday = (day: number) => {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  const isSelected = (day: number) => {
    return selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === day;
  };

  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  return (
    <Card variant="outlined" padding="md" className={className}>
      <CardContent className="p-3">
        {/* Month header */}
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-[13px] font-semibold text-text-primary capitalize">
            {monthName} {year}
          </h4>
          <div className="flex items-center gap-0.5">
            <button
              className="flex h-6 w-6 items-center justify-center rounded-md text-text-tertiary hover:bg-surface-hover hover:text-text-secondary transition-colors"
              aria-label="Mois précédent"
            >
              <Icons.chevronLeft className="size-3.5" />
            </button>
            <button
              className="flex h-6 w-6 items-center justify-center rounded-md text-text-tertiary hover:bg-surface-hover hover:text-text-secondary transition-colors"
              aria-label="Mois suivant"
            >
              <Icons.chevronRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="mb-1 grid grid-cols-7 gap-0">
          {weekDays.map((d) => (
            <div key={d} className="py-1 text-center text-[10px] font-medium text-text-tertiary">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-0">
          {days.map((day, idx) => (
            <div key={idx} className="flex items-center justify-center py-0.5">
              {day !== null ? (
                <button
                  onClick={() => onDateSelect(new Date(year, month, day))}
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-medium transition-colors',
                    'hover:bg-surface-hover hover:text-text-primary',
                    isSelected(day) && 'bg-accent text-text-inverse hover:bg-accent-hover',
                    isToday(day) && !isSelected(day) && 'border border-accent text-accent',
                    !isSelected(day) && !isToday(day) && 'text-text-secondary',
                  )}
                  aria-label={`${day} ${monthName} ${year}`}
                  aria-current={isToday(day) ? 'date' : undefined}
                >
                  {day}
                </button>
              ) : (
                <div className="h-7 w-7" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export const CalendarMini = memo(CalendarMiniComponent);

