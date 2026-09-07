/* ═════════════════════════════════════════════════════════════════════
   Activity Center — ActivitySearch
   Instant search for activities
   ═════════════════════════════════════════════════════════════════════ */

import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { debounce } from '@/utils/debounce';

interface ActivitySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const ActivitySearch = memo(function ActivitySearch({
  value,
  onChange,
  placeholder = 'Rechercher dans les activités...',
}: ActivitySearchProps) {
  const [localValue, setLocalValue] = useState(value);
  const debouncedOnChange = useRef(debounce((v: string) => onChange(v), 200)).current;

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setLocalValue(v);
      debouncedOnChange(v);
    },
    [debouncedOnChange],
  );

  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange('');
  }, [onChange]);

  return (
    <div className="relative">
      <Input
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Rechercher dans les activités"
        leftIcon={<Search className="size-4" />}
        rightIcon={
          localValue ? (
            <button
              onClick={handleClear}
              className="flex items-center justify-center text-text-tertiary hover:text-text-secondary transition-colors"
              aria-label="Effacer la recherche"
            >
              <X className="size-4" />
            </button>
          ) : undefined
        }
      />
    </div>
  );
});

