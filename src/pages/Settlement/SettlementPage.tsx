import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button/Button';
import MemberBurdenSection from '@/pages/Settlement/components/MemberBurdenSection';
import MySettlementSection from '@/pages/Settlement/components/MySettlementSection';
import PlaceAdjustmentSection from '@/pages/Settlement/components/PlaceAdjustmentSection';
import SettlementHeader from '@/pages/Settlement/components/SettlementHeader';
import SettlementHero from '@/pages/Settlement/components/SettlementHero';
import { SETTLEMENT_SUMMARY } from '@/pages/Settlement/constants/settlementMockData';
import useSettlementEditor from '@/pages/Settlement/hooks/useSettlementEditor';
import { formatSettlementWon } from '@/pages/Settlement/utils/format';

function SettlementPage() {
  const navigate = useNavigate();
  const [copiedTransferId, setCopiedTransferId] = useState<string | null>(null);
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
  } = useSettlementEditor();

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-background text-text">
      <section className="min-h-0 flex-1 overflow-y-auto pb-[104px]">
        <SettlementHeader onBack={() => navigate(-1)} />

        <SettlementHero
          summary={SETTLEMENT_SUMMARY}
          allocatedTotalText={formatSettlementWon(allocatedTotalAmount)}
          remainingText={formatSettlementWon(remainingAmount)}
          hasRemainingAmount={remainingAmount !== 0}
        />

        <div className="px-[14px] pt-7">
          <PlaceAdjustmentSection
            places={placeSettlements}
            includedPlaceCount={includedPlaceCount}
            expandedPlaceIds={expandedPlaceIds}
            onTogglePlace={togglePlaceExpanded}
            onTogglePlaceIncluded={togglePlaceIncluded}
            onUpdateParticipantAmount={updatePlaceParticipantAmount}
            onApplyRemainderToMember={applyPlaceRemainderToMember}
          />

          <MemberBurdenSection members={settlementMembers} />

          <MySettlementSection
            rows={mySettlementTransferRows}
            copiedTransferId={copiedTransferId}
            onCopyTransfer={setCopiedTransferId}
          />
        </div>
      </section>

      <footer className="fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-t border-border/70 bg-background px-[14px] pt-3 pb-5">
        <Button variant="dark" size="lg" className="text-[16px] font-semibold">
          정산 완료하기
        </Button>
      </footer>
    </main>
  );
}

export default SettlementPage;
