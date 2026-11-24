import { useState, type FormEvent } from 'react';
import { messages } from '../../../content/messages';
import { checkGuestName } from '../../../domain/rsvp';
import { useRsvp } from '../../../features/rsvp/useRsvp';
import type { BabyShowerContent } from '../content';
import { Section, SectionTitle } from './SectionTitle';

type Props = { slug: string; open: boolean; texts: BabyShowerContent['rsvp'] };

const text = messages.babyShower.rsvp;

function Note({ children }: { children: string | null }) {
  if (!children) return null;
  return <p className="mx-auto mt-4 max-w-xs text-(--color-muted)">{children}</p>;
}

export function Rsvp({ slug, open, texts }: Props) {
  const { phase, submitting, submit } = useRsvp(slug, open);
  const [name, setName] = useState('');
  const [problem, setProblem] = useState<string | null>(null);

  async function answer(attending: boolean) {
    const check = checkGuestName(name);
    if (!check.ok) {
      setProblem(text.nameProblems[check.reason]);
      return;
    }
    setProblem(null);
    const outcome = await submit(check.name, attending);
    if (outcome === 'invalid_name') setProblem(text.nameProblems.too_short);
    if (outcome === 'error') setProblem(text.networkError);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void answer(true);
  }

  return (
    <Section label={text.title}>
      <SectionTitle>{text.title}</SectionTitle>
      <div aria-live="polite">
        {phase.kind === 'answered' && (
          <>
            <p className="mx-auto max-w-xs font-(family-name:--font-display) text-2xl font-semibold text-(--color-sage-dark)">
              {phase.answer.attending
                ? text.thanksAttending(phase.answer.name)
                : text.thanksNotAttending(phase.answer.name)}
            </p>
            <Note>{texts.contactMessage}</Note>
          </>
        )}
        {phase.kind === 'closed' && (
          <>
            <p className="mx-auto max-w-xs text-lg">{texts.closedMessage ?? text.closed}</p>
            <Note>{texts.contactMessage}</Note>
          </>
        )}
      </div>
      {phase.kind === 'form' && (
        <form noValidate onSubmit={handleSubmit} className="mx-auto max-w-xs text-left">
          <label htmlFor="rsvp-name" className="block font-semibold">
            {text.nameLabel}
          </label>
          <p id="rsvp-hint" className="mt-1 text-sm text-(--color-muted)">
            {text.hint}
          </p>
          <input
            id="rsvp-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-describedby={problem ? 'rsvp-hint rsvp-problem' : 'rsvp-hint'}
            aria-invalid={problem !== null && problem !== text.networkError}
            className="mt-3 w-full rounded-lg border border-(--color-line) bg-(--color-paper) px-4 py-3 text-lg focus:border-(--color-sage) focus:outline-2 focus:outline-(--color-sage)"
          />
          {problem && (
            <p id="rsvp-problem" role="alert" className="mt-2 text-(--color-dusty-blue)">
              {problem}
            </p>
          )}
          <div className="mt-5 flex flex-col gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-(--color-sage-dark) px-6 py-3 text-lg text-(--color-paper) disabled:opacity-60"
            >
              {text.attend}
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => void answer(false)}
              className="rounded-full border border-(--color-sage-dark) px-6 py-3 text-lg text-(--color-sage-dark) disabled:opacity-60"
            >
              {text.notAttend}
            </button>
          </div>
          {submitting && <p className="mt-3 text-center text-(--color-muted)">{text.sending}</p>}
        </form>
      )}
    </Section>
  );
}
