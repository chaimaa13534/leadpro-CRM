import { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import { AIMessage } from './AIMessage';
import { AIThinkingIndicator } from './AIThinkingIndicator';
import { AIEmptyState } from './AIEmptyState';
import { AIErrorState } from './AIErrorState';
import type { AIMessage as IAIMessage, AIProcessingState } from '../types/ai.types';

interface AIMessageListProps {
  messages: IAIMessage[];
  processingState: AIProcessingState;
  error: string | null;
  thinkingSteps?: string[];
  onCopy?: (id: string) => void;
  onLike?: (id: string) => void;
  onDislike?: (id: string) => void;
  onRetry?: () => void;
  className?: string;
}

export function AIMessageList({
  messages,
  processingState,
  error,
  thinkingSteps,
  onCopy,
  onLike,
  onDislike,
  onRetry,
  className,
}: AIMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, processingState]);

  if (messages.length === 0 && processingState === 'idle') {
    return <AIEmptyState className={className} />;
  }

  return (
    <div className={cn('flex flex-col gap-4 overflow-y-auto px-4 py-4', className)}>
      <AnimatePresence mode="popLayout">
        {messages.map((message) => (
          <AIMessage
            key={message.id}
            message={message}
            onCopy={() => onCopy?.(message.id)}
            onLike={() => onLike?.(message.id)}
            onDislike={() => onDislike?.(message.id)}
          />
        ))}
      </AnimatePresence>

      {processingState === 'thinking' && (
        <AIThinkingIndicator steps={thinkingSteps} />
      )}

      {error && (
        <AIErrorState message={error} onRetry={onRetry} />
      )}

      <div ref={bottomRef} />
    </div>
  );
}
