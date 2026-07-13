import type { ReceiptItem } from '@/pages/MeetRecord/types';

export function formatWon(amount: number) {
  return amount.toLocaleString('ko-KR');
}

export function parseMenuInput(input: string): ReceiptItem | null {
  const parts = input.split(',').map((value) => value.trim());
  const [name] = parts;

  if (!name) {
    return null;
  }

  const hasCount = parts.length >= 3;
  const priceText = (hasCount ? parts.slice(1, -1) : parts.slice(1)).join('');
  const countText = hasCount ? parts.at(-1) : undefined;
  const count = Number(countText);
  const price = Number(priceText);

  return {
    name,
    count: Number.isFinite(count) && count > 0 ? count : 1,
    price: Number.isFinite(price) && price >= 0 ? price : 0,
  };
}

export function calculateReceiptTotal(items: readonly ReceiptItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.count, 0);
}

export function normalizeReceiptItemsTotal(
  items: readonly ReceiptItem[],
  totalAmount: number,
): ReceiptItem[] {
  const copiedItems = items.map((item) => ({ ...item }));
  const unitPriceTotal = calculateReceiptTotal(copiedItems);
  const linePriceTotal = copiedItems.reduce((sum, item) => sum + item.price, 0);

  if (unitPriceTotal === totalAmount || linePriceTotal !== totalAmount) {
    return copiedItems;
  }

  return copiedItems.map((item) => ({
    ...item,
    price: item.count > 0 ? item.price / item.count : item.price,
  }));
}
