import type { ReactNode } from 'react';
import { messages } from '../../content/messages';

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

export function ErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <StatusScreen title={messages.error.title} body={messages.error.body}>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 rounded-full bg-stone-700 px-6 py-2 text-white"
      >
        {messages.error.retry}
      </button>
    </StatusScreen>
  );
}
