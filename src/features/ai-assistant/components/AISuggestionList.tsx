import { motion } from 'framer-motion';
import { staggerContainer } from '@/lib/motion-variants';
import { AISuggestionCard } from './AISuggestionCard';
import type { AISuggestedPrompt } from '../types/ai.types';

interface AISuggestionListProps {
  suggestions: AISuggestedPrompt[];
  onSelect: (text: string) => void;
}

export function AISuggestionList({ suggestions, onSelect }: AISuggestionListProps) {
  if (suggestions.length === 0) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid gap-2 sm:grid-cols-2"
    >
      {suggestions.map((suggestion) => (
        <AISuggestionCard
          key={suggestion.id}
          text={suggestion.text}
          category={suggestion.category}
          onClick={() => onSelect(suggestion.text)}
        />
      ))}
    </motion.div>
  );
}
