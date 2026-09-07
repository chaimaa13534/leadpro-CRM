import { motion } from 'framer-motion';
import { LeadsChart } from '@/features/dashboard/components/LeadsChart';
import { SalesChart } from '@/features/dashboard/components/SalesChart';
import { RevenueChart } from '@/features/dashboard/components/RevenueChart';
import { OpportunitiesDistributionChart } from '@/features/dashboard/components/OpportunitiesDistributionChart';

/**
 * Grille des 4 graphiques du Dashboard. `ResponsiveContainer` (Recharts)
 * gère déjà le redimensionnement à l'intérieur de chaque carte ; cette
 * grille ne fait que réorganiser les cartes elles-mêmes selon la largeur
 * d'écran.
 */
export function DashboardCharts() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.2, 0, 0, 1], delay: 0.05 }}
      className="grid grid-cols-1 gap-4 laptop:grid-cols-2"
    >
      <LeadsChart />
      <SalesChart />
      <RevenueChart />
      <OpportunitiesDistributionChart />
    </motion.div>
  );
}
