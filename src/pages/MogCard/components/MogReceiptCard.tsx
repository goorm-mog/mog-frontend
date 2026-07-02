import { forwardRef } from 'react';
import { typography } from '@/constants/typography';
import type { MogReceipt, MogReceiptPlace } from '@/pages/MogCard/types';
import PolaroidFrame from './PolaroidFrame';
import ReceiptPaperBackground from './ReceiptPaperBackground';

type MogReceiptCardProps = {
  receipt: MogReceipt;
};

const MogReceiptCard = forwardRef<HTMLElement, MogReceiptCardProps>(
  function MogReceiptCard({ receipt }, ref) {
    return (
      <article
        ref={ref}
        className="relative mx-auto min-h-[980px] w-full max-w-[370px] overflow-hidden px-[34px] pt-[104px] pb-[88px] text-text drop-shadow-[1px_2px_6px_rgb(0_0_0_/_25%)]"
      >
        <ReceiptPaperBackground />

        <div className="relative z-10">
          <MogStamp />
          <ReceiptHeader receipt={receipt} />
          <Divider />
          <ReceiptPlaces places={receipt.places} />
          <Divider />
          <ReceiptTotal totalCost={receipt.totalCost} />
          <DoubleDivider />
          <ReceiptFooter receipt={receipt} />
        </div>
      </article>
    );
  },
);

function ReceiptHeader({ receipt }: MogReceiptCardProps) {
  return (
    <header className="mb-10">
      <h2
        className={`${typography.logo} text-center tracking-normal`}
        style={{ fontSize: 62, lineHeight: '62px' }}
      >
        {receipt.title}
      </h2>

      <div className={`${typography.body2} mt-[62px] leading-[22px] text-text`}>
        <p>인원 : {receipt.participantCount}</p>
        <p>{receipt.participants}</p>
        <p className="mt-5">{receipt.datetime}</p>
      </div>
    </header>
  );
}

function ReceiptPlaces({ places }: { places: MogReceiptPlace[] }) {
  return (
    <div className="py-8">
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
      <div className="grid grid-cols-[1fr_auto] gap-4">
        <div className="min-w-0">
          <h3 className={typography.body}>{place.placeName}</h3>
          <p className={`${typography.body2} mt-1 leading-[18px]`}>
            {place.address}
          </p>
        </div>

        <strong className={`${typography.body} pt-1 whitespace-nowrap`}>
          {place.totalCost}
        </strong>
      </div>

      <dl className="mt-6 flex flex-col gap-5">
        {place.items.map((item) => (
          <div
            key={`${place.id}-${item.name}`}
            className={`${typography.body2} grid grid-cols-[1fr_auto] gap-4 pl-[50px] leading-[18px]`}
          >
            <dt>{item.name}</dt>
            <dd className="font-medium tabular-nums">{item.amount}</dd>
          </div>
        ))}
      </dl>

      {hasDivider ? <DottedDivider className="my-8" /> : null}
    </section>
  );
}

function ReceiptTotal({ totalCost }: { totalCost: string }) {
  return (
    <div
      className={`${typography.body} grid grid-cols-[1fr_auto] items-center px-[2px] py-7 font-black`}
    >
      <span>Total</span>
      <strong>{totalCost}</strong>
    </div>
  );
}

function ReceiptFooter({ receipt }: MogReceiptCardProps) {
  return (
    <section className="mt-14">
      <PolaroidFrame photoCount={receipt.photoCount} />
      <BrandFooter barcodeValue={receipt.barcodeValue} footer={receipt.footer} />
    </section>
  );
}

function MogStamp() {
  return (
    <img
      src="/assets/mog-stamp.svg"
      alt=""
      className="pointer-events-none absolute top-[-82px] right-[-36px] h-[84px] w-[153px]"
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
