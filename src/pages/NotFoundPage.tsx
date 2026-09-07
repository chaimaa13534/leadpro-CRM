import { ErrorPage } from '@/components/errors/ErrorPage';

/** Page 404 — route introuvable. */
export function NotFoundPage() {
  return (
    <ErrorPage
      code={404}
      title="Page introuvable"
      description="La page que vous cherchez n'existe pas ou a été déplacée."
    />
  );
}
