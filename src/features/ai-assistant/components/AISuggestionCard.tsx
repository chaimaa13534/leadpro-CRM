import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { staggerItem } from '@/lib/motion-variants';

interface AISuggestionCardProps {
  text: string;
  category?: string;
  onClick?: () => void;
  className?: string;
}

export function AISuggestionCard({ text, category, onClick, className }: AISuggestionCardProps) {
  return (
    <motion.button
      variants={staggerItem}
      onClick={onClick}
      className={cn(
        'flex items-start gap-3 rounded-xl border border-border bg-surface p-3.5 text-left transition-all duration-200',
        'hover:border-accent/30 hover:bg-accent-subtle hover:shadow-sm',
        'active:scale-[0.98]',
        className,
      )}
    >
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent">
        <Sparkles className="h-3 w-3" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-text-primary leading-snug">{text}</p>
        {category && (
          <span className="mt-1 inline-block text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
            {category}
          </span>
        )}
      </div>
    </motion.button>
  );
}
