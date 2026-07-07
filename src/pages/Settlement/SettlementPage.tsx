import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/common/Button/Button';
import {
  calculateSettlement,
  confirmSettlement,
  fetchSettlement,
} from '@/features/settlement/api/settlement';
import {
  mapSettlementToMemberBurdens,
  mapSettlementToPlacePayers,
} from '@/features/settlement/utils/settlementMapper';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiFetch';
import MemberBurdenSection from '@/pages/Settlement/components/MemberBurdenSection';
import MySettlementSection from '@/pages/Settlement/components/MySettlementSection';
import PlaceAdjustmentSection from '@/pages/Settlement/components/PlaceAdjustmentSection';
import SettlementCompletionDialog from '@/pages/Settlement/components/SettlementCompletionDialog';
import SettlementConfirmDialog from '@/pages/Settlement/components/SettlementConfirmDialog';
import SettlementHeader from '@/pages/Settlement/components/SettlementHeader';
import SettlementHero from '@/pages/Settlement/components/SettlementHero';
import { SETTLEMENT_SUMMARY } from '@/pages/Settlement/constants/settlementMockData';
import useSettlementCompletion from '@/pages/Settlement/hooks/useSettlementCompletion';
import useSettlementEditor from '@/pages/Settlement/hooks/useSettlementEditor';
import type {
  SettlementMemberBurden,
  SettlementPlacePayer,
  SettlementSummary,
} from '@/pages/Settlement/types';
import { formatSettlementWon } from '@/pages/Settlement/utils/format';

async function copyTextToClipboard(text: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    if (!document.execCommand('copy')) {
      throw new Error('Copy command failed');
    }
  } finally {
    document.body.removeChild(textarea);
  }
}

type SettlementContentProps = {
  roomId: number;
  summary: SettlementSummary;
  members: SettlementMemberBurden[];
  placePayers: SettlementPlacePayer[];
};

function getSettlementErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    switch (error.code) {
      case 'SETTLEMENT_NOT_FOUND':
        return '정산 정보가 아직 생성되지 않았습니다.';
      case 'NO_RECORDS':
        return '등록된 차수 기록이 없어 정산을 계산할 수 없습니다.';
      case 'NOT_HOST':
        return '방장만 정산을 완료할 수 있습니다.';
      case 'ALREADY_CONFIRMED':
        return '이미 완료된 정산입니다.';
      default:
        return error.message;
    }
  }

  return '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
}

function SettlementContent({
  roomId,
  summary,
  members,
  placePayers,
}: SettlementContentProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isConfirmingSettlement, setIsConfirmingSettlement] = useState(false);
  const navigateToMeetDetail = useCallback(() => {
    navigate('/meet-detail');
  }, [navigate]);
  const copyAccountToClipboard = useCallback(
    async (accountText: string) => {
      try {
        await copyTextToClipboard(accountText);
        showToast('복사완료', 'success');
      } catch {
        showToast('계좌 복사에 실패했습니다.', 'error');
      }
    },
    [showToast],
  );
  const {
    isConfirmOpen,
    isCompletionOpen,
    countdownSeconds,
    isSettlementCompleted,
    openSettlementConfirm,
    closeSettlementConfirm,
    completeSettlement,
  } = useSettlementCompletion({
    initiallyCompleted: summary.statusText === '정산 완료',
    onCompleteRedirect: navigateToMeetDetail,
  });
  const {
    placeSettlements,
    expandedPlaceIds,
    settlementMembers,
    allocatedTotalAmount,
    includedPlaceCount,
    remainingAmount,
    mySettlementTransferRows,
    togglePlaceExpanded,
    togglePlaceIncluded,
    updatePlaceParticipantAmount,
    applyPlaceRemainderToMember,
    saveCurrentDraft,
  } = useSettlementEditor({
    members,
    placePayers,
    roomId,
    currentRoomMemberId: summary.currentRoomMemberId,
  });
  const saveDraft = useCallback(() => {
    try {
      saveCurrentDraft();
      showToast('중간 저장되었습니다.', 'success');
    } catch {
      showToast('저장에 실패했습니다.', 'error');
    }
  }, [saveCurrentDraft, showToast]);
  const hasRemainingAmount = remainingAmount !== 0;
  const displaySummary = {
    ...summary,
    statusText: isSettlementCompleted ? '정산 완료' : summary.statusText,
  };
  const handleConfirmSettlement = useCallback(async () => {
    if (hasRemainingAmount) {
      showToast('잔액이 0원이 되어야 정산을 완료할 수 있습니다.', 'error');
      return;
    }

    try {
      setIsConfirmingSettlement(true);
      await confirmSettlement(roomId);
      completeSettlement();
    } catch (error) {
      showToast(getSettlementErrorMessage(error), 'error');
    } finally {
      setIsConfirmingSettlement(false);
    }
  }, [completeSettlement, hasRemainingAmount, roomId, showToast]);

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-background text-text">
      <section className="min-h-0 flex-1 overflow-y-auto pb-[104px]">
        <SettlementHeader onBack={() => navigate(-1)} onSave={saveDraft} />

        <SettlementHero
          summary={displaySummary}
          allocatedTotalText={formatSettlementWon(allocatedTotalAmount)}
          remainingText={formatSettlementWon(remainingAmount)}
          hasRemainingAmount={hasRemainingAmount}
        />

        <div className="px-[14px] pt-7">
          <PlaceAdjustmentSection
            places={placeSettlements}
            includedPlaceCount={includedPlaceCount}
            currentRoomMemberId={summary.currentRoomMemberId}
            expandedPlaceIds={expandedPlaceIds}
            onTogglePlace={togglePlaceExpanded}
            onTogglePlaceIncluded={togglePlaceIncluded}
            onUpdateParticipantAmount={updatePlaceParticipantAmount}
            onApplyRemainderToMember={applyPlaceRemainderToMember}
          />

          <MemberBurdenSection
            members={settlementMembers}
            memberCount={summary.memberCount}
            currentRoomMemberId={summary.currentRoomMemberId}
          />

          <MySettlementSection
            rows={mySettlementTransferRows}
            onCopyAccount={copyAccountToClipboard}
          />
        </div>
      </section>

      <footer className="fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-t border-border/70 bg-background px-[14px] pt-3 pb-5">
        {hasRemainingAmount && !isSettlementCompleted ? (
          <p className="mb-2 text-center text-[12px] leading-[16px] font-semibold text-alert">
            잔액이 남아있어요!
          </p>
        ) : null}
        <Button
          variant="dark"
          size="lg"
          className="text-[16px] font-semibold disabled:opacity-55"
          disabled={isSettlementCompleted || hasRemainingAmount}
          onClick={openSettlementConfirm}
        >
          {isSettlementCompleted
            ? '정산 완료'
            : hasRemainingAmount
              ? '잔액을 맞춰주세요'
              : '정산 완료하기'}
        </Button>
      </footer>

      {isConfirmOpen ? (
        <SettlementConfirmDialog
          onClose={closeSettlementConfirm}
          onConfirm={handleConfirmSettlement}
          isConfirming={isConfirmingSettlement}
        />
      ) : null}

      {isCompletionOpen ? (
        <SettlementCompletionDialog
          countdownSeconds={countdownSeconds}
        />
      ) : null}
    </main>
  );
}

