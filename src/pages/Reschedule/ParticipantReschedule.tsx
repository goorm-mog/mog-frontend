import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarClock, Clock } from 'lucide-react';
import StepHeader from '@/components/common/Header/StepHeader/StepHeader';
import Calendar from '@/components/common/Calendar/Calendar';
import Title from '@/components/common/Title/Title';
import DateTabs from '@/components/Reschedule/DateTabs';
import TimeTable from '@/components/Reschedule/TimeTable';
import VoteResultTimeList from '@/components/Reschedule/VoteResultTimeList';
import VoteCountBadge from '@/components/Reschedule/VoteCountBadge';
import TimeSectionHeader from '@/components/Reschedule/TimeSectionHeader';
import TopSlotsContent from '@/components/Reschedule/TopSlotsContent';
import BottomSheet from '@/components/common/BottomSheet/BottomSheet';
import Skeleton from '@/components/ui/Skeleton';
import { fetchRoomMembers, fetchSlots, fetchSlotsIfExists, submitVotes } from '@/api/schedule';
import { getMyUserId } from '@/lib/auth-storage';
import { useToast } from '@/hooks/useToast';
import { useVoteStep } from '@/hooks/useVoteStep';
import { useConfirmStep } from '@/hooks/useConfirmStep';
import type { RegisteredSlot, RoomMember, ScheduleSlot } from '@/types/schedule';

