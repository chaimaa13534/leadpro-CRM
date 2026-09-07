import { AnimatePresence, motion } from 'framer-motion';
import { useDropdown } from '@/hooks/useDropdown';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Icons } from '@/components/ui/icons';
import { usersMock } from '@/mocks/users.mock';
import type { ContactFilters as ContactFiltersState } from '@/features/contacts/hooks/useContactsTable';

export interface ContactFiltersProps {
  filters: ContactFiltersState;
  onChange: (filters: ContactFiltersState) => void;
  companies: string[];
  cities: string[];
  countries: string[];
}

const DATE_RANGE_OPTIONS: {
  value: ContactFiltersState['dateRange'];
  label: string;
}[] = [
  { value: 'all', label: 'Toutes les dates' },
  { value: '7d', label: '7 derniers jours' },
  { value: '30d', label: '30 derniers jours' },
  { value: '90d', label: '90 derniers jours' },
];

function countActiveFilters(filters: ContactFiltersState): number {
  let count = 0;
  if (filters.company) count++;
  if (filters.city) count++;
  if (filters.country) count++;
  if (filters.status !== 'all') count++;
  if (filters.ownerId !== 'all') count++;
  if (filters.dateRange !== 'all') count++;
  return count;
}

export function ContactFilters({
  filters,
  onChange,
  companies,
  cities,
  countries,
}: ContactFiltersProps) {
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
            aria-label="Filtres des contacts"
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
                  Entreprise
                </label>
                <Select
                  value={filters.company}
                  onChange={(event) =>
                    onChange({ ...filters, company: event.target.value })
                  }
                >
                  <option value="">Toutes les entreprises</option>
                  {companies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-caption font-medium text-text-secondary">
                  Ville
                </label>
                <Select
                  value={filters.city}
                  onChange={(event) =>
                    onChange({ ...filters, city: event.target.value })
                  }
                >
                  <option value="">Toutes les villes</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-caption font-medium text-text-secondary">
                  Pays
                </label>
                <Select
                  value={filters.country}
                  onChange={(event) =>
                    onChange({ ...filters, country: event.target.value })
                  }
                >
                  <option value="">Tous les pays</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-caption font-medium text-text-secondary">
                  Statut
                </label>
                <Select
                  value={filters.status}
                  onChange={(event) =>
                    onChange({
                      ...filters,
                      status: event.target.value as ContactFiltersState['status'],
                    })
                  }
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="vip">VIP</option>
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
                        .value as ContactFiltersState['dateRange'],
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

