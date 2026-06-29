import { useId, useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RoughBorderProps {
  children: React.ReactNode;
  scale?: number;
  cornerSize?: number;
  color?: string;
  fill?: string;
  className?: string;
  containerClassName?: string;
}

function RoughBorder({
  children,
  scale = 2.5,
  cornerSize = 8,
  color = '#a09583',
  fill = 'transparent',
  className,
  containerClassName,
}: RoughBorderProps) {
  const id = useId();
  const filterId = `rough-${id.replace(/:/g, '')}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = size;
  const r = (Math.min(w, h) * cornerSize) / 100;

  const path =
    w && h
      ? [
          `M ${r},0`,
          `L ${w - r},0`,
          `A ${r},${r} 0 0,0 ${w},${r}`,
          `L ${w},${h - r}`,
          `A ${r},${r} 0 0,0 ${w - r},${h}`,
          `L ${r},${h}`,
          `A ${r},${r} 0 0,0 0,${h - r}`,
          `L 0,${r}`,
          `A ${r},${r} 0 0,0 ${r},0`,
          'Z',
        ].join(' ')
      : '';

  return (
    <div ref={containerRef} className={cn('relative', containerClassName)}>
      {path && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id={filterId} x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="3"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={scale}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
          {fill !== 'transparent' && <path d={path} fill={fill} stroke="none" />}
          <path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            filter={`url(#${filterId})`}
          />
        </svg>
      )}
      <div className={cn('relative z-10 px-10 py-2', className)}>{children}</div>
    </div>
  );
}

export default RoughBorder;
