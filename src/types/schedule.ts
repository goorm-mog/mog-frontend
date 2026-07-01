export interface ScheduleSlot {
  slotId: number;
  date: string;
  time: string;
  voteCount: number;
  votedUserIds: number[];
}

export interface SlotsResponse {
  roomId: number;
  totalParticipants: number;
  slots: ScheduleSlot[];
}

export type RegisteredSlot = Pick<ScheduleSlot, 'slotId' | 'date' | 'time'>;

export interface RegisterSlotsResponse {
  roomId: number;
  slots: RegisteredSlot[];
}

export interface VoteResponse {
  votedSlotIds: number[];
}

export interface RoomMember {
  userId: number;
  nickname: string;
  profileImageUrl?: string;
}

export interface RoomMembersResponse {
  members: RoomMember[];
}

export interface ConfirmScheduleResponse {
  confirmedId: number;
  roomId: number;
  date: string;
  time: string;
  confirmedBy: { userId: number; nickname: string };
  kakaoEventId: string | null;
  confirmedAt: string;
}
