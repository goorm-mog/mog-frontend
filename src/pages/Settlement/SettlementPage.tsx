import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchRoom } from '@/api/rooms';
import { confirmSettlement, fetchSettlement } from '@/api/settlement';
import Button from '@/components/common/Button/Button';
import { useToast } from '@/hooks/useToast';
import MemberBurdenSection from '@/pages/Settlement/components/MemberBurdenSection';
import MySettlementSection from '@/pages/Settlement/components/MySettlementSection';
import PlaceAdjustmentSection from '@/pages/Settlement/components/PlaceAdjustmentSection';
import SettlementCompletionDialog from '@/pages/Settlement/components/SettlementCompletionDialog';
import SettlementConfirmDialog from '@/pages/Settlement/components/SettlementConfirmDialog';
import SettlementHeader from '@/pages/Settlement/components/SettlementHeader';
import SettlementHero from '@/pages/Settlement/components/SettlementHero';
import useSettlementCompletion from '@/pages/Settlement/hooks/useSettlementCompletion';
import useSettlementEditor from '@/pages/Settlement/hooks/useSettlementEditor';
import { formatSettlementWon } from '@/pages/Settlement/utils/format';
import { createSettlementViewModel } from '@/pages/Settlement/utils/settlementMapper';
import type {
  SettlementMemberBurden,
  SettlementPlacePayer,
  SettlementSummary,
} from '@/pages/Settlement/types';

const EMPTY_SUMMARY: SettlementSummary = {
  groupName: '그룹 이름',
  roomName: '약속 이름',
  datetime: '',
  statusText: '정산 대기',
  totalCost: 0,
  totalCostText: '₩ 0',
  perPersonCostText: '₩ 0',
  receiptCount: 0,
  memberCount: 0,
};

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

function SettlementPage() {
  const navigate = useNavigate();
  const { roomId: roomIdParam } = useParams<{ roomId: string }>();
  const roomId = Number(roomIdParam);
  const { showToast } = useToast();
  const [summary, setSummary] = useState<SettlementSummary>(EMPTY_SUMMARY);
  const [members, setMembers] = useState<SettlementMemberBurden[]>([]);
  const [placePayers, setPlacePayers] = useState<SettlementPlacePayer[]>([]);

  useEffect(() => {
    let ignore = false;

    async function loadSettlement() {
      if (!Number.isFinite(roomId)) return;

      try {
        const [roomResponse, settlementResponse] = await Promise.all([
          fetchRoom(roomId),
          fetchSettlement(roomId),
        ]);

        if (!settlementResponse || ignore) return;

        const viewModel = createSettlementViewModel(
          roomResponse.data,
          settlementResponse.data,
        );

        setSummary(viewModel.summary);
        setMembers(viewModel.members);
        setPlacePayers(viewModel.placePayers);
      } catch {
        if (!ignore) {
          showToast('정산 정보를 불러오지 못했습니다.', 'error');
        }
      }
    }

    void loadSettlement();

    return () => {
      ignore = true;
    };
  }, [roomId, showToast]);

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
    summary,
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
  const displaySummary = useMemo(() => ({
    ...summary,
    statusText: isSettlementCompleted ? '정산 완료' : summary.statusText,
  }), [isSettlementCompleted, summary]);
  const confirmSettlementComplete = useCallback(async () => {
    try {
      if (Number.isFinite(roomId)) {
        await confirmSettlement(roomId);
      }
      completeSettlement();
    } catch {
      showToast('정산 완료 처리에 실패했습니다.', 'error');
      closeSettlementConfirm();
    }
  }, [closeSettlementConfirm, completeSettlement, roomId, showToast]);

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
        <Button
          variant="dark"
          size="lg"
          className="text-[16px] font-semibold disabled:opacity-55"
          disabled={isSettlementCompleted}
          onClick={openSettlementConfirm}
        >
          {isSettlementCompleted ? '정산 완료' : '정산 완료하기'}
        </Button>
      </footer>

      {isConfirmOpen ? (
        <SettlementConfirmDialog
          onClose={closeSettlementConfirm}
          onConfirm={confirmSettlementComplete}
        />
      ) : null}

      {isCompletionOpen ? (
        <SettlementCompletionDialog
          remainingAmount={remainingAmount}
          countdownSeconds={countdownSeconds}
        />
      ) : null}
    </main>
  );
}

export default SettlementPage;
