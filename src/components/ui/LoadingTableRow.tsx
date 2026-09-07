import { Skeleton } from '@/components/ui/Skeleton';

export interface LoadingTableRowProps {
  columns?: number;
}

/** Ligne de tableau en état de chargement, à répéter le temps de charger les données. */
export function LoadingTableRow({ columns = 4 }: LoadingTableRowProps) {
  return (
    <tr>
      {Array.from({ length: columns }, (_, index) => (
        <td key={index} className="p-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
