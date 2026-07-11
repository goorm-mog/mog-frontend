import { useEffect, useState } from 'react';
import { fetchMeetDetail } from '@/features/meetDetail/api/meetDetail';
import type { MeetDetailData } from '@/features/meetDetail/types';
import { ApiError } from '@/lib/apiFetch';

type MeetDetailState = {
  roomId: number | null;
  data: MeetDetailData | null;
  errorMessage: string | null;
};

const initialMeetDetailState: MeetDetailState = {
  roomId: null,
  data: null,
  errorMessage: null,
};

export function useMeetDetailData(roomId: number | null) {
  const [state, setState] = useState<MeetDetailState>(initialMeetDetailState);
  const hasCurrentState = state.roomId === roomId;
  const meetDetail = hasCurrentState ? state.data : null;
  const errorMessage =
    roomId == null
      ? '방 정보를 확인할 수 없습니다.'
      : hasCurrentState
        ? state.errorMessage
        : null;
  const isLoading = roomId != null && !hasCurrentState;

  useEffect(() => {
    if (roomId == null) return;

    let ignore = false;

    fetchMeetDetail(roomId)
      .then((data) => {
        if (ignore) return;

        setState({
          roomId,
          data,
          errorMessage: null,
        });
      })
      .catch((error: unknown) => {
        if (ignore) return;

        setState({
          roomId,
          data: null,
          errorMessage:
            error instanceof ApiError ? error.message : '약속 상세 정보를 불러오지 못했어요',
        });
      });

    return () => {
      ignore = true;
    };
  }, [roomId]);

  return {
    meetDetail,
    errorMessage,
    isLoading,
  };
}
