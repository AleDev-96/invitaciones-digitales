import { messages } from '../../../content/messages';
import { getEventDateParts } from '../../../domain/eventDate';
import { Section, SectionTitle } from './SectionTitle';

type Props = { eventAt: string; timezone: string; endTime: string | null };

export function EventDate({ eventAt, timezone, endTime }: Props) {
  const parts = getEventDateParts(eventAt, timezone, endTime);
  const title = messages.babyShower.date.title;
  return (
    <Section label={title}>
      <SectionTitle>{title}</SectionTitle>
      <p className="inline-block rounded-full bg-(--color-sage) px-5 py-1 text-sm tracking-widest text-(--color-paper) uppercase">
        {parts.weekday}
      </p>
      <div className="mt-4 flex items-center justify-center gap-5 font-(family-name:--font-display) text-(--color-sage-dark) lining-nums">
        <span className="w-24 text-right text-xl capitalize">{parts.month}</span>
        <span className="border-x border-(--color-line) px-5 text-7xl leading-none font-semibold">
          {parts.day}
        </span>
        <span className="w-24 text-left text-xl">{parts.year}</span>
      </div>
      <p className="mt-4 text-lg">{parts.time}</p>
    </Section>
  );
}
