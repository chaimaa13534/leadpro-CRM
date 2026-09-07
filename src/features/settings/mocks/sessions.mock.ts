/* ═════════════════════════════════════════════════════════════════════
   Settings — Active Sessions Mock Data
   ═════════════════════════════════════════════════════════════════════ */

import type { SessionDevice } from '@/features/settings/types';

/** Sessions actives fictives — aucun appareil réel n’est contacté. */
export const sessionsMock: SessionDevice[] = [
  {
    id: 'session-1',
    device: 'Desktop',
    browser: 'Chrome',
    operatingSystem: 'Windows 11',
    location: 'Paris, France',
    ipAddress: '92.184.100.12',
    lastActiveAt: '2026-01-20T08:45:00.000Z',
    isCurrent: true,
  },
  {
    id: 'session-2',
    device: 'Mobile',
    browser: 'Safari',
    operatingSystem: 'iOS 18',
    location: 'Lyon, France',
    ipAddress: '82.64.201.88',
    lastActiveAt: '2026-01-19T21:10:00.000Z',
    isCurrent: false,
  },
  {
    id: 'session-3',
    device: 'Desktop',
    browser: 'Edge',
    operatingSystem: 'Windows 11',
    location: 'Bordeaux, France',
    ipAddress: '37.71.55.204',
    lastActiveAt: '2026-01-18T14:32:00.000Z',
    isCurrent: false,
  },
  {
    id: 'session-4',
    device: 'Mobile',
    browser: 'Chrome',
    operatingSystem: 'Android 15',
    location: 'Madrid, Espagne',
    ipAddress: '88.9.124.77',
    lastActiveAt: '2026-01-15T09:05:00.000Z',
    isCurrent: false,
  },
];

