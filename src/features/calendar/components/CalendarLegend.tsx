import { memo } from 'react';
import type { EventType } from '@/types/calendar.types';
import { EVENT_COLORS } from '@/features/calendar/mocks/calendar.mock';
import { Card, CardContent } from '@/components/ui/Card';

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

function CalendarLegendComponent() {
  const types = Object.keys(typeLabels) as EventType[];

  return (
    <Card variant="outlined" padding="sm">
      <CardContent className="p-3">
        <h4 className="mb-2 text-[12px] font-semibold text-text-primary">Légende</h4>
        <div className="flex flex-col gap-1.5">
          {types.map((type) => (
            <div key={type} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: EVENT_COLORS[type] }}
                aria-hidden="true"
              />
              <span className="text-[12px] text-text-secondary">{typeLabels[type]}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export const CalendarLegend = memo(CalendarLegendComponent);

