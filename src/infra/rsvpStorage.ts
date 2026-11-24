const keyFor = (slug: string) => `rsvp:${slug}`;

export type StoredRsvp = { token: string; name: string; attending: boolean };

function browserStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

function isStoredRsvp(value: unknown): value is StoredRsvp {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.token === 'string' && typeof v.name === 'string' && typeof v.attending === 'boolean'
  );
}

export function readStoredRsvp(slug: string, storage = browserStorage()): StoredRsvp | null {
  try {
    const raw = storage?.getItem(keyFor(slug));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isStoredRsvp(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveStoredRsvp(slug: string, rsvp: StoredRsvp, storage = browserStorage()): void {
  try {
    storage?.setItem(keyFor(slug), JSON.stringify(rsvp));
  } catch {
    // Sin almacenamiento disponible (por ejemplo, modo incógnito): el formulario vuelve a aparecer.
  }
}

export function clearStoredRsvp(slug: string, storage = browserStorage()): void {
  try {
    storage?.removeItem(keyFor(slug));
  } catch {
    // Nada que borrar si no hay almacenamiento.
  }
}

export function newRsvpToken(): string {
  return crypto.randomUUID();
}
