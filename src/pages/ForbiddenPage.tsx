import { ErrorPage } from '@/components/errors/ErrorPage';
import { Icons } from '@/components/ui/icons';

/** Page 403 — accès refusé (droits insuffisants). */
export function ForbiddenPage() {
  return (
    <ErrorPage
      code={403}
      title="Accès refusé"
      description="Vous n'avez pas les droits nécessaires pour accéder à cette page."
      icon={<Icons.danger className="size-6" aria-hidden="true" />}
    />
  );
}
