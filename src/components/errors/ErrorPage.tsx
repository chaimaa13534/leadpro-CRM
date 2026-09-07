import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/ui/icons';
import { ROUTES } from '@/lib/constants/routes.constants';

export interface ErrorPageProps {
  code: number | string;
  title: string;
  description: string;
  icon?: ReactNode;
  onRetry?: () => void;
}

/**
 * Écran d'erreur générique, entièrement autonome (pas de dépendance à un
 * layout) puisque la route 404 catch-all est déclarée hors de
 * `MainLayout`/`AuthLayout` dans le routeur. Sert de base à `NotFoundPage`
 * (404), `ForbiddenPage` (403) et `ServerErrorPage` (500), ainsi qu'au
 * repli par défaut d'`ErrorBoundary`.
 */
export function ErrorPage({
  code,
  title,
  description,
  icon,
  onRetry,
}: ErrorPageProps) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
        className="flex w-full max-w-md flex-col items-center gap-4 text-center"
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-danger-50 text-danger-600 dark:bg-danger-900/30">
          {icon ?? <Icons.warning className="size-6" aria-hidden="true" />}
        </span>

        <p className="text-figure text-h1 text-text-primary">{code}</p>

        <div>
          <h1 className="text-h3 text-text-primary">{title}</h1>
          <p className="mt-1 text-body text-text-secondary">{description}</p>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Retour
          </Button>
          <Button onClick={onRetry ?? (() => navigate(ROUTES.DASHBOARD))}>
            {onRetry ? 'Réessayer' : "Retour à l'accueil"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
