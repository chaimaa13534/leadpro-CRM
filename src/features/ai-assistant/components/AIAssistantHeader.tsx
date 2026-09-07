import { Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

interface AIAssistantHeaderProps {
  onRefresh?: () => void;
  loading?: boolean;
  className?: string;
}

export function AIAssistantHeader({ onRefresh, loading = false, className }: AIAssistantHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-[#6d7af0] shadow-sm">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-[17px] font-semibold text-text-primary tracking-tight">AI Assistant</h1>
          <p className="text-[12px] text-text-tertiary">Your intelligent CRM co-pilot</p>
        </div>
      </div>

      {onRefresh && (
        <Button variant="ghost" size="sm" onClick={onRefresh} loading={loading} leadingIcon={<RefreshCw className="h-3.5 w-3.5" />}>
          Refresh
        </Button>
      )}
    </div>
  );
}
