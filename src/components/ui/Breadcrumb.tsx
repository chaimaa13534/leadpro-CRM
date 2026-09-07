import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/* ═══════════════════════════════════════════════════════ */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Fil d'Ariane" className={cn('flex items-center gap-1 text-[13px]', className)}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;

        return (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-text-disabled" />
            )}
            {isLast || !item.href ? (
              <span className="font-medium text-text-primary">{item.label}</span>
            ) : (
              <Link
                to={item.href}
                className="text-text-tertiary transition-colors hover:text-text-secondary"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
