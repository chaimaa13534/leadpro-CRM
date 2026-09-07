import { memo } from 'react';
import type { LucideIcon } from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import { Icons } from '@/components/ui/icons';
import type { CalendarKPI } from '@/types/calendar.types';
import { cn } from '@/lib/cn';

interface CalendarKPIsProps {
  kpis: CalendarKPI[];
  loading?: boolean;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  calendar: Icons.calendar,
  users: Icons.userCheck,
  checkCircle2: Icons.checkCircle2,
  alertTriangle: Icons.alertTriangle,
  clock: Icons.clock,
};

function CalendarKPIsComponent({ kpis, loading = false, className }: CalendarKPIsProps) {
  if (loading) {
    return (
      <div className={cn('grid grid-cols-2 gap-3 lg:grid-cols-5', className)}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-[120px] animate-pulse rounded-xl bg-background-tertiary"
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-2 gap-3 lg:grid-cols-5', className)}>
      {kpis.map((kpi) => {
        const Icon = iconMap[kpi.icon] ?? Icons.calendar;
        return (
          <KPICard
            key={kpi.id}
            icon={Icon}
            label={kpi.label}
            value={kpi.value}
            description={kpi.description}
            change={kpi.change}
          />
        );
      })}
    </div>
  );
}

export const CalendarKPIs = memo(CalendarKPIsComponent);

