import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

/* ── Variants ── */
const variants = {
  primary:
    'bg-gradient-to-b from-accent to-[#6d7af0] text-text-inverse shadow-sm hover:shadow-md hover:from-accent-hover hover:to-[#8b98f5] active:from-accent-active active:to-[#aeb6f8] focus-visible:shadow-ring-accent',
  secondary:
    'bg-surface text-text-primary border border-border shadow-xs hover:bg-surface-hover hover:border-border-hover active:bg-surface-active active:scale-[0.98] focus-visible:shadow-ring',
  ghost:
    'text-text-secondary hover:bg-surface-hover hover:text-text-primary active:bg-surface-active',
  danger:
    'bg-gradient-to-b from-danger-500 to-danger-600 text-white shadow-sm hover:from-danger-600 hover:to-danger-700 active:from-danger-700 active:to-danger-800 focus-visible:shadow-[0_0_0_2px_var(--color-background),0_0_0_4px_var(--color-danger-400)]',
  outline:
    'border border-border bg-transparent text-text-primary hover:bg-surface-hover hover:border-border-hover active:bg-surface-active focus-visible:shadow-ring',
  link: 'text-accent hover:text-accent-hover underline-offset-4 hover:underline p-0 h-auto',
} as const;

const sizes = {
  xs: 'h-7 px-2.5 text-[12px] gap-1.5 rounded-md',
  sm: 'h-8 px-3 text-[13px] gap-1.5 rounded-lg',
  md: 'h-9 px-4 text-[13px] gap-2 rounded-lg',
  lg: 'h-10 px-5 text-[14px] gap-2 rounded-lg',
  xl: 'h-11 px-6 text-[14px] gap-2.5 rounded-xl',
  icon: 'h-8 w-8 p-0 rounded-lg',
  'icon-sm': 'h-7 w-7 p-0 rounded-md',
  'icon-lg': 'h-10 w-10 p-0 rounded-lg',
} as const;

type ButtonVariant = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

/* ═══════════════════════════════════════════════════════ */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      isLoading = false,
      fullWidth = false,
      disabled,
      className,
      children,
      leadingIcon,
      trailingIcon,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading || isLoading;
    const isBusy = loading || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center font-medium select-none',
          'transform-gpu transition-all duration-150 ease-out',
          'focus-visible:outline-none',
          'disabled:pointer-events-none disabled:opacity-50',
          'active:scale-[0.98]',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isBusy && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isBusy && leadingIcon && <span className="shrink-0">{leadingIcon}</span>}
        {children}
        {!isBusy && trailingIcon && <span className="shrink-0">{trailingIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
