import type { AIKpiData } from '../types/ai.types';

export const aiKpiDataMock: AIKpiData[] = [
  {
    label: 'Pipeline Value',
    value: '€1.24M',
    change: 18.4,
    description: 'Total pipeline value this quarter',
    trend: 'up',
  },
  {
    label: 'Won Deals',
    value: '34',
    change: 12.2,
    description: 'Deals closed this quarter',
    trend: 'up',
  },
  {
    label: 'At Risk',
    value: '7',
    change: -5.3,
    description: 'Deals requiring attention',
    trend: 'down',
  },
  {
    label: 'Win Rate',
    value: '34%',
    change: 3.0,
    description: 'Current win rate',
    trend: 'up',
  },
];

