import { useEffect } from 'react';
import { useParams } from 'react-router';
import { messages } from '../../content/messages';
import { renderGiftsPage } from '../../templates/registry';
import { ErrorScreen, StatusScreen } from '../invitations/StatusScreen';
import { useInvitation } from '../invitations/useInvitation';

function Gifts({ slug }: { slug: string }) {
  const { state, retry } = useInvitation(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  switch (state.kind) {
    case 'loading':
      return <StatusScreen title={messages.loading} />;
    case 'not_found':
      return <StatusScreen title={messages.notFound.title} body={messages.notFound.body} />;
    case 'unavailable':
      return <StatusScreen title={messages.unavailable.title} body={messages.unavailable.body} />;
    case 'error':
      return <ErrorScreen onRetry={retry} />;
    case 'found': {
      const page = renderGiftsPage(state.invitation);
      if (!page) return <ErrorScreen onRetry={retry} />;
      return <div data-theme={state.invitation.themeKey}>{page}</div>;
    }
  }
}

export function GiftsPage() {
  const { slug = '' } = useParams();
  return <Gifts key={slug} slug={slug} />;
}
