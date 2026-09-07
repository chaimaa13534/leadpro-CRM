import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';
import { staggerContainer, staggerItem } from '@/lib/motion-variants';

interface AIThinkingIndicatorProps {
  steps?: string[];
  className?: string;
}

const DEFAULT_STEPS = ['Analyzing your request…', 'Searching knowledge base…', 'Generating response…'];

export function AIThinkingIndicator({ steps = DEFAULT_STEPS, className }: AIThinkingIndicatorProps) {
  return (
    <div className={cn('flex flex-col gap-2 rounded-xl bg-surface border border-border p-4', className)}>
      <div className="flex items-center gap-2.5 mb-1">
        <div className="flex gap-1">
          <motion.span
            className="h-2 w-2 rounded-full bg-accent"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
          />
          <motion.span
            className="h-2 w-2 rounded-full bg-accent"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
          />
          <motion.span
            className="h-2 w-2 rounded-full bg-accent"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
          />
        </div>
        <span className="text-[13px] font-medium text-text-secondary">AI is thinking…</span>
      </div>
      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-1"
      >
        {steps.map((step) => (
          <motion.li
            key={step}
            variants={staggerItem}
            className="flex items-center gap-2 text-[12px] text-text-tertiary"
          >
            <span className="h-1 w-1 rounded-full bg-accent/50" />
            {step}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
