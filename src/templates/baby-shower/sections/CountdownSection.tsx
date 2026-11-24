import { Countdown } from '../../../components/Countdown';
import { messages } from '../../../content/messages';
import { Section, SectionTitle } from './SectionTitle';

export function CountdownSection({ eventAt }: { eventAt: string }) {
  const text = messages.babyShower.countdown;
  return (
    <Section label={text.title}>
      <SectionTitle>{text.title}</SectionTitle>
      <Countdown eventAt={eventAt} labels={text} />
    </Section>
  );
}
