import { describe, expect, it } from 'vitest';
import { getCountdown } from '../../src/domain/countdown';

describe('getCountdown', () => {
  it('splits the remaining time into days, hours, minutes and seconds', () => {
    expect(
      getCountdown('2026-12-05T16:00:00-03:00', new Date('2026-12-03T14:58:30-03:00')),
    ).toEqual({ days: 2, hours: 1, minutes: 1, seconds: 30 });
  });

  it('gives the same result whatever offset the dates are written with', () => {
    expect(getCountdown('2026-12-05T19:00:00Z', new Date('2026-12-05T15:00:00-03:00'))).toEqual({
      days: 0,
      hours: 1,
      minutes: 0,
      seconds: 0,
    });
  });

  it('returns null at the moment of the event and after it', () => {
    expect(getCountdown('2026-12-05T16:00:00-03:00', new Date('2026-12-05T16:00:00-03:00'))).toBe(
      null,
    );
    expect(getCountdown('2026-12-05T16:00:00-03:00', new Date('2027-01-01T00:00:00Z'))).toBe(null);
  });

  it('returns null for an invalid date', () => {
    expect(getCountdown('no es una fecha', new Date())).toBeNull();
  });
});
