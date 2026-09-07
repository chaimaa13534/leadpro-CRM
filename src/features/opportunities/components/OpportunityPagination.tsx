import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Icons } from '@/components/ui/icons';
import { PAGE_SIZE_OPTIONS } from '@/lib/constants/pagination.constants';

export interface OpportunityPaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function OpportunityPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: OpportunityPaginationProps) {
  const rangeStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 px-4 py-3 tablet:flex-row tablet:items-center tablet:justify-between">
      <div className="flex items-center gap-3 text-caption text-text-secondary">
        <span>
          <span className="font-medium text-text-primary">{rangeStart}</span>
          &ndash;{rangeEnd} sur{' '}
          <span className="font-medium text-text-primary">
            {totalItems}
          </span>
        </span>
        <Select
          aria-label="Éléments par page"
          value={String(pageSize)}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          options={PAGE_SIZE_OPTIONS.map((size) => ({
            label: `${size} / page`,
            value: String(size),
          }))}
          className="h-8 w-auto border-border/60 text-caption"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          aria-label="Page précédente"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          leadingIcon={<Icons.chevronLeft className="size-3.5" />}
        >
          Précédent
        </Button>
        <span className="text-caption tabular-nums text-text-secondary/60">
          {page}/{totalPages}
        </span>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Page suivante"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          trailingIcon={<Icons.chevronRight className="size-3.5" />}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}

