import type { ReactNode } from 'react';
import { messages } from '../../../../content/messages';

// Ilustraciones provisorias propias (spec 002). Se reemplazan por las finales en la spec 006.
function Placeholder({
  viewBox,
  className,
  children,
}: {
  viewBox: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox={viewBox}
      role="img"
      aria-label={messages.babyShower.placeholderArt}
      data-placeholder="true"
      className={className}
    >
      {children}
    </svg>
  );
}

function Goose({ x, scale = 1 }: { x: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${70 - 50 * scale}) scale(${scale})`}>
      <ellipse
        cx="30"
        cy="38"
        rx="26"
        ry="16"
        fill="var(--color-paper)"
        stroke="var(--color-sage-dark)"
        strokeWidth="1.5"
      />
      <path
        d="M44 30 C50 18 46 8 52 4"
        fill="none"
        stroke="var(--color-sage-dark)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M44 30 C50 18 46 8 52 4"
        fill="none"
        stroke="var(--color-paper)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle
        cx="53"
        cy="5"
        r="5"
        fill="var(--color-paper)"
        stroke="var(--color-sage-dark)"
        strokeWidth="1.5"
      />
      <path d="M57 4 L64 6 L57 8 Z" fill="var(--color-taupe)" />
      <circle cx="54" cy="4" r="0.9" fill="var(--color-ink)" />
      <path
        d="M14 36 C22 30 32 32 38 40"
        fill="none"
        stroke="var(--color-line)"
        strokeWidth="1.5"
      />
    </g>
  );
}

export function GooseFamily({ className }: { className?: string }) {
  return (
    <Placeholder viewBox="0 0 200 80" className={className}>
      <path d="M0 74 Q100 64 200 74" fill="none" stroke="var(--color-sage)" strokeWidth="1.5" />
      <Goose x={20} />
      <Goose x={95} scale={0.6} />
      <Goose x={140} scale={0.5} />
    </Placeholder>
  );
}

export function HotAirBalloon({ className }: { className?: string }) {
  return (
    <Placeholder viewBox="0 0 160 120" className={className}>
      <ellipse cx="30" cy="96" rx="22" ry="8" fill="var(--color-gingham-light)" />
      <ellipse cx="132" cy="40" rx="20" ry="7" fill="var(--color-gingham-light)" />
      <path
        d="M80 8 C52 8 46 40 66 62 L94 62 C114 40 108 8 80 8 Z"
        fill="var(--color-gingham-sage)"
        stroke="var(--color-sage)"
        strokeWidth="1.5"
      />
      <path
        d="M80 8 C70 20 70 48 74 62 M80 8 C90 20 90 48 86 62"
        fill="none"
        stroke="var(--color-sage)"
        strokeWidth="1"
      />
      <path d="M68 64 L72 80 M92 64 L88 80" stroke="var(--color-muted)" strokeWidth="1" />
      <rect x="70" y="80" width="20" height="12" rx="2" fill="var(--color-taupe)" />
    </Placeholder>
  );
}

export function GiftBox({ className }: { className?: string }) {
  return (
    <Placeholder viewBox="0 0 80 70" className={className}>
      <rect
        x="12"
        y="28"
        width="56"
        height="38"
        rx="3"
        fill="var(--color-gingham-sage)"
        stroke="var(--color-sage)"
        strokeWidth="1.5"
      />
      <rect
        x="8"
        y="20"
        width="64"
        height="10"
        rx="2"
        fill="var(--color-gingham-light)"
        stroke="var(--color-sage)"
        strokeWidth="1.5"
      />
      <rect x="36" y="20" width="8" height="46" fill="var(--color-taupe)" />
      <path
        d="M40 20 C28 4 16 14 40 20 C64 14 52 4 40 20 Z"
        fill="none"
        stroke="var(--color-taupe)"
        strokeWidth="3"
      />
    </Placeholder>
  );
}
