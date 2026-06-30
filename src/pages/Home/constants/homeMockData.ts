import type { LucideIcon } from 'lucide-react';
import { Building2, Camera, Coffee, Image, SquarePen, Users } from 'lucide-react';

export type HomeTab = 'all' | 'calendar' | 'list';

export const HOME_INITIAL_MONTH = new Date(2026, 6, 1);
export const HOME_DEFAULT_SELECTED = new Date(2026, 6, 1);

export const HOME_MARKED_DAYS = [1, 3, 4, 6, 7, 9, 11, 12, 14, 17, 20, 23, 27, 29] as const;

export const HOME_MARKED_DATES = HOME_MARKED_DAYS.map((day) => new Date(2026, 6, day));

export type HomeScheduleItem = {
  id: string;
  date: string;
  title: string;
  location: string;
  startTime: string;
  endTime: string;
  icon: LucideIcon;
  locationIcon: LucideIcon;
};

export const HOME_SCHEDULES: HomeScheduleItem[] = [
  {
    id: 'schedule-1',
    date: '2026-07-01',
    title: 'A컷 촬영 모임',
    location: 'Studio A',
    startTime: '10:00',
    endTime: '11:30',
    icon: SquarePen,
    locationIcon: Camera,
  },
  {
    id: 'schedule-2',
    date: '2026-07-01',
    title: '여름 휴가 아카이브',
    location: 'Family Archive',
    startTime: '14:00',
    endTime: '15:30',
    icon: Users,
    locationIcon: Building2,
  },
  {
    id: 'schedule-3',
    date: '2026-07-01',
    title: '전시회 관람 기록',
    location: 'Gallery Hall',
    startTime: '16:30',
    endTime: '17:30',
    icon: Coffee,
    locationIcon: Image,
  },
];

export type HomeArchivalItem = {
  id: string;
  title: string;
  datetime: string;
  location: string;
  totalAmount: string;
  meta: { label: string; value: string }[];
};

export const HOME_ARCHIVAL_ITEMS: HomeArchivalItem[] = [
  {
    id: 'archival-1',
    title: '브랜드 촬영 A컷',
    datetime: '2026.07.10 (금) 10:00 - 14:00',
    location: 'MOG Room A',
    totalAmount: '₩350,000',
    meta: [
      { label: '예약자', value: 'MOG Studio' },
      { label: '예약 번호', value: '#260710-A1' },
    ],
  },
  {
    id: 'archival-2',
    title: '제품 촬영 - 여름 컬렉션',
    datetime: '2026.07.11 (토) 11:00 - 17:00',
    location: 'MOG Room B',
    totalAmount: '₩520,000',
    meta: [
      { label: '예약자', value: 'Frame Works' },
      { label: '예약 번호', value: '#260711-B2' },
    ],
  },
  {
    id: 'archival-3',
    title: '유튜브 콘텐츠 촬영',
    datetime: '2026.07.12 (일) 13:00 - 18:00',
    location: 'MOG Room A',
    totalAmount: '₩280,000',
    meta: [
      { label: '예약자', value: 'Creator J' },
      { label: '예약 번호', value: '#260712-A1' },
    ],
  },
];
