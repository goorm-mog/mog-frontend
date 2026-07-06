import type { TransportType } from '@/features/departure/types/departure';

export const TRANSPORT_OPTIONS: { label: string; value: TransportType }[] = [
  { label: '대중교통', value: 'PUBLIC' },
  { label: '자동차', value: 'CAR' },
  { label: '도보', value: 'WALK' },
];
