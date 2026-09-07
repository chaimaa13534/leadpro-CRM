import { Icons } from '@/components/ui/icons';

/**
 * Barre de recherche de la Topbar — UI uniquement aujourd'hui, aucune
 * logique de recherche n'est câblée (pas de service, pas de résultats).
 * Le raccourci clavier affiché est décoratif pour l'instant.
 */
export function SearchBar() {
  return (
    <div className="relative hidden w-full max-w-sm tablet:block">
      <Icons.search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-secondary"
        aria-hidden="true"
      />
      <input
        type="search"
        placeholder="Rechercher..."
        aria-label="Rechercher"
        className="h-9 w-full rounded-md border border-border bg-muted pr-14 pl-9 text-body text-text-primary placeholder:text-text-secondary transition-colors duration-150 ease-standard focus-visible:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
      />
      <kbd className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 rounded border border-border bg-surface px-1.5 py-0.5 text-caption text-text-secondary">
        ⌘K
      </kbd>
    </div>
  );
}
