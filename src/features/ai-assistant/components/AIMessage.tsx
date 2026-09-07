import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';
import { slideUpVariants } from '@/lib/motion-variants';
import { AIResponseRenderer } from './AIResponseRenderer';
import { AIMessageActions } from './AIMessageActions';
import type { AIMessage as IAIMessage } from '../types/ai.types';

interface AIMessageProps {
  message: IAIMessage;
  onCopy?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  className?: string;
}

export function AIMessage({ message, onCopy, onLike, onDislike, className }: AIMessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      variants={slideUpVariants}
      initial="hidden"
      animate="visible"
      className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row', className)}
    >
      {/* Avatar */}
      <div
        className={cn(
          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser ? 'bg-accent text-white' : 'bg-gradient-to-br from-accent to-[#6d7af0] text-white',
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </div>

      {/* Content */}
      <div className={cn('flex max-w-[80%] flex-col gap-1', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isUser
              ? 'bg-accent text-white rounded-tr-md'
              : 'bg-surface border border-border rounded-tl-md',
          )}
        >
          {isUser ? (
            <p className="text-[13px] leading-relaxed">{message.content}</p>
          ) : (
            <AIResponseRenderer content={message.content} />
          )}
        </div>

        {/* Metadata */}
        {(isUser ? null : message.metadata?.processingTime) && (
          <span className="px-1 text-[10px] text-text-tertiary">
            Processed in {(message.metadata?.processingTime ?? 0) / 1000}s
          </span>
        )}

        {/* Actions (only for assistant messages) */}
        {!isUser && message.actions && (
          <AIMessageActions
            actions={message.actions}
            onCopy={onCopy}
            onLike={onLike}
            onDislike={onDislike}
            className="px-2 mt-1"
          />
        )}
      </div>
    </motion.div>
  );
}
