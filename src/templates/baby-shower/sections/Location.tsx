import { MapsLink } from '../../../components/MapsLink';
import { messages } from '../../../content/messages';
import type { BabyShowerContent } from '../content';
import { Section, SectionTitle } from './SectionTitle';

export function Location({ location }: { location: BabyShowerContent['location'] }) {
  const text = messages.babyShower.location;
  return (
    <Section label={text.title}>
      <SectionTitle>{text.title}</SectionTitle>
      <MapsLink address={location.address} mapsUrl={location.mapsUrl} label={text.button} />
      {location.address && <p className="mt-5 text-lg">{location.address}</p>}
      {location.notes.length > 0 && (
        <ul className="mx-auto mt-4 max-w-xs list-disc space-y-1 pl-5 text-left text-(--color-muted)">
          {location.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}
    </Section>
  );
}
