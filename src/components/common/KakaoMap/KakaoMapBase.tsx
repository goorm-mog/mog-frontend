interface KakaoMapBaseProps {
  mapRef: React.RefObject<HTMLDivElement | null>;
  onZoomIn: () => void;
  onZoomOut: () => void;
  className?: string;
  children?: React.ReactNode;
}

export default function KakaoMapBase({
  mapRef,
  onZoomIn,
  onZoomOut,
  className,
  children,
}: KakaoMapBaseProps) {
  return (
    <div className={`relative h-[60vh] min-h-75 ${className ?? ''}`}>
      {children}

      <div className="absolute bottom-3 right-4 z-10 flex flex-col rounded-md shadow overflow-hidden">
        <button
          onClick={onZoomIn}
          className="w-10 h-10 bg-background flex items-center justify-center text-xl font-light text-text border-b border-border"
        >
          +
        </button>
        <button
          onClick={onZoomOut}
          className="w-10 h-10 bg-background flex items-center justify-center text-xl font-light text-text"
        >
          −
        </button>
      </div>

      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
