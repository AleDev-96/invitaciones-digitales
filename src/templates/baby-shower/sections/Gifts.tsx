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
      {Art && <Art className="mx-auto mb-4 w-56" />}
      {intro && <p className="mx-auto mb-6 max-w-xs text-lg whitespace-pre-line">{intro}</p>}
      <Link
        to={`/${slug}/regalos`}
        className="inline-block rounded-full bg-(--color-taupe) px-8 py-3 font-semibold text-(--color-paper) shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-sage-dark)"
      >
        {text.open}
      </Link>
    </Section>
  );
}
