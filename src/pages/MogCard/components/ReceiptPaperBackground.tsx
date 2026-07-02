const PAPER_WIDTH = 234;
const PAPER_HEIGHT = 542;
const NOTCH_COUNT = 15;
const NOTCH_WIDTH = 7.8;
const NOTCH_DEPTH = 5.9;
const NOTCH_GAP =
  (PAPER_WIDTH - NOTCH_COUNT * NOTCH_WIDTH) / (NOTCH_COUNT + 1);

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

  commands.push(`H${PAPER_WIDTH}`);

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
      `Q${toPathNumber(middleX)} ${PAPER_HEIGHT - NOTCH_DEPTH} ${toPathNumber(startX)} ${PAPER_HEIGHT}`,
    );
  }

  commands.push('H0');

  return commands.join(' ');
};

const RECEIPT_PAPER_PATH = `${createTopEdgePath()} V${PAPER_HEIGHT} ${createBottomEdgePath()} Z`;

function ReceiptPaperBackground() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox={`0 0 ${PAPER_WIDTH} ${PAPER_HEIGHT}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={RECEIPT_PAPER_PATH} fill="#F5F0E8" />
      <mask
        id="mog-card-receipt-mask"
        style={{ maskType: 'luminance' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={PAPER_WIDTH}
        height={PAPER_HEIGHT}
      >
        <path d={RECEIPT_PAPER_PATH} fill="white" />
      </mask>
      <g mask="url(#mog-card-receipt-mask)">
        <path
          opacity="0.025"
          d={`M${PAPER_WIDTH} 0H0V${PAPER_HEIGHT}H${PAPER_WIDTH}V0Z`}
          fill="#C8852A"
        />
        <path opacity="0.018" d={`M5.25 0H0V${PAPER_HEIGHT}H5.25V0Z`} fill="#1C1A14" />
        <path
          opacity="0.018"
          d={`M${PAPER_WIDTH} 0H${PAPER_WIDTH - 5.25}V${PAPER_HEIGHT}H${PAPER_WIDTH}V0Z`}
          fill="#1C1A14"
        />
      </g>
    </svg>
  );
}

export default ReceiptPaperBackground;
