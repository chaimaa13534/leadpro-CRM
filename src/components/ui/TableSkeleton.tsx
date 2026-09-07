import { Skeleton } from '@/components/ui/Skeleton';
import { LoadingTableRow } from '@/components/ui/LoadingTableRow';

export interface TableSkeletonProps {
  columns?: number;
  rows?: number;
}

/**
 * Squelette de tableau complet (en-tête + lignes), à afficher pendant le
 * chargement d'une liste (Leads, Contacts…). Compose `LoadingTableRow`
 * plutôt que de dupliquer sa logique.
 */
export function TableSkeleton({ columns = 4, rows = 5 }: TableSkeletonProps) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {Array.from({ length: columns }, (_, index) => (
            <th key={index} className="p-3 text-left">
              <Skeleton className="h-3 w-16" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }, (_, index) => (
          <LoadingTableRow key={index} columns={columns} />
        ))}
      </tbody>
    </table>
  );
}
