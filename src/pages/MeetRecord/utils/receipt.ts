import type { ReceiptItem } from '@/pages/MeetRecord/types';

export function formatWon(amount: number) {
  return amount.toLocaleString('ko-KR');
}

export function parseMenuInput(input: string): ReceiptItem | null {
  const [name, countText, ...priceParts] = input.split(',').map((value) => value.trim());

  if (!name) {
    return null;
  }

  const count = Number(countText);
  const price = Number(priceParts.join(''));

  return {
    name,
    count: Number.isFinite(count) && count > 0 ? count : 1,
    price: Number.isFinite(price) && price >= 0 ? price : 0,
  };
}

export function calculateReceiptTotal(items: readonly ReceiptItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.count, 0);
}
