import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-background-tertiary text-text-secondary',
  primary: 'bg-accent-subtle text-accent border border-accent/10',
  success: 'bg-success-50 text-success-400 border border-success-500/10',
  warning: 'bg-warning-50 text-warning-400 border border-warning-500/10',
  danger: 'bg-danger-50 text-danger-400 border border-danger-500/10',
  info: 'bg-info-50 text-info-400 border border-info-500/10',
  neutral: 'bg-neutral-800 text-neutral-400 border border-neutral-700',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-text-tertiary',
  primary: 'bg-accent',
  success: 'bg-success-400',
  warning: 'bg-warning-400',
  danger: 'bg-danger-400',
  info: 'bg-info-400',
  neutral: 'bg-neutral-500',
};

/* ═══════════════════════════════════════════════════════ */
export function Badge({
  variant = 'default',
  size = 'sm',
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-md',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-[12px]',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColors[variant])} />
      )}
      {children}
    </span>
  );
}
