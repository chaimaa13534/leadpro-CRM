import { Skeleton } from '@/components/ui/Skeleton';
import { CardSkeleton } from '@/components/ui/CardSkeleton';
import { Card } from '@/components/ui/Card';
import { TableSkeleton } from '@/components/ui/TableSkeleton';

/**
 * Squelette pleine page à la forme du Dashboard (Header → KPI → Graphiques
 * → Tableau), utilisé comme repli de `<Suspense>` pendant le chargement
 * du chunk `DashboardPage` (voir `routes/LazyDashboardPage.tsx`) — un
 * gain d'expérience réel par rapport à un simple spinner générique,
 * puisque la forme de la page est déjà lisible pendant le chargement.
 */
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-6">
        {Array.from({ length: 6 }, (_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 laptop:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Card key={index} className="p-4">
            <Skeleton className="mb-4 h-4 w-32" />
            <Skeleton className="h-56 w-full" />
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <TableSkeleton columns={6} rows={5} />
      </Card>
    </div>
  );
}
