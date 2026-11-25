import { describe, expect, it, vi } from 'vitest';
import type { RpcCaller } from '../../src/infra/supabase';
import { fetchOwnerPanel, runOwnerAction } from '../../src/services/owners';

function rpcReturning(data: unknown, error: unknown = null): RpcCaller {
  return vi.fn(async () => ({ data, error }));
}

const row = {
  status: 'ok',
  expected_guests: 64,
  rsvp_open: true,
  rsvp_closed: false,
  rsvp_closes_at: '2026-12-05T02:59:00+00:00',
  rsvps: [
    { id: 'r1', name: 'Meli', attending: true, manual: false, created_at: '2026-11-25T10:00:00Z' },
  ],
  gifts: [
    {
      id: 'g1',
      name: 'Pañales',
      description: 'Talle P',
      max_reservations: 64,
      reservations: [{ id: 'x1', name: 'Tía Rosa', rsvp_id: null, manual: true }],
    },
  ],
};

describe('fetchOwnerPanel', () => {
  it('reads the panel with the key', async () => {
    const rpc = rpcReturning(row);
    expect(await fetchOwnerPanel('demo', 'clave', rpc)).toEqual({
      kind: 'ok',
      panel: {
        expectedGuests: 64,
        rsvpOpen: true,
        rsvpClosed: false,
        rsvpClosesAt: '2026-12-05T02:59:00+00:00',
        rsvps: [
          {
            id: 'r1',
            name: 'Meli',
            attending: true,
            manual: false,
            createdAt: '2026-11-25T10:00:00Z',
          },
        ],
        gifts: [
          {
            id: 'g1',
            name: 'Pañales',
            description: 'Talle P',
            maxReservations: 64,
            reservations: [{ id: 'x1', name: 'Tía Rosa', rsvpId: null, manual: true }],
          },
        ],
      },
    });
    expect(rpc).toHaveBeenCalledWith('get_owner_panel', { p_slug: 'demo', p_key: 'clave' });
  });

  it('reports a wrong key, a lock, a missing invitation and errors', async () => {
    expect(await fetchOwnerPanel('demo', 'x', rpcReturning({ status: 'wrong' }))).toEqual({
      kind: 'wrong',
    });
    expect(await fetchOwnerPanel('demo', 'x', rpcReturning({ status: 'locked' }))).toEqual({
      kind: 'locked',
    });
    expect(await fetchOwnerPanel('demo', 'x', rpcReturning(null))).toEqual({ kind: 'missing' });
    expect(await fetchOwnerPanel('demo', 'x', rpcReturning(null, { message: 'x' }))).toEqual({
      kind: 'error',
    });
    expect(await fetchOwnerPanel('demo', 'x', rpcReturning({ ...row, rsvps: [{}] }))).toEqual({
      kind: 'error',
    });
    const failing: RpcCaller = async () => {
      throw new Error('offline');
    };
    expect(await fetchOwnerPanel('demo', 'x', failing)).toEqual({ kind: 'error' });
  });
});

describe('runOwnerAction', () => {
  it('sends each action with the slug and the key', async () => {
    const rpc = rpcReturning({ status: 'ok' });
    await runOwnerAction('demo', 'k', { type: 'delete_rsvp', rsvpId: 'r1' }, rpc);
    await runOwnerAction(
      'demo',
      'k',
      { type: 'update_rsvp', rsvpId: 'r1', name: 'Meli', attending: false },
      rpc,
    );
    await runOwnerAction('demo', 'k', { type: 'add_rsvp', name: 'Tomi', attending: true }, rpc);
    await runOwnerAction('demo', 'k', { type: 'release_gift', reservationId: 'x1' }, rpc);
    await runOwnerAction('demo', 'k', { type: 'reserve_gift', giftId: 'g1', name: 'Rosa' }, rpc);
    expect(await runOwnerAction('demo', 'k', { type: 'set_rsvp_closed', closed: true }, rpc)).toBe(
      'ok',
    );
    const base = { p_slug: 'demo', p_key: 'k' };
    expect(vi.mocked(rpc).mock.calls).toEqual([
      ['owner_delete_rsvp', { ...base, p_rsvp_id: 'r1' }],
      ['owner_update_rsvp', { ...base, p_rsvp_id: 'r1', p_name: 'Meli', p_attending: false }],
      ['owner_add_rsvp', { ...base, p_name: 'Tomi', p_attending: true }],
      ['owner_release_gift', { ...base, p_reservation_id: 'x1' }],
      ['owner_reserve_gift', { ...base, p_gift_id: 'g1', p_name: 'Rosa' }],
      ['owner_set_rsvp_closed', { ...base, p_closed: true }],
    ]);
  });

  it('maps the answers of the database', async () => {
    const action = { type: 'reserve_gift', giftId: 'g1', name: 'Rosa' } as const;
    for (const status of ['wrong', 'locked', 'sold_out', 'invalid_name', 'past_deadline']) {
      expect(await runOwnerAction('demo', 'k', action, rpcReturning({ status }))).toBe(status);
    }
    expect(await runOwnerAction('demo', 'k', action, rpcReturning(null))).toBe('missing');
    expect(await runOwnerAction('demo', 'k', action, rpcReturning({ status: 'raro' }))).toBe(
      'error',
    );
    expect(await runOwnerAction('demo', 'k', action, rpcReturning(null, { message: 'x' }))).toBe(
      'error',
    );
  });
});
