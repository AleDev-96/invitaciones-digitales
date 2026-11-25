import { useState, type FormEvent } from 'react';
import { messages } from '../../content/messages';
import { checkGuestName } from '../../domain/rsvp';
import { Button, inputClass } from './ui';

type NameFormProps = {
  label: string;
  initialName?: string;
  // Sin valor, el formulario no pregunta la respuesta (anotar un regalo a mano).
  initialAttending?: boolean;
  busy: boolean;
  onSave: (name: string, attending: boolean) => Promise<boolean>;
  onCancel: () => void;
};

export function NameForm({
  label,
  initialName = '',
  initialAttending,
  busy,
  onSave,
  onCancel,
}: NameFormProps) {
  const [name, setName] = useState(initialName);
  const [attending, setAttending] = useState(initialAttending ?? true);
  const [problem, setProblem] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const check = checkGuestName(name);
    if (!check.ok) return setProblem(true);
    setProblem(false);
    const saved = await onSave(check.name, attending);
    if (!saved) setProblem(false);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 rounded-lg bg-stone-100 p-3">
      <label className="flex flex-col gap-1 text-base font-medium">
        {label}
        <input
          value={name}
          maxLength={80}
          onChange={(event) => setName(event.target.value)}
          className={inputClass}
          autoFocus
        />
      </label>
      {problem && <p className="text-base text-red-700">{messages.owners.nameProblem}</p>}
      {initialAttending !== undefined && (
        <div className="flex flex-wrap gap-4 text-base">
          {[true, false].map((value) => (
            <label key={String(value)} className="flex min-h-11 items-center gap-2">
              <input
                type="radio"
                className="size-5"
                checked={attending === value}
                onChange={() => setAttending(value)}
              />
              {value ? messages.owners.answerAttending : messages.owners.answerNotAttending}
            </label>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" variant="primary" disabled={busy}>
          {messages.owners.save}
        </Button>
        <Button onClick={onCancel} disabled={busy}>
          {messages.owners.cancel}
        </Button>
      </div>
    </form>
  );
}
