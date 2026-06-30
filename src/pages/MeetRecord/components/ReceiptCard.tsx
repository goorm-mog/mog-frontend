import { Sparkles, X } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { usePlaceSearch } from '@/pages/MeetRecord/hooks/usePlaceSearch';
import { useReceiptMenu } from '@/pages/MeetRecord/hooks/useReceiptMenu';
import type { ReceiptCardData } from '@/pages/MeetRecord/types';
import { formatWon } from '@/pages/MeetRecord/utils/receipt';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';
import MemoField from './MemoField';
import MenuEditor from './MenuEditor';
import ParticipantPicker from './ParticipantPicker';
import PayerSelect from './PayerSelect';
import PhotoPicker from './PhotoPicker';
import PlaceField from './PlaceField';

export type { ReceiptCardData } from '@/pages/MeetRecord/types';

type ReceiptCardProps = {
  receipt: ReceiptCardData;
  onTotalAmountChange: (receiptId: string, totalAmount: number) => void;
  onDelete: (receiptId: string) => void;
};

function ReceiptCard({ receipt, onTotalAmountChange, onDelete }: ReceiptCardProps) {
  const [participants, setParticipants] = useState(receipt.participants);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const placeSearch = usePlaceSearch(receipt.placeName);
  const receiptMenu = useReceiptMenu({
    initialItems: receipt.items,
    receiptId: receipt.roundLabel,
  });

  useEffect(() => {
    onTotalAmountChange(receipt.roundLabel, receiptMenu.totalAmount);
  }, [onTotalAmountChange, receipt.roundLabel, receiptMenu.totalAmount]);

  const handleParticipantToggle = (participantId: number) => {
    setParticipants((currentParticipants) =>
      currentParticipants.map((participant) =>
        participant.id === participantId
          ? { ...participant, selected: !participant.selected }
          : participant,
      ),
    );
  };

  const handleDeleteConfirm = () => {
    onDelete(receipt.roundLabel);
  };

  return (
    <article
      className="receipt-paper relative min-h-[590px] px-5 pb-7 pt-10"
      data-receipt-id={receipt.roundLabel}
    >
      <div
        className="flex items-center justify-between border-b pb-5"
        style={{ borderColor: colors.border }}
      >
        <span
          className={`${typography.body} rounded-[6px] px-2.5 py-1.5`}
          style={{ backgroundColor: colors.darkBorder, color: colors.background }}
        >
          {receipt.roundLabel}
        </span>

        <div className="flex items-center gap-3">
          <button type="button" style={{ color: colors.text }} aria-label="자동 채우기">
            <Sparkles className="size-[25px]" strokeWidth={1.8} />
          </button>
          <button
            type="button"
            style={{ color: colors.alert }}
            aria-label={`${receipt.roundLabel} 삭제`}
            aria-expanded={isDeleteConfirmOpen}
            onClick={() => setIsDeleteConfirmOpen(true)}
          >
            <X className="size-[32px]" strokeWidth={2.1} />
          </button>
        </div>
      </div>

      {isDeleteConfirmOpen ? (
        <div
          className="absolute right-5 top-[84px] z-10 w-[210px] rounded-[8px] border px-4 py-3 shadow-[0_8px_18px_rgba(27,26,18,0.18)]"
          style={{
            borderColor: colors.darkBackground,
            backgroundColor: colors.background,
            color: colors.text,
          }}
          role="dialog"
          aria-label={`${receipt.roundLabel} 삭제 확인`}
        >
          <p className={typography.caption}>해당 차수를 삭제하시겠습니까?</p>
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              className={`${typography.caption} rounded-[6px] px-3 py-1.5`}
              style={{ color: colors.border }}
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              취소
            </button>
            <button
              type="button"
              className={`${typography.caption} rounded-[6px] px-3 py-1.5`}
              style={{ backgroundColor: colors.alert, color: colors.background }}
              onClick={handleDeleteConfirm}
            >
              확인
            </button>
          </div>
        </div>
      ) : null}

      <div className="space-y-7 py-7">
        <FormRow label="장소" required>
          <PlaceField
            placeholder={receipt.placePlaceholder}
            query={placeSearch.query}
            places={placeSearch.places}
            isDropdownOpen={placeSearch.isDropdownOpen}
            hasSelectedPlace={placeSearch.hasSelectedPlace}
            onQueryChange={placeSearch.setQuery}
            onSearch={placeSearch.searchPlaces}
            onEditPlace={placeSearch.editPlace}
            onSelectPlace={placeSearch.selectPlace}
            onKeyDown={placeSearch.handleKeyDown}
          />
        </FormRow>

        <FormRow label="메뉴">
          <MenuEditor
            placeholder={receipt.menuPlaceholder}
            input={receiptMenu.input}
            items={receiptMenu.items}
            onInputChange={receiptMenu.setInput}
            onAddItem={receiptMenu.addItem}
            onKeyDown={receiptMenu.handleKeyDown}
            onUpdateItemCount={receiptMenu.updateItemCount}
            onDeleteItem={receiptMenu.deleteItem}
          />
        </FormRow>
      </div>

      <DashedDivider />

      <FormRow label="총액" required className="py-7">
        <p className={`${typography.head1} text-right`} style={{ color: colors.text }}>
          <span className="mr-4">₩</span>
          {formatWon(receiptMenu.totalAmount)}
        </p>
      </FormRow>

      <DashedDivider />

      <FormRow label="참가자" required className="py-7">
        <ParticipantPicker
          participants={participants}
          onParticipantToggle={handleParticipantToggle}
        />
      </FormRow>

      <FormRow label="계좌">
        <PayerSelect payerText={receipt.payerPlaceholder} />
      </FormRow>

      <div className="my-7 border-t" style={{ borderColor: colors.border }} />

      <FormRow label="메모">
        <MemoField initialMemo={receipt.memo} placeholder={receipt.memoPlaceholder} />
      </FormRow>

      <DashedDivider className="my-7" />

      <PhotoPicker photoCount={receipt.photoCount} receiptId={receipt.roundLabel} />
    </article>
  );
}

type FormRowProps = {
  label: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

function FormRow({ label, required = false, className = '', children }: FormRowProps) {
  return (
    <div className={`grid grid-cols-[90px_1fr] items-start gap-4 px-2 ${className}`}>
      <label className={`${typography.body} pt-3`} style={{ color: colors.text }}>
        {label}
        {required ? (
          <span className="ml-1" style={{ color: colors.alert }}>
            *
          </span>
        ) : null}
      </label>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

type DashedDividerProps = {
  className?: string;
};

function DashedDivider({ className = '' }: DashedDividerProps) {
  return (
    <div
      className={`border-t-[3px] border-dashed ${className}`}
      style={{ borderColor: colors.border }}
    />
  );
}

export default ReceiptCard;
