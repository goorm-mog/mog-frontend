import { ReceiptText } from 'lucide-react';
import MemberAvatar from '@/components/common/MemberAvatar/MemberAvatar';
import { SETTLEMENT_SUMMARY } from '@/pages/Settlement/constants/settlementMockData';
import SectionTitle from '@/pages/Settlement/components/SectionTitle';
import type { SettlementMemberBurden } from '@/pages/Settlement/types';
import { formatTransferWon } from '@/pages/Settlement/utils/format';
import { calculateMemberTotalAmount } from '@/pages/Settlement/utils/settlementCalculator';

type MemberBurdenSectionProps = {
  members: SettlementMemberBurden[];
};

function MemberBurdenSection({ members }: MemberBurdenSectionProps) {
  return (
    <>
      <div className="mt-10 mb-4 flex items-center justify-between px-1">
        <SectionTitle
          icon={<ReceiptText size={17} strokeWidth={2.1} />}
          title="멤버별 부담금"
          meta={`${SETTLEMENT_SUMMARY.memberCount}인`}
        />
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 promise-scrollbar-hidden">
        {members.map((member) => {
          const totalAmount = calculateMemberTotalAmount(member);

          return (
            <article
              key={member.id}
              className="w-[198px] shrink-0 rounded-[5px] border border-dark-border bg-background px-4 py-4"
            >
              <div className="flex items-start justify-between gap-3">
                <MemberAvatar
                  name={member.name}
                  size="sm"
                  selected={member.id === SETTLEMENT_SUMMARY.currentRoomMemberId}
                  showCheck={false}
                  borderStyle="solid"
                  tone="point"
                  unselectedTone="muted"
                  labelTone="default"
                  labelPosition="right"
                  className="pointer-events-none"
                  tabIndex={-1}
                />
                <span className="pt-1 text-right text-[17px] leading-[21px] font-semibold">
                  {formatTransferWon(totalAmount)}
                </span>
              </div>

              <dl className="mt-4 flex flex-col gap-2 border-t border-dashed border-border pt-3">
                {member.details.map((detail) => (
                  <div
                    key={detail.id}
                    className="grid grid-cols-[minmax(0,1fr)_76px] items-center gap-3 text-[12px] leading-[15px]"
                  >
                    <dt className="truncate text-dark-border">{detail.placeName}</dt>
                    <dd className="whitespace-nowrap text-right font-semibold text-text">
                      {formatTransferWon(detail.amount)}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          );
        })}
      </div>
    </>
  );
}

export default MemberBurdenSection;
