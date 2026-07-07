import { useCallback, useEffect, useMemo, useState } from 'react';
import { calculateMidpoint, confirmMidpointPlace, fetchMidpoint } from '@/features/midpoint/api/midpoint';
import { fetchDepartures } from '@/features/departure/api/departure';
import { useToast } from '@/hooks/useToast';
import { shortenAddress } from '@/utils/shortenAddress';
import type { DepartureWithLabel, MidpointPlace, MidpointResult } from '@/features/midpoint/types/midpoint';
import type { DepartureEntry } from '@/features/departure/types/departure';

export function useMidpoint(roomId: number) {
  const { showToast } = useToast();
  const [midpoint, setMidpoint] = useState<MidpointResult | null>(null);
  const [departures, setDepartures] = useState<DepartureEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<MidpointPlace | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const places = useMemo<MidpointPlace[]>(() => {
    if (!midpoint) return [];
    if (midpoint.places && midpoint.places.length > 0) return midpoint.places;
    return [{
      placeId: midpoint.middlePointId,
      address: midpoint.address ?? '',
      placeName: midpoint.placeName,
      latitude: midpoint.latitude,
      longitude: midpoint.longitude,
    }];
  }, [midpoint]);

  const departuresWithLabels = useMemo<DepartureWithLabel[]>(() => {
    return departures.map((d) => {
      const t = midpoint?.travelTimes.find((tt) => tt.userId === d.userId);
      return {
        userId: d.userId,
        latitude: d.latitude,
        longitude: d.longitude,
        nickname: t?.nickname,
        durationMinutes: t?.durationMinutes,
        transportType: t?.transportType,
      };
    });
  }, [departures, midpoint]);

  const avgTravelMinutes = useMemo(() => {
    if (!midpoint || midpoint.travelTimes.length === 0) return 0;
    return Math.round(
      midpoint.travelTimes.reduce((s, t) => s + t.durationMinutes, 0) / midpoint.travelTimes.length,
    );
  }, [midpoint]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const [departuresRes, midpointData] = await Promise.allSettled([
          fetchDepartures(roomId),
          fetchMidpoint(roomId),
        ]);

        if (cancelled) return;

        if (departuresRes.status === 'fulfilled') {
          setDepartures(departuresRes.value.departures);
        }

        if (midpointData.status === 'fulfilled' && midpointData.value) {
          setMidpoint(midpointData.value);
        }
      } catch {
        if (!cancelled) showToast('데이터를 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [roomId, showToast]);

  const triggerCalculate = useCallback(async () => {
    setIsCalculating(true);
    try {
      const calculated = await calculateMidpoint(roomId);
      setMidpoint(calculated);
    } catch {
      showToast('중간 지점 계산에 실패했습니다.');
    } finally {
      setIsCalculating(false);
    }
  }, [roomId, showToast]);

  const confirmPlace = useCallback(async () => {
    if (!selectedPlace) return;
    setIsConfirming(true);
    try {
      await confirmMidpointPlace(roomId, {
        kakaoPlaceId: '',
        placeName: selectedPlace.placeName ?? shortenAddress(selectedPlace.address),
        address: selectedPlace.address,
        category: '',
        latitude: selectedPlace.latitude,
        longitude: selectedPlace.longitude,
      });
      showToast('장소가 확정되었습니다.');
    } catch {
      showToast('확정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsConfirming(false);
    }
  }, [roomId, selectedPlace, showToast]);

  return {
    places,
    departures: departuresWithLabels,
    avgTravelMinutes,
    isLoading,
    isCalculated: midpoint !== null,
    isCalculating,
    triggerCalculate,
    selectedPlace,
    setSelectedPlace,
    isConfirming,
    confirmPlace,
  };
}
