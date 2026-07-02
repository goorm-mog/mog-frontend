import { useRef, useState, type KeyboardEvent } from 'react';
import type { EditableReceiptItem, ReceiptItem } from '@/pages/MeetRecord/types';
import {
  calculateReceiptTotal,
  parseMenuInput,
} from '@/pages/MeetRecord/utils/receipt';

type UseReceiptMenuParams = {
  initialItems: ReceiptItem[];
  receiptId: string;
};

export function useReceiptMenu({ initialItems, receiptId }: UseReceiptMenuParams) {
  const menuIdRef = useRef(0);
  const [input, setInput] = useState('');
  const [items, setItems] = useState<EditableReceiptItem[]>(() =>
    initialItems.map((item, index) => ({
      ...item,
      id: `${receiptId}-menu-${index}`,
    })),
  );

  const addItem = () => {
    const nextItem = parseMenuInput(input);

    if (!nextItem) {
      return;
    }

    menuIdRef.current += 1;
    setItems((currentItems) => [
      { ...nextItem, id: `${receiptId}-added-menu-${menuIdRef.current}` },
      ...currentItems,
    ]);
    setInput('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addItem();
    }
  };

  const updateItemCount = (id: string, nextCount: number) => {
    if (!Number.isFinite(nextCount)) {
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, count: Math.max(1, nextCount) } : item,
      ),
    );
  };

  const deleteItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  return {
    input,
    items,
    totalAmount: calculateReceiptTotal(items),
    setInput,
    addItem,
    handleKeyDown,
    updateItemCount,
    deleteItem,
  };
}
