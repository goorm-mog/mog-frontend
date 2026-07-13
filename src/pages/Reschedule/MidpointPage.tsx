import { Clock, MapPinCheck, Star } from 'lucide-react';
import { useCallback, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import StepHeader from '@/components/common/Header/StepHeader/StepHeader';
import BottomSheet from '@/components/common/BottomSheet/BottomSheet';
import ChatButton from '@/components/common/ChatButton/ChatButton';
import SelectionCard from '@/components/common/SelectionCard/SelectionCard';
import MidpointMap from '@/features/midpoint/components/MidpointMap';
import { useMidpoint } from '@/features/midpoint/hooks/useMidpoint';
import { shortenAddress } from '@/utils/shortenAddress';
import type { MidpointPlace } from '@/features/midpoint/types/midpoint';

function MidpointPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const parsedRoomId = Number(roomId);
  const location = useLocation();
  const navigate = useNavigate();
  const isHost = location.pathname.includes('/host/');
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const {
    places,
    departures,
    avgTravelMinutes,
    isLoading,
    isCalculated,
    isCalculating,
    triggerCalculate,
    selectedPlace,
    setSelectedPlace,
    isConfirming,
    confirmPlace,
  } = useMidpoint(parsedRoomId, () => navigate(`/${parsedRoomId}/meet-record`));

  const handleMarkerClick = useCallback(
    (place: MidpointPlace) => {
      if (selectedPlace?.placeId === place.placeId) {
        setSelectedPlace(null);
      } else {
        setSelectedPlace(place);
        const idx = places.findIndex((p) => p.placeId === place.placeId);
        cardRefs.current[idx]?.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    },
    [places, selectedPlace, setSelectedPlace],
  );

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <StepHeader currentStep={3} />
        <div className="h-[60vh] min-h-75 bg-border animate-pulse" />
      </div>
    );
  }

  if (!isCalculated) {
    return (
      <div className="flex flex-col gap-2">
        <StepHeader currentStep={3} />
        <div className="px-3 pb-3">
          <div className="flex items-center gap-2">
            <MapPinCheck size={20} />
            <p className="text-lg font-semibold">
              {isHost ? '중간 지점을 계산해보세요' : '방장이 중간 지점을 계산하고 있어요'}
            </p>
          </div>
        </div>
        <BottomSheet
          ctaLabel={isHost ? '중간 지점 계산하기' : '방장이 계산 중이에요'}
          onCtaClick={isHost ? triggerCalculate : () => {}}
          ctaDisabled={!isHost}
          isLoading={isCalculating}
          caption={!isHost ? '방장만 계산할 수 있어요' : undefined}
        >
          {null}
        </BottomSheet>
      </div>
    );
  }

  return (
    <div className="flex-col flex gap-2">
      <StepHeader currentStep={3} />

      <div className="px-3 pb-3">
        <div className="flex items-center gap-2">
          <MapPinCheck size={20} />
          {selectedPlace ? (
            <p className="text-lg font-semibold">
              이번 만남은{' '}
              <span className="text-point">
                {selectedPlace.placeName ?? shortenAddress(selectedPlace.address)}
              </span>{' '}
              어떠세요?
            </p>
          ) : (
            <p className="text-lg font-semibold">약속 장소를 잡아보세요</p>
          )}
        </div>
      </div>

      <MidpointMap
        places={places}
        selectedPlace={selectedPlace}
        departures={departures}
        onMarkerClick={handleMarkerClick}
      />

      <BottomSheet
        ctaLabel="확정하기"
        onCtaClick={confirmPlace}
        ctaDisabled={!isHost || !selectedPlace}
        isLoading={isConfirming}
        caption={!isHost ? '방장만 확정할 수 있어요' : undefined}
        sideAction={<ChatButton size="md" onClick={() => navigate(`/${parsedRoomId}/chat`)} />}
      >
        {places.map((place, idx) => (
          <div
            key={place.placeId}
            ref={(el) => {
              cardRefs.current[idx] = el;
            }}
          >
            <SelectionCard
              icon={Star}
              title={place.placeName ?? shortenAddress(place.address)}
              subtitle={place.address}
              isSelected={selectedPlace?.placeId === place.placeId}
              onClick={() =>
                setSelectedPlace(selectedPlace?.placeId === place.placeId ? null : place)
              }
            >
              <div className="flex items-center gap-1">
                <Clock size={14} className="text-dark-border" />
                <span className="text-point font-bold text-sm">
                  {avgTravelMinutes > 0 ? `${avgTravelMinutes}분` : '-'}
                </span>
              </div>
              <p className="text-xs text-dark-border mt-0.5">1인당 예상 소요 시간 (평균)</p>
            </SelectionCard>
          </div>
        ))}
      </BottomSheet>
    </div>
  );
}

export default MidpointPage;
