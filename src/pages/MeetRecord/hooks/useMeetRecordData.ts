import { useEffect, useState } from 'react';
import { fetchMeetingRecords } from '@/api/records';
import {
  fetchMeetDetailConfirmedSchedule,
  fetchRoomStatus,
} from '@/features/meetDetail/api/meetDetail';
import type { ConfirmedScheduleResponse } from '@/features/meetDetail/types';
import type { ReceiptCardData } from '@/pages/MeetRecord/types';
import {
  mapMeetingRecordToReceipt,
  type MeetRecordMember,
} from '@/pages/MeetRecord/utils/meetRecordMapper';
import type { RoomRecordPhoto } from '@/types/records';

type MeetRecordData = {
  roomName: string;
  roomMembers: MeetRecordMember[];
  confirmedSchedule: ConfirmedScheduleResponse | null;
  initialReceipts: ReceiptCardData[];
  initialPhotos: RoomRecordPhoto[];
};

const initialMeetRecordData: MeetRecordData = {
  roomName: '약속 기록',
  roomMembers: [],
  confirmedSchedule: null,
  initialReceipts: [],
  initialPhotos: [],
};

export function useMeetRecordData(roomId: number | null) {
  const [data, setData] = useState<MeetRecordData>(initialMeetRecordData);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadVersion, setLoadVersion] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadMeetRecord() {
      setIsLoading(true);
      setLoadError(null);

      try {
        if (roomId == null) {
          throw new Error('올바른 약속 ID가 없습니다.');
        }

        const [room, recordsResponse, schedule] = await Promise.all([
          fetchRoomStatus(roomId),
          fetchMeetingRecords(roomId),
          fetchMeetDetailConfirmedSchedule(roomId).catch(() => null),
        ]);

        if (!isMounted) return;

        const roomMembers = room.members.map((member) => {
          if (!Number.isFinite(member.roomMemberId)) {
            throw new Error('방 멤버 식별자(roomMemberId)가 응답에 없습니다.');
          }

          return {
            roomMemberId: member.roomMemberId,
            nickname: member.nickname,
          };
        });

        setData({
          roomName: room.roomName,
          roomMembers,
          confirmedSchedule: schedule,
          initialReceipts: recordsResponse.data.records
            .slice()
            .sort((a, b) => a.seq - b.seq)
            .map((record) => mapMeetingRecordToReceipt(record, roomMembers)),
          initialPhotos: recordsResponse.data.photos,
        });
        setLoadVersion((version) => version + 1);
      } catch (error) {
        if (!isMounted) return;

        setLoadError(
          error instanceof Error ? error.message : '약속 기록을 불러오는 중 오류가 발생했습니다.',
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadMeetRecord();

    return () => {
      isMounted = false;
    };
  }, [roomId]);

  return {
    ...data,
    isLoading,
    loadError,
    loadVersion,
  };
}
