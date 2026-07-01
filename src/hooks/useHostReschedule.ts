import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { confirmSchedule, fetchRoomMembers, fetchSlots, fetchSlotsIfExists, registerSlots, submitVotes } from '@/api/schedule';
import { getMyUserId } from '@/lib/auth-storage';
import { useToast } from '@/hooks/useToast';
import { useVoteStep } from '@/hooks/useVoteStep';
import { useConfirmStep } from '@/hooks/useConfirmStep';
import type { RegisteredSlot, RoomMember, ScheduleSlot } from '@/types/schedule';

export type HostStep = 'create' | 'vote' | 'confirm';

export function useHostReschedule(roomId: number) {
  const { showToast } = useToast();

  const [step, setStep] = useState<HostStep>('create');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // create step
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [timesByDate, setTimesByDate] = useState<Record<string, string[]>>({});
  const [pendingTimes, setPendingTimes] = useState<string[]>([]);
  const [targetDateKeys, setTargetDateKeys] = useState<string[]>([]);

  // vote step — 슬롯 등록 후 API 응답에서 채워짐
  const [registeredSlots, setRegisteredSlots] = useState<RegisteredSlot[]>([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [votedCount, setVotedCount] = useState(0);
  const voteStep = useVoteStep(registeredSlots);

  // confirm step
  const [confirmSlots, setConfirmSlots] = useState<ScheduleSlot[]>([]);
  const [confirmMembers, setConfirmMembers] = useState<RoomMember[]>([]);
  const confirmStep = useConfirmStep(confirmSlots, confirmMembers);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const slotsData = await fetchSlotsIfExists(roomId);
        if (!slotsData || slotsData.slots.length === 0) return; // create step 유지

        setRegisteredSlots(slotsData.slots.map(({ slotId, date, time }) => ({ slotId, date, time })));
        setTotalParticipants(slotsData.totalParticipants);
        setVotedCount(new Set(slotsData.slots.flatMap((s) => s.votedUserIds)).size);
        setStep('vote');

        const myUserId = getMyUserId();
        const iVoted =
          myUserId !== null && slotsData.slots.some((s) => s.votedUserIds.includes(myUserId));
        if (!iVoted) return; // vote step 유지

        const [slotsConfirm, membersData] = await Promise.all([
          fetchSlots(roomId),
          fetchRoomMembers(roomId),
        ]);
        setConfirmSlots(slotsConfirm.slots);
        setConfirmMembers(membersData.members);
        setStep('confirm');
      } catch (e) {
        showToast(e instanceof Error ? e.message : '초기 데이터를 불러오는 데 실패했습니다.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [roomId]);

  const handleDateChange = (dates: Date[]) => {
    setSelectedDates(dates);
    const newKeys = dates.map((d) => format(d, 'yyyy-MM-dd'));
    setTimesByDate((prev) => {
      const next: Record<string, string[]> = {};
      newKeys.forEach((key) => {
        next[key] = prev[key] ?? [];
      });
      return next;
    });
    setTargetDateKeys((prev) => prev.filter((k) => newKeys.includes(k)));
  };

  const handleToggle = (time: string) => {
    setPendingTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time],
    );
  };

  const handleSelectSection = (times: string[]) => {
    setPendingTimes((prev) => [...new Set([...prev, ...times])]);
  };

  const handleClearSection = (times: string[]) => {
    setPendingTimes((prev) => prev.filter((t) => !times.includes(t)));
  };

  const handleTargetToggle = (key: string) => {
    if (pendingTimes.length === 0) return;
    setTargetDateKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const handleTargetSelectAll = () => {
    if (pendingTimes.length === 0) return;
    setTargetDateKeys(selectedDates.map((d) => format(d, 'yyyy-MM-dd')));
  };

  const handleTargetClearAll = () => {
    setTargetDateKeys([]);
  };

  const handleApply = () => {
    if (pendingTimes.length === 0 || targetDateKeys.length === 0) return;
    setTimesByDate((prev) => {
      const next = { ...prev };
      targetDateKeys.forEach((key) => {
        next[key] = [...pendingTimes];
      });
      return next;
    });
    setPendingTimes([]);
    setTargetDateKeys([]);
  };

  const canSubmit = (() => {
    if (step === 'create') {
      return (
        selectedDates.length > 0 &&
        selectedDates.every((d) => {
          const key = format(d, 'yyyy-MM-dd');
          return (timesByDate[key]?.length ?? 0) > 0;
        })
      );
    }
    if (step === 'vote') return voteStep.canSubmit;
    if (step === 'confirm') return confirmStep.topSlots.length > 0;
    return false;
  })();

  const handleCTA = async () => {
    if (step === 'create') {
      const slots = selectedDates.flatMap((d) => {
        const key = format(d, 'yyyy-MM-dd');
        return (timesByDate[key] ?? []).map((time) => ({ date: key, time }));
      });
      try {
        setIsSubmitting(true);
        await registerSlots(roomId, slots);
        const slotsData = await fetchSlots(roomId);
        setRegisteredSlots(
          slotsData.slots.map(({ slotId, date, time }) => ({ slotId, date, time })),
        );
        setTotalParticipants(slotsData.totalParticipants);
        setVotedCount(new Set(slotsData.slots.flatMap((s) => s.votedUserIds)).size);
        setStep('vote');
      } catch (e) {
        showToast(e instanceof Error ? e.message : '슬롯 등록에 실패했습니다.', 'error');
      } finally {
        setIsSubmitting(false);
      }
    } else if (step === 'vote') {
      const slotIds = voteStep.getVotedSlotIds();
      try {
        setIsSubmitting(true);
        await submitVotes(roomId, slotIds);
        const [slotsData, membersData] = await Promise.all([
          fetchSlots(roomId),
          fetchRoomMembers(roomId),
        ]);
        setConfirmSlots(slotsData.slots);
        setTotalParticipants(slotsData.totalParticipants);
        setConfirmMembers(membersData.members);
        setStep('confirm');
      } catch (e) {
        showToast(e instanceof Error ? e.message : '투표 제출에 실패했습니다.', 'error');
      } finally {
        setIsSubmitting(false);
      }
    } else if (step === 'confirm') {
      const slotToConfirm = confirmStep.activeSlot ?? confirmStep.topSlots[0];
      if (!slotToConfirm) return;
      try {
        setIsSubmitting(true);
        await confirmSchedule(roomId, slotToConfirm.date, slotToConfirm.time);
        showToast('일정이 확정되었습니다.', 'success');
      } catch (e) {
        showToast(e instanceof Error ? e.message : '일정 확정에 실패했습니다.', 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return {
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
  };
}
