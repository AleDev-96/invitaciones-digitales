import { messages } from '../content/messages';
import { StatusScreen } from '../features/invitations/StatusScreen';

export function HomePage() {
  return <StatusScreen title={messages.home.title} body={messages.home.body} />;
}
