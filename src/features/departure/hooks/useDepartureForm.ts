import { useState } from 'react';
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
  const [prevMyDepartureId, setPrevMyDepartureId] = useState(myDeparture?.departureId ?? null);

  if (prevMyDepartureId !== (myDeparture?.departureId ?? null)) {
    setPrevMyDepartureId(myDeparture?.departureId ?? null);
    if (myDeparture && selectedMemberId === myUserId) {
      setSelectedPlace({
        placeName: myDeparture.placeName,
        address: myDeparture.address,
        latitude: myDeparture.latitude,
        longitude: myDeparture.longitude,
      });
      setTransport(myDeparture.transportType);
    }
  }

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
  const isReadOnly = !isSelectedSelf && isEditing;

  const handleSave = async () => {
    if (!selectedPlace || !transport || !selectedMemberId) return;
    setIsSaving(true);
    const body: RegisterDepartureRequest = {
      ...selectedPlace,
      transportType: transport,
      ...(selectedMemberId !== myUserId && { targetUserId: selectedMemberId }),
    };
    try {
      if (isSelectedSelf && isEditing) {
        await updateDeparture(roomId, body);
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
