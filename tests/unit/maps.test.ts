import { describe, expect, it } from 'vitest';
import { buildMapsUrl } from '../../src/domain/maps';

describe('buildMapsUrl', () => {
  it('builds a Google Maps search from the address', () => {
    expect(buildMapsUrl('Av. Siempre Viva 742, Springfield', null)).toBe(
      'https://www.google.com/maps/search/?api=1&query=Av.%20Siempre%20Viva%20742%2C%20Springfield',
    );
  });

  it('prefers the Google Maps link loaded in the invitation', () => {
    expect(buildMapsUrl('Av. Siempre Viva 742', 'https://maps.app.goo.gl/abc123')).toBe(
      'https://maps.app.goo.gl/abc123',
    );
  });

  it.each([
    'https://www.google.es/maps/place/x',
    'https://www.google.com.mx/maps/place/x',
    'https://maps.google.co.uk/?q=x',
  ])('accepts the regional Google Maps link %s', (mapsUrl) => {
    expect(buildMapsUrl(null, mapsUrl)).toBe(mapsUrl);
  });

  it.each([
    'https://google.evil.example/maps',
    'https://www.google.com.evil.example/maps',
    'javascript:alert(1)',
    'http://maps.app.goo.gl/abc',
    'https://evil.example/maps',
    'x',
  ])('ignores the link %s and falls back to the address', (mapsUrl) => {
    expect(buildMapsUrl('Av. Siempre Viva 742', mapsUrl)).toBe(
      'https://www.google.com/maps/search/?api=1&query=Av.%20Siempre%20Viva%20742',
    );
  });

  it('returns null without address nor valid link', () => {
    expect(buildMapsUrl(null, null)).toBeNull();
    expect(buildMapsUrl(null, 'https://evil.example')).toBeNull();
  });
});
