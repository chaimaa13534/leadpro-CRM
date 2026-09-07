import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, AuthProvider, NotificationProvider, LayoutProvider } from '@/store';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';
import { router } from '@/routes';
import { queryClient } from '@/lib/query-client';

/**
 * Point d'entrée applicatif. Ordre des providers, du plus indépendant au
 * plus dépendant :
 * `ErrorBoundary` (filet de sécurité global)
 *   → `ThemeProvider` (ne dépend de rien, actif partout)
 *     → `NotificationProvider` (indépendant de la session)
 *       → `AuthProvider` (nécessaire à `ProtectedRoute`/`PublicRoute`)
 *         → `RouterProvider`
 */
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <NotificationProvider>
            <AuthProvider>
              <LayoutProvider>
                <RouterProvider router={router} />
              </LayoutProvider>
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
