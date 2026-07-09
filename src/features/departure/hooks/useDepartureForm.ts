import { useEffect, useState } from 'react';
import { registerDeparture, updateDeparture } from '@/features/departure/api/departure';
import { ApiError } from '@/lib/apiFetch';
import { useToast } from '@/hooks/useToast';
import type {
  DepartureEntry,
  RegisterDepartureRequest,
  SelectedPlace,
  TransportType,
} from '@/features/departure/types/departure';

interface DepartureFormOptions {
  roomId: number;
  myDeparture: DepartureEntry | null;
  departures: DepartureEntry[];
  myUserId: number | null;
  refetch: () => void;
}

export function useDepartureForm({
  roomId,
  myDeparture,
  departures,
  myUserId,
  refetch,
}: DepartureFormOptions) {
  const { showToast } = useToast();
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(myUserId);
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(null);
  const [transport, setTransport] = useState<TransportType | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 내 출발지가 처음 로드될 때 폼에 채워줌 (ID 변경 시에만 동기화)
  useEffect(() => {
    if (!myDeparture || selectedMemberId !== myUserId) return;
    setSelectedPlace({
      placeName: myDeparture.placeName,
      address: myDeparture.address,
      latitude: myDeparture.latitude,
      longitude: myDeparture.longitude,
    });
    setTransport(myDeparture.transportType);
    // myDeparture 내용이 아닌 ID 변경 시에만 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myDeparture?.departureId]);

  const handleMemberSelect = (memberId: number, departure: DepartureEntry | null) => {
    setSelectedMemberId(memberId);
    if (departure) {
      setSelectedPlace({
        placeName: departure.placeName,
        address: departure.address,
        latitude: departure.latitude,
        longitude: departure.longitude,
      });
      setTransport(departure.transportType);
    } else {
      setSelectedPlace(null);
      setTransport(null);
    }
  };

  const selectedMemberDeparture = departures.find((d) => d.userId === selectedMemberId) ?? null;
  const isSelectedSelf = myUserId !== null && selectedMemberId === myUserId;
  const isEditing = selectedMemberDeparture !== null;
  const isReadOnly = !isSelectedSelf;

  const handleSave = async () => {
    if (!selectedPlace || !transport || !isSelectedSelf) return;
    setIsSaving(true);
    const body: RegisterDepartureRequest = {
      ...selectedPlace,
      transportType: transport,
    };
    try {
      if (isEditing) {
        await updateDeparture(roomId, body);
        showToast('출발지가 수정되었습니다.', 'success');
      } else {
        await registerDeparture(roomId, body);
      }
      refetch();
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) {
        showToast('이미 다른 사람이 출발지를 등록했습니다. 새로고침 후 다시 시도해주세요.');
      } else {
        showToast('저장에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return {
    selectedMemberId,
    selectedPlace,
    setSelectedPlace,
    transport,
    setTransport,
    isSaving,
    isEditing,
    isReadOnly,
    handleMemberSelect,
    handleSave,
  };
}
