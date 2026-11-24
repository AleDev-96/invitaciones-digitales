import { useState } from 'react';
import { messages } from '../../content/messages';

const OPEN_DURATION_MS = 1400;

function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export function Cover({ onOpened }: { onOpened: () => void }) {
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
      className={`baby-shower-frame fixed inset-0 z-10 flex print:hidden items-center justify-center p-3 ${opening ? 'baby-shower-cover-leave' : ''}`}
    >
      <div className="flex h-full w-full max-w-[430px] flex-col items-center justify-center gap-8 bg-(--color-background) px-6 text-center">
        <h1 className="font-(family-name:--font-display) text-4xl font-semibold text-(--color-sage-dark)">
          {text.title}
        </h1>
        <button
          type="button"
          onClick={open}
          aria-label={text.open}
          className="relative h-44 w-64 [perspective:800px] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-(--color-sage-dark)"
        >
          <span className="baby-shower-letter absolute inset-x-4 top-3 bottom-3 rounded-sm bg-(--color-paper) shadow-sm" />
          <span className="absolute inset-0 rounded-md bg-(--color-sage) shadow-md [clip-path:polygon(0_0,50%_55%,100%_0,100%_100%,0_100%)]" />
          <span className="baby-shower-flap absolute inset-x-0 top-0 h-[58%] bg-(--color-sage-dark) [clip-path:polygon(0_0,100%_0,50%_100%)]" />
          <span className="baby-shower-frame absolute top-[46%] left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-(--color-paper) shadow" />
        </button>
        <p className="font-(family-name:--font-script) text-2xl text-(--color-dusty-blue)">
          {text.hint}
        </p>
      </div>
    </div>
  );
}
