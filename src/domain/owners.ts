export type OwnerRsvp = {
  id: string;
  name: string;
  attending: boolean;
  manual: boolean;
  createdAt: string;
};

export type OwnerReservation = { id: string; name: string; rsvpId: string | null; manual: boolean };

export type OwnerGift = {
  id: string;
  name: string;
  description: string | null;
  maxReservations: number;
  reservations: OwnerReservation[];
};

export type OwnerPanel = {
  expectedGuests: number | null;
  rsvpOpen: boolean;
  rsvpClosed: boolean;
  rsvpClosesAt: string;
  rsvps: OwnerRsvp[];
  gifts: OwnerGift[];
};

export type RsvpCounts = {
  attending: number;
  notAttending: number;
  noAnswer: number | null;
  crasher: boolean;
};

export function rsvpCounts(panel: OwnerPanel): RsvpCounts {
  const attending = panel.rsvps.filter((rsvp) => rsvp.attending).length;
  const notAttending = panel.rsvps.length - attending;
  const expected = panel.expectedGuests;
  return {
    attending,
    notAttending,
    noAnswer: expected === null ? null : Math.max(expected - panel.rsvps.length, 0),
    crasher: expected !== null && panel.rsvps.length > expected,
  };
}

export function rsvpGroup(panel: OwnerPanel, attending: boolean): OwnerRsvp[] {
  return panel.rsvps
    .filter((rsvp) => rsvp.attending === attending)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export function hasChosenGifts(panel: OwnerPanel, rsvpId: string): boolean {
  return panel.gifts.some((gift) => gift.reservations.some((r) => r.rsvpId === rsvpId));
}

export function giftHasRoom(gift: OwnerGift): boolean {
  return gift.reservations.length < gift.maxReservations;
}

export function canReopenRsvp(panel: OwnerPanel, now: Date): boolean {
  return panel.rsvpClosed && now.getTime() < Date.parse(panel.rsvpClosesAt);
}
