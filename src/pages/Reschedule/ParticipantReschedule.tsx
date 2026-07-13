import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarClock, Clock } from 'lucide-react';
import StepHeader from '@/components/common/Header/StepHeader/StepHeader';
import Calendar from '@/components/common/Calendar/Calendar';
import Title from '@/components/common/Title/Title';
import DateTabs from '@/features/schedule/components/DateTabs';
import TimeTable from '@/features/schedule/components/TimeTable';
import VoteResultTimeList from '@/features/schedule/components/VoteResultTimeList';
import VoteCountBadge from '@/components/common/VoteCountBadge/VoteCountBadge';
import TimeSectionHeader from '@/features/schedule/components/TimeSectionHeader';
import TopSlotsContent from '@/features/schedule/components/TopSlotsContent';
import BottomSheet from '@/components/common/BottomSheet/BottomSheet';
import Skeleton from '@/components/ui/Skeleton';
import {
  fetchRoomMembers,
  fetchSlots,
  fetchSlotsIfExists,
  submitVotes,
} from '@/features/schedule/api/schedule';
import { getMyUserId } from '@/lib/auth-storage';
import { useToast } from '@/hooks/useToast';
import { useVoteStep } from '@/features/schedule/hooks/useVoteStep';
import { useConfirmStep } from '@/features/schedule/hooks/useConfirmStep';
import type { RegisteredSlot, ScheduleSlot } from '@/features/schedule/types/schedule';
import { countUniqueVoters } from '@/features/schedule/utils/slotUtils';
import { RoomStatusContext } from '@/components/common/RoomGuard';
import { useRoomStepNavigation } from '@/hooks/useRoomStepNavigation';

function ParticipantReschedule() {
  const { roomId: roomIdStr } = useParams<{ roomId: string }>();
  const roomId = Number(roomIdStr);
  const { showToast } = useToast();
  const { phase } = useContext(RoomStatusContext);
  const stepNavigation = useRoomStepNavigation(1);
  const isRevisitingSchedule =
    phase === 'DEPARTURE_INPUT' || phase === 'MIDPOINT_FINDING' || phase === 'COMPLETED';

  const [registeredSlots, setRegisteredSlots] = useState<RegisteredSlot[]>([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [votedCount, setVotedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [existingVotedSlotIds, setExistingVotedSlotIds] = useState<number[]>([]);
  const [slotsReady, setSlotsReady] = useState(false);
  const [bottomSheetExpanded, setBottomSheetExpanded] = useState(true);

  const [confirmSlots, setConfirmSlots] = useState<ScheduleSlot[]>([]);
  const confirmStep = useConfirmStep(confirmSlots);

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
    initializeVotes,
  } = useVoteStep(registeredSlots);

  useEffect(() => {
    const init = async () => {
      try {
        const [data, roomData] = await Promise.all([
          fetchSlotsIfExists(roomId),
          fetchRoomMembers(roomId),
        ]);

        if (!data || data.slots.length === 0) {
          setSlotsReady(false);
          return;
        }

        setSlotsReady(true);
        const uniqueVoterCount = countUniqueVoters(data.slots);
        setRegisteredSlots(
          data.slots.map(({ slotId, date, time }) => ({ slotId, date, time: time.slice(0, 5) })),
        );
        setTotalParticipants(Math.max(roomData.members.length, uniqueVoterCount));
        setVotedCount(uniqueVoterCount);

        const myUserId = getMyUserId();
        const iVoted =
          myUserId !== null && data.slots.some((s) => s.votedUserIds.includes(myUserId));
        if (iVoted) {
          const myVotedSlots = data.slots.filter((slot) => slot.votedUserIds.includes(myUserId));
          setExistingVotedSlotIds(myVotedSlots.map((slot) => slot.slotId));
          setConfirmSlots(data.slots.map((slot) => ({ ...slot, time: slot.time.slice(0, 5) })));
          if (isRevisitingSchedule) {
            initializeVotes(
              myVotedSlots.map(({ slotId, date, time }) => ({
                slotId,
                date,
                time: time.slice(0, 5),
              })),
            );
          } else {
            setHasVoted(true);
          }
        }
      } catch (e) {
        showToast(
          e instanceof Error ? e.message : '초기 데이터를 불러오는 데 실패했습니다.',
          'error',
        );
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [initializeVotes, isRevisitingSchedule, roomId, showToast]);

  const handleSubmit = async () => {
    const slotIds = getVotedSlotIds();
    const idsToToggle = isRevisitingSchedule
      ? [...new Set([...existingVotedSlotIds, ...slotIds])].filter(
          (slotId) => existingVotedSlotIds.includes(slotId) !== slotIds.includes(slotId),
        )
      : slotIds;
    try {
      setIsSubmitting(true);
      if (idsToToggle.length > 0) await submitVotes(roomId, idsToToggle);
      const [slotsData, membersData] = await Promise.all([
        fetchSlots(roomId),
        fetchRoomMembers(roomId),
      ]);
      setConfirmSlots(slotsData.slots.map((slot) => ({ ...slot, time: slot.time.slice(0, 5) })));
      const uniqueVoterCount = countUniqueVoters(slotsData.slots);
      setTotalParticipants(Math.max(membersData.members.length, uniqueVoterCount));
      setVotedCount(uniqueVoterCount);
      setExistingVotedSlotIds(slotIds);
      setHasVoted(!isRevisitingSchedule);
      if (isRevisitingSchedule) showToast('투표가 수정되었습니다.', 'success');
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
      <StepHeader currentStep={1} {...stepNavigation} />

      <div className="flex flex-col px-6 gap-5">
        <div className="flex items-center justify-between">
          <Title
            title={voteTitle}
            icon={CalendarClock}
            iconStrokeWidth={2}
            subtitle={{ text: voteSubtitle }}
          />
          {!hasVoted && (
            <VoteCountBadge votedCount={votedCount} totalParticipants={totalParticipants} />
          )}
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
                  hintText={
                    '드래그: 기간 · Shift + 드래그: 기간 추가\n클릭: 날짜 · ⌘ + 클릭: 날짜 추가'
                  }
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
            activeSlotId={confirmStep.activeSlotId}
            onSlotClick={confirmStep.handleSlotClick}
          />
        </BottomSheet>
      ) : voteSubStep === 'adjust' ? (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-107.5 px-6 py-4 bg-background z-50">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting || isLoading}
            className="w-full py-3 rounded-md bg-point text-background font-pretendard font-semibold text-[14px] disabled:opacity-40"
          >
            {isSubmitting ? '처리 중...' : isRevisitingSchedule ? '투표 수정 완료' : '투표 완료'}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default ParticipantReschedule;
