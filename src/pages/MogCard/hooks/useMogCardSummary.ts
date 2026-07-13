import { useEffect, useState } from 'react';
import { ApiError } from '@/lib/apiFetch';
import { fetchMogCardForReceipt } from '@/pages/MogCard/api/mogCard';
import type { SummaryCardResponse } from '@/pages/MogCard/types';

type SummaryState = {
  roomId: number | null;
  summary: SummaryCardResponse | null;
  errorMessage: string | null;
};

const initialSummaryState: SummaryState = {
  roomId: null,
  summary: null,
  errorMessage: null,
};

export function useMogCardSummary(roomId: number | null) {
  const [summaryState, setSummaryState] = useState<SummaryState>(initialSummaryState);
  const hasCurrentSummaryState = summaryState.roomId === roomId;
  const summary = hasCurrentSummaryState ? summaryState.summary : null;
  const errorMessage = roomId == null
    ? '잘못된 약속 정보입니다.'
    : hasCurrentSummaryState
      ? summaryState.errorMessage
      : null;
  const isLoading = roomId != null && !hasCurrentSummaryState;

  useEffect(() => {
    if (roomId == null) return;

    let ignore = false;

    fetchMogCardForReceipt(roomId)
      .then((data) => {
        if (!ignore) {
          setSummaryState({
            roomId,
            summary: data,
            errorMessage: null,
          });
        }
      })
      .catch((error: unknown) => {
        if (ignore) {
          return;
        }

        setSummaryState({
          roomId,
          summary: null,
          errorMessage: getMogCardErrorMessage(error),
        });
      });

    return () => {
      ignore = true;
    };
  }, [roomId]);

  return {
    summary,
    errorMessage,
    isLoading,
  };
}

function getMogCardErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.code === 'SETTLEMENT_NOT_CONFIRMED') {
      return '정산 확정 후 모그카드를 만들 수 있어요.';
    }

    return error.message;
  }

  return '영수증을 불러오지 못했어요.';
}
