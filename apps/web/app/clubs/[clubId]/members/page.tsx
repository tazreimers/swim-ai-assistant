'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { useParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { AppShell } from '../../../../src/components/layout/app-shell';
import {
  ClubDetail,
  ClubRole,
  createInvitation,
  getClub,
  Invitation,
  listInvitations,
} from '../../../../src/lib/clubs';

export default function ClubMembersPage() {
  const params = useParams<{ clubId: string }>();
  const clubId = params.clubId;
  const [club, setClub] = useState<ClubDetail | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<ClubRole>('ATHLETE');
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!clubId) return;
    Promise.all([getClub(clubId), listInvitations(clubId)])
      .then(([clubData, invitationData]) => {
        setClub(clubData);
        setInvitations(invitationData);
      })
      .catch((loadError: unknown) =>
        setError(loadError instanceof Error ? loadError.message : 'Unable to load members'),
      );
  }, [clubId]);

  async function handleInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setInviteToken(null);
    setIsSubmitting(true);
    try {
      const invitation = await createInvitation(clubId, email, role);
      setInvitations((current) => [invitation, ...current]);
      setInviteToken(invitation.inviteToken);
      setEmail('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to send invitation');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppShell displayName={club?.name ?? 'Members'}>
      <Container maxWidth="lg" disableGutters>
        <Stack spacing={4}>
          <Link component={NextLink} href={`/clubs/${clubId}`} underline="hover" sx={{ alignSelf: 'flex-start' }}>
            <ArrowBackIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
            Back to club
          </Link>
          <div>
            <Typography variant="h4" component="h1" gutterBottom>Members and invitations</Typography>
            <Typography color="text.secondary">Invite trusted coaches and athletes to your club.</Typography>
          </div>
          {error && <Alert severity="error">{error}</Alert>}
          {inviteToken && (
            <Alert severity="success">
              Invitation created. Share this one-time token with the recipient:
              <Typography component="code" display="block" sx={{ mt: 1, wordBreak: 'break-all' }}>
                {inviteToken}
              </Typography>
            </Alert>
          )}
          <Card>
            <CardContent>
              <Stack spacing={2} component="form" onSubmit={handleInvite}>
                <Typography variant="h6">Invite a member</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                  <FormControl sx={{ minWidth: 160 }}>
                    <InputLabel id="invite-role-label">Role</InputLabel>
                    <Select
                      labelId="invite-role-label"
                      label="Role"
                      value={role}
                      onChange={(event) => setRole(event.target.value as ClubRole)}
                    >
                      <MenuItem value="ATHLETE">Athlete</MenuItem>
                      <MenuItem value="COACH">Coach</MenuItem>
                    </Select>
                  </FormControl>
                  <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create invitation'}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Active members</Typography>
              <Table>
                <TableHead>
                  <TableRow><TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Role</TableCell></TableRow>
                </TableHead>
                <TableBody>
                  {club?.memberships.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.user.name}</TableCell>
                      <TableCell>{member.user.email}</TableCell>
                      <TableCell>{member.role.toLowerCase()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Invitation history</Typography>
              {invitations.length === 0 ? (
                <Typography color="text.secondary">No invitations yet.</Typography>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow><TableCell>Email</TableCell><TableCell>Role</TableCell><TableCell>Status</TableCell><TableCell>Expires</TableCell></TableRow>
                  </TableHead>
                  <TableBody>
                    {invitations.map((invitation) => (
                      <TableRow key={invitation.id}>
                        <TableCell>{invitation.email}</TableCell>
                        <TableCell>{invitation.role.toLowerCase()}</TableCell>
                        <TableCell>{invitation.status.toLowerCase()}</TableCell>
                        <TableCell>{new Date(invitation.expiresAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </AppShell>
  );
}
