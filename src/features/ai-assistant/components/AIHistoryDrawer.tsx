import { Search, MessageSquarePlus } from 'lucide-react';
import { cn } from '@/lib/cn';
import { AIConversationItem } from './AIConversationItem';
import type { AIConversation } from '../types/ai.types';

interface AIHistoryDrawerProps {
  conversations: AIConversation[];
  currentConversationId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNewConversation: () => void;
  className?: string;
}

export function AIHistoryDrawer({
  conversations,
  currentConversationId,
  searchQuery,
  onSearchChange,
  onSelect,
  onDelete,
  onNewConversation,
  className,
}: AIHistoryDrawerProps) {
  return (
    <aside className={cn('flex flex-col border-r border-border bg-surface', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-[13px] font-semibold text-text-primary">History</h3>
        <button
          onClick={onNewConversation}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface-hover hover:text-accent transition-colors"
          aria-label="New conversation"
        >
          <MessageSquarePlus className="h-4 w-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5">
          <Search className="h-3.5 w-3.5 text-text-tertiary shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations…"
            className="flex-1 bg-transparent text-[12px] text-text-primary placeholder:text-text-disabled outline-none"
          />
        </div>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquarePlus className="h-8 w-8 text-text-disabled mb-2" />
            <p className="text-[12px] text-text-tertiary">No conversations yet</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <AIConversationItem
              key={conv.id}
              conversation={conv}
              active={conv.id === currentConversationId}
              onClick={() => onSelect(conv.id)}
              onDelete={() => onDelete(conv.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
