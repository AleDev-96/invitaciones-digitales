const GOOGLE_MAPS_HOSTS = [
  'google.com',
  'www.google.com',
  'maps.google.com',
  'google.com.ar',
  'www.google.com.ar',
  'maps.app.goo.gl',
  'goo.gl',
];

function isGoogleMapsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && GOOGLE_MAPS_HOSTS.includes(url.hostname);
  } catch {
    return false;
  }
}

export function buildMapsUrl(address: string | null, mapsUrl: string | null): string | null {
  if (mapsUrl && isGoogleMapsUrl(mapsUrl)) return mapsUrl;
  if (!address) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
