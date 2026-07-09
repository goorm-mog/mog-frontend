import { apiFetch } from '@/lib/apiFetch';
import type {
  GroupCreateApiResponse,
  GroupCreateBody,
  GroupDeleteApiResponse,
  GroupDetailApiResponse,
  GroupListApiResponse,
  GroupUpdateApiResponse,
  GroupUpdateBody,
  HomeGroup,
} from '@/types/group';
import { toHomeGroup } from '@/types/group';

export async function fetchGroups(): Promise<HomeGroup[]> {
  const response = await apiFetch<GroupListApiResponse>('/api/v1/groups');
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

export async function updateGroup(groupId: number, body: GroupUpdateBody) {
  const response = await apiFetch<GroupUpdateApiResponse>(`/api/v1/groups/${groupId}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return response.data;
}

export async function deleteGroup(groupId: number) {
  const response = await apiFetch<GroupDeleteApiResponse>(`/api/v1/groups/${groupId}`, {
    method: 'DELETE',
  });
  return response.data;
}
