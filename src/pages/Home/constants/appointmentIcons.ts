import type { LucideIcon } from 'lucide-react';
import {
  Bike,
  BookOpen,
  Briefcase,
  Cake,
  Calendar,
  Camera,
  Car,
  Coffee,
  Dog,
  Dumbbell,
  Film,
  Gamepad2,
  Gift,
  Heart,
  Leaf,
  Mic2,
  Mountain,
  Music,
  PartyPopper,
  Pencil,
  Plane,
  ShoppingBag,
  Ticket,
  Users,
  Utensils,
  Video,
  Wine,
} from 'lucide-react';

export type AppointmentIconId =
  | 'calendar'
  | 'coffee'
  | 'gift'
  | 'camera'
  | 'briefcase'
  | 'utensils'
  | 'plane'
  | 'book'
  | 'music'
  | 'dumbbell'
  | 'heart'
  | 'party'
  | 'cake'
  | 'leaf'
  | 'pencil'
  | 'film'
  | 'game'
  | 'shopping'
  | 'wine'
  | 'drive'
  | 'hike'
  | 'meetup'
  | 'video-call'
  | 'karaoke'
  | 'show'
  | 'walk'
  | 'bike';

export type AppointmentIconOption = {
  id: AppointmentIconId;
  label: string;
  icon: LucideIcon;
};

export const APPOINTMENT_ICON_OPTIONS: AppointmentIconOption[] = [
  { id: 'calendar', label: '캘린더', icon: Calendar },
  { id: 'coffee', label: '커피', icon: Coffee },
  { id: 'gift', label: '선물', icon: Gift },
  { id: 'camera', label: '카메라', icon: Camera },
  { id: 'briefcase', label: '업무', icon: Briefcase },
  { id: 'utensils', label: '식사', icon: Utensils },
  { id: 'plane', label: '여행', icon: Plane },
  { id: 'book', label: '독서', icon: BookOpen },
  { id: 'music', label: '음악', icon: Music },
  { id: 'dumbbell', label: '운동', icon: Dumbbell },
  { id: 'heart', label: '하트', icon: Heart },
  { id: 'party', label: '파티', icon: PartyPopper },
  { id: 'cake', label: '케이크', icon: Cake },
  { id: 'leaf', label: '자연', icon: Leaf },
  { id: 'pencil', label: '기록', icon: Pencil },
  { id: 'film', label: '영화', icon: Film },
  { id: 'game', label: '게임', icon: Gamepad2 },
  { id: 'shopping', label: '쇼핑', icon: ShoppingBag },
  { id: 'wine', label: '술자리', icon: Wine },
  { id: 'drive', label: '드라이브', icon: Car },
  { id: 'hike', label: '등산', icon: Mountain },
  { id: 'meetup', label: '모임', icon: Users },
  { id: 'video-call', label: '화상', icon: Video },
  { id: 'karaoke', label: '노래방', icon: Mic2 },
  { id: 'show', label: '공연', icon: Ticket },
  { id: 'walk', label: '산책', icon: Dog },
  { id: 'bike', label: '라이딩', icon: Bike },
];

export const DEFAULT_APPOINTMENT_ICON_ID: AppointmentIconId = 'calendar';
