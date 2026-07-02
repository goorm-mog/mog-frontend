import { useState, useMemo } from 'react';
import { format, parse } from 'date-fns';
import { useSwipe } from '@/hooks/useSwipe';
import type { RegisteredSlot } from '@/types/schedule';

export function useVoteStep(registeredSlots: RegisteredSlot[]) {
  // 슬롯 → 날짜별 사용 가능한 시간 목록
  const timesByDate = useMemo<Record<string, string[]>>(() => {
    const map: Record<string, string[]> = {};
    registeredSlots.forEach(({ date, time }) => {
      if (!map[date]) map[date] = [];
      if (!map[date].includes(time)) map[date].push(time);
    });
    return map;
  }, [registeredSlots]);

  // 슬롯 → (date, time) → slotId 매핑 (투표 제출 시 사용)
  const slotIdMap = useMemo<Record<string, Record<string, number>>>(() => {
    const map: Record<string, Record<string, number>> = {};
    registeredSlots.forEach(({ slotId, date, time }) => {
      if (!map[date]) map[date] = {};
      map[date][time] = slotId;
    });
    return map;
  }, [registeredSlots]);

  // 달력 availableDates prop용 Date 배열
  const availableDates = useMemo<Date[]>(() => {
    return Object.keys(timesByDate).map((dateStr) =>
      parse(dateStr, 'yyyy-MM-dd', new Date()),
    );
  }, [timesByDate]);

  // 이 방 슬롯에 있는 시간 전체 합집합 (기본 시간 선택 화면에서 사용)
  const allSlotTimes = useMemo<string[]>(() => {
    const times = new Set<string>();
    registeredSlots.forEach(({ time }) => times.add(time));
    return [...times].sort();
  }, [registeredSlots]);

  const [voteSelectedDates, setVoteSelectedDates] = useState<Date[]>([]);
  const [activeDateKey, setActiveDateKey] = useState<string>('');
  const [voteByDate, setVoteByDate] = useState<Record<string, string[]>>({});

  const sortedDateKeys = useMemo(
    () => voteSelectedDates.map((d) => format(d, 'yyyy-MM-dd')).sort(),
    [voteSelectedDates],
  );

  const { onTouchStart, onTouchEnd } = useSwipe(
    () => {
      const idx = sortedDateKeys.indexOf(activeDateKey);
      if (idx >= 0 && idx < sortedDateKeys.length - 1) setActiveDateKey(sortedDateKeys[idx + 1]);
    },
    () => {
      const idx = sortedDateKeys.indexOf(activeDateKey);
      if (idx > 0) setActiveDateKey(sortedDateKeys[idx - 1]);
    },
  );

  // 서브스텝: 'base' = 기본 시간 선택, 'adjust' = 날짜별 조정
  const [voteSubStep, setVoteSubStep] = useState<'base' | 'adjust'>('base');
  const [baseTimes, setBaseTimes] = useState<string[]>([]);

  // 교집합이 없는 날짜 키 목록 (adjust 단계에서 ! 표시용)
  const datesWithNoMatch = useMemo<string[]>(() => {
    return voteSelectedDates
      .map((d) => format(d, 'yyyy-MM-dd'))
      .filter((key) => (voteByDate[key] ?? []).length === 0);
  }, [voteSelectedDates, voteByDate]);

  const canSubmit = Object.values(voteByDate).some((times) => times.length > 0);

  // --- 날짜 선택 ---

  const handleVoteDateChange = (dates: Date[]) => {
    const newKeys = dates.map((d) => format(d, 'yyyy-MM-dd')).sort();
    setVoteSelectedDates(dates);
    if (!newKeys.includes(activeDateKey)) {
      setActiveDateKey(newKeys[0] ?? '');
    }
    // 날짜가 바뀌면 base 단계로 초기화
    setVoteSubStep('base');
    setBaseTimes([]);
    setVoteByDate({});
  };

  // --- 기본 시간 핸들러 ---

  const handleBaseTimeToggle = (time: string) => {
    setBaseTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time],
    );
  };

  const handleBaseTimeSelectSection = (times: string[]) => {
    setBaseTimes((prev) => [...new Set([...prev, ...times])]);
  };

  const handleBaseTimeClearSection = (times: string[]) => {
    setBaseTimes((prev) => prev.filter((t) => !times.includes(t)));
  };

  // 기본 시간 확정 → 각 날짜별 (슬롯 ∩ 기본시간) 자동 pre-select
  const handleConfirmBaseTimes = () => {
    const preSelected: Record<string, string[]> = {};
    voteSelectedDates.forEach((d) => {
      const key = format(d, 'yyyy-MM-dd');
      preSelected[key] = (timesByDate[key] ?? []).filter((t) => baseTimes.includes(t));
    });
    setVoteByDate(preSelected);
    setVoteSubStep('adjust');
  };

  // --- 날짜별 시간 핸들러 ---

  const handleVoteToggle = (time: string) => {
    if (!activeDateKey) return;
    setVoteByDate((prev) => {
      const current = prev[activeDateKey] ?? [];
      return {
        ...prev,
        [activeDateKey]: current.includes(time)
          ? current.filter((t) => t !== time)
          : [...current, time],
      };
    });
  };

  const handleVoteSelectSection = (times: string[]) => {
    if (!activeDateKey) return;
    setVoteByDate((prev) => ({
      ...prev,
      [activeDateKey]: [...new Set([...(prev[activeDateKey] ?? []), ...times])],
    }));
  };

  const handleVoteClearSection = (times: string[]) => {
    if (!activeDateKey) return;
    setVoteByDate((prev) => ({
      ...prev,
      [activeDateKey]: (prev[activeDateKey] ?? []).filter((t) => !times.includes(t)),
    }));
  };

  // 투표 제출 시 사용: 선택된 (date, time) 쌍을 slotId 배열로 변환
  const getVotedSlotIds = (): number[] => {
    const ids: number[] = [];
    Object.entries(voteByDate).forEach(([date, times]) => {
      times.forEach((time) => {
        const slotId = slotIdMap[date]?.[time];
        if (slotId !== undefined) ids.push(slotId);
      });
    });
    return ids;
  };

  return {
    timesByDate,
    availableDates,
    allSlotTimes,
    voteSelectedDates,
    sortedDateKeys,
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
  };
}
