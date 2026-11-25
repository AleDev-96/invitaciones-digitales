// La palabra clave vive solo en esta pestaña: se borra al cerrarla o al tocar "Salir".
const keyFor = (slug: string) => `owner-key:${slug}`;

function tabStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

export function readOwnerKey(slug: string, storage = tabStorage()): string | null {
  try {
    return storage?.getItem(keyFor(slug)) ?? null;
  } catch {
    return null;
  }
}

export function saveOwnerKey(slug: string, key: string, storage = tabStorage()): void {
  try {
    storage?.setItem(keyFor(slug), key);
  } catch {
    // Sin almacenamiento: se vuelve a pedir al recargar.
  }
}

export function clearOwnerKey(slug: string, storage = tabStorage()): void {
  try {
    storage?.removeItem(keyFor(slug));
  } catch {
    // Nada que borrar si no hay almacenamiento.
  }
}
