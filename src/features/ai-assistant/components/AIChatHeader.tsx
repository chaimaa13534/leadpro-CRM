import { ChevronLeft, MoreHorizontal, Trash2 } from 'lucide-react';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { cn } from '@/lib/cn';
import type { AIConversation } from '../types/ai.types';

interface AIChatHeaderProps {
  conversation: AIConversation | null;
  onBack?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function AIChatHeader({ conversation, onBack, onDelete, className }: AIChatHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between border-b border-border px-4 py-3', className)}>
      <div className="flex items-center gap-2">
        {onBack && (
          <button
            onClick={onBack}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-secondary transition-colors"
            aria-label="Back"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        <div>
          <h2 className="text-[14px] font-semibold text-text-primary truncate max-w-[200px]">
            {conversation?.title ?? 'New conversation'}
          </h2>
          {conversation && (
            <p className="text-[11px] text-text-tertiary">{conversation.messageCount} messages</p>
          )}
        </div>

        {conversation && (
          <Dropdown
            trigger={
              <button className="flex h-7 w-7 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-text-secondary transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            }
          >
            <DropdownItem
              icon={<Trash2 className="h-3.5 w-3.5" />}
              danger
              onClick={onDelete}
            >
              Delete conversation
            </DropdownItem>
          </Dropdown>
        )}
      </div>
    </div>
  );
}
