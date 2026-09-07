import { ErrorPage } from '@/components/errors/ErrorPage';

/** Page 500 — erreur serveur inattendue. */
export function ServerErrorPage() {
  return (
    <ErrorPage
      code={500}
      title="Erreur serveur"
      description="Une erreur inattendue est survenue. Notre équipe a été notifiée, merci de réessayer dans quelques instants."
      onRetry={() => window.location.reload()}
    />
  );
}
