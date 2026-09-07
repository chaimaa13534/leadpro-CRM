/* ═════════════════════════════════════════════════════════════════════
   Activity Center — ActivityFilters
   Filter bar: type, user, date, module
   ═════════════════════════════════════════════════════════════════════ */

import { memo } from 'react';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';
import type { ActivityFilter, ActivityType, ActivityModule } from '@/types/activity.types';
import { ACTIVITY_TYPES, ACTIVITY_MODULES } from '@/types/activity.types';

interface ActivityFiltersProps {
  filters: Partial<ActivityFilter>;
  onFilterChange: <K extends keyof ActivityFilter>(key: K, value: ActivityFilter[K]) => void;
  onReset: () => void;
  className?: string;
}

const typeOptions = [
  { label: 'Tous les types', value: 'all' },
  ...ACTIVITY_TYPES.map((t) => ({
    label: t
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    value: t,
  })),
];

const moduleOptions = [
  { label: 'Tous les modules', value: 'all' },
  ...ACTIVITY_MODULES.map((m) => ({
    label: m.charAt(0).toUpperCase() + m.slice(1),
    value: m,
  })),
];

const userOptions = [
  { label: 'Tous les utilisateurs', value: 'all' },
  { label: 'Alex Martin', value: 'user-1' },
  { label: 'Sara Idrissi', value: 'user-2' },
  { label: 'Yassine Bennani', value: 'user-3' },
  { label: 'Omar Chraibi', value: 'user-4' },
  { label: 'Leila Kabiri', value: 'user-5' },
  { label: 'Mehdi Touati', value: 'user-6' },
  { label: 'Mounia Ouazzani', value: 'user-7' },
  { label: 'Karim Benali', value: 'user-8' },
];

function countActiveFilters(filters: Partial<ActivityFilter>): number {
  let count = 0;
  if (filters.type && filters.type !== 'all') count++;
  if (filters.module && filters.module !== 'all') count++;
  if (filters.actorId && filters.actorId !== 'all') count++;
  if (filters.searchQuery) count++;
  return count;
}

export const ActivityFilters = memo(function ActivityFilters({
  filters,
  onFilterChange,
  onReset,
  className,
}: ActivityFiltersProps) {
  const activeCount = countActiveFilters(filters);

  return (
    <Card variant="outlined" className={cn('', className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-text-tertiary" />
            <span className="text-[13px] font-medium text-text-primary">Filtres</span>
            {activeCount > 0 && (
              <Badge variant="primary" size="sm">
                {activeCount} actif{activeCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          {activeCount > 0 && (
            <Button variant="ghost" size="xs" onClick={onReset} aria-label="Réinitialiser les filtres">
              <X className="size-3" />
              Réinitialiser
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <Select
            value={filters.type ?? 'all'}
            onChange={(e) => onFilterChange('type', e.target.value as ActivityType | 'all')}
            options={typeOptions}
            placeholder="Type d'activité"
            aria-label="Type d'activité"
          />
          <Select
            value={filters.module ?? 'all'}
            onChange={(e) => onFilterChange('module', e.target.value as ActivityModule | 'all')}
            options={moduleOptions}
            placeholder="Module"
            aria-label="Module"
          />
          <Select
            value={filters.actorId ?? 'all'}
            onChange={(e) => onFilterChange('actorId', e.target.value)}
            options={userOptions}
            placeholder="Utilisateur"
            aria-label="Utilisateur"
          />
        </div>
      </CardContent>
    </Card>
  );
});

