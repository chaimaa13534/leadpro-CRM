import { cn } from '@/lib/cn';

export type OpportunityDetailTab =
  | 'overview'
  | 'timeline'
  | 'notes'
  | 'documents'
  | 'history';

export interface OpportunityTabsProps {
  activeTab: OpportunityDetailTab;
  onChange: (tab: OpportunityDetailTab) => void;
}

const TABS: { value: OpportunityDetailTab; label: string }[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'notes', label: 'Notes' },
  { value: 'documents', label: 'Documents' },
  { value: 'history', label: 'Historique' },
];

export function OpportunityTabs({ activeTab, onChange }: OpportunityTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Sections de la fiche opportunité"
      className="flex gap-1 overflow-x-auto border-b border-border"
    >
      {TABS.map((tab) => {
        const isActive = tab.value === activeTab;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={cn(
              'relative shrink-0 px-4 py-2.5 text-body font-medium whitespace-nowrap transition-colors duration-150',
              isActive
                ? 'text-primary-700 dark:text-primary-300'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            {tab.label}
            {isActive ? (
              <span
                className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-primary-600"
                aria-hidden="true"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

