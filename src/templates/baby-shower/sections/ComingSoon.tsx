import type { ComponentType } from 'react';
import { messages } from '../../../content/messages';
import { Section, SectionTitle } from './SectionTitle';

type Props = { title: string; art?: ComponentType<{ className?: string }> };

// Lugar reservado hasta la spec 004 (regalos).
export function ComingSoon({ title, art: Art }: Props) {
  return (
    <Section label={title}>
      <SectionTitle>{title}</SectionTitle>
      {Art && <Art className="mx-auto mb-4 w-48" />}
      <p className="font-(family-name:--font-script) text-3xl text-(--color-muted)">
        {messages.babyShower.comingSoon}
      </p>
    </Section>
  );
}
