import { forwardRef, type InputHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  hasError?: boolean;
  hint?: string;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/* ═══════════════════════════════════════════════════════ */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, hasError: hasErrorProp, hint, label, leftIcon, rightIcon, className, id, onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const hasError = !!error || hasErrorProp;
    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className="flex flex-col gap-1.5">
        {label ? <label htmlFor={inputId} className="text-[12px] font-medium text-text-secondary">{label}</label> : null}
        <div
          className={cn(
            'flex items-center gap-2 rounded-lg border bg-surface px-3 transition-all duration-150',
            hasError
              ? 'border-danger-400 bg-danger-500/5 focus-within:shadow-[0_0_0_2px_var(--color-background),0_0_0_4px_var(--color-danger-400)]'
              : focused
                ? 'border-accent shadow-[0_0_0_2px_var(--color-background),0_0_0_4px_var(--color-ring)]'
                : 'border-border hover:border-border-hover focus-within:border-accent focus-within:shadow-[0_0_0_2px_var(--color-background),0_0_0_4px_var(--color-ring)]',
            props.disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {leftIcon && (
            <span className="shrink-0 text-text-tertiary">{leftIcon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'flex-1 bg-transparent py-2 text-[13px] text-text-primary placeholder:text-text-disabled outline-none',
              'disabled:cursor-not-allowed',
              className
            )}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />
          {rightIcon && (
            <span className="shrink-0 text-text-tertiary">{rightIcon}</span>
          )}
        </div>
        {hasError && (
          <p id={`${inputId}-error`} className="text-[12px] font-medium text-danger-400" role="alert">
            {error}
          </p>
        )}
        {!hasError && hint && (
          <p id={`${inputId}-hint`} className="text-[12px] text-text-tertiary">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
