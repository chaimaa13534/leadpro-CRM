/* ═════════════════════════════════════════════════════════════════════
   Notifications — NotificationFilters
   Filter bar: type, user, date, priority, status, module
   ═════════════════════════════════════════════════════════════════════ */

import { memo } from 'react';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';
import type { NotificationFilter, NotificationType, NotificationPriority, NotificationModule, NotificationStatus } from '@/types/notification.types';
import { NOTIFICATION_TYPES, NOTIFICATION_PRIORITIES, NOTIFICATION_MODULES } from '@/types/notification.types';

interface NotificationFiltersProps {
  filters: Partial<NotificationFilter>;
  onFilterChange: <K extends keyof NotificationFilter>(key: K, value: NotificationFilter[K]) => void;
  onReset: () => void;
  className?: string;
}

const typeOptions = [
  { label: 'Tous les types', value: 'all' },
  ...NOTIFICATION_TYPES.map((t) => ({
    label: t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    value: t,
  })),
];

const moduleOptions = [
  { label: 'Tous les modules', value: 'all' },
  ...NOTIFICATION_MODULES.map((m) => ({ label: m.charAt(0).toUpperCase() + m.slice(1), value: m })),
];

const priorityOptions = [
  { label: 'Toutes les priorités', value: 'all' },
  ...NOTIFICATION_PRIORITIES.map((p) => ({
    label: p.charAt(0).toUpperCase() + p.slice(1),
    value: p,
  })),
];

const statusOptions = [
  { label: 'Tous les statuts', value: 'all' },
  { label: 'Non lu', value: 'unread' },
  { label: 'Lu', value: 'read' },
  { label: 'Archivé', value: 'archived' },
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

function countActiveFilters(filters: Partial<NotificationFilter>): number {
  let count = 0;
  if (filters.type && filters.type !== 'all') count++;
  if (filters.module && filters.module !== 'all') count++;
  if (filters.priority && filters.priority !== 'all') count++;
  if (filters.status && filters.status !== 'all') count++;
  if (filters.userId && filters.userId !== 'all') count++;
  if (filters.searchQuery) count++;
  return count;
}

export const NotificationFilters = memo(function NotificationFilters({
  filters,
  onFilterChange,
  onReset,
  className,
}: NotificationFiltersProps) {
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          <Select
            value={filters.type ?? 'all'}
            onChange={(e) => onFilterChange('type', e.target.value as NotificationType | 'all')}
            options={typeOptions}
            placeholder="Type"
            aria-label="Type de notification"
          />
          <Select
            value={filters.module ?? 'all'}
            onChange={(e) => onFilterChange('module', e.target.value as NotificationModule | 'all')}
            options={moduleOptions}
            placeholder="Module"
            aria-label="Module"
          />
          <Select
            value={filters.priority ?? 'all'}
            onChange={(e) => onFilterChange('priority', e.target.value as NotificationPriority | 'all')}
            options={priorityOptions}
            placeholder="Priorité"
            aria-label="Priorité"
          />
          <Select
            value={filters.status ?? 'all'}
            onChange={(e) => onFilterChange('status', e.target.value as NotificationStatus | 'all')}
            options={statusOptions}
            placeholder="Statut"
            aria-label="Statut"
          />
          <Select
            value={filters.userId ?? 'all'}
            onChange={(e) => onFilterChange('userId', e.target.value)}
            options={userOptions}
            placeholder="Utilisateur"
            aria-label="Utilisateur"
          />
        </div>
      </CardContent>
    </Card>
  );
});

