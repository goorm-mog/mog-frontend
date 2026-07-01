import { cn } from '@/lib/utils';
import type { SettlementRound } from '@/pages/PromiseDetail/constants/promiseDetailMockData';

const detailRows = [
  { label: '주소', key: 'address' },
  { label: '메뉴', key: 'menu' },
  { label: '총 비용', key: 'totalCost' },
  { label: '계산자', key: 'payer' },
  { label: '참여자', key: 'participants' },
  { label: '메모', key: 'memo' },
] as const;

type SettlementCardProps = {
  round: SettlementRound;
};

function SettlementCard({ round }: SettlementCardProps) {
  return (
    <article className="relative shrink-0 overflow-hidden rounded-[5px] border border-dark-border bg-background">
      <span className="absolute top-0 right-[22px] flex h-[36px] w-[42px] items-center justify-center rounded-b-[5px] bg-dark-border text-[14px] leading-[17px] font-semibold text-background">
        {round.seq}차
      </span>

      <div className="px-3 pt-[29px] pb-8">
        <div className="min-w-0 px-4">
          <h2 className="mb-[18px] text-[20px] leading-[24px] font-semibold text-text">
            {round.placeName}
          </h2>
          <dl className="flex flex-col gap-[5px]">
            {detailRows.map((row) => (
              <div key={row.key} className="grid grid-cols-[54px_1fr] items-start gap-2">
                <dt className="text-[12px] leading-[15px] font-semibold text-text">{row.label}</dt>
                <dd
                  className={cn(
                    'min-w-0 pb-[1px] text-[12px] leading-[19px] text-dark-border',
                    row.key === 'totalCost' ? 'font-semibold' : 'font-normal',
                  )}
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 1px 17px, var(--color-border) 1px, transparent 1.2px)',
                    backgroundPosition: 'left top',
                    backgroundSize: '6px 18px',
                  }}
                >
                  {round[row.key]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="overflow-x-auto border-t border-border/70 px-[18px] py-[16px]">
        <div className="flex w-max items-center gap-4">
          {Array.from({ length: round.imageCount }).map((_, index) => {
            const photoUrl = round.photoUrls?.[index];

            return (
              <div
                key={`${round.seq}-image-${index}`}
                className={cn(
                  'w-[60px] shrink-0 overflow-hidden rounded-[5px] border bg-background',
                  index === 0 ? 'border-2 border-point' : 'border-border/60',
                )}
              >
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={`${round.placeName} 사진 ${index + 1}`}
                    className="h-auto w-[60px] object-contain"
                  />
                ) : (
                  <div className="aspect-[60/84] w-[60px]" aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}

export default SettlementCard;
