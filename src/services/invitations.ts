import { isValidSlug, type Invitation } from '../domain/invitation';
import type { RpcCaller } from '../infra/supabase';

export type InvitationResult =
  | { kind: 'found'; invitation: Invitation }
  | { kind: 'not_found' }
  | { kind: 'unavailable' }
  | { kind: 'error' };

type InvitationRow = {
  status: string;
  slug: string;
  template_key: string;
  theme_key: string;
  event_at: string;
  timezone: string;
  rsvp_closes_at: string | null;
  expected_guests: number | null;
  takedown_on: string;
  preview_title: string;
  preview_description: string;
  preview_image_url: string | null;
  content: Record<string, unknown> | null;
  features: string[] | null;
};

function toInvitation(row: InvitationRow): Invitation {
  return {
    slug: row.slug,
    templateKey: row.template_key,
    themeKey: row.theme_key,
    eventAt: row.event_at,
    timezone: row.timezone,
    rsvpClosesAt: row.rsvp_closes_at,
    expectedGuests: row.expected_guests,
    takedownOn: row.takedown_on,
    preview: {
      title: row.preview_title,
      description: row.preview_description,
      imageUrl: row.preview_image_url,
    },
    content: row.content ?? {},
    features: row.features ?? [],
  };
}

export async function loadInvitation(slug: string, rpc: RpcCaller): Promise<InvitationResult> {
  if (!isValidSlug(slug)) return { kind: 'not_found' };

  try {
    const { data, error } = await rpc('get_invitation', { p_slug: slug });
    if (error) return { kind: 'error' };
    if (data === null || data === undefined) return { kind: 'not_found' };

    const row = data as InvitationRow;
    if (row.status === 'archived') return { kind: 'unavailable' };
    if (row.status === 'published') return { kind: 'found', invitation: toInvitation(row) };
    return { kind: 'error' };
  } catch {
    return { kind: 'error' };
  }
}
