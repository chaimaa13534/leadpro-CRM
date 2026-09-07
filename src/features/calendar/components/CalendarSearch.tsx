import { memo, useCallback, useRef, useEffect } from 'react';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/cn';

interface CalendarSearchProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
  className?: string;
}

function CalendarSearchComponent({ value, onChange, placeholder = 'Rechercher...', className }: CalendarSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = useCallback(() => {
    onChange('');
    inputRef.current?.focus();
  }, [onChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={cn('relative', className)}>
      <Icons.search
        className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-tertiary pointer-events-none"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-8 text-[13px] text-text-primary',
          'placeholder:text-text-tertiary',
          'focus:border-border-focus focus:outline-none focus:shadow-ring',
          'transition-all duration-150',
        )}
        aria-label={placeholder}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-text-tertiary hover:bg-surface-hover hover:text-text-secondary transition-colors"
          aria-label="Effacer la recherche"
        >
          <Icons.close className="size-3.5" />
        </button>
      )}
      <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 rounded-md border border-border bg-surface px-1.5 py-0.5 text-[10px] text-text-tertiary font-medium">
        <span className="text-[9px]">⌘</span>K
      </kbd>
    </div>
  );
}

export const CalendarSearch = memo(CalendarSearchComponent);

