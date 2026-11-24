import { useParams } from 'react-router';
import { messages } from '../../content/messages';
import { renderTemplate } from '../../templates/registry';
import { StatusScreen } from './StatusScreen';
import { useInvitation } from './useInvitation';

function ErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <StatusScreen title={messages.error.title} body={messages.error.body}>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 rounded-full bg-stone-700 px-6 py-2 text-white"
      >
        {messages.error.retry}
      </button>
    </StatusScreen>
  );
}

function Invitation({ slug }: { slug: string }) {
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
    case 'found': {
      const template = renderTemplate(state.invitation);
      if (!template) return <ErrorScreen onRetry={retry} />;
      return <div data-theme={state.invitation.themeKey}>{template}</div>;
    }
  }
}

export function InvitationPage() {
  const { slug = '' } = useParams();
  return <Invitation key={slug} slug={slug} />;
}
