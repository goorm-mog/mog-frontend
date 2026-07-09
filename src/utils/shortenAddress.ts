export function shortenAddress(address?: string): string {
  if (!address?.trim()) return '중간 지점';
  const parts = address.split(' ').filter(Boolean);
  const startIdx = parts.findIndex((p) => /[읍면동로길]$/.test(p));
  if (startIdx === -1) return parts.slice(-2).join(' ');
  return parts.slice(startIdx, startIdx + 2).join(' ');
}
