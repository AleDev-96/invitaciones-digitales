export type InvitationStatus = 'draft' | 'published' | 'archived';

export type InvitationPreview = {
  title: string;
  description: string;
  imageUrl: string | null;
};

export type Invitation = {
  slug: string;
  templateKey: string;
  themeKey: string;
  eventAt: string;
  timezone: string;
  rsvpClosesAt: string | null;
  rsvpOpen: boolean;
  expectedGuests: number | null;
  takedownOn: string;
  preview: InvitationPreview;
  content: Record<string, unknown>;
  features: string[];
};

export type InvitationVisibility = 'visible' | 'not_found' | 'unavailable';

export const SLUG_MIN_LENGTH = 3;
export const SLUG_MAX_LENGTH = 40;

export const RESERVED_SLUGS: readonly string[] = [
  'admin',
  'api',
  'app',
  'assets',
  'functions',
  'index',
  'login',
  'owners',
  'static',
];

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export type SlugError = 'too_short' | 'too_long' | 'invalid_characters' | 'reserved';

export function validateSlug(slug: string): SlugError | null {
  if (slug.length < SLUG_MIN_LENGTH) return 'too_short';
  if (slug.length > SLUG_MAX_LENGTH) return 'too_long';
  if (!SLUG_PATTERN.test(slug)) return 'invalid_characters';
  if (RESERVED_SLUGS.includes(slug)) return 'reserved';
  return null;
}

export function isValidSlug(slug: string): boolean {
  return validateSlug(slug) === null;
}

export function localDate(instant: Date, timezone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(instant);
}

export function getVisibility(
  status: InvitationStatus,
  takedownOn: string,
  timezone: string,
  now: Date,
): InvitationVisibility {
  if (status === 'draft') return 'not_found';
  if (status === 'archived') return 'unavailable';
  return localDate(now, timezone) >= takedownOn ? 'unavailable' : 'visible';
}
