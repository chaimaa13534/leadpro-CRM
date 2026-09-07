import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

/* ═══════════════════════════════════════════════════════ */
export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-x-auto rounded-xl border border-border bg-surface', className)}>
      <table className="w-full text-left">{children}</table>
    </div>
  );
}

export function TableHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <thead className={cn('border-b border-border bg-background-secondary/50', className)}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className }: { children: ReactNode; className?: string }) {
  return <tbody className={cn('divide-y divide-border', className)}>{children}</tbody>;
}

export function TableRow({ children, className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'group transition-colors hover:bg-surface-hover',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary whitespace-nowrap',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn('px-4 py-3.5 text-[13px] text-text-secondary whitespace-nowrap', className)}
      {...props}
    >
      {children}
    </td>
  );
}
