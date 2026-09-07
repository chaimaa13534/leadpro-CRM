import { Link, useLocation } from 'react-router-dom';
import { Icons } from '@/components/ui/icons';
import { MAIN_NAV_ITEMS } from '@/lib/constants/navigation.constants';
import { ROUTES } from '@/lib/constants/routes.constants';

interface Crumb {
  label: string;
  path: string;
}

function humanizeSegment(segment: string): string {
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

/**
 * Fil d'Ariane généré automatiquement à partir de l'URL courante —
 * aucune page ne doit déclarer son propre breadcrumb manuellement.
 *
 * Résout chaque segment via `MAIN_NAV_ITEMS` quand c'est une route
 * connue (ex: `/leads` → "Leads"), et retombe sur une version
 * "humanisée" du segment sinon (ex: `/leads/123` → "123"), pour rester
 * correct une fois que des routes dynamiques (détail d'un lead…)
 * existeront.
 */
export function Breadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  const crumbs: Crumb[] = [{ label: 'Dashboard', path: ROUTES.DASHBOARD }];

  let cumulativePath = '';
  for (const segment of segments) {
    cumulativePath += `/${segment}`;

    if (cumulativePath === ROUTES.DASHBOARD) {
      continue;
    }

    const matchingNavItem = MAIN_NAV_ITEMS.find(
      (item) => item.path === cumulativePath,
    );

    crumbs.push({
      label: matchingNavItem?.label ?? humanizeSegment(segment),
      path: cumulativePath,
    });
  }

  return (
    <nav aria-label="Fil d'Ariane">
      <ol className="flex items-center gap-1.5 text-caption text-text-secondary">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li key={crumb.path} className="flex items-center gap-1.5">
              {index > 0 ? (
                <Icons.chevronRight
                  className="size-3.5 shrink-0"
                  aria-hidden="true"
                />
              ) : null}
              {isLast ? (
                <span
                  className="font-medium text-text-primary"
                  aria-current="page"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="transition-colors duration-150 hover:text-text-primary"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
