import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StepHeader from '@/components/common/Header/StepHeader/StepHeader';
import DepartureProfile from '@/features/departure/components/DepartureProfile';
import DepartureMapSection from '@/features/departure/components/DepartureMapSection';
import { useDeparture } from '@/features/departure/hooks/useDeparture';
import { useDepartureForm } from '@/features/departure/hooks/useDepartureForm';
import { calculateMidpoint } from '@/features/midpoint/api/midpoint';
import { useToast } from '@/hooks/useToast';
import { RoomStatusContext } from '@/components/common/room-status-context';
import { getMyUserId } from '@/lib/auth-storage';

function DeparturePage() {
  const { roomId } = useParams<{ roomId: string }>();
  const parsedRoomId = Number(roomId);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { phase, role } = useContext(RoomStatusContext);
  const isMidpointFinding = phase === 'MIDPOINT_FINDING';

  const {
    members,
    departures,
    myDeparture,
    submittedCount,
    totalParticipants,
    isLoading,
    isError,
    refetch,
  } = useDeparture(parsedRoomId);

  const myMember = members.find((m) => m.isMe);
  const isHost = role === 'LEADER' || myMember?.isHost || false;

  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      await calculateMidpoint(parsedRoomId);
      navigate(`/midpoint/${isHost ? 'host' : 'participant'}/${parsedRoomId}`);
    } catch {
      showToast('중간 지점 계산에 실패했습니다.');
    } finally {
      setIsCalculating(false);
    }
  };

  const {
    selectedPlace,
    setSelectedPlace,
    transport,
    setTransport,
    isSaving,
    isEditing,
    isReadOnly,
    handleMemberSelect,
    handleSave,
  } = useDepartureForm({
    roomId: parsedRoomId,
    myDeparture,
    departures,
    myUserId: getMyUserId(),
    refetch,
  });

  if (isError) {
    return (
      <div className="flex flex-col min-h-screen">
        <StepHeader currentStep={2} />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-sm text-dark-border">데이터를 불러오지 못했습니다.</p>
          <button
            onClick={refetch}
            className="px-5 py-2 rounded-lg bg-point text-background text-sm font-semibold"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <StepHeader currentStep={2} />
      <DepartureProfile
        members={members}
        departures={departures}
        submittedCount={submittedCount}
        totalParticipants={totalParticipants}
        isLoading={isLoading}
        onMemberSelect={handleMemberSelect}
      />
      <DepartureMapSection
        selectedPlace={selectedPlace}
        onPlaceSelect={setSelectedPlace}
        transport={transport}
        onTransportChange={setTransport}
      />
      <div className="px-4 pb-6 flex flex-col gap-3">
        {isMidpointFinding && !isHost ? (
          <p className="text-center text-sm text-dark-border font-pretendard py-4">
            방장이 중간 지점을 계산하고 있어요
          </p>
        ) : (
          <>
            <div className={isHost && !!myDeparture ? 'flex gap-2' : ''}>
              <button
                onClick={handleSave}
                disabled={isReadOnly || !selectedPlace || !transport || isSaving}
                className={`py-4 rounded-lg font-semibold text-base disabled:opacity-40 ${
                  isHost && !!myDeparture
                    ? 'flex-1 border border-point text-point'
                    : 'w-full bg-point text-background'
                }`}
              >
                {isEditing ? '수정하기' : '저장하기'}
              </button>
              {isHost && !!myDeparture && (
                <button
                  onClick={handleCalculate}
                  disabled={isCalculating}
                  className="flex-1 py-4 rounded-lg bg-point text-background font-semibold text-base disabled:opacity-40"
                >
                  {isCalculating ? '계산 중...' : '중간지점 찾기'}
                </button>
              )}
            </div>
            <p className="text-center text-xs text-dark-border font-pretendard">
              {isHost
                ? '모두 입력하지 않아도 다음 단계로 넘어갈 수 있어요'
                : '방장만 다음 단계로 넘어갈 수 있어요'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default DeparturePage;
