import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  label?: string;
}

/** Bouton radio, même pattern visuel que `Checkbox` (input natif + peer). */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, disabled, ...props }, ref) => {
    return (
      <label
        htmlFor={id}
        className={cn(
          'inline-flex items-center gap-2 group',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        )}
      >
        <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
          <input
            ref={ref}
            type="radio"
            id={id}
            disabled={disabled}
            className="peer absolute inset-0 size-4 cursor-pointer appearance-none rounded-full border border-border bg-surface transition-all duration-150 ease-out checked:border-[5px] checked:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed group-hover:border-border-hover"
            {...props}
          />
          <span className="absolute inset-0 rounded-full bg-accent scale-0 peer-checked:scale-100 transition-transform duration-150 ease-out" />
        </span>
        {label ? (
          <span className={cn('text-[13px] text-text-secondary group-hover:text-text-primary transition-colors duration-150', className)}>{label}</span>
        ) : null}
      </label>
    );
  },
);

Radio.displayName = 'Radio';
