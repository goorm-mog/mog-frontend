// http://localhost:5173/reschedule/participant/45 -> 참여자 화면
// http://localhost:5173/reschedule/host/45 -> 방장 화면
// ※ 임시 데이터로 테스트하기때문에 실제 날짜와 시간이 플로우와 다를 수 있습니다

// ✏️ 여기만 바꾸면 됩니다
// 'fresh' → 슬롯 없음  (방장: 슬롯 생성 화면 / 참가자: 대기 화면)
// 'vote'  → 슬롯 있음  (방장·참가자 모두 투표 화면)
// 'done'  → 투표 완료  (방장: 일정 확정 화면 / 참가자: 결과 확인 화면)
const SCENARIO = 'fresh' as 'fresh' | 'vote' | 'done';

const BASE_SLOTS = {
  roomId: 45,
  dates: [
    { slotId: 10, date: '2026-07-01', time: '09:00' },
    { slotId: 11, date: '2026-07-01', time: '10:00' },
    { slotId: 12, date: '2026-07-01', time: '14:00' },
    { slotId: 13, date: '2026-07-01', time: '19:00' },
    { slotId: 14, date: '2026-07-02', time: '13:00' },
    { slotId: 15, date: '2026-07-02', time: '19:00' },
    { slotId: 16, date: '2026-07-03', time: '18:00' },
    { slotId: 17, date: '2026-07-03', time: '19:00' },
    { slotId: 18, date: '2026-07-03', time: '20:00' },
  ],
};

// userId 1 = 현재 로그인 유저
const VOTED_USER_IDS: Record<number, number[]> = {
  10: [1, 2],
  11: [1, 2, 3],
  12: [4],
  13: [1, 2, 3, 4],
  14: [2, 3],
  15: [1, 2],
  16: [1, 2, 3],
  17: [1, 2, 3, 4],
  18: [1],
};

const NOT_VOTED_USER_IDS: Record<number, number[]> = {
  10: [2],
  11: [2, 3],
  12: [4],
  13: [2, 3, 4],
  14: [2, 3],
  15: [2],
  16: [2, 3],
  17: [2, 3, 4],
  18: [],
};

export const scheduleSlotsDb =
  SCENARIO === 'fresh'
    ? []
    : BASE_SLOTS.dates.map((s) => ({
        ...s,
        roomId: BASE_SLOTS.roomId,
        votedUserIds: (SCENARIO === 'done' ? VOTED_USER_IDS : NOT_VOTED_USER_IDS)[s.slotId] ?? [],
      }));

export const confirmedSchedulesDb =
  SCENARIO === 'done'
    ? [
        {
          confirmedId: 1,
          roomId: 45,
          date: '2026-07-01',
          time: '19:00',
          confirmedBy: { userId: 1, nickname: '김구름' },
          kakaoEventId: 'kakao_event_abc123',
          confirmedAt: '2026-06-18T10:00:00',
        },
      ]
    : [];
