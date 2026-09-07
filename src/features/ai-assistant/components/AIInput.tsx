import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';

interface AIInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function AIInput({ onSend, disabled = false, placeholder = 'Ask me anything about your CRM…', className }: AIInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [value]);

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn('relative flex items-end gap-2 rounded-xl border border-border bg-surface p-2 shadow-sm', className)}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-subtle text-accent">
        <Sparkles className="h-4 w-4" />
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        disabled={disabled}
        className="flex-1 resize-none bg-transparent py-2 text-[13px] text-text-primary placeholder:text-text-disabled outline-none max-h-40"
      />
      <button
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-150',
          value.trim() && !disabled
            ? 'bg-accent text-white shadow-sm hover:bg-accent-hover active:scale-95'
            : 'bg-background-tertiary text-text-disabled cursor-not-allowed',
        )}
        aria-label="Send message"
      >
        {disabled ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      </button>
    </div>
  );
}
