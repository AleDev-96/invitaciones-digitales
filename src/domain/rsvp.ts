export const GUEST_NAME_MIN = 2;
export const GUEST_NAME_MAX = 60;

export type GuestNameCheck =
  { ok: true; name: string } | { ok: false; reason: 'empty' | 'too_short' | 'too_long' };

export function normalizeGuestName(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ');
}

export function checkGuestName(raw: string): GuestNameCheck {
  const name = normalizeGuestName(raw);
  if (name.length === 0) return { ok: false, reason: 'empty' };
  if (name.length < GUEST_NAME_MIN) return { ok: false, reason: 'too_short' };
  if (name.length > GUEST_NAME_MAX) return { ok: false, reason: 'too_long' };
  return { ok: true, name };
}

export type RsvpAnswer = { name: string; attending: boolean };
