import { describe, expect, it } from 'vitest';
import { getVisibility, isValidSlug, localDate, validateSlug } from '../../src/domain/invitation';

describe('validateSlug', () => {
  it.each(['oliver', 'demo', 'baby-shower-sofia', 'sofia-2027', 'abc', 'a'.repeat(40)])(
    'accepts %s',
    (slug) => {
      expect(validateSlug(slug)).toBeNull();
      expect(isValidSlug(slug)).toBe(true);
    },
  );

  it.each([
    ['ab', 'too_short'],
    ['a'.repeat(41), 'too_long'],
    ['Oliver', 'invalid_characters'],
    ['sofía', 'invalid_characters'],
    ['baby shower', 'invalid_characters'],
    ['baby_shower', 'invalid_characters'],
    ['-oliver', 'invalid_characters'],
    ['oliver-', 'invalid_characters'],
    ['baby--shower', 'invalid_characters'],
    ['owners', 'reserved'],
    ['api', 'reserved'],
    ['assets', 'reserved'],
  ])('rejects %s as %s', (slug, error) => {
    expect(validateSlug(slug)).toBe(error);
    expect(isValidSlug(slug)).toBe(false);
  });
});

describe('localDate', () => {
  it('uses the invitation timezone', () => {
    const instant = new Date('2026-12-05T02:00:00Z');
    expect(localDate(instant, 'America/Argentina/Buenos_Aires')).toBe('2026-12-04');
    expect(localDate(instant, 'UTC')).toBe('2026-12-05');
  });
});

describe('getVisibility', () => {
  const tz = 'America/Argentina/Buenos_Aires';
  const takedownOn = '2026-12-12';
  const before = new Date('2026-12-11T23:00:00-03:00');
  const onTakedownDay = new Date('2026-12-12T00:00:00-03:00');

  it('hides drafts as if they did not exist', () => {
    expect(getVisibility('draft', takedownOn, tz, before)).toBe('not_found');
  });

  it('shows published invitations before the takedown date', () => {
    expect(getVisibility('published', takedownOn, tz, before)).toBe('visible');
  });

  it('marks published invitations as unavailable from the takedown date', () => {
    expect(getVisibility('published', takedownOn, tz, onTakedownDay)).toBe('unavailable');
  });

  it('marks archived invitations as unavailable', () => {
    expect(getVisibility('archived', takedownOn, tz, before)).toBe('unavailable');
  });
});
