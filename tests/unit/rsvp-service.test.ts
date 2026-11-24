import { describe, expect, it, vi } from 'vitest';
import type { RpcCaller } from '../../src/infra/supabase';
import { checkRsvp, submitRsvp } from '../../src/services/rsvp';

function rpcReturning(data: unknown, error: unknown = null): RpcCaller {
  return vi.fn(async () => ({ data, error }));
}

const input = { name: 'Ana', attending: false, token: 'tok' };

describe('submitRsvp', () => {
  it('sends the answer and returns it', async () => {
    const rpc = rpcReturning({ status: 'saved', name: 'Ana', attending: false });
    expect(await submitRsvp('demo', input, rpc)).toEqual({
      kind: 'saved',
      answer: { name: 'Ana', attending: false },
    });
    expect(rpc).toHaveBeenCalledWith('submit_rsvp', {
      p_slug: 'demo',
      p_name: 'Ana',
      p_attending: false,
      p_token: 'tok',
    });
  });

  it('reports closed and invalid name', async () => {
    expect(await submitRsvp('demo', input, rpcReturning({ status: 'closed' }))).toEqual({
      kind: 'closed',
    });
    expect(await submitRsvp('demo', input, rpcReturning({ status: 'invalid_name' }))).toEqual({
      kind: 'invalid_name',
    });
  });

  it('reports errors', async () => {
    expect(await submitRsvp('demo', input, rpcReturning(null, { message: 'x' }))).toEqual({
      kind: 'error',
    });
    expect(await submitRsvp('demo', input, rpcReturning(null))).toEqual({ kind: 'error' });
    expect(await submitRsvp('demo', input, rpcReturning({ status: 'invalid_request' }))).toEqual({
      kind: 'error',
    });
    const failing: RpcCaller = vi.fn(async () => {
      throw new Error('offline');
    });
    expect(await submitRsvp('demo', input, failing)).toEqual({ kind: 'error' });
  });
});

describe('checkRsvp', () => {
  it('finds the own answer', async () => {
    const rpc = rpcReturning({ name: 'Ana', attending: true });
    expect(await checkRsvp('demo', 'tok', rpc)).toEqual({
      kind: 'found',
      answer: { name: 'Ana', attending: true },
    });
    expect(rpc).toHaveBeenCalledWith('get_rsvp', { p_slug: 'demo', p_token: 'tok' });
  });

  it('returns missing when the owners deleted it', async () => {
    expect(await checkRsvp('demo', 'tok', rpcReturning(null))).toEqual({ kind: 'missing' });
  });

  it('returns error on failure', async () => {
    expect(await checkRsvp('demo', 'tok', rpcReturning(null, { message: 'x' }))).toEqual({
      kind: 'error',
    });
  });
});
