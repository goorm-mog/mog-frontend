import { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import type { ScheduleSlot } from '@/features/schedule/types/schedule';

export function useConfirmStep(slots: ScheduleSlot[]) {
  const [selectedDateKey, setSelectedDateKey] = useState<string>('');
  const [userSelectedSlotId, setUserSelectedSlotId] = useState<number | null>(null);

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

  const activeSlotId = useMemo(
    () => userSelectedSlotId ?? topSlots[0]?.slotId ?? null,
    [userSelectedSlotId, topSlots],
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

  const handleDateChange = (dates: Date[]) => {
    if (dates[0]) {
      setSelectedDateKey(format(dates[0], 'yyyy-MM-dd'));
      setUserSelectedSlotId(null);
    }
  };

  const handleSlotClick = (slotId: number) => {
    setUserSelectedSlotId((prev) => (prev === slotId ? null : slotId));
  };

  return {
    availableDates,
    topSlots,
    bestDates,
    activeSlot,
    slotsForDate,
    selectedDateKey,
    activeSlotId,
    handleDateChange,
    handleSlotClick,
  };
}
