import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { ErrorPage } from '@/components/errors/ErrorPage';

export interface ErrorBoundaryProps {
  children: ReactNode;
  /** Contenu de repli personnalisé ; par défaut, `ErrorPage` générique. */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Filet de sécurité pour les erreurs de rendu React (composant de
 * classe requis — React n'a pas d'équivalent hook pour
 * `componentDidCatch`). Capture toute erreur non gérée dans son
 * sous-arbre et affiche `ErrorPage` plutôt qu'un écran blanc.
 *
 * N'attrape ni les erreurs dans des gestionnaires d'événements, ni les
 * erreurs asynchrones (promesses) — ce n'est pas son rôle ; celles-ci
 * doivent être gérées localement (voir les blocs `try/catch` de
 * `AuthProvider`, des formulaires, etc.).
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Point d'intégration futur avec un service de suivi d'erreurs
    // (Sentry, etc.) — se contente de journaliser pour l'instant.
    console.error('ErrorBoundary a intercepté une erreur :', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  override render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <ErrorPage
            code={500}
            title="Une erreur est survenue"
            description="Quelque chose s'est mal passé de notre côté. Vous pouvez réessayer, ou revenir à l'accueil."
            onRetry={this.handleReset}
          />
        )
      );
    }

    return this.props.children;
  }
}
