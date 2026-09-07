import { motion } from 'framer-motion';
import { Target, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { staggerContainer, staggerItem } from '@/lib/motion-variants';
import { formatCurrency } from '@/utils/formatCurrency';
import { cn } from '@/lib/cn';
import type { AILeadAnalysis as IAILeadAnalysis } from '../types/ai.types';

interface AILeadAnalysisProps {
  analyses: IAILeadAnalysis[];
  className?: string;
}

const RISK_VARIANT: Record<string, 'success' | 'warning' | 'danger'> = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
};

const RISK_ICON: Record<string, typeof TrendingUp> = {
  low: TrendingUp,
  medium: Minus,
  high: TrendingDown,
};

export function AILeadAnalysis({ analyses, className }: AILeadAnalysisProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={cn('space-y-3', className)}
    >
      <h3 className="text-[15px] font-semibold text-text-primary flex items-center gap-2">
        <Target className="h-4 w-4 text-accent" />
        Lead Analysis
      </h3>

      {analyses.map((analysis, index) => {
        const RiskIcon = RISK_ICON[analysis.risk] ?? Minus;
        const riskVariant = RISK_VARIANT[analysis.risk] ?? 'warning';

        return (
          <motion.div key={analysis.id} variants={staggerItem}>
            <Card variant="outlined" padding="md">
              <CardContent className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-[13px] font-semibold text-text-primary">{analysis.leadName}</h4>
                    <p className="text-[11px] text-text-tertiary">Score: {analysis.score}/100</p>
                  </div>
                  <Badge variant={riskVariant} size="sm" dot>
                    {analysis.risk} risk
                  </Badge>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-text-tertiary">Conversion probability</span>
                      <span className="text-[11px] font-medium text-text-primary tabular-nums">{analysis.conversionProbability}%</span>
                    </div>
                    <Progress value={analysis.conversionProbability} variant={riskVariant} size="sm" />
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-text-tertiary">Potential value</p>
                    <p className="text-[13px] font-semibold text-text-primary tabular-nums">{formatCurrency(analysis.potentialValue)}</p>
                  </div>
                </div>

                <p className="text-[12px] text-text-tertiary leading-relaxed">{analysis.reasoning}</p>

                <div className="flex items-center gap-2 text-[11px]">
                  <RiskIcon className="h-3.5 w-3.5 text-text-tertiary" />
                  <span className="text-accent font-medium">{analysis.recommendedAction}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
