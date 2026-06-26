import { Plus, X } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import type { EditableReceiptItem } from '@/pages/MeetRecord/types';
import { formatWon } from '@/pages/MeetRecord/utils/receipt';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';

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
          className={`${typography.caption} min-w-0 flex-1 bg-transparent pl-5 pr-3 outline-none placeholder:text-[#a09583]`}
          style={{ color: colors.text }}
          aria-label="메뉴 입력"
        />
        <button type="button" onClick={onAddItem} aria-label="메뉴 추가">
          <Plus className="size-6" strokeWidth={2.8} color={colors.text} />
        </button>
      </div>
      <div
        className={`${typography.caption} mt-3 space-y-1 px-3`}
        style={{ color: colors.text }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[minmax(100px,1fr)_32px_64px_18px] items-center gap-2"
          >
            <span className="truncate">{item.name}</span>
            <input
              type="number"
              min={1}
              value={item.count}
              onChange={(event) => onUpdateItemCount(item.id, Number(event.target.value))}
              className="w-8 bg-transparent text-center outline-none"
              style={{ color: colors.text }}
              aria-label={`${item.name} 수량`}
            />
            <span className="text-right">{formatWon(item.price)}</span>
            <button
              type="button"
              className="grid size-[18px] place-items-center"
              style={{ color: colors.alert }}
              onClick={() => onDeleteItem(item.id)}
              aria-label={`${item.name} 삭제`}
            >
              <X className="size-3.5" strokeWidth={2.4} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuEditor;