function SettlementPage() {
  const { roomId: roomIdParam } = useParams<{ roomId: string }>();
  const roomId = Number(roomIdParam);
  const isValidRoomId = Number.isFinite(roomId);
  const [settlement, setSettlement] = useState<{
    summary: SettlementSummary;
    members: SettlementMemberBurden[];
    placePayers: SettlementPlacePayer[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(isValidRoomId);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    isValidRoomId ? null : '유효하지 않은 모임입니다.',
  );

  useEffect(() => {
    if (!isValidRoomId) return;

    let ignore = false;

    const loadSettlement = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        setSettlement(null);

        let settlementResponse;
        try {
          settlementResponse = await fetchSettlement(roomId);
        } catch (error) {
          if (
            error instanceof ApiError &&
            error.status === 404 &&
            (!error.code || error.code === 'SETTLEMENT_NOT_FOUND')
          ) {
            settlementResponse = await calculateSettlement(roomId);
          } else {
            throw error;
          }
        }

        if (ignore) return;

        setSettlement({
          summary: {
            ...SETTLEMENT_SUMMARY,
            statusText: settlementResponse.isConfirmed ? '정산 완료' : '정산 대기',
            totalCost: settlementResponse.totalCost,
            totalCostText: formatSettlementWon(settlementResponse.totalCost),
            perPersonCostText: formatSettlementWon(
              Math.round(
                settlementResponse.totalCost /
                  Math.max(settlementResponse.memberSettlements.length, 1),
              ),
            ),
            memberCount: settlementResponse.memberSettlements.length,
          },
          members: mapSettlementToMemberBurdens(
            settlementResponse,
            SETTLEMENT_SUMMARY.currentRoomMemberId,
          ),
          placePayers: mapSettlementToPlacePayers(settlementResponse),
        });
      } catch (error) {
        if (ignore) return;

        setErrorMessage(getSettlementErrorMessage(error));
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    void loadSettlement();

    return () => {
      ignore = true;
    };
  }, [isValidRoomId, roomId]);

  if (isLoading) {
    return (
      <main className="flex h-screen items-center justify-center bg-background px-6 text-center text-text">
        <p className="text-[14px] font-medium text-dark-border">
          정산 정보를 불러오는 중입니다.
        </p>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="flex h-screen items-center justify-center bg-background px-6 text-center text-text">
        <p className="text-[14px] font-medium text-dark-border">{errorMessage}</p>
      </main>
    );
  }

  if (!settlement) {
    return (
      <main className="flex h-screen items-center justify-center bg-background px-6 text-center text-text">
        <p className="text-[14px] font-medium text-dark-border">
          정산 정보를 불러오지 못했습니다.
        </p>
      </main>
    );
  }

  return (
    <SettlementContent
      roomId={roomId}
      summary={settlement.summary}
      members={settlement.members}
      placePayers={settlement.placePayers}
    />
  );
}

export default SettlementPage;
