export interface ScheduleSlot {
  slotId: number;
  date: string;
  time: string;
  voteCount: number;
  votedUserIds: number[];
}

export interface SlotsResponse {
  roomId: number;
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
  role: 'LEADER' | 'MEMBER';
  profileImageUrl?: string;
}

export interface RoomMembersResponse {
  members: RoomMember[];
}

export interface RoomStatusResponse {
  roomId: number;
  roomName: string;
  status: string;
  currentStep: number;
  members: RoomMember[];
}

export interface ConfirmScheduleResponse {
  confirmedId: number;
  roomId: number;
  date: string;
  time: string;
  confirmedBy: number;
  kakaoEventId: string | null;
  confirmedAt: string;
}
