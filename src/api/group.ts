import { apiFetch } from '@/lib/apiFetch';
import type {
  GroupCreateApiResponse,
  GroupCreateBody,
  GroupDeleteApiResponse,
  GroupDetailApiResponse,
  GroupJoinApiResponse,
  GroupJoinBody,
  GroupLeaveApiResponse,
  GroupListApiResponse,
  GroupUpdateApiResponse,
  GroupUpdateBody,
  HomeGroup,
} from '@/types/group';
import { toHomeGroup } from '@/types/group';

export async function fetchGroups(): Promise<HomeGroup[]> {
  const response = await apiFetch<GroupListApiResponse>('/api/v1/groups');
  if (!response.data?.groups) return [];
  return response.data.groups.map(toHomeGroup);
}

export async function fetchGroupDetail(groupId: number) {
  const response = await apiFetch<GroupDetailApiResponse>(`/api/v1/groups/${groupId}`);
  return response.data;
}

export async function createGroup(body: GroupCreateBody) {
  const response = await apiFetch<GroupCreateApiResponse>('/api/v1/groups', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return response.data;
}

export async function joinGroup(body: GroupJoinBody) {
  const response = await apiFetch<GroupJoinApiResponse>('/api/v1/groups/join', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return response.data;
}

export async function updateGroup(groupId: number, body: GroupUpdateBody) {
  const response = await apiFetch<GroupUpdateApiResponse>(`/api/v1/groups/${groupId}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return response.data;
}

export async function deleteGroup(groupId: number) {
  return apiFetch<GroupDeleteApiResponse>(`/api/v1/groups/${groupId}`, {
    method: 'DELETE',
  });
}

export async function leaveGroup(groupId: number) {
  return apiFetch<GroupLeaveApiResponse>(`/api/v1/groups/${groupId}/leave`, {
    method: 'DELETE',
  });
}
