import { Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { analyzeReceiptOcr } from '@/api/records';
import { usePlaceSearch } from '@/pages/MeetRecord/hooks/usePlaceSearch';
import { useReceiptMenu } from '@/pages/MeetRecord/hooks/useReceiptMenu';
import type {
  PlaceSearchResult,
  ReceiptCardData,
  ReceiptPayerOption,
} from '@/pages/MeetRecord/types';
import { formatWon } from '@/pages/MeetRecord/utils/receipt';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';
import MemoField from './MemoField';
import MenuEditor from './MenuEditor';
import ParticipantPicker from './ParticipantPicker';
import PayerSelect from './PayerSelect';
import PlaceField from './PlaceField';

export type { ReceiptCardData } from '@/pages/MeetRecord/types';

type ReceiptCardProps = {
  roomId: number;
  receipt: ReceiptCardData;
  payerOptions: readonly ReceiptPayerOption[];
  onReceiptChange: (receiptId: string, receipt: Partial<ReceiptCardData>) => void;
  onDelete: (receiptId: string) => void;
};

function ReceiptCard({
  roomId,
  receipt,
  payerOptions,
  onReceiptChange,
  onDelete,
}: ReceiptCardProps) {
  const [participants, setParticipants] = useState(receipt.participants);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isOcrAnalyzing, setIsOcrAnalyzing] = useState(false);
  const [payerAccountText, setPayerAccountText] = useState(() =>
    formatPayerAccountText(receipt.payerBankName, receipt.payerAccountNumber),
  );
  const ocrInputRef = useRef<HTMLInputElement>(null);
  const placeSearch = usePlaceSearch(receipt.placeName, receipt.placeAddress ?? null);
  const receiptMenu = useReceiptMenu({
    initialItems: receipt.items,
    receiptId: receipt.roundLabel,
  });

  useEffect(() => {
    onReceiptChange(receipt.roundLabel, {
      items: receiptMenu.items.map(({ id: _id, ...item }) => item),
      totalAmount: receiptMenu.totalAmount,
    });
  }, [onReceiptChange, receipt.roundLabel, receiptMenu.items, receiptMenu.totalAmount]);

  useEffect(() => {
    onReceiptChange(receipt.roundLabel, {
      placeName: placeSearch.query,
      placeAddress: placeSearch.selectedAddress,
    });
  }, [onReceiptChange, placeSearch.query, placeSearch.selectedAddress, receipt.roundLabel]);

  const handleSelectPlace = (place: PlaceSearchResult) => {
    placeSearch.selectPlace(place);
    onReceiptChange(receipt.roundLabel, {
      placeName: place.name,
      placeAddress: place.address,
    });
  };

  const handleParticipantToggle = (participantId: number) => {
    setParticipants((currentParticipants) => {
      const nextParticipants = currentParticipants.map((participant) =>
        participant.id === participantId
          ? { ...participant, selected: !participant.selected }
          : participant,
      );

      onReceiptChange(receipt.roundLabel, { participants: nextParticipants });

      return nextParticipants;
    });
  };

  const handleDeleteConfirm = () => {
    onDelete(receipt.roundLabel);
  };

  const handlePayerAccountChange = (value: string) => {
    setPayerAccountText(value);

    const [bankName = '', ...accountParts] = value.trimStart().split(/\s+/);

    onReceiptChange(receipt.roundLabel, {
      payerBankName: bankName,
      payerAccountNumber: accountParts.join(' '),
    });
  };

  const handleOcrImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const image = event.target.files?.[0];
    event.target.value = '';

    if (!image) {
      return;
    }

    setIsOcrAnalyzing(true);

    try {
      const response = await analyzeReceiptOcr(roomId, image);
      const { storeName, totalAmount, items } = response.data;
      const nextItems =
        items.length > 0
          ? items.map((item) => ({
              name: item.name,
              count: item.count ?? 1,
              price: item.price,
            }))
          : [{ name: '총액', count: 1, price: totalAmount }];

      if (storeName) {
        placeSearch.setQuery(storeName);
      }

      receiptMenu.replaceItems(nextItems);
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : '영수증을 분석하는 중 오류가 발생했습니다.',
      );
    } finally {
      setIsOcrAnalyzing(false);
    }
  };

  return (
    <article
      className="receipt-paper relative min-h-[590px] px-6 pb-8 pt-14"
      data-receipt-id={receipt.roundLabel}
    >
      <input
        ref={ocrInputRef}
        type="file"
        className="sr-only"
        accept="image/*"
        onChange={handleOcrImageSelect}
      />

      <div
        className="flex items-center justify-between border-b pb-7"
        style={{ borderColor: colors.border }}
      >
        <span
          className={`${typography.body} rounded-[6px] px-2.5 py-1.5`}
          style={{ backgroundColor: colors.darkBorder, color: colors.background }}
        >
          {receipt.roundLabel}
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            style={{ color: colors.darkBorder }}
            aria-label="영수증 OCR 자동 채우기"
            disabled={isOcrAnalyzing}
            onClick={() => ocrInputRef.current?.click()}
          >
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
          <p className="font-pretendard text-[16px] leading-[20px]">
            해당 차수를 삭제하시겠습니까?
          </p>
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              className="rounded-[6px] px-3 py-1.5 font-pretendard text-[16px] leading-[20px]"
              style={{ color: colors.border }}
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              취소
            </button>
            <button
              type="button"
              className="rounded-[6px] px-3 py-1.5 font-pretendard text-[16px] leading-[20px]"
              style={{ backgroundColor: colors.alert, color: colors.background }}
              onClick={handleDeleteConfirm}
            >
              확인
            </button>
          </div>
        </div>
      ) : null}

      <div className="space-y-9 py-8">
        <FormRow label="장소" required>
          <PlaceField
            placeholder={receipt.placePlaceholder}
            query={placeSearch.query}
            places={placeSearch.places}
            isDropdownOpen={placeSearch.isDropdownOpen}
            hasSelectedPlace={placeSearch.hasSelectedPlace}
            selectedAddress={placeSearch.selectedAddress}
            isSearching={placeSearch.isSearching}
            errorMessage={placeSearch.errorMessage}
            onQueryChange={placeSearch.setQuery}
            onSearch={placeSearch.searchPlaces}
            onEditPlace={placeSearch.editPlace}
            onSelectPlace={handleSelectPlace}
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

      <FormRow label="총액" required className="py-8">
        <p className={`${typography.head1} text-right`} style={{ color: colors.text }}>
          <span className="mr-4">₩</span>
          {formatWon(receiptMenu.totalAmount)}
        </p>
      </FormRow>

      <DashedDivider />

      <FormRow label="참가자" required className="py-8">
        <ParticipantPicker
          participants={participants}
          onParticipantToggle={handleParticipantToggle}
        />
      </FormRow>

      <FormRow label="정산자">
        <PayerSelect
          payerText={receipt.payerPlaceholder}
          hasSelectedPayer={receipt.payerRoomMemberId != null}
          options={payerOptions}
          onSelectPayer={(payer) =>
            onReceiptChange(receipt.roundLabel, {
              payerPlaceholder: payer.label,
              payerRoomMemberId: payer.id,
            })
          }
        />
      </FormRow>

      <FormRow label="계좌" className="pt-6">
        <input
          type="text"
          className="h-10 w-full border-b bg-transparent px-3 font-pretendard text-[16px] leading-[20px] outline-none placeholder:text-[#a09583]"
          style={{
            borderColor: colors.darkBorder,
            color: payerAccountText.trim() ? colors.text : colors.border,
          }}
          placeholder="계좌를 입력하세요"
          value={payerAccountText}
          onChange={(event) => handlePayerAccountChange(event.target.value)}
        />
      </FormRow>

      <div className="my-8 border-t" style={{ borderColor: colors.border }} />

      <FormRow label="메모" className="pb-10">
        <MemoField
          initialMemo={receipt.memo}
          placeholder={receipt.memoPlaceholder}
          onMemoChange={(memo) => onReceiptChange(receipt.roundLabel, { memo })}
        />
      </FormRow>
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
    <div className={`grid grid-cols-[64px_minmax(0,1fr)] items-start gap-4 px-1 ${className}`}>
      <label
        className="pt-3 font-pretendard text-[16px] leading-[20px] font-semibold"
        style={{ color: colors.text }}
      >
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

function formatPayerAccountText(
  bankName: string | null | undefined,
  accountNumber: string | null | undefined,
) {
  return [bankName, accountNumber].filter(Boolean).join(' ');
}
