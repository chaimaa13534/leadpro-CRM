import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface SwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  label?: string;
}

/**
 * Interrupteur booléen. Construit sur `<input type="checkbox">
 * role="switch">` pour rester accessible (annoncé comme interrupteur par
 * les lecteurs d'écran), avec un rendu "pilule" entièrement custom.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, id, disabled, ...props }, ref) => {
    return (
      <label
        htmlFor={id}
        className={cn(
          'inline-flex items-center gap-2',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        )}
      >
        <span className="relative inline-flex h-6 w-10 shrink-0 items-center">
          <input
            ref={ref}
            type="checkbox"
            role="switch"
            id={id}
            disabled={disabled}
            className="peer absolute inset-0 size-full cursor-pointer appearance-none rounded-full border border-border bg-muted transition-colors duration-150 ease-standard checked:border-primary-600 checked:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed"
            {...props}
          />
          <span
            className="pointer-events-none relative left-1 size-4 rounded-full bg-white shadow-sm transition-transform duration-150 ease-standard peer-checked:translate-x-4"
            aria-hidden="true"
          />
        </span>
        {label ? (
          <span className={cn('text-body', className)}>{label}</span>
        ) : null}
      </label>
    );
  },
);

Switch.displayName = 'Switch';
