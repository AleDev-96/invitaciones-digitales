import type { ComponentType } from 'react';
import { messages } from '../../../content/messages';
import type { BabyShowerContent } from '../content';

type Props = {
  content: BabyShowerContent;
  art: ComponentType<{ className?: string }>;
  frame: ComponentType<{ className?: string }>;
};

export function Presentation({ content, art: Art, frame: Frame }: Props) {
  const text = messages.babyShower.presentation;
  return (
    <section aria-label={text.title} className="px-6 pt-14 pb-6 text-center">
      <div className="@container relative mx-auto w-full max-w-sm">
        <Frame className="w-full" />
        <div className="absolute inset-x-[8%] top-[29%] bottom-[17%] flex flex-col items-center justify-center">
          <p className="font-(family-name:--font-display) text-[6cqw] leading-tight text-(--color-muted)">
            {text.kicker}
          </p>
          <h1 className="font-(family-name:--font-display) text-[11cqw] leading-none font-semibold text-(--color-sage-dark)">
            {text.title}
          </h1>
          {content.babyName && (
            <p className="mt-[1cqw] font-(family-name:--font-script) text-[18cqw] leading-none text-(--color-sage-dark)">
              {content.babyName}
            </p>
          )}
        </div>
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
