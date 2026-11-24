import { describe, expect, it } from 'vitest';
import {
  chosenCount,
  giftAction,
  giftBadge,
  giftNotice,
  type Gift,
  type GiftList,
} from '../../src/domain/gift';

function gift(id: string, available = true, mine = false): Gift {
  return { id, name: `Regalo ${id}`, description: null, available, mine };
}

function list(overrides: Partial<GiftList> = {}): GiftList {
  return {
    open: true,
    guest: 'attending',
    perGuest: 3,
    gifts: [gift('a'), gift('b', false), gift('c', false, true)],
    ...overrides,
  };
}

const actions = (l: GiftList) => l.gifts.map((g) => giftAction(l, g));

describe('giftBadge', () => {
  it('shows only available, reserved or mine', () => {
    expect(giftBadge(gift('a'))).toBe('available');
    expect(giftBadge(gift('a', false))).toBe('reserved');
    expect(giftBadge(gift('a', false, true))).toBe('mine');
    expect(giftBadge(gift('a', true, true))).toBe('mine');
  });
});

describe('gift list rules', () => {
  it('lets an attending guest choose available gifts and release their own', () => {
    const l = list();
    expect(actions(l)).toEqual(['choose', null, 'release']);
    expect(giftNotice(l)).toBeNull();
  });

  it('asks to confirm first when there is no answer', () => {
    const l = list({ guest: 'no_rsvp', gifts: [gift('a'), gift('b', false)] });
    expect(actions(l)).toEqual([null, null]);
    expect(giftNotice(l)).toBe('confirm_first');
  });

  it('points to the hosts when the answer is "No podré ir"', () => {
    const l = list({ guest: 'not_attending', gifts: [gift('a')] });
    expect(actions(l)).toEqual([null]);
    expect(giftNotice(l)).toBe('contact_hosts');
  });

  it('is only informative when the invitation has no rsvp', () => {
    const l = list({ guest: 'disabled', gifts: [gift('a')] });
    expect(actions(l)).toEqual([null]);
    expect(giftNotice(l)).toBeNull();
    expect(giftNotice({ ...l, open: false })).toBeNull();
  });

  it('keeps "Tu regalo" but hides buttons when closed', () => {
    const l = list({ open: false });
    expect(actions(l)).toEqual([null, null, null]);
    expect(giftBadge(l.gifts[2])).toBe('mine');
    expect(giftNotice(l)).toBe('closed');
    expect(giftNotice({ ...l, guest: 'no_rsvp' })).toBe('closed');
  });

  it('stops choosing at the per-guest limit but still allows releasing', () => {
    const l = list({
      perGuest: 2,
      gifts: [gift('a', true, true), gift('b', false, true), gift('c'), gift('d')],
    });
    expect(chosenCount(l)).toBe(2);
    expect(actions(l)).toEqual(['release', 'release', null, null]);
    expect(giftNotice(l)).toBe('limit_reached');
    expect(giftNotice({ ...l, perGuest: 3 })).toBeNull();
  });
});
