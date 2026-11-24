import { Link } from 'react-router';
import { messages } from '../../content/messages';
import {
  giftAction,
  giftBadge,
  giftNotice,
  type Gift,
  type GiftList as List,
} from '../../domain/gift';
import { useGifts, type GiftProblem } from '../../features/gifts/useGifts';
import type { TemplateProps } from '../registry';
import './baby-shower.css';
import { readBabyShowerContent } from './content';
import { SectionTitle } from './sections/SectionTitle';
import { babyShowerTheme } from './themes';

const text = messages.babyShower.gifts;

const problemText: Record<GiftProblem, string> = {
  sold_out: text.soldOut,
  closed: text.closed,
  error: text.networkError,
};

const badgeClass = {
  available: 'border-(--color-sage) text-(--color-sage-dark)',
  reserved: 'border-(--color-line) text-(--color-muted)',
  mine: 'border-(--color-dusty-blue) bg-(--color-dusty-blue) text-(--color-paper)',
};

function BackLink({ slug }: { slug: string }) {
  return (
    <Link
      to={`/${slug}#regalos`}
      className="inline-block rounded-full border border-(--color-sage-dark) px-5 py-2 text-(--color-sage-dark)"
    >
      {text.back}
    </Link>
  );
}

function Notice({
  slug,
  list,
  contactMessage,
}: {
  slug: string;
  list: List;
  contactMessage: string | null;
}) {
  const notice = giftNotice(list);
  if (!notice) return null;
  return (
    <div className="mx-auto mb-6 max-w-xs rounded-xl bg-(--color-gingham-light) px-4 py-4">
      {notice === 'confirm_first' && (
        <>
          <p className="text-lg">{text.confirmFirst}</p>
          <Link
            to={`/${slug}#confirmar`}
            className="mt-3 inline-block rounded-full bg-(--color-sage-dark) px-5 py-2 text-(--color-paper)"
          >
            {text.confirmButton}
          </Link>
        </>
      )}
      {notice === 'contact_hosts' && (
        <>
          <p className="text-lg">{text.contactHosts}</p>
          {contactMessage && <p className="mt-2 text-(--color-muted)">{contactMessage}</p>}
        </>
      )}
      {notice === 'limit_reached' && <p>{text.limitReached(list.perGuest)}</p>}
      {notice === 'closed' && <p>{text.closed}</p>}
    </div>
  );
}

type ItemProps = {
  list: List;
  gift: Gift;
  saving: boolean;
  onChoose: (id: string) => void;
  onRelease: (id: string) => void;
};

function GiftItem({ list, gift, saving, onChoose, onRelease }: ItemProps) {
  const badge = giftBadge(gift);
  const action = giftAction(list, gift);
  return (
    <li className="rounded-xl border border-(--color-line) bg-(--color-paper) px-4 py-4 text-left">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-lg font-semibold break-words">{gift.name}</p>
          {gift.description && (
            <p className="mt-1 break-words text-(--color-muted)">{gift.description}</p>
          )}
        </div>
        <span className={`shrink-0 rounded-full border px-3 py-1 text-sm ${badgeClass[badge]}`}>
          {text.badges[badge]}
        </span>
      </div>
      {action === 'choose' && (
        <button
          type="button"
          disabled={saving}
          onClick={() => onChoose(gift.id)}
          className="mt-3 w-full rounded-full bg-(--color-sage-dark) px-5 py-2 text-(--color-paper) disabled:opacity-60"
        >
          {text.choose}
        </button>
      )}
      {action === 'release' && (
        <button
          type="button"
          disabled={saving}
          onClick={() => onRelease(gift.id)}
          className="mt-3 w-full rounded-full border border-(--color-sage-dark) px-5 py-2 text-(--color-sage-dark) disabled:opacity-60"
        >
          {text.release}
        </button>
      )}
    </li>
  );
}

export function GiftList({ invitation }: TemplateProps) {
  const { slug } = invitation;
  const content = readBabyShowerContent(invitation.content);
  const theme = babyShowerTheme(invitation.themeKey);
  const { state, saving, problem, choose, release, retry } = useGifts(slug);
  const list = state.kind === 'ready' ? state.list : null;
  const showProblem = problem && !(problem === 'closed' && list && !list.open);

  return (
    <div className="baby-shower-frame min-h-dvh px-3 sm:px-8">
      <main className="mx-auto min-h-dvh max-w-[430px] bg-(--color-background) px-6 py-8 text-center font-(family-name:--font-body) text-(--color-ink)">
        <BackLink slug={slug} />
        <div className="mt-8">
          <SectionTitle>{text.listTitle}</SectionTitle>
        </div>
        <theme.giftsArt className="mx-auto mb-4 w-40" />
        {content.gifts.intro && (
          <p className="mx-auto mb-6 max-w-xs text-lg">{content.gifts.intro}</p>
        )}

        {state.kind === 'loading' && <p className="text-(--color-muted)">{text.loading}</p>}
        {state.kind === 'error' && (
          <div role="alert">
            <p>{text.loadError}</p>
            <button
              type="button"
              onClick={retry}
              className="mt-3 rounded-full bg-(--color-sage-dark) px-5 py-2 text-(--color-paper)"
            >
              {text.retry}
            </button>
          </div>
        )}
        {list && list.gifts.length === 0 && <p className="text-lg">{text.empty}</p>}
        {list && list.gifts.length > 0 && (
          <>
            <Notice slug={slug} list={list} contactMessage={content.rsvp.contactMessage} />
            <div aria-live="polite">
              {showProblem && (
                <p role="alert" className="mb-4 text-(--color-dusty-blue)">
                  {problemText[problem]}
                </p>
              )}
              {saving && <p className="mb-4 text-(--color-muted)">{text.saving}</p>}
            </div>
            <ul className="flex flex-col gap-3">
              {list.gifts.map((gift) => (
                <GiftItem
                  key={gift.id}
                  list={list}
                  gift={gift}
                  saving={saving}
                  onChoose={(id) => void choose(id)}
                  onRelease={(id) => void release(id)}
                />
              ))}
            </ul>
          </>
        )}

        <div className="mt-8">
          <BackLink slug={slug} />
        </div>
      </main>
    </div>
  );
}
