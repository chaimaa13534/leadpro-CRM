import { cn } from '@/lib/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rect' | 'rounded';
}

/* ═══════════════════════════════════════════════════════ */
export function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-shimmer bg-skeleton',
        variant === 'text' && 'h-4 rounded-md',
        variant === 'circle' && 'rounded-full',
        variant === 'rect' && 'rounded-none',
        variant === 'rounded' && 'rounded-lg',
        className
      )}
      aria-hidden="true"
    />
  );
}

/* ── Prebuilt skeleton patterns ── */

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(i === lines - 1 && 'w-2/3')}
        />
      ))}
    </div>
  );
}

export function SkeletonRow({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Skeleton variant="circle" className="h-8 w-8 shrink-0" />
      <div className="flex-1 flex flex-col gap-1.5">
        <Skeleton className="h-3.5 w-1/3" />
        <Skeleton className="h-3 w-1/5" />
      </div>
      <Skeleton className="h-6 w-16 rounded-md" />
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl border border-border bg-surface p-5', className)}>
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton variant="circle" className="h-5 w-5" />
      </div>
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-border bg-surface overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border px-5 py-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16 ml-auto" />
      </div>
      {/* Rows */}
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow key={i} className="px-5 py-3.5" />
        ))}
      </div>
    </div>
  );
}
