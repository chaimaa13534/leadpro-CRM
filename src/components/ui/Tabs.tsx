import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (id: string) => void;
  className?: string;
}

/* ═══════════════════════════════════════════════════════ */
export function Tabs({ tabs, defaultTab, onChange, className }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultTab ?? tabs[0]?.id ?? '');

  const handleClick = (id: string) => {
    setActiveId(id);
    onChange?.(id);
  };

  return (
    <div className={cn('flex items-center gap-1 border-b border-border', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleClick(tab.id)}
          className={cn(
            'relative flex items-center gap-2 px-3 py-2.5 text-[13px] font-medium transition-colors duration-150',
            activeId === tab.id
              ? 'text-text-primary'
              : 'text-text-tertiary hover:text-text-secondary'
          )}
          role="tab"
          aria-selected={activeId === tab.id}
        >
          {tab.icon && <span className="shrink-0">{tab.icon}</span>}
          <span>{tab.label}</span>
          {tab.count !== undefined && (
            <span
              className={cn(
                'min-w-[20px] rounded-md px-1.5 py-0.5 text-[11px] font-medium tabular-nums',
                activeId === tab.id
                  ? 'bg-background-tertiary text-text-secondary'
                  : 'bg-transparent text-text-disabled'
              )}
            >
              {tab.count}
            </span>
          )}
          {/* Active indicator with animation */}
          {activeId === tab.id && (
            <motion.span
              layoutId="tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-accent"
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
