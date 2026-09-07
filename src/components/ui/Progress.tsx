import { cn } from '@/lib/cn';

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  className?: string;
}

const sizeStyles = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2.5',
} as const;

const variantStyles = {
  default: 'bg-neutral-700',
  accent: 'bg-accent',
  success: 'bg-success-400',
  warning: 'bg-warning-400',
  danger: 'bg-danger-400',
} as const;

/* ═══════════════════════════════════════════════════════ */
export function Progress({
  value,
  max = 100,
  size = 'md',
  variant = 'accent',
  showLabel = false,
  className,
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn('flex-1 rounded-full bg-background-tertiary overflow-hidden', sizeStyles[size])}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', variantStyles[variant])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-[12px] font-medium tabular-nums text-text-tertiary shrink-0">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
