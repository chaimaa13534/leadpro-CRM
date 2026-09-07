import { forwardRef, type InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

/* ═══════════════════════════════════════════════════════ */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, id, ...props }, ref) => {
    const checkboxId = id ?? `checkbox-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          'inline-flex items-center gap-2.5 cursor-pointer select-none group',
          props.disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'flex h-4 w-4 items-center justify-center rounded border transition-all duration-150',
              'border-border bg-surface',
              'group-hover:border-border-hover',
              'peer-focus-visible:shadow-ring peer-focus-visible:border-accent',
              'peer-checked:border-accent peer-checked:bg-accent',
              'peer-checked:group-hover:bg-accent-hover peer-checked:group-hover:border-accent-hover',
              'peer-disabled:opacity-50'
            )}
          >
            <Check className="h-3 w-3 text-white opacity-0 transition-all duration-150 peer-checked:opacity-100 peer-checked:scale-100 scale-0" />
          </div>
        </div>
        {label && (
          <span className="text-[13px] text-text-secondary group-hover:text-text-primary transition-colors duration-150">{label}</span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
