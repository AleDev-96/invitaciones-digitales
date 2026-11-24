import type { ReactNode } from 'react';

export function SectionTitle({ children }: { children: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="h-px flex-1 border-t border-dashed border-(--color-sage)" />
      <h2 className="font-(family-name:--font-display) text-3xl font-semibold text-(--color-sage-dark)">
        {children}
      </h2>
      <span className="h-px flex-1 border-t border-dashed border-(--color-sage)" />
    </div>
  );
}

export function Section({ children, label }: { children: ReactNode; label: string }) {
  return (
    <section aria-label={label} className="px-6 py-10 text-center">
      {children}
    </section>
  );
}
