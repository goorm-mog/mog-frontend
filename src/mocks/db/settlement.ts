import type { SettlementData } from '@/types/settlement';

export const settlementsDb: Array<{ roomId: number; data: SettlementData }> = [
  {
    roomId: 45,
    data: {
      isConfirmed: false,
      detail: {
        '1': {
          seq: 1,
          placeName: '합정 카페 A',
          totalCost: 28000,
          payer: {
            roomMemberId: 101,
            nickname: '김구름',
            bankName: '신한은행',
            accountNumber: '110-1234-1234',
          },
          participants: [
            { roomMemberId: 101, nickname: '김구름', amount: 10000 },
            { roomMemberId: 102, nickname: '박구름', amount: 8000 },
            { roomMemberId: 103, nickname: '최구름', amount: 10000 },
          ],
        },
        '2': {
          seq: 2,
          placeName: '냥냥 룰루',
          totalCost: 52000,
          payer: {
            roomMemberId: 103,
            nickname: '최구름',
            bankName: '카카오뱅크',
            accountNumber: '3333-1234-5678',
          },
          participants: [
            { roomMemberId: 101, nickname: '김구름', amount: 15000 },
            { roomMemberId: 102, nickname: '박구름', amount: 15000 },
            { roomMemberId: 104, nickname: '이구름', amount: 22000 },
          ],
        },
      },
    },
  },
];
