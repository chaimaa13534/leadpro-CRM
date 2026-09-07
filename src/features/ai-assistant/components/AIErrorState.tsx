import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

interface AIErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function AIErrorState({
  message = 'Une erreur est survenue lors de la génération de la réponse.',
  onRetry,
  className,
}: AIErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-xl border border-danger-200 bg-danger-50 p-6 text-center', className)}>
      <AlertCircle className="h-8 w-8 text-danger-400 mb-3" />
      <p className="text-[13px] font-medium text-danger-700 mb-1">Error</p>
      <p className="text-[12px] text-danger-500 mb-4 max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} leadingIcon={<RefreshCw className="h-3.5 w-3.5" />}>
          Retry
        </Button>
      )}
    </div>
  );
}
