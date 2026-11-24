import type { ComponentType } from 'react';
import { Link } from 'react-router';
import { messages } from '../../../content/messages';
import { Section, SectionTitle } from './SectionTitle';

type Props = { slug: string; intro: string | null; art?: ComponentType<{ className?: string }> };

const text = messages.babyShower.gifts;

export function Gifts({ slug, intro, art: Art }: Props) {
  return (
    <Section id="regalos" label={text.title}>
      <SectionTitle>{text.title}</SectionTitle>
      {Art && <Art className="mx-auto mb-4 w-48" />}
      {intro && <p className="mx-auto mb-6 max-w-xs text-lg">{intro}</p>}
      <Link
        to={`/${slug}/regalos`}
        className="inline-block rounded-full bg-(--color-sage-dark) px-6 py-3 text-lg text-(--color-paper)"
      >
        {text.open}
      </Link>
    </Section>
  );
}
