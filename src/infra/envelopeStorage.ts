const keyFor = (slug: string) => `envelope-opened:${slug}`;

function browserStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function hasOpenedEnvelope(slug: string, storage = browserStorage()): boolean {
  try {
    return storage?.getItem(keyFor(slug)) === '1';
  } catch {
    return false;
  }
}

export function markEnvelopeOpened(slug: string, storage = browserStorage()): void {
  try {
    storage?.setItem(keyFor(slug), '1');
  } catch {
    // Sin almacenamiento disponible (por ejemplo, modo incógnito): el sobre se vuelve a mostrar.
  }
}
