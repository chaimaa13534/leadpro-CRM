import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/* ═══════════════════════════════════════════════════════ */
export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      className={cn('flex items-center gap-1', className)}
      aria-label="Pagination"
    >
      <PaginationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Page précédente"
      >
        <ChevronLeft className="h-4 w-4" />
      </PaginationButton>

      {pages.map((page, i) =>
        page === '...' ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-8 w-8 items-center justify-center text-[13px] text-text-tertiary"
          >
            <MoreHorizontal className="h-4 w-4" />
          </span>
        ) : (
          <PaginationButton
            key={page}
            onClick={() => onPageChange(page as number)}
            active={page === currentPage}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </PaginationButton>
        )
      )}

      <PaginationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Page suivante"
      >
        <ChevronRight className="h-4 w-4" />
      </PaginationButton>
    </nav>
  );
}

/* ── Page button ── */
function PaginationButton({
  children,
  active = false,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={cn(
        'flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[13px] font-medium transition-all duration-150',
        active
          ? 'bg-accent text-text-inverse shadow-sm ring-1 ring-accent/30'
          : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary hover:border-border-hover',
        'disabled:pointer-events-none disabled:opacity-40',
        'border border-border/50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ── Compute visible page numbers with ellipsis ── */
function getVisiblePages(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '...')[] = [1];

  if (current > 3) pages.push('...');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('...');

  pages.push(total);

  return pages;
}
