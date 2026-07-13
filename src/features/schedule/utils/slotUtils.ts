export function countUniqueVoters(slots: { votedUserIds: number[] }[]): number {
  return new Set(slots.flatMap((s) => s.votedUserIds)).size;
}
