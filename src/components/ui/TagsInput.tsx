import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/cn';

export interface TagsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  hasError?: boolean;
  'aria-label'?: string;
}

/**
 * Champ de saisie de tags libres : taper puis `Entrée` ou `,` ajoute une
 * puce, `Retour arrière` sur un champ vide retire la dernière. Simulation
 * complète (pas de suggestions serveur) — alimente `Lead.tags`.
 */
export function TagsInput({
  value,
  onChange,
  placeholder = 'Ajouter un tag...',
  hasError = false,
  'aria-label': ariaLabel,
}: TagsInputProps) {
  const [draft, setDraft] = useState('');

  function commitDraft() {
    const trimmed = draft.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setDraft('');
  }

  function removeTag(tag: string) {
    onChange(value.filter((item) => item !== tag));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      commitDraft();
    } else if (event.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div
      className={cn(
        'flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border bg-surface px-3 py-1.5',
        'transition-all duration-150 ease-standard',
        'focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/15',
        hasError ? 'border-danger-500' : 'border-border',
      )}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded-full bg-muted py-0.5 pr-1 pl-2.5 text-caption font-medium text-text-primary"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            aria-label={`Retirer le tag ${tag}`}
            className="rounded-full p-0.5 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            <Icons.close className="size-3" aria-hidden="true" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commitDraft}
        placeholder={value.length === 0 ? placeholder : ''}
        aria-label={ariaLabel}
        className="min-w-24 flex-1 border-0 bg-transparent text-body text-text-primary placeholder:text-text-secondary focus:outline-none"
      />
    </div>
  );
}
