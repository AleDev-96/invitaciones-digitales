import { describe, expect, it } from 'vitest';
import { buildMapsUrl } from '../../src/domain/maps';

describe('buildMapsUrl', () => {
  it('builds a Google Maps search from the address', () => {
    expect(buildMapsUrl('Calle 123, Salta Capital', null)).toBe(
      'https://www.google.com/maps/search/?api=1&query=Calle%20123%2C%20Salta%20Capital',
    );
  });

  it('prefers the Google Maps link loaded in the invitation', () => {
    expect(buildMapsUrl('Calle 123', 'https://maps.app.goo.gl/abc123')).toBe(
      'https://maps.app.goo.gl/abc123',
    );
  });

  it.each(['javascript:alert(1)', 'http://maps.app.goo.gl/abc', 'https://evil.example/maps', 'x'])(
    'ignores the link %s and falls back to the address',
    (mapsUrl) => {
      expect(buildMapsUrl('Calle 123', mapsUrl)).toBe(
        'https://www.google.com/maps/search/?api=1&query=Calle%20123',
      );
    },
  );

  it('returns null without address nor valid link', () => {
    expect(buildMapsUrl(null, null)).toBeNull();
    expect(buildMapsUrl(null, 'https://evil.example')).toBeNull();
  });
});
