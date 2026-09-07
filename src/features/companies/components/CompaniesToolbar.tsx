import { Search, Filter, ArrowUpDown, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type {
  ManagedCompaniesQuery,
  CompanyFilterOptions,
} from '../types/company-management.types';
import type {
  CompanyFilters,
  CompanySortState as HookCompanySortState,
} from '@/features/companies/hooks/useCompaniesTable';

interface CompaniesToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filters: CompanyFilters;
  onFiltersChange: (filters: CompanyFilters) => void;
  sort: HookCompanySortState;
  onSortChange: (sort: HookCompanySortState) => void;
  filterOptions?: CompanyFilterOptions;
  industries?: string[];
  cities?: string[];
  countries?: string[];
  onRefresh: () => void;
  isRefreshing: boolean;
  canCreate?: boolean;
  onAdd?: () => void;
}

const SORT_OPTIONS = [
  { value: 'name', label: 'Nom' },
  { value: 'industry', label: 'Secteur' },
  { value: 'city', label: 'Ville' },
  { value: 'country', label: 'Pays' },
  { value: 'created_at', label: 'Créé le' },
  { value: 'updated_at', label: 'Mis à jour' },
  { value: 'owner', label: 'Responsable' },
];

/**
 * Barre d'outils : recherche, filtres, tri, actualisation et bouton
 * "Ajouter une entreprise" (conditionné par les permissions).
 */
export function CompaniesToolbar({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  filterOptions,
  industries = [],
  cities = [],
  countries = [],
  onRefresh,
  isRefreshing,
  canCreate = false,
  onAdd,
}: CompaniesToolbarProps) {
  const resolvedFilterOptions: CompanyFilterOptions = {
    industries: filterOptions?.industries ?? industries,
    cities: filterOptions?.cities ?? cities,
    countries: filterOptions?.countries ?? countries,
  };

  const currentIndustry = filters.industry ?? '';
  const currentCountry = filters.country ?? '';
  const currentCity = filters.city ?? '';
  const currentSortValue =
    sort && 'sort' in sort && typeof sort.sort === 'string'
      ? sort.sort
      : sort && 'field' in sort && typeof sort.field === 'string'
        ? sort.field
        : 'name';
  const currentOrder = sort && 'order' in sort && sort.order ? sort.order : 'asc';

  const handleSortChange = (value: string) => {
    if ('field' in sort) {
      onSortChange({
        ...(sort as HookCompanySortState),
        field: value as HookCompanySortState['field'],
        order: currentOrder,
      });
      return;
    }

    onSortChange({
      ...(sort as HookCompanySortState),
      field: value as HookCompanySortState['field'],
      order: currentOrder,
    });
  };

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
          value={currentIndustry}
          onChange={(e) =>
            onFiltersChange({ ...filters, industry: e.target.value })
          }
          options={[
            { value: '', label: 'Tous les secteurs' },
            ...resolvedFilterOptions.industries.map((i) => ({ value: i, label: i })),
          ]}
          aria-label="Filtrer par secteur"
          className="md:max-w-45"
        />

        <Select
          value={currentCountry}
          onChange={(e) =>
            onFiltersChange({ ...filters, country: e.target.value })
          }
          options={[
            { value: '', label: 'Tous les pays' },
            ...resolvedFilterOptions.countries.map((c) => ({ value: c, label: c })),
          ]}
          aria-label="Filtrer par pays"
          className="md:max-w-45"
        />

        <Select
          value={currentCity}
          onChange={(e) =>
            onFiltersChange({ ...filters, city: e.target.value })
          }
          options={[
            { value: '', label: 'Toutes les villes' },
            ...resolvedFilterOptions.cities.map((c) => ({ value: c, label: c })),
          ]}
          aria-label="Filtrer par ville"
          className="md:max-w-45"
        />

        <div className="md:ml-auto flex items-center gap-2">
          <Select
            value={currentSortValue}
            onChange={(e) => handleSortChange(e.target.value)}
            options={SORT_OPTIONS}
            aria-label="Trier par"
            leftIcon={<ArrowUpDown className="h-3.5 w-3.5" />}
          />
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              const nextOrder = currentOrder === 'asc' ? 'desc' : 'asc';

              onSortChange({
                ...(sort as HookCompanySortState),
                field: currentSortValue as HookCompanySortState['field'],
                order: nextOrder,
              });
            }}
            aria-label="Inverser le tri"
          >
            {currentOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>
    </div>
  );
}
