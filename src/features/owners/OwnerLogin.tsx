import { useState, type FormEvent } from 'react';
import { messages } from '../../content/messages';
import type { LoginProblem } from './useOwnerPanel';
import { Button, inputClass, Notice } from './ui';

const PROBLEMS: Record<LoginProblem, string> = {
  wrong: messages.owners.wrongKey,
  locked: messages.owners.locked,
  error: messages.owners.networkError,
};

type OwnerLoginProps = {
  problem: LoginProblem | null;
  busy: boolean;
  onLogin: (key: string) => void;
};

export function OwnerLogin({ problem, busy, onLogin }: OwnerLoginProps) {
  const [key, setKey] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (key.trim()) onLogin(key);
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-stone-50 p-6 text-stone-800">
      <form onSubmit={submit} className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-semibold">{messages.owners.title}</h1>
        <label className="flex flex-col gap-2 text-base font-medium">
          {messages.owners.keyLabel}
          <input
            type="password"
            autoComplete="current-password"
            value={key}
            onChange={(event) => setKey(event.target.value)}
            className={inputClass}
          />
        </label>
        {problem && <Notice>{PROBLEMS[problem]}</Notice>}
        <Button type="submit" variant="primary" disabled={busy || !key.trim()}>
          {busy ? messages.owners.entering : messages.owners.enter}
        </Button>
      </form>
    </main>
  );
}
