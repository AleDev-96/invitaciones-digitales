import { useState } from 'react';
import { messages } from '../../content/messages';
import { giftHasRoom, type OwnerGift } from '../../domain/owners';
import type { OwnerAction, OwnerActionKind } from '../../services/owners';
import { NameForm } from './NameForm';
import { Button } from './ui';

type GiftsProps = {
  gifts: OwnerGift[];
  busy: boolean;
  act: (action: OwnerAction) => Promise<OwnerActionKind>;
};

function GiftCard({ gift, busy, act }: Omit<GiftsProps, 'gifts'> & { gift: OwnerGift }) {
  const [adding, setAdding] = useState(false);
  const room = giftHasRoom(gift);

  const release = (id: string, name: string) => {
    if (window.confirm(messages.owners.confirmRelease(name)))
      act({ type: 'release_gift', reservationId: id });
  };

  const reserve = async (name: string) => {
    const result = await act({ type: 'reserve_gift', giftId: gift.id, name });
    if (result === 'ok' || result === 'sold_out') setAdding(false);
    return result === 'ok';
  };

  return (
    <li className="flex flex-col gap-2 rounded-lg bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-lg font-medium break-words">{gift.name}</p>
          {gift.description && <p className="text-sm text-stone-600">{gift.description}</p>}
        </div>
        <span className="shrink-0 rounded-full bg-stone-100 px-3 py-1 text-base font-semibold">
          {messages.owners.giftCount(gift.reservations.length, gift.maxReservations)}
        </span>
      </div>
      {gift.reservations.length > 0 && (
        <ul>
          {gift.reservations.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-200 py-2"
            >
              <span className="min-w-0 text-base break-words">
                {r.name}
                {r.manual && (
                  <span className="ml-1 text-sm text-stone-600">{messages.owners.manual}</span>
                )}
              </span>
              <Button variant="danger" onClick={() => release(r.id, r.name)} disabled={busy}>
                {messages.owners.release}
              </Button>
            </li>
          ))}
        </ul>
      )}
      {adding ? (
        <NameForm
          label={messages.owners.giverLabel}
          busy={busy}
          onSave={reserve}
          onCancel={() => setAdding(false)}
        />
      ) : room ? (
        <Button onClick={() => setAdding(true)} disabled={busy} className="self-start">
          {messages.owners.reserveManual}
        </Button>
      ) : (
        <p className="text-sm font-medium text-stone-600">{messages.owners.full}</p>
      )}
    </li>
  );
}

export function OwnerGifts({ gifts, busy, act }: GiftsProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold">{messages.owners.giftsTitle}</h2>
      {gifts.length === 0 ? (
        <p className="text-base text-stone-600">{messages.owners.noGifts}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {gifts.map((gift) => (
            <GiftCard key={gift.id} gift={gift} busy={busy} act={act} />
          ))}
        </ul>
      )}
    </section>
  );
}
