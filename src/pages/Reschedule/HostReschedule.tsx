import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarClock, Clock } from 'lucide-react';
import StepHeader from '@/components/common/Header/StepHeader/StepHeader';
import Calendar from '@/components/common/Calendar/Calendar';
import Title from '@/components/common/Title/Title';
import DateTabs from '@/components/Reschedule/DateTabs';
import DateCheckboxes from '@/components/Reschedule/DateCheckboxes';
import TimeTable from '@/components/Reschedule/TimeTable';
import VoteResultTimeList from '@/components/Reschedule/VoteResultTimeList';
import VoteCountBadge from '@/components/Reschedule/VoteCountBadge';
import TimeSectionHeader from '@/components/Reschedule/TimeSectionHeader';
import TopSlotsContent from '@/components/Reschedule/TopSlotsContent';
import BottomSheet from '@/components/common/BottomSheet/BottomSheet';
import Skeleton from '@/components/ui/Skeleton';
import { useHostReschedule } from '@/hooks/useHostReschedule';

const CTA_LABEL = {
  create: '슬롯 열기',
  vote: '투표 완료',
  confirm: '일정 확정하기',
} as const;

function HostReschedule() {
  const { roomId: roomIdStr } = useParams<{ roomId: string }>();
  const roomId = Number(roomIdStr);
  const [bottomSheetExpanded, setBottomSheetExpanded] = useState(true);

  const {
    step,
    isLoading,
    isSubmitting,
    totalParticipants,
    votedCount,
    selectedDates,
    timesByDate,
    pendingTimes,
    targetDateKeys,
    canSubmit,
    voteStep,
    confirmStep,
    confirmMembers,
    handleDateChange,
    handleToggle,
    handleSelectSection,
    handleClearSection,
    handleTargetToggle,
    handleTargetSelectAll,
    handleTargetClearAll,
    handleApply,
    handleCTA,
  } = useHostReschedule(roomId);

  const {
    availableDates: voteAvailableDates,
    timesByDate: voteTimesByDate,
    allSlotTimes,
    voteSelectedDates,
    activeDateKey,
    setActiveDateKey,
    voteByDate,
    voteSubStep,
    setVoteSubStep,
    baseTimes,
    datesWithNoMatch,
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
  } = voteStep;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 pb-24">
        <StepHeader />
        <div className="px-6">
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const showFixedCTA = step === 'create' || (step === 'vote' && voteSubStep === 'adjust');

  return (
    <div
      className={`flex flex-col gap-4 ${step === 'confirm' ? (bottomSheetExpanded ? 'pb-72' : 'pb-28') : 'pb-24'}`}
    >
      <StepHeader />

      <div className="flex flex-col px-6 gap-5">
        {step === 'create' && (
          <>
            <Title
              title="날짜 선택"
              icon={CalendarClock}
              iconStrokeWidth={2}
              subtitle={{ text: '슬롯을 열 날짜를 모두 선택해주세요' }}
            />
            <Calendar
              mode="multiple"
              onSelectionChange={handleDateChange}
              hintText={
                '드래그: 기간 · Shift + 드래그: 기간 추가\n클릭: 날짜 · ⌘ + 클릭: 날짜 추가'
              }
            />

            {selectedDates.length > 0 && (
              <>
                <Title
                  title="시간 선택"
                  icon={Clock}
                  iconStrokeWidth={2}
                  subtitle={{ text: '열 시간대를 선택하고 적용할 날짜를 지정해주세요' }}
                />
                <TimeTable
                  selectedTimes={pendingTimes}
                  onToggle={handleToggle}
                  onSelectSection={handleSelectSection}
                  onClearSection={handleClearSection}
                />
                <DateCheckboxes
                  dates={selectedDates}
                  targetDateKeys={targetDateKeys}
                  timesByDate={timesByDate}
                  onToggle={handleTargetToggle}
                  onSelectAll={handleTargetSelectAll}
                  onClearAll={handleTargetClearAll}
                  disabled={pendingTimes.length === 0}
                />
                <button
                  onClick={handleApply}
                  disabled={pendingTimes.length === 0 || targetDateKeys.length === 0}
                  className="w-full py-2 rounded-md border border-point text-point font-pretendard font-semibold text-[13px] disabled:opacity-40"
                >
                  선택한 날짜에 적용
                </button>
              </>
            )}
          </>
        )}

        {step === 'vote' && (
          <>
            <div className="flex items-center justify-between">
              <Title
                title="날짜 투표"
                icon={CalendarClock}
                iconStrokeWidth={2}
                subtitle={{
                  text: voteSubStep === 'base'
                    ? '가능한 날짜를 선택해주세요'
                    : '날짜별 시간을 확인하고 조정해주세요',
                }}
              />
              <VoteCountBadge votedCount={votedCount} totalParticipants={totalParticipants} />
            </div>

            {voteSubStep === 'base' && (
              <>
                <Calendar
                  mode="multiple"
                  availableDates={voteAvailableDates}
                  onSelectionChange={handleVoteDateChange}
                  hintText={'드래그: 기간 · Shift+드래그: 기간 추가\n클릭: 날짜 · ⌘+클릭: 날짜 추가'}
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
                    onSelectAll={() => handleVoteSelectSection(voteTimesByDate[activeDateKey] ?? [])}
                    onClear={() => handleVoteClearSection(voteByDate[activeDateKey] ?? [])}
                  />
                  <TimeTable
                    selectedTimes={voteByDate[activeDateKey] ?? []}
                    availableTimes={voteTimesByDate[activeDateKey] ?? []}
                    onToggle={handleVoteToggle}
                    onSelectSection={handleVoteSelectSection}
                    onClearSection={handleVoteClearSection}
                  />
                </div>
              </>
            )}
          </>
        )}

        {step === 'confirm' && (
          <>
            <div className="flex items-center justify-between">
              <Title
                title="투표 결과 확인"
                icon={CalendarClock}
                iconStrokeWidth={2}
                subtitle={{ text: '날짜를 선택해 투표 현황을 확인해주세요' }}
              />
              <VoteCountBadge votedCount={votedCount} totalParticipants={totalParticipants} />
            </div>
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
        )}
      </div>

      {showFixedCTA ? (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-97.5 px-6 py-4 bg-background">
          <button
            onClick={handleCTA}
            disabled={!canSubmit || isSubmitting}
            className="w-full py-3 rounded-md bg-point text-background font-pretendard font-semibold text-[14px] disabled:opacity-40"
          >
            {isSubmitting ? '처리 중...' : CTA_LABEL[step]}
          </button>
        </div>
      ) : step === 'confirm' ? (
        <BottomSheet
          ctaLabel={isSubmitting ? '처리 중...' : CTA_LABEL.confirm}
          onCtaClick={handleCTA}
          ctaDisabled={!canSubmit || isSubmitting}
          caption="방장만 확정할 수 있어요"
          onExpandedChange={setBottomSheetExpanded}
        >
          <TopSlotsContent
            topSlots={confirmStep.topSlots}
            members={confirmMembers}
            activeSlotId={confirmStep.activeSlotId}
            onSlotClick={confirmStep.handleSlotClick}
          />
        </BottomSheet>
      ) : null}
    </div>
  );
}

export default HostReschedule;
