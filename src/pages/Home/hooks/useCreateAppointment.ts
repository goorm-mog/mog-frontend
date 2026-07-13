import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '@/api/room';
import { ApiError } from '@/lib/apiFetch';
import type { RoomInfo } from '@/types/room';
import type { AppointmentIconId } from '@/pages/Home/constants/appointmentIcons';
import type { CreateAppointmentFormValues } from '@/pages/Home/components/CreateAppointmentSheet';
import { saveAppointmentIcon } from '@/pages/Home/utils/appointmentIconStorage';
import { writePendingRoom } from '@/pages/Home/utils/homeStorage';
import { mergeRooms } from '@/pages/Home/utils/homeRoomUtils';

type Options = {
  selectedGroupId: number | null;
  refreshRooms: () => Promise<RoomInfo[]>;
  setRooms: React.Dispatch<React.SetStateAction<RoomInfo[]>>;
  setIcon: (roomId: number, iconId: AppointmentIconId) => void;
  showToast: (message: string) => void;
  onSuccess: () => void;
};

export function useCreateAppointment(options: Options) {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const createAppointment = async ({ name, iconId }: CreateAppointmentFormValues) => {
    if (options.selectedGroupId === null) {
      options.showToast('약속을 만들 그룹을 먼저 선택해 주세요');
      return;
    }
    setIsCreating(true);
    try {
      const created = await createRoom(options.selectedGroupId, { roomName: name });
      const pendingRoom: RoomInfo = {
        roomId: created.roomId,
        roomName: created.roomName,
        status: created.status ?? 'VOTING',
        promiseDate: null,
      };
      writePendingRoom(options.selectedGroupId, pendingRoom);
      saveAppointmentIcon({ roomId: created.roomId, roomName: name, iconId });
      options.setIcon(created.roomId, iconId);
      const nextRooms = await options.refreshRooms();
      if (!nextRooms.some((room) => room.roomId === created.roomId)) {
        options.setRooms(mergeRooms([pendingRoom], nextRooms));
      }
      options.onSuccess();
      navigate(`/reschedule/host/${created.roomId}`);
    } catch (error: unknown) {
      options.showToast(error instanceof ApiError ? error.message : '약속을 만들지 못했어요');
    } finally {
      setIsCreating(false);
    }
  };

  return { isCreating, createAppointment };
}
