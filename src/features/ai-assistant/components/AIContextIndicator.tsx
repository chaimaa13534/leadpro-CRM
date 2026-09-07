import { cn } from '@/lib/cn';
import type { AIContextSource } from '../types/ai.types';

interface AIContextIndicatorProps {
  sources: AIContextSource[];
  className?: string;
}

export function AIContextIndicator({ sources, className }: AIContextIndicatorProps) {
  const activeSources = sources.filter((s) => s.active);

  if (activeSources.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      <span className="text-[11px] font-medium text-text-tertiary mr-1">Context:</span>
      {activeSources.map((source) => (
        <span
          key={source.type}
          className="inline-flex items-center gap-1 rounded-md bg-accent-subtle px-2 py-0.5 text-[11px] font-medium text-accent"
        >
          {source.label}
          <span className="text-[10px] text-accent/70">({source.count})</span>
        </span>
      ))}
    </div>
  );
}
