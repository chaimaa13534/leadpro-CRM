import { memo } from 'react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/ui/icons';
import type { EventType, EventPriority, CalendarFilters as CalendarFiltersType } from '@/types/calendar.types';
import type { ID } from '@/types/common.types';
import { calendarDataService } from '@/features/calendar/services/calendar.service';

interface CalendarFiltersProps {
  filters: CalendarFiltersType;
  onOwnerChange: (ownerId: ID | null) => void;
  onTypeChange: (type: EventType | null) => void;
  onPriorityChange: (priority: EventPriority | null) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const eventTypeOptions = [
  { value: '', label: 'Tous les types' },
  { value: 'meeting', label: 'Réunion' },
  { value: 'call', label: 'Appel' },
  { value: 'demo', label: 'Démo' },
  { value: 'appointment', label: 'RDV' },
  { value: 'reminder', label: 'Rappel' },
  { value: 'deadline', label: 'Échéance' },
  { value: 'lunch', label: 'Déjeuner' },
];

const priorityOptions = [
  { value: '', label: 'Toutes priorités' },
  { value: 'critical', label: 'Critique' },
  { value: 'high', label: 'Haute' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'low', label: 'Basse' },
];

function CalendarFiltersComponent({ filters, onOwnerChange, onTypeChange, onPriorityChange, onReset, hasActiveFilters }: CalendarFiltersProps) {
  const users = calendarDataService.getUsers();
  const userOptions = [
    { value: '', label: 'Tous les responsables' },
    ...users.map((u) => ({ value: u.id, label: u.name })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={filters.ownerId ?? ''}
        onChange={(e) => onOwnerChange(e.target.value || null)}
        options={userOptions}
        className="min-w-45"
        aria-label="Filtrer par responsable"
      />

      <Select
        value={filters.type ?? ''}
        onChange={(e) => onTypeChange((e.target.value || null) as EventType | null)}
        options={eventTypeOptions}
        className="min-w-37.5"
        aria-label="Filtrer par type"
      />

      <Select
        value={filters.priority ?? ''}
        onChange={(e) => onPriorityChange((e.target.value || null) as EventPriority | null)}
        options={priorityOptions}
        className="min-w-37.5"
        aria-label="Filtrer par priorité"
      />

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset} aria-label="Réinitialiser les filtres">
          <Icons.refresh className="size-3.5" aria-hidden="true" />
          Réinitialiser
        </Button>
      )}
    </div>
  );
}

export const CalendarFilters = memo(CalendarFiltersComponent);