function ParticipantReschedule() {
  const { roomId: roomIdStr } = useParams<{ roomId: string }>();
  const roomId = Number(roomIdStr);
  const { showToast } = useToast();

  const [registeredSlots, setRegisteredSlots] = useState<RegisteredSlot[]>([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [votedCount, setVotedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [slotsReady, setSlotsReady] = useState(false);
  const [bottomSheetExpanded, setBottomSheetExpanded] = useState(true);

  const [confirmSlots, setConfirmSlots] = useState<ScheduleSlot[]>([]);
  const [confirmMembers, setConfirmMembers] = useState<RoomMember[]>([]);
  const confirmStep = useConfirmStep(confirmSlots, confirmMembers);

  const {
    timesByDate,
    availableDates,
    allSlotTimes,
    voteSelectedDates,
    activeDateKey,
    setActiveDateKey,
    voteByDate,
    voteSubStep,
    setVoteSubStep,
    baseTimes,
    datesWithNoMatch,
    canSubmit,
    onTouchStart,
    onTouchEnd,
    handleVoteDateChange,
    handleBaseTimeToggle,
    handleBaseTimeSelectSection,
    handleBaseTimeClearSection,
    handleConfirmBaseTimes,
    handleVoteToggle,
    handleVoteSelectSection,
    handleVoteClearSection,
    getVotedSlotIds,
  } = useVoteStep(registeredSlots);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await fetchSlotsIfExists(roomId);
        if (!data || data.slots.length === 0) {
          setSlotsReady(false);
          return;
        }

        setSlotsReady(true);
        setRegisteredSlots(data.slots.map(({ slotId, date, time }) => ({ slotId, date, time })));
        setTotalParticipants(data.totalParticipants);
        setVotedCount(new Set(data.slots.flatMap((s) => s.votedUserIds)).size);

        const myUserId = getMyUserId();
        const iVoted =
          myUserId !== null && data.slots.some((s) => s.votedUserIds.includes(myUserId));
        if (iVoted) {
          const membersData = await fetchRoomMembers(roomId);
          setConfirmSlots(data.slots);
          setConfirmMembers(membersData.members);
          setHasVoted(true);
        }
      } catch (e) {
        showToast(e instanceof Error ? e.message : '초기 데이터를 불러오는 데 실패했습니다.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [roomId]);

  const handleSubmit = async () => {
    const slotIds = getVotedSlotIds();
    try {
      setIsSubmitting(true);
      await submitVotes(roomId, slotIds);
      const [slotsData, membersData] = await Promise.all([
        fetchSlots(roomId),
        fetchRoomMembers(roomId),
      ]);
      setConfirmSlots(slotsData.slots);
      setTotalParticipants(slotsData.totalParticipants);
      setVotedCount(new Set(slotsData.slots.flatMap((s) => s.votedUserIds)).size);
      setConfirmMembers(membersData.members);
      setHasVoted(true);
    } catch (e) {
      showToast(e instanceof Error ? e.message : '투표에 실패했습니다.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoading && !slotsReady) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3 px-6 text-center">
        <CalendarClock size={40} className="text-dark-border" />
        <p className="font-pretendard text-[14px] text-dark-border">
          방장이 아직 일정 슬롯을 등록하지 않았어요.
          <br />
          조금 기다려주세요.
        </p>
      </div>
    );
  }

  const voteTitle = hasVoted ? '투표 결과 확인' : '날짜 투표';

  const voteSubtitle = hasVoted
    ? '날짜를 선택해 투표 현황을 확인해주세요'
    : voteSubStep === 'base'
      ? '가능한 날짜를 선택해주세요'
      : '날짜별 시간을 확인하고 조정해주세요';

  return (
    <div
      className={`flex flex-col gap-4 ${hasVoted ? (bottomSheetExpanded ? 'pb-72' : 'pb-28') : 'pb-24'}`}
    >
      <StepHeader />

      <div className="flex flex-col px-6 gap-5">
        <div className="flex items-center justify-between">
          <Title
            title={voteTitle}
            icon={CalendarClock}
            iconStrokeWidth={2}
            subtitle={{ text: voteSubtitle }}
          />
          <VoteCountBadge votedCount={votedCount} totalParticipants={totalParticipants} />
        </div>

        {isLoading ? (
          <Skeleton className="h-64" />
        ) : hasVoted ? (
          <>
            <Calendar
              mode="single"
              availableDates={confirmStep.availableDates}
              dotDates={confirmStep.bestDates}
              onSelectionChange={confirmStep.handleDateChange}
            />
            {confirmStep.selectedDateKey && (
              <VoteResultTimeList
                slots={confirmStep.slotsForDate}
                totalParticipants={totalParticipants}
                activeMemberList={confirmStep.activeMemberList}
                activeSlotId={confirmStep.activeSlotId}
                onSlotClick={confirmStep.handleSlotClick}
              />
            )}
          </>
        ) : (
          <>
            {voteSubStep === 'base' && (
              <>
                <Calendar
                  mode="multiple"
                  availableDates={availableDates}
                  onSelectionChange={handleVoteDateChange}
                  hintText={'드래그: 기간 · Shift + 드래그: 기간 추가\n클릭: 날짜 · ⌘ + 클릭: 날짜 추가'}
                />
                {voteSelectedDates.length > 0 && (
                  <>
                    <Title
                      title="기본 가능 시간"
                      icon={Clock}
                      iconStrokeWidth={2}
                      subtitle={{ text: '주로 가능한 시간을 선택해주세요' }}
                    />
                    <TimeSectionHeader
                      label="전체 선택 / 초기화"
                      onSelectAll={() => handleBaseTimeSelectSection(allSlotTimes)}
                      onClear={() => handleBaseTimeClearSection(allSlotTimes)}
                    />
                    <TimeTable
                      selectedTimes={baseTimes}
                      availableTimes={allSlotTimes}
                      onToggle={handleBaseTimeToggle}
                      onSelectSection={handleBaseTimeSelectSection}
                      onClearSection={handleBaseTimeClearSection}
                    />
                    <button
                      onClick={handleConfirmBaseTimes}
                      disabled={baseTimes.length === 0}
                      className="w-full py-2 rounded-md border border-point text-point font-pretendard font-semibold text-[13px] disabled:opacity-40"
                    >
                      날짜별 확인 →
                    </button>
                  </>
                )}
              </>
            )}

            {voteSubStep === 'adjust' && (
              <>
                <button
                  onClick={() => setVoteSubStep('base')}
                  className="self-start font-pretendard text-[12px] text-dark-border"
                >
                  ← 기본 시간 수정
                </button>
                <DateTabs
                  dates={voteSelectedDates}
                  activeDateKey={activeDateKey}
                  timesByDate={voteByDate}
                  datesWithNoMatch={datesWithNoMatch}
                  onTabClick={setActiveDateKey}
                />
                <div
                  className="flex flex-col gap-5"
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                >
                  {datesWithNoMatch.includes(activeDateKey) && (
                    <p className="font-pretendard text-[11px] text-dark-border">
                      이 날짜에는 기본 시간과 겹치는 슬롯이 없어요. 직접 선택해주세요.
                    </p>
                  )}
                  <TimeSectionHeader
                    label={`${activeDateKey}에 가능한 시간 선택`}
                    onSelectAll={() => handleVoteSelectSection(timesByDate[activeDateKey] ?? [])}
                    onClear={() => handleVoteClearSection(voteByDate[activeDateKey] ?? [])}
                  />
                  <TimeTable
                    selectedTimes={voteByDate[activeDateKey] ?? []}
                    availableTimes={timesByDate[activeDateKey] ?? []}
                    onToggle={handleVoteToggle}
                    onSelectSection={handleVoteSelectSection}
                    onClearSection={handleVoteClearSection}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>

      {hasVoted ? (
        <BottomSheet
          ctaLabel="투표가 완료되었습니다"
          onCtaClick={() => {}}
          ctaDisabled
          caption="방장이 일정을 확정해야 출발지를 입력할 수 있어요"
          onExpandedChange={setBottomSheetExpanded}
        >
          <TopSlotsContent
            topSlots={confirmStep.topSlots}
            members={confirmMembers}
            activeSlotId={confirmStep.activeSlotId}
            onSlotClick={confirmStep.handleSlotClick}
          />
        </BottomSheet>
      ) : voteSubStep === 'adjust' ? (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-97.5 px-6 py-4 bg-background z-50">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting || isLoading}
            className="w-full py-3 rounded-md bg-point text-background font-pretendard font-semibold text-[14px] disabled:opacity-40"
          >
            {isSubmitting ? '처리 중...' : '투표 완료'}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default ParticipantReschedule;
