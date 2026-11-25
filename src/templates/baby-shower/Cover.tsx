import { useState, type ComponentType } from 'react';
import { messages } from '../../content/messages';

const OPEN_DURATION_MS = 1400;

function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

type Props = { onOpened: () => void; art: ComponentType<{ className?: string }> };

export function Cover({ onOpened, art: Art }: Props) {
  const [opening, setOpening] = useState(false);
  const text = messages.babyShower.cover;

  function open() {
    if (opening) return;
    if (prefersReducedMotion()) {
      onOpened();
      return;
    }
    setOpening(true);
    window.setTimeout(onOpened, OPEN_DURATION_MS);
  }

  return (
    <div
      className={`fixed inset-0 z-10 flex print:hidden justify-center bg-(--color-background) ${opening ? 'baby-shower-cover-leave' : ''}`}
    >
      <div className="baby-shower-frame flex h-full w-full max-w-[454px] p-3">
        <div className="flex h-full w-full flex-col items-center justify-center gap-8 bg-(--color-background) px-6 text-center">
          <h1 className="font-(family-name:--font-display) text-4xl font-semibold text-(--color-sage-dark)">
            {text.title}
          </h1>
          <button
            type="button"
            onClick={open}
            aria-label={text.open}
            className="baby-shower-envelope w-72 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-(--color-sage-dark)"
          >
            <Art />
          </button>
          <p className="font-(family-name:--font-script) text-3xl text-(--color-dusty-blue)">
            {text.hint}
          </p>
        </div>
      </div>
    </div>
  );
}
