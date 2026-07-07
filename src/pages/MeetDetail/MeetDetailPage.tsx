import { ClipboardList } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchMeetDetail } from '@/api/meetDetail';
import Button from '@/components/common/Button/Button';
import StepHeader from '@/components/common/Header/StepHeader/StepHeader';
import TopAppBar from '@/components/common/TopAppBar/TopAppBar';
import { ApiError } from '@/lib/apiFetch';
import SettlementCard from '@/pages/MeetDetail/components/SettlementCard';
import type { MeetDetailData } from '@/types/meetDetail';

function MeetDetailPage() {
  const navigate = useNavigate();
  const { roomId: roomIdParam } = useParams<{ roomId: string }>();
  const roomId = Number(roomIdParam);
  const isValidRoomId = Number.isFinite(roomId);
  const [meetDetail, setMeetDetail] = useState<MeetDetailData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    isValidRoomId ? null : '방 정보를 확인할 수 없습니다.',
  );

  useEffect(() => {
    if (!isValidRoomId) return;

    let ignore = false;

    fetchMeetDetail(roomId)
      .then((data) => {
        if (ignore) return;
        setMeetDetail(data);
        setErrorMessage(null);
      })
      .catch((error: unknown) => {
        if (ignore) return;
        const message =
          error instanceof ApiError ? error.message : '약속 상세 정보를 불러오지 못했어요';
        setErrorMessage(message);
      });

    return () => {
      ignore = true;
    };
  }, [isValidRoomId, roomId]);

  const isLoading = isValidRoomId && meetDetail === null && errorMessage === null;

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
                {meetDetail?.summary.title ?? '약속 상세'}
              </h1>
              <p className="text-caption text-dark-border">
                {meetDetail?.summary.datetime ?? '불러오는 중'}
              </p>
            </div>

            <div className="flex items-center justify-center border-l border-dashed border-border">
              <Button
                variant="point"
                size="md"
                fullWidth={false}
                className="gap-2 text-[16px] font-semibold"
                disabled={!meetDetail}
                onClick={() => {
                  if (meetDetail) navigate(`/${meetDetail.summary.roomId}/mog-card`);
                }}
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
                {meetDetail?.summary.perPersonCost ?? '₩ 0'}
              </span>
            </div>
          </div>
        </StepHeader>

        <section className="mt-[22px] flex min-h-0 flex-1 flex-col gap-[23px] overflow-y-auto px-[14px] pb-[19px]">
          {isLoading ? (
            <p className="py-8 text-center text-xs text-dark-border">
              약속 상세 정보를 불러오는 중입니다.
            </p>
          ) : errorMessage ? (
            <p className="py-8 text-center text-xs text-dark-border">{errorMessage}</p>
          ) : meetDetail && meetDetail.rounds.length > 0 ? (
            meetDetail.rounds.map((round) => <SettlementCard key={round.id} round={round} />)
          ) : (
            <p className="py-8 text-center text-xs text-dark-border">아직 기록된 내역이 없습니다.</p>
          )}
        </section>
      </main>
    </>
  );
}

export default MeetDetailPage;
