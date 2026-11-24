import { buildMapsUrl } from '../domain/maps';

type MapsLinkProps = { address: string | null; mapsUrl: string | null; label: string };

export function MapsLink({ address, mapsUrl, label }: MapsLinkProps) {
  const href = buildMapsUrl(address, mapsUrl);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block rounded-full bg-(--color-taupe) px-8 py-3 font-semibold text-(--color-paper) shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-sage-dark)"
    >
      {label}
    </a>
  );
}
