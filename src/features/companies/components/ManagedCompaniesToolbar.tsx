import { Search, Filter, ArrowUpDown, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type {
  CompanyFilterOptions,
  ManagedCompaniesSortField,
} from '../types/company-management.types';

/** Filter state managed by the page for the companies toolbar. */
export interface CompanyFilterState {
  industry: string;
  country: string;
  city: string;
}

interface ManagedCompaniesToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filters: CompanyFilterState;
  onFiltersChange: (filters: CompanyFilterState) => void;
  /** Sort field key + order managed by the page. */
  sort: ManagedCompaniesSortField;
  order: 'asc' | 'desc';
  onSortChange: (sort: ManagedCompaniesSortField) => void;
  onOrderChange: () => void;
  /** Distinct filter values loaded from the API. */
  filterOptions?: CompanyFilterOptions;
  onRefresh: () => void;
  isRefreshing: boolean;
  canCreate?: boolean;
  onAdd?: () => void;
}

const SORT_OPTIONS: { value: ManagedCompaniesSortField; label: string }[] = [
  { value: 'name', label: 'Nom' },
  { value: 'industry', label: 'Secteur' },
  { value: 'city', label: 'Ville' },
  { value: 'country', label: 'Pays' },
  { value: 'owner', label: 'Responsable' },
  { value: 'created_at', label: 'Créé le' },
  { value: 'updated_at', label: 'Mis à jour' },
];

/**
 * Barre d'outils des entreprises (module piloté par l'API) : recherche,
 * filtre (secteur / pays / ville), tri, actualisation et bouton
 * "Ajouter une entreprise" (conditionné par les permissions).
 */
export function ManagedCompaniesToolbar({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  sort,
  order,
  onSortChange,
  onOrderChange,
  filterOptions,
  onRefresh,
  isRefreshing,
  canCreate = false,
  onAdd,
}: ManagedCompaniesToolbarProps) {
  const industries = filterOptions?.industries ?? [];
  const countries = filterOptions?.countries ?? [];
  const cities = filterOptions?.cities ?? [];

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <Input
            placeholder="Rechercher une entreprise…"
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
              aria-label="Ajouter une entreprise"
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
          value={filters.industry}
          onChange={(e) =>
            onFiltersChange({ ...filters, industry: e.target.value })
          }
          options={[
            { value: '', label: 'Tous les secteurs' },
            ...industries.map((i) => ({ value: i, label: i })),
          ]}
          aria-label="Filtrer par secteur"
          className="md:max-w-48"
        />

        <Select
          value={filters.country}
          onChange={(e) =>
            onFiltersChange({ ...filters, country: e.target.value })
          }
          options={[
            { value: '', label: 'Tous les pays' },
            ...countries.map((c) => ({ value: c, label: c })),
          ]}
          aria-label="Filtrer par pays"
          className="md:max-w-48"
        />

        <Select
          value={filters.city}
          onChange={(e) =>
            onFiltersChange({ ...filters, city: e.target.value })
          }
          options={[
            { value: '', label: 'Toutes les villes' },
            ...cities.map((c) => ({ value: c, label: c })),
          ]}
          aria-label="Filtrer par ville"
          className="md:max-w-48"
        />

        <div className="md:ml-auto flex items-center gap-2">
          <Select
            value={sort}
            onChange={(e) =>
              onSortChange(e.target.value as ManagedCompaniesSortField)
            }
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

