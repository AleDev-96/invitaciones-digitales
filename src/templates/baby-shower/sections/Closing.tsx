import type { ComponentType } from 'react';

type Props = { closing: string | null; art: ComponentType<{ className?: string }> };

export function Closing({ closing, art: Art }: Props) {
  return (
    <footer className="px-6 pt-6 pb-16 text-center">
      <Art className="mx-auto w-56" />
      {closing && (
        <p className="mx-auto mt-6 max-w-sm font-(family-name:--font-display) text-2xl text-(--color-sage-dark)">
          {closing}
        </p>
      )}
    </footer>
  );
}
