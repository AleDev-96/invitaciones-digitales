const GOOGLE_HOST = /^(?:(?:www|maps)\.)?google\.(?:[a-z]{2,3}|com?\.[a-z]{2})$/;
const SHORT_LINK_HOSTS = ['maps.app.goo.gl', 'goo.gl'];

function isGoogleMapsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      (GOOGLE_HOST.test(url.hostname) || SHORT_LINK_HOSTS.includes(url.hostname))
    );
  } catch {
    return false;
  }
}

export function buildMapsUrl(address: string | null, mapsUrl: string | null): string | null {
  if (mapsUrl && isGoogleMapsUrl(mapsUrl)) return mapsUrl;
  if (!address) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
