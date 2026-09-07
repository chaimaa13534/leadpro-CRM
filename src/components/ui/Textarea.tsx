import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError = false, disabled, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        aria-invalid={hasError || undefined}
        className={cn(
          'w-full resize-y rounded-md border bg-surface px-3 py-2',
          'text-body text-text-primary placeholder:text-text-secondary',
          'transition-all duration-150 ease-standard',
          'focus-visible:border-primary-500 focus-visible:ring-4 focus-visible:ring-primary-500/15 focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:bg-muted disabled:text-disabled',
          hasError
            ? 'border-danger-500 focus-visible:border-danger-500 focus-visible:ring-danger-500/15'
            : 'border-border',
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';
