import { describe, expect, it } from 'vitest';
import { checkGuestName } from '../../src/domain/rsvp';

describe('checkGuestName', () => {
  it('accepts a name and normalizes spaces', () => {
    expect(checkGuestName('  Ana   Pérez ')).toEqual({ ok: true, name: 'Ana Pérez' });
  });

  it('asks for a name when empty', () => {
    expect(checkGuestName('   ')).toEqual({ ok: false, reason: 'empty' });
  });

  it('rejects 1 character and more than 60', () => {
    expect(checkGuestName(' a ')).toEqual({ ok: false, reason: 'too_short' });
    expect(checkGuestName('x'.repeat(61))).toEqual({ ok: false, reason: 'too_long' });
    expect(checkGuestName('x'.repeat(60)).ok).toBe(true);
  });

  it('does not block two names', () => {
    expect(checkGuestName('Juan y María').ok).toBe(true);
  });
});
