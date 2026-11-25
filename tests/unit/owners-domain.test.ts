import { describe, expect, it } from 'vitest';
import {
  canReopenRsvp,
  formatOwnerDate,
  formatOwnerDeadline,
  giftHasRoom,
  hasChosenGifts,
  rsvpCounts,
  rsvpGroup,
  type OwnerPanel,
  type OwnerRsvp,
} from '../../src/domain/owners';

const rsvp = (id: string, attending: boolean, createdAt: string): OwnerRsvp => ({
  id,
  name: id,
  attending,
  manual: false,
  createdAt,
});

function panel(overrides: Partial<OwnerPanel> = {}): OwnerPanel {
  return {
    expectedGuests: 4,
    rsvpOpen: true,
    rsvpClosed: false,
    rsvpClosesAt: '2026-12-05T02:59:00Z',
    rsvps: [
      rsvp('Ana', true, '2026-11-20T10:00:00Z'),
      rsvp('Beto', false, '2026-11-21T10:00:00Z'),
      rsvp('Caro', true, '2026-11-22T10:00:00Z'),
    ],
    gifts: [
      {
        id: 'g1',
        name: 'Cuna',
        description: null,
        maxReservations: 2,
        reservations: [{ id: 'r1', name: 'Ana', rsvpId: 'Ana', manual: false }],
      },
    ],
    ...overrides,
  };
}

describe('rsvpCounts', () => {
  it('counts each group and the pending answers', () => {
    expect(rsvpCounts(panel())).toEqual({
      attending: 2,
      notAttending: 1,
      noAnswer: 1,
      crasher: false,
    });
  });

  it('never goes below zero and flags a crasher', () => {
    expect(rsvpCounts(panel({ expectedGuests: 2 }))).toMatchObject({ noAnswer: 0, crasher: true });
    expect(rsvpCounts(panel({ expectedGuests: 3 }))).toMatchObject({ noAnswer: 0, crasher: false });
  });

  it('hides pending answers without expected guests', () => {
    expect(rsvpCounts(panel({ expectedGuests: null }))).toMatchObject({
      noAnswer: null,
      crasher: false,
    });
  });
});

describe('rsvpGroup', () => {
  it('lists one group from newest to oldest', () => {
    expect(rsvpGroup(panel(), true).map((r) => r.name)).toEqual(['Caro', 'Ana']);
    expect(rsvpGroup(panel(), false).map((r) => r.name)).toEqual(['Beto']);
  });
});

describe('gifts', () => {
  it('knows who has chosen gifts and which gifts have room', () => {
    expect(hasChosenGifts(panel(), 'Ana')).toBe(true);
    expect(hasChosenGifts(panel(), 'Caro')).toBe(false);
    const [gift] = panel().gifts;
    expect(giftHasRoom(gift)).toBe(true);
    expect(giftHasRoom({ ...gift, maxReservations: 1 })).toBe(false);
  });
});

describe('canReopenRsvp', () => {
  it('reopens only a manual close before the deadline', () => {
    const before = new Date('2026-12-01T00:00:00Z');
    const after = new Date('2026-12-06T00:00:00Z');
    expect(canReopenRsvp(panel({ rsvpClosed: true, rsvpOpen: false }), before)).toBe(true);
    expect(canReopenRsvp(panel({ rsvpClosed: true, rsvpOpen: false }), after)).toBe(false);
    expect(canReopenRsvp(panel(), before)).toBe(false);
  });
});

describe('owner dates', () => {
  it('formats in the invitation timezone', () => {
    const tz = 'America/Argentina/Buenos_Aires';
    expect(formatOwnerDate('2026-11-25T17:32:00Z', tz)).toBe('25/11 14:32');
    expect(formatOwnerDeadline('2026-12-05T02:59:00Z', tz)).toBe('04/12 a las 23:59');
  });
});
