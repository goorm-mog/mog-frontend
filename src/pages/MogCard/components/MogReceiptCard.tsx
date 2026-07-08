import { forwardRef } from 'react';
import { typography } from '@/constants/typography';
import type { MogReceipt, MogReceiptPlace } from '@/pages/MogCard/types';
import PolaroidFrame from './PolaroidFrame';
import ReceiptPaperBackground, {
  RECEIPT_PAPER_HEIGHT,
  RECEIPT_PAPER_PATH,
  RECEIPT_PAPER_WIDTH,
} from './ReceiptPaperBackground';

type MogReceiptCardProps = {
  receipt: MogReceipt;
};

const MogReceiptCard = forwardRef<HTMLElement, MogReceiptCardProps>(
  function MogReceiptCard({ receipt }, ref) {
    return (
      <article
        ref={ref}
        className="relative mx-auto min-h-[980px] w-full max-w-[398px] overflow-hidden px-[30px] pt-[124px] pb-[132px] text-text drop-shadow-[0_10px_16px_rgb(0_0_0_/_26%)]"
      >
        <ReceiptRoughEffectFilters />
        <ReceiptPaperBackground />

        <div
          className="relative z-10"
          style={{ filter: 'url(#mog-card-receipt-ink-roughen)' }}
        >
          <MogStamp />
          <ReceiptHeader receipt={receipt} />
          <Divider />
          <ReceiptPlaces places={receipt.places} />
          <Divider />
          <ReceiptTotal totalCost={receipt.totalCost} />
          <DoubleDivider />
          <ReceiptFooter receipt={receipt} />
        </div>
        <ReceiptGrainOverlay />
      </article>
    );
  },
);

function ReceiptRoughEffectFilters() {
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
          id="mog-card-receipt-ink-roughen"
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

function ReceiptGrainOverlay() {
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

function ReceiptHeader({ receipt }: MogReceiptCardProps) {
  return (
    <header className="mb-8">
      <h2
        className={`${typography.logo} text-center tracking-normal`}
        style={{ fontSize: 58, lineHeight: '58px' }}
      >
        {receipt.title}
      </h2>

      <div className="mt-[58px] font-dm-mono text-[13px] leading-[20px] font-medium tracking-normal text-text">
        <p>인원 : {receipt.participantCount}</p>
        <p>{receipt.participants}</p>
        <p className="mt-4">{receipt.datetime}</p>
      </div>
    </header>
  );
}

function ReceiptPlaces({ places }: { places: MogReceiptPlace[] }) {
  return (
    <div className="py-6">
      {places.map((place, index) => (
        <ReceiptPlace
          key={place.id}
          place={place}
          hasDivider={index < places.length - 1}
        />
      ))}
    </div>
  );
}

function ReceiptPlace({
  place,
  hasDivider,
}: {
  place: MogReceiptPlace;
  hasDivider: boolean;
}) {
  return (
    <section>
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <div className="min-w-0">
          <h3 className="font-pretendard text-[15px] leading-[18px] font-semibold tracking-normal">
            {place.placeName}
          </h3>
          <p className="mt-1 font-dm-mono text-[11px] leading-[15px] font-medium tracking-normal text-text/80">
            {place.address}
          </p>
        </div>

        <strong className="pt-1 font-dm-mono text-[13px] leading-[18px] font-semibold tracking-normal whitespace-nowrap tabular-nums">
          {place.totalCost}
        </strong>
      </div>

      <dl className="mt-4 flex flex-col gap-1.5">
        {place.items.map((item) => (
          <div
            key={`${place.id}-${item.name}`}
            className="grid grid-cols-[1fr_auto] gap-3 pl-[38px] font-dm-mono text-[12px] leading-[16px] font-medium tracking-normal"
          >
            <dt>{item.name}</dt>
            <dd className="font-medium tabular-nums">{item.amount}</dd>
          </div>
        ))}
      </dl>

      {hasDivider ? <DottedDivider className="my-6" /> : null}
    </section>
  );
}

function ReceiptTotal({ totalCost }: { totalCost: string }) {
  return (
    <div
      className="grid grid-cols-[1fr_auto] items-center px-[2px] py-6 font-pretendard text-[15px] leading-[18px] font-black tracking-normal"
    >
      <span>Total</span>
      <strong className="font-dm-mono text-[13px] leading-[18px] font-black tabular-nums">
        {totalCost}
      </strong>
    </div>
  );
}

function ReceiptFooter({ receipt }: MogReceiptCardProps) {
  return (
    <section className="mt-14">
      <PolaroidFrame
        photoCount={receipt.photoCount}
        photoUrl={receipt.representativePhotoUrl}
      />
      <BrandFooter barcodeValue={receipt.barcodeValue} footer={receipt.footer} />
    </section>
  );
}

function MogStamp() {
  return (
    <img
      src="/assets/mog-stamp.svg"
      alt=""
      className="pointer-events-none absolute top-[-90px] right-[-50px] h-[84px] w-[153px] origin-center rotate-[30deg]"
      aria-hidden="true"
    />
  );
}

function BrandFooter({
  barcodeValue,
  footer,
}: {
  barcodeValue: string;
  footer: string;
}) {
  return (
    <div className="mt-14 flex flex-col items-center pb-3">
      <p className={`${typography.body2} text-center text-[12px] leading-[15px] text-text/80`}>
        {footer}
      </p>
      <p
        className={`${typography.logo} mt-10 tracking-normal text-text`}
        style={{ fontSize: 45, lineHeight: '45px' }}
      >
        MOG
      </p>
      <Barcode value={barcodeValue} />
    </div>
  );
}

function Barcode({ value }: { value: string }) {
  return (
    <p
      className={`${typography.body2} mt-20 w-full text-center text-[48px] leading-[0.88] text-text`}
      style={{
        fontFamily: '"Libre Barcode 39 Extended Text", monospace',
      }}
      aria-label={`바코드 ${value}`}
    >
      {value}
    </p>
  );
}

function Divider() {
  return <div className="h-px bg-dark-border/70" />;
}

function DoubleDivider() {
  return (
    <div className="flex flex-col gap-[5px]">
      <Divider />
      <Divider />
    </div>
  );
}

function DottedDivider({ className }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        height: 2,
        backgroundImage:
          'radial-gradient(circle, rgb(160 149 131 / 75%) 1px, transparent 1.3px)',
        backgroundPosition: 'left center',
        backgroundRepeat: 'repeat-x',
        backgroundSize: '7px 2px',
      }}
    />
  );
}

export default MogReceiptCard;
