import { fetchApi } from './api';

export type ClubRole = 'OWNER' | 'COACH' | 'ATHLETE';

export type ClubSummary = {
  role: ClubRole;
  club: {
    id: string;
    name: string;
    status: string;
    _count: { memberships: number; squads: number };
  };
};

export type ClubMember = {
  id: string;
  role: ClubRole;
  user: { id: string; email: string; name: string };
};

export type Squad = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  memberships: Array<{
    id: string;
    user: { id: string; email: string; name: string };
  }>;
  _count?: { memberships: number };
};

export type ClubDetail = {
  id: string;
  name: string;
  status: string;
  memberships: ClubMember[];
  squads: Squad[];
};

export type Invitation = {
  id: string;
  email: string;
  role: ClubRole;
  status: string;
  expiresAt: string;
  createdAt: string;
};

export async function listClubs() {
  return fetchApi<ClubSummary[]>('/clubs');
}

export async function createClub(name: string) {
  return fetchApi<{ id: string }>('/clubs', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
}

export async function getClub(clubId: string) {
  return fetchApi<ClubDetail>(`/clubs/${clubId}`);
}

export async function createInvitation(
  clubId: string,
  email: string,
  role: ClubRole,
) {
  return fetchApi<Invitation & { inviteToken: string; deliveryRequired: boolean }>(
    `/clubs/${clubId}/invitations`,
    {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    },
  );
}

export async function listInvitations(clubId: string) {
  return fetchApi<Invitation[]>(`/clubs/${clubId}/invitations`);
}

export async function createSquad(
  clubId: string,
  name: string,
  description?: string,
) {
  return fetchApi<Squad>(`/clubs/${clubId}/squads`, {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  });
}

export async function listSquads(clubId: string) {
  return fetchApi<Squad[]>(`/clubs/${clubId}/squads`);
}

export async function addSquadMember(squadId: string, userId: string) {
  return fetchApi(`/squads/${squadId}/members`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

export async function acceptInvitation(token: string) {
  return fetchApi<{ clubId: string; role: ClubRole }>(
    `/invitations/${token}/accept`,
    { method: 'POST' },
  );
}
