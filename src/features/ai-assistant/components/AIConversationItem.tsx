import { MessageSquare, Trash2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { AIConversation } from '../types/ai.types';

interface AIConversationItemProps {
  conversation: AIConversation;
  active?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function AIConversationItem({ conversation, active = false, onClick, onDelete, className }: AIConversationItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-150',
        active
          ? 'bg-accent-subtle text-accent'
          : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
        className,
      )}
    >
      <MessageSquare className="h-4 w-4 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium truncate">{conversation.title}</p>
        <p className="text-[11px] text-text-tertiary">{conversation.messageCount} messages</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex h-6 w-6 items-center justify-center rounded-md text-text-tertiary hover:text-danger-400 hover:bg-danger-50"
        aria-label="Delete"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
