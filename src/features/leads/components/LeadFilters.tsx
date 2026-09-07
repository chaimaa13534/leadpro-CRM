import { AnimatePresence, motion } from 'framer-motion';
import { useDropdown } from '@/hooks/useDropdown';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Icons } from '@/components/ui/icons';
import {
  LEAD_SOURCES,
  LEAD_STATUSES,
} from '@/lib/constants/statuses.constants';
import { usersMock } from '@/mocks/users.mock';
import type { LeadFilters as LeadFiltersState } from '@/features/leads/hooks/useLeadsTable';

export interface LeadFiltersProps {
  filters: LeadFiltersState;
  onChange: (filters: LeadFiltersState) => void;
}

const DATE_RANGE_OPTIONS: {
  value: LeadFiltersState['dateRange'];
  label: string;
}[] = [
  { value: 'all', label: 'Toutes les dates' },
  { value: '7d', label: '7 derniers jours' },
  { value: '30d', label: '30 derniers jours' },
  { value: '90d', label: '90 derniers jours' },
];

function countActiveFilters(filters: LeadFiltersState): number {
  return Object.values(filters).filter((value) => value !== 'all').length;
}

/** Panneau de filtres (Statut, Source, Responsable, Date) en popover. */
export function LeadFilters({ filters, onChange }: LeadFiltersProps) {
  const { isOpen, setIsOpen, containerRef } = useDropdown<HTMLDivElement>();
  const activeCount = countActiveFilters(filters);

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen((prev) => !prev)}
        leadingIcon={<Icons.filter className="size-4" />}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        Filtrer
        {activeCount > 0 ? (
          <span className="flex size-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-semibold text-white">
            {activeCount}
          </span>
        ) : null}
      </Button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            role="dialog"
            aria-label="Filtres des leads"
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.12, ease: [0.2, 0, 0, 1] }}
            className="absolute top-full left-0 mt-2 w-72 rounded-xl border border-border/80 bg-surface p-4 shadow-md"
            style={{ zIndex: 'var(--z-popover)' }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-caption font-medium text-text-secondary">
                  Statut
                </label>
                <Select
                  value={filters.status}
                  onChange={(event) =>
                    onChange({
                      ...filters,
                      status: event.target.value as LeadFiltersState['status'],
                    })
                  }
                >
                  <option value="all">Tous les statuts</option>
                  {Object.entries(LEAD_STATUSES).map(([value, meta]) => (
                    <option key={value} value={value}>
                      {meta.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-caption font-medium text-text-secondary">
                  Source
                </label>
                <Select
                  value={filters.source}
                  onChange={(event) =>
                    onChange({
                      ...filters,
                      source: event.target.value as LeadFiltersState['source'],
                    })
                  }
                >
                  <option value="all">Toutes les sources</option>
                  {Object.entries(LEAD_SOURCES).map(([value, meta]) => (
                    <option key={value} value={value}>
                      {meta.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-caption font-medium text-text-secondary">
                  Responsable
                </label>
                <Select
                  value={filters.ownerId}
                  onChange={(event) =>
                    onChange({ ...filters, ownerId: event.target.value })
                  }
                >
                  <option value="all">Tous les responsables</option>
                  {usersMock.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-caption font-medium text-text-secondary">
                  Date
                </label>
                <Select
                  value={filters.dateRange}
                  onChange={(event) =>
                    onChange({
                      ...filters,
                      dateRange: event.target
                        .value as LeadFiltersState['dateRange'],
                    })
                  }
                >
                  {DATE_RANGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
