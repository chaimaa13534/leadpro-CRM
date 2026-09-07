/**
 * État vide pour une colonne du pipeline ou le board entier.
 */
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/cn';

interface PipelineEmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function PipelineEmptyState({
  title = 'Aucune opportunité',
  description = 'Les opportunités apparaîtront ici lorsqu\'elles seront ajoutées.',
  className,
}: PipelineEmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-8 px-4 text-center', className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background-tertiary mb-3">
        <Inbox className="h-5 w-5 text-text-tertiary" />
      </div>
      <p className="text-[13px] font-medium text-text-secondary mb-0.5">{title}</p>
      <p className="text-[11px] text-text-tertiary max-w-[180px] leading-relaxed">{description}</p>
    </div>
  );
}

