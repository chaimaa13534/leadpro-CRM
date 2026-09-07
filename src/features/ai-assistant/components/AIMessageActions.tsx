import { Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { AIMessageActions as IAIMessageActions } from '../types/ai.types';

interface AIMessageActionsProps {
  actions: IAIMessageActions;
  onCopy?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  className?: string;
}

export function AIMessageActions({ actions, onCopy, onLike, onDislike, className }: AIMessageActionsProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <button
        onClick={onCopy}
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
          actions.copied
            ? 'text-success-400 bg-success-50'
            : 'text-text-tertiary hover:text-text-secondary hover:bg-surface-hover',
        )}
        aria-label={actions.copied ? 'Copied' : 'Copy'}
      >
        <Copy className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={onLike}
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
          actions.liked
            ? 'text-accent bg-accent-subtle'
            : 'text-text-tertiary hover:text-text-secondary hover:bg-surface-hover',
        )}
        aria-label="Like"
      >
        <ThumbsUp className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={onDislike}
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
          actions.disliked
            ? 'text-danger-400 bg-danger-50'
            : 'text-text-tertiary hover:text-text-secondary hover:bg-surface-hover',
        )}
        aria-label="Dislike"
      >
        <ThumbsDown className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
