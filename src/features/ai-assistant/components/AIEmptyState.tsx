import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';

interface AIEmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function AIEmptyState({
  title = 'How can I help you today?',
  description = 'Ask me anything about your CRM data — pipeline overviews, lead analysis, opportunity insights, and more.',
  className,
}: AIEmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-[#6d7af0] shadow-lg mb-5">
        <Sparkles className="h-7 w-7 text-white" />
      </div>
      <h2 className="text-lg font-semibold text-text-primary mb-2">{title}</h2>
      <p className="text-[13px] text-text-tertiary max-w-md leading-relaxed">{description}</p>
    </div>
  );
}
