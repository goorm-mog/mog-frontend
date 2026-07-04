import { SendHorizontal } from 'lucide-react';
import SectionTitle from '@/pages/Settlement/components/SectionTitle';
import type { SettlementTransferRow } from '@/pages/Settlement/types';
import {
  formatTransferDelta,
  formatTransferWon,
} from '@/pages/Settlement/utils/format';
import { cn } from '@/lib/utils';

type MySettlementSectionProps = {
  rows: SettlementTransferRow[];
  copiedTransferId: string | null;
  onCopyTransfer: (transferId: string) => void;
};

function MySettlementSection({
  rows,
  copiedTransferId,
  onCopyTransfer,
}: MySettlementSectionProps) {
  return (
    <>
      <div className="mt-8 mb-4 flex items-center justify-between px-1">
        <SectionTitle
          icon={<SendHorizontal size={17} strokeWidth={2.1} />}
          title="내 정산 내역"
          meta={`${rows.length}건`}
        />
      </div>

      <div className="flex flex-col gap-3">
        {rows.map(({ transfer, originalAmount, amountDelta, isRemoved }, index) => {
          const isCopied = copiedTransferId === transfer.id;
          const isSend = transfer.direction === 'send';

          return (
            <article
              key={transfer.id}
              className="relative overflow-hidden rounded-[5px] border border-dark-border bg-background"
            >
              <span className="absolute top-0 right-[18px] flex h-[32px] w-[38px] items-center justify-center rounded-b-[5px] bg-dark-border text-[13px] leading-[16px] font-semibold text-background">
                {index + 1}
              </span>

              <div className="px-5 pt-5 pb-4">
                <div className="pr-12">
                  <p
                    className={cn(
                      'w-fit rounded-[5px] px-2 py-1 text-[12px] leading-[15px] font-semibold',
                      isSend
                        ? 'bg-point text-background'
                        : 'bg-dark-background text-dark-border',
                    )}
                  >
                    {isSend ? '보낼 돈' : '받을 돈'}
                  </p>
                  <strong className="mt-3 block text-[25px] leading-[30px] font-semibold">
                    {formatTransferWon(transfer.amount)}
                  </strong>
                  <p className="mt-2 text-[14px] leading-[17px] font-semibold text-dark-border">
                    {isSend ? `${transfer.to}에게 보내기` : `${transfer.from}에게 받기`}
                  </p>
                  <p
                    className={cn(
                      'mt-2 text-[12px] leading-[15px] font-semibold',
                      amountDelta === 0 ? 'text-dark-border' : 'text-alert',
                    )}
                  >
                    기존 {formatTransferWon(originalAmount)} ·{' '}
                    {isRemoved ? '내역 없어짐' : formatTransferDelta(amountDelta)}
                  </p>
                </div>

                <dl className="mt-4 flex flex-col gap-1 border-t border-dashed border-border pt-4 text-[12px] leading-[18px]">
                  {transfer.breakdown.map((item) => (
                    <div
                      key={`${transfer.transferKey}-${item.placeName}-${item.direction}`}
                      className="grid grid-cols-[1fr_auto] gap-3"
                    >
                      <dt className="truncate text-dark-border">{item.placeName}</dt>
                      <dd className="font-semibold text-text">
                        {item.direction === 'send' ? '보낼' : '받을'}{' '}
                        {formatTransferWon(item.amount)}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-4 grid grid-cols-[62px_1fr] gap-y-1 border-t border-dashed border-border pt-4 text-[12px] leading-[18px]">
                  <span className="font-semibold">{isSend ? '은행' : '내 은행'}</span>
                  <span className="text-dark-border">{transfer.bankText}</span>
                  <span className="font-semibold">{isSend ? '계좌' : '내 계좌'}</span>
                  {isRemoved ? (
                    <span className="text-dark-border">{transfer.accountText}</span>
                  ) : (
                    <button
                      type="button"
                      className="w-fit bg-transparent p-0 text-left text-dark-border underline decoration-dashed underline-offset-3"
                      onClick={() => onCopyTransfer(transfer.id)}
                    >
                      {isCopied ? '복사 완료' : transfer.accountText}
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        {rows.length === 0 ? (
          <div className="rounded-[5px] border border-dashed border-border px-5 py-6 text-center text-[13px] leading-[18px] font-semibold text-dark-border">
            지금은 보내거나 받을 정산이 없습니다.
          </div>
        ) : null}
      </div>
    </>
  );
}

export default MySettlementSection;
