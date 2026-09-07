import { QueryClient } from '@tanstack/react-query';

/**
 * Application-wide TanStack Query client.
 *
 * Conservative defaults for an admin CRM dashboard:
 * - `staleTime` keeps data fresh for 30s to avoid hammering the API.
 * - `retry` retries transient failures once before surfacing the error.
 * - `refetchOnWindowFocus` is enabled so the admin table stays in sync.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
