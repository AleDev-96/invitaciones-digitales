import type { OwnerGift, OwnerPanel, OwnerReservation, OwnerRsvp } from '../domain/owners';
import type { RpcCaller } from '../infra/supabase';

export type OwnerAccess = 'wrong' | 'locked';

export type FetchOwnerPanelResult =
  | { kind: 'ok'; panel: OwnerPanel }
  | { kind: OwnerAccess }
  | { kind: 'missing' }
  | { kind: 'error' };

export type OwnerAction =
  | { type: 'delete_rsvp'; rsvpId: string }
  | { type: 'update_rsvp'; rsvpId: string; name: string; attending: boolean }
  | { type: 'add_rsvp'; name: string; attending: boolean }
  | { type: 'release_gift'; reservationId: string }
  | { type: 'reserve_gift'; giftId: string; name: string }
  | { type: 'set_rsvp_closed'; closed: boolean };

const ACTION_KINDS = [
  'ok',
  'wrong',
  'locked',
  'invalid_name',
  'sold_out',
  'not_found',
  'past_deadline',
] as const;

export type OwnerActionKind = (typeof ACTION_KINDS)[number] | 'missing' | 'error';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

function toRsvp(value: unknown): OwnerRsvp | null {
  if (!isObject(value)) return null;
  const { id, name, attending, manual, created_at } = value;
  if (typeof id !== 'string' || typeof name !== 'string' || typeof created_at !== 'string')
    return null;
  if (typeof attending !== 'boolean' || typeof manual !== 'boolean') return null;
  return { id, name, attending, manual, createdAt: created_at };
}

function toReservation(value: unknown): OwnerReservation | null {
  if (!isObject(value)) return null;
  const { id, name, rsvp_id, manual } = value;
  if (typeof id !== 'string' || typeof name !== 'string' || typeof manual !== 'boolean')
    return null;
  return { id, name, rsvpId: typeof rsvp_id === 'string' ? rsvp_id : null, manual };
}

function toGift(value: unknown): OwnerGift | null {
  if (!isObject(value)) return null;
  const { id, name, description, max_reservations, reservations } = value;
  if (typeof id !== 'string' || typeof name !== 'string') return null;
  if (typeof max_reservations !== 'number' || !Array.isArray(reservations)) return null;
  const list = reservations.map(toReservation);
  if (list.some((r) => r === null)) return null;
  return {
    id,
    name,
    description: typeof description === 'string' ? description : null,
    maxReservations: max_reservations,
    reservations: list as OwnerReservation[],
  };
}

function toPanel(value: Record<string, unknown>): OwnerPanel | null {
  const { expected_guests, rsvp_open, rsvp_closed, rsvp_closes_at, rsvps, gifts } = value;
  if (typeof rsvp_open !== 'boolean' || typeof rsvp_closed !== 'boolean') return null;
  if (typeof rsvp_closes_at !== 'string' || !Array.isArray(rsvps) || !Array.isArray(gifts))
    return null;
  const rsvpList = rsvps.map(toRsvp);
  const giftList = gifts.map(toGift);
  if (rsvpList.some((r) => r === null) || giftList.some((g) => g === null)) return null;
  return {
    expectedGuests: typeof expected_guests === 'number' ? expected_guests : null,
    rsvpOpen: rsvp_open,
    rsvpClosed: rsvp_closed,
    rsvpClosesAt: rsvp_closes_at,
    rsvps: rsvpList as OwnerRsvp[],
    gifts: giftList as OwnerGift[],
  };
}

export async function fetchOwnerPanel(
  slug: string,
  key: string,
  rpc: RpcCaller,
): Promise<FetchOwnerPanelResult> {
  try {
    const { data, error } = await rpc('get_owner_panel', { p_slug: slug, p_key: key });
    if (error) return { kind: 'error' };
    if (data === null || data === undefined) return { kind: 'missing' };
    if (!isObject(data)) return { kind: 'error' };
    if (data.status === 'wrong' || data.status === 'locked') return { kind: data.status };
    const panel = data.status === 'ok' ? toPanel(data) : null;
    return panel ? { kind: 'ok', panel } : { kind: 'error' };
  } catch {
    return { kind: 'error' };
  }
}

function actionCall(action: OwnerAction): [string, Record<string, unknown>] {
  switch (action.type) {
    case 'delete_rsvp':
      return ['owner_delete_rsvp', { p_rsvp_id: action.rsvpId }];
    case 'update_rsvp':
      return [
        'owner_update_rsvp',
        { p_rsvp_id: action.rsvpId, p_name: action.name, p_attending: action.attending },
      ];
    case 'add_rsvp':
      return ['owner_add_rsvp', { p_name: action.name, p_attending: action.attending }];
    case 'release_gift':
      return ['owner_release_gift', { p_reservation_id: action.reservationId }];
    case 'reserve_gift':
      return ['owner_reserve_gift', { p_gift_id: action.giftId, p_name: action.name }];
    case 'set_rsvp_closed':
      return ['owner_set_rsvp_closed', { p_closed: action.closed }];
  }
}

export async function runOwnerAction(
  slug: string,
  key: string,
  action: OwnerAction,
  rpc: RpcCaller,
): Promise<OwnerActionKind> {
  const [fn, args] = actionCall(action);
  try {
    const { data, error } = await rpc(fn, { p_slug: slug, p_key: key, ...args });
    if (error) return 'error';
    if (data === null || data === undefined) return 'missing';
    const status = isObject(data) ? data.status : null;
    return ACTION_KINDS.find((kind) => kind === status) ?? 'error';
  } catch {
    return 'error';
  }
}
