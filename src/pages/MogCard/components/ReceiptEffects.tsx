import {
  RECEIPT_PAPER_HEIGHT,
  RECEIPT_PAPER_PATH,
  RECEIPT_PAPER_WIDTH,
} from './ReceiptPaperBackground';

export const RECEIPT_INK_ROUGHEN_FILTER_ID = 'mog-card-receipt-ink-roughen';

export function ReceiptRoughEffectFilters() {
  return (
    <svg
      className="pointer-events-none absolute h-0 w-0"
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter
          id={RECEIPT_INK_ROUGHEN_FILTER_ID}
          x="-4%"
          y="-4%"
          width="108%"
          height="108%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.95"
            numOctaves="3"
            seed="31"
            result="roughNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="roughNoise"
            scale="1"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

export function ReceiptGrainOverlay() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
      viewBox={`0 0 ${RECEIPT_PAPER_WIDTH} ${RECEIPT_PAPER_HEIGHT}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <mask
        id="mog-card-receipt-grain-overlay-mask"
        style={{ maskType: 'luminance' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={RECEIPT_PAPER_WIDTH}
        height={RECEIPT_PAPER_HEIGHT}
      >
        <path d={RECEIPT_PAPER_PATH} fill="white" />
      </mask>
      <g mask="url(#mog-card-receipt-grain-overlay-mask)">
        <rect
          width={RECEIPT_PAPER_WIDTH}
          height={RECEIPT_PAPER_HEIGHT}
          opacity="0.18"
          filter="url(#mog-card-receipt-content-dark-grain)"
          style={{ mixBlendMode: 'multiply' }}
        />
        <rect
          width={RECEIPT_PAPER_WIDTH}
          height={RECEIPT_PAPER_HEIGHT}
          opacity="0.14"
          filter="url(#mog-card-receipt-content-light-grain)"
          style={{ mixBlendMode: 'screen' }}
        />
      </g>
      <defs>
        <filter
          id="mog-card-receipt-content-dark-grain"
          x="0"
          y="0"
          width={RECEIPT_PAPER_WIDTH}
          height={RECEIPT_PAPER_HEIGHT}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.05"
            numOctaves="4"
            seed="24"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0.16 0 0 0 0 0.13 0 0 0 0 0.09 0 0 0 0.58 0"
          />
        </filter>
        <filter
          id="mog-card-receipt-content-light-grain"
          x="0"
          y="0"
          width={RECEIPT_PAPER_WIDTH}
          height={RECEIPT_PAPER_HEIGHT}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.35"
            numOctaves="3"
            seed="42"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0.92 0 0 0 0 0.86 0 0 0 0 0.74 0 0 0 0.42 0"
          />
        </filter>
      </defs>
    </svg>
  );
}
