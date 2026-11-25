import { describe, expect, it } from 'vitest';
import { getEventDateParts } from '../../src/domain/eventDate';

describe('getEventDateParts', () => {
  it('formats the date in the time zone of the invitation', () => {
    expect(getEventDateParts('2026-12-05T19:00:00Z', 'America/Argentina/Salta')).toEqual({
      weekday: 'sábado',
      month: 'diciembre',
      day: '5',
      year: '2026',
      time: '16:00 hs.',
    });
  });

  it('shows a time range when the invitation has an end time', () => {
    expect(getEventDateParts('2026-12-05T17:30:00Z', 'America/Argentina/Salta', '18:30').time).toBe(
      'De 14:30 a 18:30 hs.',
    );
  });

  it('ignores an end time that is not a valid hour', () => {
    expect(getEventDateParts('2026-12-05T17:30:00Z', 'America/Argentina/Salta', '6 pm').time).toBe(
      '14:30 hs.',
    );
  });

  it('uses the time zone to decide the day', () => {
    expect(getEventDateParts('2026-12-06T01:30:00Z', 'America/Argentina/Salta').day).toBe('5');
    expect(getEventDateParts('2026-12-06T01:30:00Z', 'Europe/Madrid').day).toBe('6');
  });

  it('shows the zone next to the time when the time zone is not recognized', () => {
    const parts = getEventDateParts('2026-12-05T19:00:00Z', 'Zona/Inexistente');
    expect(parts.year).toBe('2026');
    expect(parts.time).toMatch(/^\d{2}:\d{2} hs\. \(.+\)$/);
  });
});
