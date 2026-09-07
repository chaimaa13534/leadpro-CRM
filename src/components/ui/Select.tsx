import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  hasError?: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
  label?: string;
  leftIcon?: ReactNode;
}

/* ═══════════════════════════════════════════════════════ */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, hasError: hasErrorProp, options, placeholder, label, leftIcon, className, id, children, ...props }, ref) => {
    const selectId = id ?? `select-${Math.random().toString(36).slice(2, 9)}`;
    const hasError = !!error || hasErrorProp;

    return (
      <div className="flex flex-col gap-1.5">
        {label ? <label htmlFor={selectId} className="text-[12px] font-medium text-text-secondary">{label}</label> : null}
        <div
          className={cn(
            'relative flex items-center rounded-lg border bg-surface px-3 transition-all duration-150',
            hasError
              ? 'border-danger-400 focus-within:shadow-[0_0_0_2px_var(--color-background),0_0_0_4px_var(--color-danger-400)]'
              : 'border-border hover:border-border-hover focus-within:border-accent focus-within:shadow-[0_0_0_2px_var(--color-background),0_0_0_4px_var(--color-ring)]',
            props.disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {leftIcon && (
            <span className="mr-2 shrink-0 text-text-tertiary">{leftIcon}</span>
          )}
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'flex-1 appearance-none bg-transparent py-2 pr-8 text-[13px] text-text-primary outline-none',
              'disabled:cursor-not-allowed',
              !props.value && 'text-text-disabled',
              className
            )}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${selectId}-error` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children}
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-text-tertiary" />
        </div>
        {hasError && (
          <p id={`${selectId}-error`} className="text-[12px] text-danger-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
