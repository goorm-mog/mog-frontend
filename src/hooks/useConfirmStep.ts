import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import type { RoomMember, ScheduleSlot } from '@/types/schedule';

export function useConfirmStep(slots: ScheduleSlot[], members: RoomMember[]) {
  const [selectedDateKey, setSelectedDateKey] = useState<string>('');
  const [activeSlotId, setActiveSlotId] = useState<number | null>(null);

  const availableDates = useMemo(
    () => [...new Set(slots.map((s) => s.date))].map((d) => parseISO(d)),
    [slots],
  );

  const topSlots = useMemo(
    () =>
      [...slots]
        .sort((a, b) =>
          b.voteCount !== a.voteCount
            ? b.voteCount - a.voteCount
            : `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
        )
        .slice(0, 5),
    [slots],
  );

  const bestDates = useMemo(() => {
    if (topSlots.length === 0) return [];
    const maxVote = topSlots[0].voteCount;
    return [...new Set(topSlots.filter((s) => s.voteCount === maxVote).map((s) => s.date))].map(
      (d) => parseISO(d),
    );
  }, [topSlots]);

  const slotsForDate = useMemo(
    () =>
      [...slots.filter((s) => s.date === selectedDateKey)].sort(
        (a, b) => b.voteCount - a.voteCount,
      ),
    [slots, selectedDateKey],
  );

  const activeSlot = useMemo(
    () => slots.find((s) => s.slotId === activeSlotId) ?? null,
    [slots, activeSlotId],
  );

  const activeMemberList = useMemo(() => {
    if (activeSlotId === null) return [];
    const slot = slots.find((s) => s.slotId === activeSlotId);
    return (slot?.votedUserIds ?? [])
      .map((uid) => members.find((m) => m.userId === uid))
      .filter((m): m is RoomMember => m !== undefined);
  }, [activeSlotId, slots, members]);

  const handleDateChange = (dates: Date[]) => {
    if (dates[0]) {
      setSelectedDateKey(format(dates[0], 'yyyy-MM-dd'));
      setActiveSlotId(null);
    }
  };

  const handleSlotClick = (slotId: number) => {
    setActiveSlotId((prev) => (prev === slotId ? null : slotId));
  };

  return {
    availableDates,
    topSlots,
    bestDates,
    activeSlot,
    slotsForDate,
    activeMemberList,
    selectedDateKey,
    activeSlotId,
    handleDateChange,
    handleSlotClick,
  };
}
