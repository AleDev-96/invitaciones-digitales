import type { Gift, GiftGuest, GiftList } from '../domain/gift';
import type { RpcCaller } from '../infra/supabase';

export type FetchGiftsResult =
  { kind: 'found'; list: GiftList } | { kind: 'missing' } | { kind: 'error' };

export type ReserveGiftResult = {
  kind:
    'reserved' | 'sold_out' | 'limit_reached' | 'closed' | 'no_rsvp' | 'not_attending' | 'error';
};

export type ReleaseGiftResult = { kind: 'released' | 'closed' | 'no_rsvp' | 'error' };

const GUESTS: GiftGuest[] = ['attending', 'not_attending', 'no_rsvp', 'disabled'];

function toGift(value: unknown): Gift | null {
  if (typeof value !== 'object' || value === null) return null;
  const v = value as Record<string, unknown>;
  if (typeof v.id !== 'string' || typeof v.name !== 'string') return null;
  if (typeof v.available !== 'boolean' || typeof v.mine !== 'boolean') return null;
  const description = typeof v.description === 'string' ? v.description : null;
  return { id: v.id, name: v.name, description, available: v.available, mine: v.mine };
}

function toList(value: unknown): GiftList | null {
  if (typeof value !== 'object' || value === null) return null;
  const v = value as Record<string, unknown>;
  const guest = GUESTS.find((g) => g === v.can_reserve);
  if (typeof v.open !== 'boolean' || !guest || typeof v.per_guest !== 'number') return null;
  if (!Array.isArray(v.gifts)) return null;
  const gifts = v.gifts.map(toGift);
  if (gifts.some((gift) => gift === null)) return null;
  return { open: v.open, guest, perGuest: v.per_guest, gifts: gifts as Gift[] };
}

function statusOf(data: unknown): unknown {
  return typeof data === 'object' && data !== null ? (data as { status?: unknown }).status : null;
}

export async function fetchGifts(
  slug: string,
  token: string | null,
  rpc: RpcCaller,
): Promise<FetchGiftsResult> {
  try {
    const { data, error } = await rpc('get_gifts', { p_slug: slug, p_token: token });
    if (error) return { kind: 'error' };
    if (data === null || data === undefined) return { kind: 'missing' };
    const list = toList(data);
    return list ? { kind: 'found', list } : { kind: 'error' };
  } catch {
    return { kind: 'error' };
  }
}

const RESERVE_KINDS = [
  'reserved',
  'sold_out',
  'limit_reached',
  'closed',
  'no_rsvp',
  'not_attending',
] as const;

export async function reserveGift(
  slug: string,
  giftId: string,
  token: string,
  rpc: RpcCaller,
): Promise<ReserveGiftResult> {
  try {
    const { data, error } = await rpc('reserve_gift', {
      p_slug: slug,
      p_gift_id: giftId,
      p_token: token,
    });
    if (error) return { kind: 'error' };
    const status = statusOf(data);
    return { kind: RESERVE_KINDS.find((kind) => kind === status) ?? 'error' };
  } catch {
    return { kind: 'error' };
  }
}

const RELEASE_KINDS = ['released', 'closed', 'no_rsvp'] as const;

export async function releaseGift(
  slug: string,
  giftId: string,
  token: string,
  rpc: RpcCaller,
): Promise<ReleaseGiftResult> {
  try {
    const { data, error } = await rpc('release_gift', {
      p_slug: slug,
      p_gift_id: giftId,
      p_token: token,
    });
    if (error) return { kind: 'error' };
    const status = statusOf(data);
    return { kind: RELEASE_KINDS.find((kind) => kind === status) ?? 'error' };
  } catch {
    return { kind: 'error' };
  }
}
