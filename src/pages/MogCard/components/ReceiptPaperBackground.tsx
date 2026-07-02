export const RECEIPT_PAPER_WIDTH = 234;
export const RECEIPT_PAPER_HEIGHT = 542;
const NOTCH_COUNT = 15;
const NOTCH_WIDTH = 7.8;
const NOTCH_DEPTH = 5.9;
const NOTCH_GAP =
  (RECEIPT_PAPER_WIDTH - NOTCH_COUNT * NOTCH_WIDTH) / (NOTCH_COUNT + 1);

const toPathNumber = (value: number) => Number(value.toFixed(3));

const createTopEdgePath = () => {
  const commands = ['M0 0'];

  for (let index = 0; index < NOTCH_COUNT; index += 1) {
    const startX = NOTCH_GAP + index * (NOTCH_WIDTH + NOTCH_GAP);
    const middleX = startX + NOTCH_WIDTH / 2;
    const endX = startX + NOTCH_WIDTH;

    commands.push(
      `H${toPathNumber(startX)}`,
      `Q${toPathNumber(middleX)} ${NOTCH_DEPTH} ${toPathNumber(endX)} 0`,
    );
  }

  commands.push(`H${RECEIPT_PAPER_WIDTH}`);

  return commands.join(' ');
};

const createBottomEdgePath = () => {
  const commands = [];

  for (let index = NOTCH_COUNT - 1; index >= 0; index -= 1) {
    const startX = NOTCH_GAP + index * (NOTCH_WIDTH + NOTCH_GAP);
    const middleX = startX + NOTCH_WIDTH / 2;
    const endX = startX + NOTCH_WIDTH;

    commands.push(
      `H${toPathNumber(endX)}`,
      `Q${toPathNumber(middleX)} ${RECEIPT_PAPER_HEIGHT - NOTCH_DEPTH} ${toPathNumber(startX)} ${RECEIPT_PAPER_HEIGHT}`,
    );
  }

  commands.push('H0');

  return commands.join(' ');
};

export const RECEIPT_PAPER_PATH = `${createTopEdgePath()} V${RECEIPT_PAPER_HEIGHT} ${createBottomEdgePath()} Z`;

function ReceiptPaperBackground() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox={`0 0 ${RECEIPT_PAPER_WIDTH} ${RECEIPT_PAPER_HEIGHT}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d={RECEIPT_PAPER_PATH}
        fill="#F5F0E8"
        filter="url(#mog-card-receipt-paper-roughen)"
      />
      <mask
        id="mog-card-receipt-mask"
        style={{ maskType: 'luminance' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={RECEIPT_PAPER_WIDTH}
        height={RECEIPT_PAPER_HEIGHT}
      >
        <path d={RECEIPT_PAPER_PATH} fill="white" />
      </mask>
      <g mask="url(#mog-card-receipt-mask)">
        <path
          opacity="0.025"
          d={`M${RECEIPT_PAPER_WIDTH} 0H0V${RECEIPT_PAPER_HEIGHT}H${RECEIPT_PAPER_WIDTH}V0Z`}
          fill="#C8852A"
        />
        <path opacity="0.018" d={`M5.25 0H0V${RECEIPT_PAPER_HEIGHT}H5.25V0Z`} fill="#1C1A14" />
        <path
          opacity="0.018"
          d={`M${RECEIPT_PAPER_WIDTH} 0H${RECEIPT_PAPER_WIDTH - 5.25}V${RECEIPT_PAPER_HEIGHT}H${RECEIPT_PAPER_WIDTH}V0Z`}
          fill="#1C1A14"
        />
        <rect
          width={RECEIPT_PAPER_WIDTH}
          height={RECEIPT_PAPER_HEIGHT}
          opacity="0.045"
          filter="url(#mog-card-receipt-grain)"
          style={{ mixBlendMode: 'multiply' }}
        />
      </g>
      <defs>
        <filter
          id="mog-card-receipt-paper-roughen"
          x="-4%"
          y="-2%"
          width="108%"
          height="104%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.35"
            numOctaves="3"
            seed="17"
            result="paperNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="paperNoise"
            scale="1"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter
          id="mog-card-receipt-grain"
          x="0"
          y="0"
          width={RECEIPT_PAPER_WIDTH}
          height={RECEIPT_PAPER_HEIGHT}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="4"
            seed="12"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0.12 0 0 0 0 0.10 0 0 0 0 0.07 0 0 0 0.45 0"
          />
        </filter>
      </defs>
    </svg>
  );
}

export default ReceiptPaperBackground;
