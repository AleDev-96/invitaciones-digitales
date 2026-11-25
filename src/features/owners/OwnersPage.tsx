import { useParams } from 'react-router';
import { messages } from '../../content/messages';
import type { Invitation } from '../../domain/invitation';
import { ErrorScreen, StatusScreen } from '../invitations/StatusScreen';
import { useInvitation } from '../invitations/useInvitation';
import { OwnerGifts } from './OwnerGifts';
import { OwnerLogin } from './OwnerLogin';
import { OwnerRsvpClose, OwnerRsvps } from './OwnerRsvps';
import { Button, Notice } from './ui';
import { useOwnerPanel, type PanelNotice } from './useOwnerPanel';

const NOTICES: Record<Exclude<PanelNotice, null>, string> = {
  sold_out: messages.owners.soldOut,
  past_deadline: messages.owners.pastDeadline,
  error: messages.owners.networkError,
};

function OwnerScreen({ invitation }: { invitation: Invitation }) {
  const { phase, busy, notice, login, refresh, act, logout } = useOwnerPanel(invitation.slug);

  if (phase.kind === 'checking') return <StatusScreen title={messages.owners.loading} />;
  if (phase.kind === 'login')
    return <OwnerLogin problem={phase.problem} busy={busy} onLogin={login} />;

  const section = { panel: phase.panel, timezone: invitation.timezone, busy, act };
  return (
    <main className="min-h-dvh bg-stone-50 text-stone-800">
      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">{messages.owners.title}</h1>
          <div className="flex gap-2">
            <Button onClick={refresh} disabled={busy}>
              {messages.owners.refresh}
            </Button>
            <Button onClick={logout}>{messages.owners.logout}</Button>
          </div>
        </header>
        {notice && <Notice>{NOTICES[notice]}</Notice>}
        <OwnerRsvps {...section} />
        <OwnerRsvpClose {...section} />
        <OwnerGifts gifts={phase.panel.gifts} busy={busy} act={act} />
      </div>
    </main>
  );
}

function Owners({ slug }: { slug: string }) {
  const { state, retry } = useInvitation(slug);

  switch (state.kind) {
    case 'loading':
      return <StatusScreen title={messages.loading} />;
    case 'not_found':
      return <StatusScreen title={messages.notFound.title} body={messages.notFound.body} />;
    case 'unavailable':
      return <StatusScreen title={messages.unavailable.title} body={messages.unavailable.body} />;
    case 'error':
      return <ErrorScreen onRetry={retry} />;
    case 'found':
      return <OwnerScreen invitation={state.invitation} />;
  }
}

export function OwnersPage() {
  const { slug = '' } = useParams();
  return <Owners key={slug} slug={slug} />;
}
