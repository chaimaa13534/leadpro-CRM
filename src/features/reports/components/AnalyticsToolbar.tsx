/* ═════════════════════════════════════════════════════════════════════
   Reports & Analytics — AnalyticsToolbar
   Quick action toolbar with tab switching
   ═════════════════════════════════════════════════════════════════════ */

import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  DollarSign,
  Target,
  Users,
  GitBranch,
  Trophy,
  Table,
  LayoutGrid,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import type { ReportTab } from '@/features/reports/types';

interface AnalyticsToolbarProps {
  activeTab: ReportTab;
  onTabChange: (tab: ReportTab) => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const tabs: { id: ReportTab; label: string; icon: typeof BarChart3 }[] = [
  { id: 'overview', label: 'Vue globale', icon: BarChart3 },
  { id: 'sales', label: 'Ventes', icon: DollarSign },
  { id: 'leads', label: 'Leads', icon: Target },
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'opportunities', label: 'Opportunités', icon: GitBranch },
  { id: 'team', label: 'Équipe', icon: Trophy },
  { id: 'tables', label: 'Tableaux', icon: Table },
];

export const AnalyticsToolbar = memo(function AnalyticsToolbar({
  activeTab,
  onTabChange,
  onToggleSidebar,
  sidebarOpen,
}: AnalyticsToolbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between gap-2 flex-wrap"
    >
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-all',
                isActive
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-tertiary hover:text-text-secondary hover:bg-surface-hover',
              )}
              role="tab"
              aria-selected={isActive}
            >
              <Icon className="size-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sidebar Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleSidebar}
        aria-label={sidebarOpen ? 'Fermer les filtres' : 'Ouvrir les filtres'}
      >
        <LayoutGrid className="size-3.5" />
        <span className="hidden sm:inline">Filtres</span>
      </Button>
    </motion.div>
  );
});
