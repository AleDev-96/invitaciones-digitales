import type { Invitation } from '../../domain/invitation';
import './themes/sage-geese/theme.css';

function text(content: Record<string, unknown>, key: string): string | null {
  const value = content[key];
  return typeof value === 'string' ? value : null;
}

function formatEventDate(invitation: Invitation): string {
  const options: Intl.DateTimeFormatOptions = { dateStyle: 'full', timeStyle: 'short' };
  const eventAt = new Date(invitation.eventAt);
  try {
    return new Intl.DateTimeFormat('es-AR', { ...options, timeZone: invitation.timezone }).format(
      eventAt,
    );
  } catch {
    return new Intl.DateTimeFormat('es-AR', options).format(eventAt);
  }
}

// Plantilla provisoria de la spec 001: sin diseño. El diseño real llega con la spec 002.
export function BabyShowerTemplate({ invitation }: { invitation: Invitation }) {
  const title = text(invitation.content, 'title') ?? invitation.preview.title;
  const honoree = text(invitation.content, 'honoree');

  return (
    <main className="flex min-h-dvh items-center justify-center bg-(--color-background) p-6 text-(--color-ink)">
      <article className="w-full max-w-md rounded-2xl border border-(--color-line) bg-(--color-paper) p-8 text-center shadow-sm">
        <p className="text-sm tracking-widest text-(--color-sage) uppercase">Baby shower</p>
        <h1 className="mt-3 text-2xl font-semibold text-(--color-sage-dark)">{title}</h1>
        {honoree && <p className="mt-2 text-lg text-(--color-dusty-blue)">{honoree}</p>}
        <p className="mt-6 text-(--color-muted)">{formatEventDate(invitation)}</p>
        <p className="mt-8 text-xs text-(--color-muted)">Vista provisoria, sin diseño final.</p>
      </article>
    </main>
  );
}
