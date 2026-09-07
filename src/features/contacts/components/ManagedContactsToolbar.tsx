import { Search, Filter, ArrowUpDown, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { ManagedContactsSortField } from '../types/contact-management.types';

export interface ContactFilterState {
  companyId: string;
  ownerId: string;
}

interface ManagedContactsToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filters: ContactFilterState;
  onFiltersChange: (filters: ContactFilterState) => void;
  /** Sort field key + order managed by the page. */
  sort: ManagedContactsSortField;
  order: 'asc' | 'desc';
  onSortChange: (sort: ManagedContactsSortField) => void;
  onOrderChange: () => void;
  /** Select options. */
  companyOptions: { value: string; label: string }[];
  ownerOptions: { value: string; label: string }[];
  onRefresh: () => void;
  isRefreshing: boolean;
  canCreate?: boolean;
  onAdd?: () => void;
}

const SORT_OPTIONS: { value: ManagedContactsSortField; label: string }[] = [
  { value: 'first_name', label: 'Prénom' },
  { value: 'last_name', label: 'Nom' },
  { value: 'email', label: 'Email' },
  { value: 'position', label: 'Poste' },
  { value: 'company', label: 'Entreprise' },
  { value: 'owner', label: 'Responsable' },
  { value: 'created_at', label: 'Créé le' },
  { value: 'updated_at', label: 'Mis à jour' },
];

/**
 * Barre d'outils : recherche, filtres (entreprise / responsable), tri,
 * actualisation et bouton "Ajouter un contact" (conditionné par permissions).
 */
export function ManagedContactsToolbar({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  sort,
  order,
  onSortChange,
  onOrderChange,
  companyOptions,
  ownerOptions,
  onRefresh,
  isRefreshing,
  canCreate = false,
  onAdd,
}: ManagedContactsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <Input
            placeholder="Rechercher un contact…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            aria-label="Actualiser"
            onClick={onRefresh}
            loading={isRefreshing}
            leadingIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Actualiser
          </Button>
          {canCreate && (
            <Button
              size="md"
              aria-label="Ajouter un contact"
              onClick={onAdd}
              leadingIcon={<Plus className="h-4 w-4" />}
            >
              Ajouter
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-3 md:flex-row md:items-center md:flex-wrap">
        <div className="flex items-center gap-2 text-text-tertiary">
          <Filter className="h-4 w-4" aria-hidden="true" />
          <span className="text-[12px] font-medium">Filtres</span>
        </div>

        <Select
          value={filters.companyId}
          onChange={(e) =>
            onFiltersChange({ ...filters, companyId: e.target.value })
          }
          options={[
            { value: '', label: 'Toutes les entreprises' },
            ...companyOptions,
          ]}
          aria-label="Filtrer par entreprise"
          className="md:max-w-48"
        />

        <Select
          value={filters.ownerId}
          onChange={(e) =>
            onFiltersChange({ ...filters, ownerId: e.target.value })
          }
          options={[
            { value: '', label: 'Tous les responsables' },
            ...ownerOptions,
          ]}
          aria-label="Filtrer par responsable"
          className="md:max-w-48"
        />

        <div className="md:ml-auto flex items-center gap-2">
          <Select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as ManagedContactsSortField)}
            options={SORT_OPTIONS}
            aria-label="Trier par"
            leftIcon={<ArrowUpDown className="h-3.5 w-3.5" />}
          />
          <Button
            variant="outline"
            size="md"
            onClick={onOrderChange}
            aria-label="Inverser le tri"
          >
            {order === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>
    </div>
  );
}
