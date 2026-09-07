import { useMemo } from 'react';
import { useDropdown } from '@/hooks/useDropdown';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/cn';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  hasError?: boolean;
  'aria-label'?: string;
}

/**
 * Sélecteur multiple "maison" (simulation — aucune donnée réelle
 * consommée par le formulaire du Jour 9, composant de base du Design
 * System préparé pour un futur champ à choix multiples). Un
 * `<select multiple>` natif reste peu ergonomique visuellement ; ce
 * composant garde le menu déroulant accessible (`role="listbox"`,
 * `aria-selected`) tout en affichant les choix sous forme de puces
 * retirables.
 */
export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Sélectionner...',
  hasError = false,
  'aria-label': ariaLabel,
}: MultiSelectProps) {
  const { isOpen, setIsOpen, containerRef } = useDropdown<HTMLDivElement>();

  const selectedOptions = useMemo(
    () => options.filter((option) => value.includes(option.value)),
    [options, value],
  );

  function toggleValue(optionValue: string) {
    if (value.includes(optionValue)) {
      onChange(value.filter((item) => item !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  }

  function removeValue(optionValue: string) {
    onChange(value.filter((item) => item !== optionValue));
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={cn(
          'flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border bg-surface px-3 py-1.5 text-left',
          'transition-all duration-150 ease-standard',
          'focus-visible:border-primary-500 focus-visible:ring-4 focus-visible:ring-primary-500/15 focus-visible:outline-none',
          hasError ? 'border-danger-500' : 'border-border',
        )}
      >
        {selectedOptions.length === 0 ? (
          <span className="text-body text-text-secondary">{placeholder}</span>
        ) : (
          selectedOptions.map((option) => (
            <span
              key={option.value}
              className="flex items-center gap-1 rounded-full bg-primary-50 py-0.5 pr-1 pl-2.5 text-caption font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
            >
              {option.label}
              <span
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation();
                  removeValue(option.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.stopPropagation();
                    event.preventDefault();
                    removeValue(option.value);
                  }
                }}
                aria-label={`Retirer ${option.label}`}
                className="rounded-full p-0.5 hover:bg-primary-100 dark:hover:bg-primary-800"
              >
                <Icons.close className="size-3" aria-hidden="true" />
              </span>
            </span>
          ))
        )}
        <Icons.chevronDown
          className="ml-auto size-4 shrink-0 text-text-secondary"
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div
          role="listbox"
          aria-multiselectable="true"
          className="absolute top-full left-0 z-(--z-popover) mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-border bg-surface p-1 shadow-lg"
        >
          {options.map((option) => {
            const isSelected = value.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => toggleValue(option.value)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-body transition-colors duration-150',
                  isSelected
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                    : 'text-text-primary hover:bg-muted',
                )}
              >
                <span
                  className={cn(
                    'flex size-4 shrink-0 items-center justify-center rounded-sm border',
                    isSelected
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : 'border-border',
                  )}
                >
                  {isSelected ? (
                    <Icons.check className="size-3" aria-hidden="true" />
                  ) : null}
                </span>
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
