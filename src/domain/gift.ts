export type GiftGuest = 'attending' | 'not_attending' | 'no_rsvp' | 'disabled';

export type Gift = {
  id: string;
  name: string;
  description: string | null;
  available: boolean;
  mine: boolean;
};

export type GiftList = { open: boolean; guest: GiftGuest; perGuest: number; gifts: Gift[] };

export type GiftBadge = 'mine' | 'available' | 'reserved';
export type GiftAction = 'choose' | 'release' | null;
export type GiftNotice = 'closed' | 'confirm_first' | 'contact_hosts' | 'limit_reached' | null;

export function chosenCount(list: GiftList): number {
  return list.gifts.filter((gift) => gift.mine).length;
}

export function giftBadge(gift: Gift): GiftBadge {
  if (gift.mine) return 'mine';
  return gift.available ? 'available' : 'reserved';
}

export function giftAction(list: GiftList, gift: Gift): GiftAction {
  if (!list.open || list.guest !== 'attending') return null;
  if (gift.mine) return 'release';
  return gift.available && chosenCount(list) < list.perGuest ? 'choose' : null;
}

// Sin confirmación de asistencia en la invitación, la lista es solo informativa: sin avisos.
export function giftNotice(list: GiftList): GiftNotice {
  if (list.guest === 'disabled') return null;
  if (!list.open) return 'closed';
  if (list.guest === 'no_rsvp') return 'confirm_first';
  if (list.guest === 'not_attending') return 'contact_hosts';
  return chosenCount(list) >= list.perGuest ? 'limit_reached' : null;
}
