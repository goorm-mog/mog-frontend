import { ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button/Button';
import StepHeader from '@/components/common/Header/StepHeader/StepHeader';
import TopAppBar from '@/components/common/TopAppBar/TopAppBar';
import SettlementCard from '@/pages/PromiseDetail/components/SettlementCard';
import {
  PROMISE_DETAIL,
  SETTLEMENT_ROUNDS,
} from '@/pages/PromiseDetail/constants/promiseDetailMockData';

function PromiseDetailPage() {
  const navigate = useNavigate();

  return (
    <>
      <TopAppBar
        title="기록"
        showBack
        className="fixed top-0 left-1/2 z-50 w-full max-w-[390px] -translate-x-1/2"
        rightSlot={<span aria-hidden className="block size-4" />}
        onBack={() => navigate(-1)}
      />

      <main className="flex h-screen flex-col overflow-hidden bg-background pt-[50px]">
        <StepHeader
          showStep={false}
          wrapperClassName="px-[14px] pt-[19px] pb-0"
          contentClassName="flex flex-col p-0"
        >
          <div className="grid min-h-[112px] grid-cols-[1fr_130px]">
            <div className="flex flex-col justify-center gap-2 px-6">
              <h1 className="text-[23px] leading-[28px] font-semibold text-text">
                {PROMISE_DETAIL.title}
              </h1>
              <p className="text-caption text-dark-border">{PROMISE_DETAIL.datetime}</p>
            </div>

            <div className="flex items-center justify-center border-l border-dashed border-border">
              <Button
                variant="point"
                size="md"
                fullWidth={false}
                className="gap-2 text-[16px] font-semibold"
              >
                <ClipboardList size={18} strokeWidth={2.2} />
                로그
              </Button>
            </div>
          </div>

          <div className="flex h-[55px] items-center justify-between border-t border-dashed border-border px-6">
            <span className="text-[12px] leading-[15px] font-semibold text-text">정산 요약</span>
            <div className="flex items-center gap-4">
              <span className="text-[14px] leading-[17px] font-medium text-text">1인당</span>
              <span className="text-[22px] leading-[27px] font-semibold text-text">
                {PROMISE_DETAIL.perPersonCost}
              </span>
            </div>
          </div>
        </StepHeader>

        <section className="mt-[22px] flex min-h-0 flex-1 flex-col gap-[23px] overflow-y-auto px-[14px] pb-[19px]">
          {SETTLEMENT_ROUNDS.map((round) => (
            <SettlementCard key={round.id} round={round} />
          ))}
        </section>
      </main>
    </>
  );
}

export default PromiseDetailPage;
