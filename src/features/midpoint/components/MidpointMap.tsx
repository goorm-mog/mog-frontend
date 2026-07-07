import { useRef } from 'react';
import KakaoMapBase from '@/components/common/KakaoMap/KakaoMapBase';
import { useMidpointMapSetup } from '@/features/midpoint/hooks/useMidpointMapSetup';
import type { DepartureWithLabel, MidpointPlace } from '@/features/midpoint/types/midpoint';

interface MidpointMapProps {
  places: MidpointPlace[];
  selectedPlace: MidpointPlace | null;
  departures: DepartureWithLabel[];
  onMarkerClick: (place: MidpointPlace) => void;
  className?: string;
}

export default function MidpointMap({ places, selectedPlace, departures, onMarkerClick, className }: MidpointMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const { handleZoomIn, handleZoomOut } = useMidpointMapSetup(
    mapRef,
    places,
    selectedPlace,
    departures,
    onMarkerClick,
  );

  return (
    <KakaoMapBase mapRef={mapRef} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} className={className} />
  );
}
