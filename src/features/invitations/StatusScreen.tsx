import type { ReactNode } from 'react';

type StatusScreenProps = {
  title: string;
  body?: string;
  children?: ReactNode;
};

export function StatusScreen({ title, body, children }: StatusScreenProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-stone-50 p-6 text-center text-stone-700">
      <h1 className="text-xl font-semibold">{title}</h1>
      {body && <p className="max-w-sm text-stone-500">{body}</p>}
      {children}
    </main>
  );
}
