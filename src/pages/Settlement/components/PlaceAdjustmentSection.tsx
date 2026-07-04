import { Check, ChevronDown, ReceiptText, X } from 'lucide-react';
import MemberAvatar from '@/components/common/MemberAvatar/MemberAvatar';
import { SETTLEMENT_SUMMARY } from '@/pages/Settlement/constants/settlementMockData';
import SectionTitle from '@/pages/Settlement/components/SectionTitle';
import type { PlaceSettlement } from '@/pages/Settlement/types';
import { formatTransferWon } from '@/pages/Settlement/utils/format';
import { calculatePlaceAllocatedAmount } from '@/pages/Settlement/utils/settlementCalculator';
import { cn } from '@/lib/utils';

type PlaceAdjustmentSectionProps = {
  places: PlaceSettlement[];
  includedPlaceCount: number;
  expandedPlaceIds: Set<string>;
  onTogglePlace: (placeId: string) => void;
  onTogglePlaceIncluded: (placeId: string) => void;
  onUpdateParticipantAmount: (placeId: string, memberId: number, amount: number) => void;
  onApplyRemainderToMember: (placeId: string, memberId: number) => void;
};

function PlaceAdjustmentSection({
  places,
  includedPlaceCount,
  expandedPlaceIds,
  onTogglePlace,
  onTogglePlaceIncluded,
  onUpdateParticipantAmount,
  onApplyRemainderToMember,
}: PlaceAdjustmentSectionProps) {
  return (
    <>
      <div className="mb-5 flex items-center justify-between px-1">
        <SectionTitle
          icon={<ReceiptText size={17} strokeWidth={2.1} />}
          title="장소별 부담금 조정"
          meta={`${places.length}건 중 ${includedPlaceCount}건 정산 포함`}
        />
      </div>

      <div className="flex flex-col gap-4">
        {places.map((place) => {
          const allocatedAmount = calculatePlaceAllocatedAmount(place);
          const placeRemainder = place.targetAmount - allocatedAmount;
          const remainderLabel = placeRemainder > 0 ? '덜 배분됨' : '초과 배분됨';
          const adjustmentPrefix = placeRemainder > 0 ? '+' : '-';
          const isExpanded = expandedPlaceIds.has(place.id);

          return (
            <article
              key={place.id}
              className={cn(
                'rounded-[5px] border bg-background px-5 py-5 transition-colors',
                place.included
                  ? 'border-dark-border'
                  : 'border-border text-dark-border',
              )}
            >
              <div className="grid grid-cols-[1fr_auto_36px] items-start gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-[18px] leading-[22px] font-semibold">
                    {place.placeName}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] leading-[15px] font-semibold text-dark-border">
                    <span>총 {formatTransferWon(place.targetAmount)}</span>
                    <span className="text-border">|</span>
                    <span>결제자 {place.payerName}</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={place.included}
                    className={cn(
                      'mt-3 inline-flex h-7 items-center gap-1.5 rounded-[5px] border px-2.5 text-[12px] leading-[15px] font-semibold transition-colors',
                      place.included
                        ? 'border-point bg-point text-background'
                        : 'border-border bg-dark-background text-dark-border',
                    )}
                    onClick={() => onTogglePlaceIncluded(place.id)}
                  >
                    {place.included ? (
                      <Check size={13} strokeWidth={2.4} />
                    ) : (
                      <X size={13} strokeWidth={2.4} />
                    )}
                    {place.included ? '정산 포함' : '정산 제외'}
                  </button>
                </div>
                <div className="flex min-h-[54px] shrink-0 items-center text-right">
                  <div>
                    <strong
                      className={cn(
                        'block text-[18px] leading-[22px] font-semibold',
                        place.included ? 'text-text' : 'text-dark-border',
                      )}
                    >
                      {place.included ? formatTransferWon(allocatedAmount) : '제외'}
                    </strong>
                    {!place.included ? (
                      <span className="mt-1 block text-[11px] leading-[13px] font-semibold text-dark-border">
                        합계 미반영
                      </span>
                    ) : null}
                  </div>
                </div>
                <button
                  type="button"
                  className="grid size-8 place-items-center rounded-[5px] border border-dark-border text-dark-border"
                  onClick={() => onTogglePlace(place.id)}
                  aria-label={`${place.placeName} 부담금 ${isExpanded ? '접기' : '펼치기'}`}
                  aria-expanded={isExpanded}
                >
                  <ChevronDown
                    size={18}
                    strokeWidth={2.2}
                    className={cn(
                      'transition-transform',
                      isExpanded ? 'rotate-180' : 'rotate-0',
                    )}
                  />
                </button>
              </div>

              {isExpanded ? (
                <>
                  <dl className="mt-5 flex flex-col gap-3 border-t border-dashed border-border pt-4">
                    {place.participants.map((participant) => (
                      <div
                        key={participant.memberId}
                        className="grid grid-cols-[1fr_104px] items-center gap-3"
                      >
                        <dt className="flex min-w-0 items-center gap-2">
                          <MemberAvatar
                            name={participant.name}
                            size="sm"
                            selected={
                              participant.memberId === SETTLEMENT_SUMMARY.currentRoomMemberId
                            }
                            showCheck={false}
                            borderStyle="solid"
                            tone="point"
                            unselectedTone="muted"
                            labelTone="default"
                            labelPosition="right"
                            className="pointer-events-none"
                            tabIndex={-1}
                          />
                        </dt>
                        <dd className="flex items-center justify-end gap-1 font-semibold text-text">
                          <input
                            type="number"
                            min={0}
                            step={1000}
                            value={participant.amount}
                            disabled={!place.included}
                            className={cn(
                              'h-8 w-[84px] border-b border-dashed bg-transparent text-right text-[14px] leading-[17px] outline-none',
                              place.included
                                ? 'border-dark-border text-text'
                                : 'border-border text-dark-border',
                            )}
                            aria-label={`${participant.name} ${place.placeName} 부담금`}
                            onChange={(event) =>
                              onUpdateParticipantAmount(
                                place.id,
                                participant.memberId,
                                Number(event.target.value),
                              )
                            }
                          />
                          <span className="text-[12px] leading-[15px]">원</span>
                        </dd>
                      </div>
                    ))}
                  </dl>

                  {place.included && placeRemainder !== 0 ? (
                    <div className="mt-4 border-t border-dashed border-border pt-4">
                      <p className="text-[12px] leading-[17px] font-semibold text-alert">
                        {remainderLabel} {formatTransferWon(Math.abs(placeRemainder))}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {place.participants.map((participant) => (
                          <button
                            key={`${place.id}-${participant.memberId}-adjust`}
                            type="button"
                            className="rounded-[5px] bg-dark-background px-2.5 py-1.5 text-[12px] leading-[15px] font-semibold text-dark-border"
                            onClick={() =>
                              onApplyRemainderToMember(place.id, participant.memberId)
                            }
                          >
                            {participant.name} {adjustmentPrefix}
                            {formatTransferWon(Math.abs(placeRemainder))}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : null}
            </article>
          );
        })}
      </div>
    </>
  );
}

export default PlaceAdjustmentSection;
