import { useState } from 'react';
import { messages } from '../../content/messages';
import {
  canReopenRsvp,
  formatOwnerDate,
  formatOwnerDeadline,
  hasChosenGifts,
  rsvpCounts,
  rsvpGroup,
  type OwnerPanel,
  type OwnerRsvp,
} from '../../domain/owners';
import type { OwnerAction, OwnerActionKind } from '../../services/owners';
import { NameForm } from './NameForm';
import { Button, Notice } from './ui';

type SectionProps = {
  panel: OwnerPanel;
  timezone: string;
  busy: boolean;
  act: (action: OwnerAction) => Promise<OwnerActionKind>;
};

type Group = 'attending' | 'not_attending';

function Counter({
  label,
  value,
  selected,
  onClick,
}: {
  label: string;
  value: number;
  selected?: boolean;
  onClick?: () => void;
}) {
  const body = (
    <>
      <span className="text-3xl font-bold">{value}</span>
      <span className="text-center text-sm leading-tight font-medium">{label}</span>
    </>
  );
  const base = 'flex min-h-20 flex-1 flex-col items-center justify-center rounded-lg p-2';
  if (!onClick)
    return (
      <div className={`${base} border-2 border-transparent bg-stone-100 text-stone-700`}>
        {body}
      </div>
    );
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`${base} border-2 ${selected ? 'border-stone-800 bg-white' : 'border-transparent bg-stone-100'} text-stone-800`}
    >
      {body}
    </button>
  );
}

function RsvpRow({ rsvp, panel, timezone, busy, act }: SectionProps & { rsvp: OwnerRsvp }) {
  const [editing, setEditing] = useState(false);

  const remove = () => {
    if (window.confirm(messages.owners.confirmDelete(rsvp.name)))
      act({ type: 'delete_rsvp', rsvpId: rsvp.id });
  };

  const save = async (name: string, attending: boolean) => {
    if (rsvp.attending && !attending && hasChosenGifts(panel, rsvp.id)) {
      if (!window.confirm(messages.owners.confirmNotAttending(rsvp.name))) return false;
    }
    const result = await act({ type: 'update_rsvp', rsvpId: rsvp.id, name, attending });
    if (result === 'ok') setEditing(false);
    return result === 'ok';
  };

  if (editing)
    return (
      <li>
        <NameForm
          label={messages.owners.nameLabel}
          initialName={rsvp.name}
          initialAttending={rsvp.attending}
          busy={busy}
          onSave={save}
          onCancel={() => setEditing(false)}
        />
      </li>
    );

  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-stone-200 py-3 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-lg font-medium break-words">
          {rsvp.name}
          {rsvp.manual && (
            <span className="ml-1 text-sm font-normal text-stone-600">
              {messages.owners.manual}
            </span>
          )}
        </p>
        <p className="text-sm text-stone-600">{formatOwnerDate(rsvp.createdAt, timezone)}</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => setEditing(true)} disabled={busy}>
          {messages.owners.edit}
        </Button>
        <Button variant="danger" onClick={remove} disabled={busy}>
          {messages.owners.delete}
        </Button>
      </div>
    </li>
  );
}

export function OwnerRsvps(props: SectionProps) {
  const { panel, busy, act } = props;
  const [group, setGroup] = useState<Group | null>(null);
  const [adding, setAdding] = useState(false);
  const counts = rsvpCounts(panel);
  const toggle = (next: Group) => setGroup((current) => (current === next ? null : next));
  const list = group ? rsvpGroup(panel, group === 'attending') : [];

  const add = async (name: string, attending: boolean) => {
    const result = await act({ type: 'add_rsvp', name, attending });
    if (result === 'ok') {
      setAdding(false);
      setGroup(attending ? 'attending' : 'not_attending');
    }
    return result === 'ok';
  };

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold">{messages.owners.rsvpTitle}</h2>
      <div className="flex gap-2">
        <Counter
          label={messages.owners.attending}
          value={counts.attending}
          selected={group === 'attending'}
          onClick={() => toggle('attending')}
        />
        <Counter
          label={messages.owners.notAttending}
          value={counts.notAttending}
          selected={group === 'not_attending'}
          onClick={() => toggle('not_attending')}
        />
        {counts.noAnswer !== null && (
          <Counter label={messages.owners.noAnswer} value={counts.noAnswer} />
        )}
      </div>
      {panel.expectedGuests !== null && (
        <p className="text-sm text-stone-600">{messages.owners.expectedOf(panel.expectedGuests)}</p>
      )}
      {counts.crasher && <Notice>{messages.owners.crasher}</Notice>}
      {group && (
        <ul className="rounded-lg bg-white px-3">
          {list.length === 0 && (
            <li className="py-3 text-base text-stone-600">{messages.owners.emptyGroup}</li>
          )}
          {list.map((rsvp) => (
            <RsvpRow key={rsvp.id} rsvp={rsvp} {...props} />
          ))}
        </ul>
      )}
      {adding ? (
        <NameForm
          label={messages.owners.nameLabel}
          initialAttending
          busy={busy}
          onSave={add}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <Button onClick={() => setAdding(true)} disabled={busy} className="self-start">
          {messages.owners.addGuest}
        </Button>
      )}
    </section>
  );
}

export function OwnerRsvpClose({ panel, timezone, busy, act }: SectionProps) {
  let status: string = messages.owners.rsvpEnded;
  let action: { label: string; closed: boolean } | null = null;
  if (panel.rsvpClosed) {
    status = messages.owners.rsvpClosed;
    if (canReopenRsvp(panel, new Date()))
      action = { label: messages.owners.reopenRsvp, closed: false };
  } else if (panel.rsvpOpen) {
    status = messages.owners.rsvpOpenUntil(formatOwnerDeadline(panel.rsvpClosesAt, timezone));
    action = { label: messages.owners.closeRsvp, closed: true };
  }

  return (
    <section className="flex flex-col gap-3">
      <p className="text-base">
        <span className="font-semibold">{messages.owners.rsvpTitle}:</span> {status}
      </p>
      {action && (
        <Button
          onClick={() => act({ type: 'set_rsvp_closed', closed: action.closed })}
          disabled={busy}
          className="self-start"
        >
          {action.label}
        </Button>
      )}
    </section>
  );
}
