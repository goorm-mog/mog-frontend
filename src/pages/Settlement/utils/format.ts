const WON_FORMATTER = new Intl.NumberFormat('ko-KR');

export const formatSettlementWon = (amount: number) => {
  const absoluteAmount = Math.abs(amount);
  const formattedAmount = `₩ ${WON_FORMATTER.format(absoluteAmount)}`;

  return amount < 0 ? `초과 ${formattedAmount}` : formattedAmount;
};

export const formatTransferWon = (amount: number) =>
  `${WON_FORMATTER.format(amount)}원`;

export const formatTransferDelta = (amount: number) => {
  if (amount === 0) return '변동 없음';

  return `${formatTransferWon(Math.abs(amount))} ${amount > 0 ? '증가' : '감소'}`;
};
