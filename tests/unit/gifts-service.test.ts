import { describe, expect, it, vi } from 'vitest';
import type { RpcCaller } from '../../src/infra/supabase';
import { fetchGifts, releaseGift, reserveGift } from '../../src/services/gifts';

function rpcReturning(data: unknown, error: unknown = null): RpcCaller {
  return vi.fn(async () => ({ data, error }));
}

const offline: RpcCaller = vi.fn(async () => {
  throw new Error('offline');
});

const row = {
  open: true,
  can_reserve: 'attending',
  per_guest: 3,
  gifts: [
    { id: 'g1', name: 'Pañales', description: 'Talle P', available: true, mine: false },
    { id: 'g2', name: 'Cuna', description: null, available: false, mine: true },
  ],
};

describe('fetchGifts', () => {
  it('reads the list', async () => {
    const rpc = rpcReturning(row);
    expect(await fetchGifts('demo', 'tok', rpc)).toEqual({
      kind: 'found',
      list: {
        open: true,
        guest: 'attending',
        perGuest: 3,
        gifts: [
          { id: 'g1', name: 'Pañales', description: 'Talle P', available: true, mine: false },
          { id: 'g2', name: 'Cuna', description: null, available: false, mine: true },
        ],
      },
    });
    expect(rpc).toHaveBeenCalledWith('get_gifts', { p_slug: 'demo', p_token: 'tok' });
  });

  it('reads the list without an answer', async () => {
    const rpc = rpcReturning({ ...row, can_reserve: 'no_rsvp', gifts: [] });
    const result = await fetchGifts('demo', null, rpc);
    expect(result.kind === 'found' && result.list.guest).toBe('no_rsvp');
    expect(rpc).toHaveBeenCalledWith('get_gifts', { p_slug: 'demo', p_token: null });
  });

  it('returns missing when the invitation is not visible', async () => {
    expect(await fetchGifts('demo', null, rpcReturning(null))).toEqual({ kind: 'missing' });
  });

  it('returns error on failure or unexpected data', async () => {
    expect(await fetchGifts('demo', null, rpcReturning(null, { message: 'x' }))).toEqual({
      kind: 'error',
    });
    expect(await fetchGifts('demo', null, rpcReturning({ ...row, can_reserve: 'x' }))).toEqual({
      kind: 'error',
    });
    expect(await fetchGifts('demo', null, rpcReturning({ ...row, gifts: [{ id: 1 }] }))).toEqual({
      kind: 'error',
    });
    expect(await fetchGifts('demo', null, offline)).toEqual({ kind: 'error' });
  });
});

describe('reserveGift', () => {
  it('reserves the gift', async () => {
    const rpc = rpcReturning({ status: 'reserved' });
    expect(await reserveGift('demo', 'g1', 'tok', rpc)).toEqual({ kind: 'reserved' });
    expect(rpc).toHaveBeenCalledWith('reserve_gift', {
      p_slug: 'demo',
      p_gift_id: 'g1',
      p_token: 'tok',
    });
  });

  it('reports sold out, limit, closed and missing answer', async () => {
    for (const status of ['sold_out', 'limit_reached', 'closed', 'no_rsvp', 'not_attending']) {
      expect(await reserveGift('demo', 'g1', 'tok', rpcReturning({ status }))).toEqual({
        kind: status,
      });
    }
  });

  it('reports errors', async () => {
    expect(await reserveGift('demo', 'g1', 'tok', rpcReturning(null, { message: 'x' }))).toEqual({
      kind: 'error',
    });
    expect(await reserveGift('demo', 'g1', 'tok', rpcReturning(null))).toEqual({ kind: 'error' });
    expect(
      await reserveGift('demo', 'g1', 'tok', rpcReturning({ status: 'invalid_request' })),
    ).toEqual({ kind: 'error' });
    expect(await reserveGift('demo', 'g1', 'tok', offline)).toEqual({ kind: 'error' });
  });
});

describe('releaseGift', () => {
  it('releases the gift', async () => {
    const rpc = rpcReturning({ status: 'released' });
    expect(await releaseGift('demo', 'g1', 'tok', rpc)).toEqual({ kind: 'released' });
    expect(rpc).toHaveBeenCalledWith('release_gift', {
      p_slug: 'demo',
      p_gift_id: 'g1',
      p_token: 'tok',
    });
  });

  it('reports closed, missing answer and errors', async () => {
    expect(await releaseGift('demo', 'g1', 'tok', rpcReturning({ status: 'closed' }))).toEqual({
      kind: 'closed',
    });
    expect(await releaseGift('demo', 'g1', 'tok', rpcReturning({ status: 'no_rsvp' }))).toEqual({
      kind: 'no_rsvp',
    });
    expect(await releaseGift('demo', 'g1', 'tok', offline)).toEqual({ kind: 'error' });
  });
});
