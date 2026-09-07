import { AIChatHeader } from './AIChatHeader';
import { AIMessageList } from './AIMessageList';
import { AIInput } from './AIInput';
import { cn } from '@/lib/cn';
import type { AIMessage as IAIMessage, AIConversation, AIProcessingState } from '../types/ai.types';

interface AIChatProps {
  conversation: AIConversation | null;
  messages: IAIMessage[];
  processingState: AIProcessingState;
  error: string | null;
  onSend: (message: string) => void;
  onBack?: () => void;
  onDelete?: () => void;
  onCopy?: (id: string) => void;
  onLike?: (id: string) => void;
  onDislike?: (id: string) => void;
  onRetry?: () => void;
  className?: string;
}

export function AIChat({
  conversation,
  messages,
  processingState,
  error,
  onSend,
  onBack,
  onDelete,
  onCopy,
  onLike,
  onDislike,
  onRetry,
  className,
}: AIChatProps) {
  return (
    <div className={cn('flex flex-col h-full', className)}>
      <AIChatHeader
        conversation={conversation}
        onBack={onBack}
        onDelete={onDelete}
      />
      <AIMessageList
        messages={messages}
        processingState={processingState}
        error={error}
        onCopy={onCopy}
        onLike={onLike}
        onDislike={onDislike}
        onRetry={onRetry}
        className="flex-1"
      />
      <div className="border-t border-border p-4">
        <AIInput
          onSend={onSend}
          disabled={processingState === 'thinking'}
        />
      </div>
    </div>
  );
}
