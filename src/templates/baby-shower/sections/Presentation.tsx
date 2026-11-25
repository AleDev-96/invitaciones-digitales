import type { ComponentType } from 'react';
import { messages } from '../../../content/messages';
import type { BabyShowerContent } from '../content';

type Props = { content: BabyShowerContent; art: ComponentType<{ className?: string }> };

export function Presentation({ content, art: Art }: Props) {
  const text = messages.babyShower.presentation;
  return (
    <section aria-label={text.title} className="px-6 pt-14 pb-6 text-center">
      <div className="mx-auto max-w-xs rounded-[50%] border-2 border-(--color-gingham-sage) px-6 py-12">
        <p className="font-(family-name:--font-display) text-xl text-(--color-muted)">
          {text.kicker}
        </p>
        <h1 className="font-(family-name:--font-display) text-5xl font-semibold text-(--color-sage-dark)">
          {text.title}
        </h1>
        {content.babyName && (
          <p className="mt-3 font-(family-name:--font-script) text-7xl text-(--color-sage-dark)">
            {content.babyName}
          </p>
        )}
      </div>
      {content.message && (
        <p className="mx-auto mt-8 max-w-sm leading-relaxed">{content.message}</p>
      )}
      {content.hosts && (
        <p className="mt-6 text-(--color-muted)">
          {text.hostsLead}
          <span className="block font-(family-name:--font-script) text-3xl text-(--color-sage-dark)">
            {content.hosts}
          </span>
        </p>
      )}
      <Art className="mx-auto mt-8 w-64" />
    </section>
  );
}
