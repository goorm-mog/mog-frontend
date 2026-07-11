import type { LucideIcon } from 'lucide-react';
import { Calendar } from 'lucide-react';
import {
  APPOINTMENT_ICON_OPTIONS,
  DEFAULT_APPOINTMENT_ICON_ID,
  type AppointmentIconId,
} from '@/pages/Home/constants/appointmentIcons';
import type { RoomInfo } from '@/types/room';

const STORAGE_KEY = 'mog-appointment-icons-v2';

type AppointmentIconStore = {
  byRoomId: Record<string, AppointmentIconId>;
  byRoomName: Record<string, AppointmentIconId>;
};

function isAppointmentIconId(value: unknown): value is AppointmentIconId {
  return APPOINTMENT_ICON_OPTIONS.some((option) => option.id === value);
}

function emptyStore(): AppointmentIconStore {
  return { byRoomId: {}, byRoomName: {} };
}

function readStore(): AppointmentIconStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as Partial<AppointmentIconStore>;
    const byRoomId: Record<string, AppointmentIconId> = {};
    const byRoomName: Record<string, AppointmentIconId> = {};

    for (const [key, value] of Object.entries(parsed.byRoomId ?? {})) {
      if (isAppointmentIconId(value)) byRoomId[key] = value;
    }
    for (const [key, value] of Object.entries(parsed.byRoomName ?? {})) {
      if (isAppointmentIconId(value)) byRoomName[key] = value;
    }

    return { byRoomId, byRoomName };
  } catch {
    return emptyStore();
  }
}

function writeStore(store: AppointmentIconStore) {
  const raw = JSON.stringify(store);
  try {
    localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    try {
      sessionStorage.setItem(STORAGE_KEY, raw);
    } catch {
      // ignore
    }
  }
}

function iconComponent(iconId: AppointmentIconId): LucideIcon {
  return (
    APPOINTMENT_ICON_OPTIONS.find((option) => option.id === iconId)?.icon ?? Calendar
  );
}

export function loadAppointmentIconMap(): Record<number, AppointmentIconId> {
  const store = readStore();
  const map: Record<number, AppointmentIconId> = {};
  for (const [key, value] of Object.entries(store.byRoomId)) {
    const roomId = Number(key);
    if (Number.isInteger(roomId) && roomId > 0) map[roomId] = value;
  }
  return map;
}

export function saveAppointmentIcon(input: {
  roomId: number;
  roomName: string;
  iconId: AppointmentIconId;
}) {
  const store = readStore();
  store.byRoomId[String(input.roomId)] = input.iconId;
  const name = input.roomName.trim();
  if (name) store.byRoomName[name] = input.iconId;
  writeStore(store);
}

export function resolveAppointmentIconId(
  room: Pick<RoomInfo, 'roomId' | 'roomName'>,
  iconMap: Record<number, AppointmentIconId>,
): AppointmentIconId {
  const fromState = iconMap[room.roomId];
  if (fromState) return fromState;

  const store = readStore();
  const fromId = store.byRoomId[String(room.roomId)];
  if (fromId) return fromId;

  const name = room.roomName.trim();
  if (name) {
    const fromName = store.byRoomName[name];
    if (fromName) return fromName;
  }

  return DEFAULT_APPOINTMENT_ICON_ID;
}

export function resolveAppointmentIcon(
  room: Pick<RoomInfo, 'roomId' | 'roomName'>,
  iconMap: Record<number, AppointmentIconId>,
): LucideIcon {
  return iconComponent(resolveAppointmentIconId(room, iconMap));
}
