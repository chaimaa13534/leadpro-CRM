import { Search, Filter, ArrowUpDown, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { LEAD_STATUS_OPTIONS, LEAD_PRIORITY_OPTIONS } from '../constants';
import type {
  LeadPriority,
  LeadStatus,
  ManagedLeadsSortField,
} from '../types/lead-management.types';

export interface LeadFilterState {
  status: string;
  priority: string;
  sourceId: string;
  ownerId: string;
  companyId: string;
}

interface ManagedLeadsToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filters: LeadFilterState;
  onFiltersChange: (filters: LeadFilterState) => void;
  sort: ManagedLeadsSortField;
  order: 'asc' | 'desc';
  onSortChange: (sort: ManagedLeadsSortField) => void;
  onOrderChange: () => void;
  companyOptions: { value: string; label: string }[];
  ownerOptions: { value: string; label: string }[];
  sourceOptions: { value: string; label: string }[];
  onRefresh: () => void;
  isRefreshing: boolean;
  canCreate?: boolean;
  onAdd?: () => void;
}

const SORT_OPTIONS: { value: ManagedLeadsSortField; label: string }[] = [
  { value: 'company', label: 'Entreprise' },
  { value: 'contact', label: 'Contact' },
  { value: 'owner', label: 'Responsable' },
  { value: 'source', label: 'Source' },
  { value: 'status', label: 'Statut' },
  { value: 'priority', label: 'Priorité' },
  { value: 'estimated_value', label: 'Valeur estimée' },
  { value: 'created_at', label: 'Créé le' },
  { value: 'updated_at', label: 'Mis à jour' },
];

/**
 * Barre d'outils : recherche, filtres (statut, priorité, source,
 * entreprise, responsable), tri, actualisation et bouton "Ajouter un lead"
 * (conditionné par permissions).
 */
export function ManagedLeadsToolbar({
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
  sourceOptions,
  onRefresh,
  isRefreshing,
  canCreate = false,
  onAdd,
}: ManagedLeadsToolbarProps) {
  const setFilter = (key: keyof LeadFilterState, value: string) =>
    onFiltersChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <Input
            placeholder="Rechercher un lead (entreprise, contact…)…"
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
              aria-label="Ajouter un lead"
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
          value={filters.status}
          onChange={(e) => setFilter('status', e.target.value)}
          options={[
            { value: '', label: 'Tous les statuts' },
            ...LEAD_STATUS_OPTIONS.map((o) => ({
              value: o.value as string,
              label: o.label,
            })),
          ]}
          aria-label="Filtrer par statut"
          className="md:max-w-40"
        />

        <Select
          value={filters.priority}
          onChange={(e) => setFilter('priority', e.target.value)}
          options={[
            { value: '', label: 'Toutes priorités' },
            ...LEAD_PRIORITY_OPTIONS.map((o) => ({
              value: o.value as string,
              label: o.label,
            })),
          ]}
          aria-label="Filtrer par priorité"
          className="md:max-w-40"
        />

        <Select
          value={filters.sourceId}
          onChange={(e) => setFilter('sourceId', e.target.value)}
          options={[
            { value: '', label: 'Toutes sources' },
            ...sourceOptions,
          ]}
          aria-label="Filtrer par source"
          className="md:max-w-40"
        />

        <Select
          value={filters.companyId}
          onChange={(e) => setFilter('companyId', e.target.value)}
          options={[
            { value: '', label: 'Toutes entreprises' },
            ...companyOptions,
          ]}
          aria-label="Filtrer par entreprise"
          className="md:max-w-44"
        />

        <Select
          value={filters.ownerId}
          onChange={(e) => setFilter('ownerId', e.target.value)}
          options={[
            { value: '', label: 'Tous responsables' },
            ...ownerOptions,
          ]}
          aria-label="Filtrer par responsable"
          className="md:max-w-44"
        />

        <div className="md:ml-auto flex items-center gap-2">
          <Select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as ManagedLeadsSortField)}
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
