import { Plus, X } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import type { EditableReceiptItem } from '@/pages/MeetRecord/types';
import { formatWon } from '@/pages/MeetRecord/utils/receipt';
import { colors } from '../../../constants/colors';

type MenuEditorProps = {
  placeholder: string;
  input: string;
  items: EditableReceiptItem[];
  onInputChange: (input: string) => void;
  onAddItem: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onUpdateItemCount: (id: string, nextCount: number) => void;
  onDeleteItem: (id: string) => void;
};

function MenuEditor({
  placeholder,
  input,
  items,
  onInputChange,
  onAddItem,
  onKeyDown,
  onUpdateItemCount,
  onDeleteItem,
}: MenuEditorProps) {
  return (
    <div>
      <div
        className="flex h-9 items-center justify-between border-b"
        style={{ borderColor: colors.darkBorder }}
      >
        <input
          type="text"
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent pl-4 pr-3 font-pretendard text-[16px] leading-[20px] outline-none placeholder:text-[#a09583]"
          style={{ color: colors.text }}
          aria-label="메뉴 입력"
        />
        <button type="button" onClick={onAddItem} aria-label="메뉴 추가">
          <Plus className="size-6" strokeWidth={2.2} color={colors.text} />
        </button>
      </div>
      <div
        className="mt-4 space-y-4 px-0.5 font-pretendard text-[16px] leading-[20px]"
        style={{ color: colors.text }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[22px_minmax(0,1fr)_auto] items-start gap-x-2 gap-y-1.5"
          >
            <button
              type="button"
              className="grid size-[22px] place-items-center pt-0.5"
              style={{ color: colors.alert }}
              onClick={() => onDeleteItem(item.id)}
              aria-label={`${item.name} 삭제`}
            >
              <X className="size-4" strokeWidth={2.4} />
            </button>
            <span className="min-w-0 break-words">{item.name}</span>
            <div className="flex items-center justify-end gap-1">
              <input
                type="number"
                min={1}
                value={item.count}
                onChange={(event) => onUpdateItemCount(item.id, Number(event.target.value))}
                className="w-10 bg-transparent text-center font-pretendard text-[16px] leading-[20px] outline-none"
                style={{ color: colors.text }}
                aria-label={`${item.name} 수량`}
              />
            </div>
            <span className="col-span-3 pr-2 text-right tabular-nums whitespace-nowrap">
              ₩ {formatWon(item.price)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuEditor;
