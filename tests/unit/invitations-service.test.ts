import { describe, expect, it, vi } from 'vitest';
import type { RpcCaller } from '../../src/infra/supabase';
import { loadInvitation } from '../../src/services/invitations';

const publishedRow = {
  status: 'published',
  slug: 'demo',
  template_key: 'baby-shower',
  theme_key: 'sage-geese',
  event_at: '2027-06-12T19:00:00+00:00',
  timezone: 'America/Argentina/Buenos_Aires',
  rsvp_closes_at: null,
  rsvp_open: true,
  expected_guests: null,
  takedown_on: '2027-12-31',
  preview_title: 'Baby shower de demostración',
  preview_description: 'Invitación de prueba.',
  preview_image_url: null,
  content: { title: 'Baby shower de demostración' },
  features: [],
};

function rpcReturning(data: unknown, error: unknown = null): RpcCaller {
  return vi.fn(async () => ({ data, error }));
}

describe('loadInvitation', () => {
  it('returns a published invitation', async () => {
    const rpc = rpcReturning(publishedRow);
    const result = await loadInvitation('demo', rpc);
    expect(rpc).toHaveBeenCalledWith('get_invitation', { p_slug: 'demo' });
    expect(result).toMatchObject({
      kind: 'found',
      invitation: {
        slug: 'demo',
        templateKey: 'baby-shower',
        themeKey: 'sage-geese',
        rsvpOpen: true,
      },
    });
  });

  it('returns not_found when the database returns nothing', async () => {
    expect(await loadInvitation('no-existe', rpcReturning(null))).toEqual({ kind: 'not_found' });
  });

  it('returns not_found for an invalid slug without calling the database', async () => {
    const rpc = rpcReturning(publishedRow);
    expect(await loadInvitation('Not A Slug', rpc)).toEqual({ kind: 'not_found' });
    expect(rpc).not.toHaveBeenCalled();
  });

  it('returns unavailable for an archived invitation', async () => {
    expect(await loadInvitation('demo-baja', rpcReturning({ status: 'archived' }))).toEqual({
      kind: 'unavailable',
    });
  });

  it('returns error when the database answers with an error', async () => {
    expect(await loadInvitation('demo', rpcReturning(null, { message: 'down' }))).toEqual({
      kind: 'error',
    });
  });

  it('returns error when the call throws', async () => {
    const rpc: RpcCaller = async () => {
      throw new Error('network');
    };
    expect(await loadInvitation('demo', rpc)).toEqual({ kind: 'error' });
  });
});
