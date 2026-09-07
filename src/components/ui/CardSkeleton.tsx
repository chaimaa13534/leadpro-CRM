import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

/**
 * État de chargement d'une `Card` — même structure header/content.
 * Anciennement `LoadingCard` (Jour 3), renommée au Jour 7 pour suivre la
 * convention `*Skeleton` de toute la famille de loaders (voir
 * `TableSkeleton`, `FormSkeleton`, `DashboardSkeleton`).
 */
export function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}
