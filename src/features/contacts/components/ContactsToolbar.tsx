import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/ui/icons';
import { ContactSearch } from '@/features/contacts/components/ContactSearch';
import { ContactFilters } from '@/features/contacts/components/ContactFilters';
import { ContactSort } from '@/features/contacts/components/ContactSort';
import type {
  ContactFilters as ContactFiltersState,
  ContactSortState,
} from '@/features/contacts/hooks/useContactsTable';

export interface ContactsToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  resetKey: number;
  filters: ContactFiltersState;
  onFiltersChange: (filters: ContactFiltersState) => void;
  sort: ContactSortState;
  onSortChange: (sort: ContactSortState) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  companies: string[];
  cities: string[];
  countries: string[];
}

export function ContactsToolbar({
  searchQuery,
  onSearchChange,
  resetKey,
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  onRefresh,
  isRefreshing,
  companies,
  cities,
  countries,
}: ContactsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <ContactSearch
          key={resetKey}
          value={searchQuery}
          onChange={onSearchChange}
        />
        <ContactFilters
          filters={filters}
          onChange={onFiltersChange}
          companies={companies}
          cities={cities}
          countries={countries}
        />
        <div className="h-6 w-px bg-border/60" aria-hidden="true" />
        <ContactSort sort={sort} onChange={onSortChange} />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          aria-label="Actualiser la liste"
          onClick={onRefresh}
          isLoading={isRefreshing}
          leadingIcon={<Icons.refresh className="size-3.5" />}
        >
          Actualiser
        </Button>
      </div>
    </div>
  );
}

