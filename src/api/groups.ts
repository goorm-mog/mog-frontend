import { apiFetch } from '@/lib/apiFetch';
import type { GroupDetailResponse, GroupsResponse } from '@/types/groups';

export function fetchGroups() {
  return apiFetch<GroupsResponse>('/api/v1/groups');
}

export function fetchGroup(groupId: number) {
  return apiFetch<GroupDetailResponse>(`/api/v1/groups/${groupId}`);
}
