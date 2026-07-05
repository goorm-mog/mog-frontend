import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button/Button';
import { useToast } from '@/hooks/useToast';
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

function SettlementPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
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
    initiallyCompleted: SETTLEMENT_SUMMARY.statusText === '정산 완료',
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
  } = useSettlementEditor();
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
    ...SETTLEMENT_SUMMARY,
    statusText: isSettlementCompleted ? '정산 완료' : SETTLEMENT_SUMMARY.statusText,
  };

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
            currentRoomMemberId={SETTLEMENT_SUMMARY.currentRoomMemberId}
            expandedPlaceIds={expandedPlaceIds}
            onTogglePlace={togglePlaceExpanded}
            onTogglePlaceIncluded={togglePlaceIncluded}
            onUpdateParticipantAmount={updatePlaceParticipantAmount}
            onApplyRemainderToMember={applyPlaceRemainderToMember}
          />

          <MemberBurdenSection
            members={settlementMembers}
            memberCount={SETTLEMENT_SUMMARY.memberCount}
            currentRoomMemberId={SETTLEMENT_SUMMARY.currentRoomMemberId}
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
          onConfirm={completeSettlement}
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
