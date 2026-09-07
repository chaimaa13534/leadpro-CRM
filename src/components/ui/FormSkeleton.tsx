import { Skeleton } from '@/components/ui/Skeleton';

export interface FormSkeletonProps {
  fields?: number;
}

/** Squelette générique de formulaire (label + champ répétés). */
export function FormSkeleton({ fields = 4 }: FormSkeletonProps) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: fields }, (_, index) => (
        <div key={index} className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="mt-2 h-10 w-32" />
    </div>
  );
}
