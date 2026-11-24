import type { RsvpAnswer } from '../domain/rsvp';
import type { RpcCaller } from '../infra/supabase';

export type SubmitRsvpResult =
  | { kind: 'saved'; answer: RsvpAnswer }
  | { kind: 'closed' }
  | { kind: 'invalid_name' }
  | { kind: 'error' };

export type CheckRsvpResult =
  { kind: 'found'; answer: RsvpAnswer } | { kind: 'missing' } | { kind: 'error' };

type RsvpRow = { status?: string; name?: unknown; attending?: unknown };

function toAnswer(row: RsvpRow): RsvpAnswer | null {
  if (typeof row.name !== 'string' || typeof row.attending !== 'boolean') return null;
  return { name: row.name, attending: row.attending };
}

export async function submitRsvp(
  slug: string,
  input: RsvpAnswer & { token: string },
  rpc: RpcCaller,
): Promise<SubmitRsvpResult> {
  try {
    const { data, error } = await rpc('submit_rsvp', {
      p_slug: slug,
      p_name: input.name,
      p_attending: input.attending,
      p_token: input.token,
    });
    if (error || !data) return { kind: 'error' };
    const row = data as RsvpRow;
    if (row.status === 'closed') return { kind: 'closed' };
    if (row.status === 'invalid_name') return { kind: 'invalid_name' };
    const answer = row.status === 'saved' ? toAnswer(row) : null;
    return answer ? { kind: 'saved', answer } : { kind: 'error' };
  } catch {
    return { kind: 'error' };
  }
}

export async function checkRsvp(
  slug: string,
  token: string,
  rpc: RpcCaller,
): Promise<CheckRsvpResult> {
  try {
    const { data, error } = await rpc('get_rsvp', { p_slug: slug, p_token: token });
    if (error) return { kind: 'error' };
    if (data === null || data === undefined) return { kind: 'missing' };
    const answer = toAnswer(data as RsvpRow);
    return answer ? { kind: 'found', answer } : { kind: 'error' };
  } catch {
    return { kind: 'error' };
  }
}
