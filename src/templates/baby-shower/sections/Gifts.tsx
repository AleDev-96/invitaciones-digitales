import { useState, type ComponentType } from 'react';
import { Link } from 'react-router';
import { messages } from '../../../content/messages';
import type { BabyShowerContent } from '../content';
import { Section, SectionTitle } from './SectionTitle';

type Art = ComponentType<{ className?: string }>;
type Fund = BabyShowerContent['gifts']['fund'];

type Props = { slug: string; intro: string | null; fund: Fund; art?: Art; fundArt?: Art };

const text = messages.babyShower.gifts;

function CopyAlias({ alias }: { alias: string }) {
  const [copied, setCopied] = useState(false);
  if (!navigator.clipboard) return null;

  function copy() {
    navigator.clipboard.writeText(alias).then(
      () => setCopied(true),
      () => setCopied(false),
    );
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="mt-4 rounded-full border border-(--color-sage-dark) px-6 py-3 text-lg text-(--color-sage-dark) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-sage-dark)"
    >
      <span aria-live="polite">{copied ? text.fund.copied : text.fund.copy}</span>
    </button>
  );
}

function FundDetails({ fund, art: Art }: { fund: Fund; art?: Art }) {
  if (!fund.alias) return null;
  return (
    <div className="mt-12">
      {Art && <Art className="mx-auto mb-4 w-40" />}
      {fund.message && (
        <p className="mx-auto mb-4 max-w-xs text-lg whitespace-pre-line">{fund.message}</p>
      )}
      <dl className="mx-auto max-w-xs rounded-2xl border border-(--color-line) bg-(--color-paper) px-5 py-4">
        <dt className="text-sm text-(--color-muted)">{text.fund.alias}</dt>
        <dd className="text-lg font-semibold break-all text-(--color-sage-dark) select-all">
          {fund.alias}
        </dd>
        {fund.holder && (
          <>
            <dt className="mt-3 text-sm text-(--color-muted)">{text.fund.holder}</dt>
            <dd className="text-lg">{fund.holder}</dd>
          </>
        )}
      </dl>
      <CopyAlias alias={fund.alias} />
    </div>
  );
}

export function Gifts({ slug, intro, fund, art: Art, fundArt }: Props) {
  return (
    <Section id="regalos" label={text.title}>
      <SectionTitle>{text.title}</SectionTitle>
      {Art && <Art className="mx-auto mb-4 w-56" />}
      {intro && <p className="mx-auto mb-6 max-w-xs text-lg whitespace-pre-line">{intro}</p>}
      <Link
        to={`/${slug}/regalos`}
        className="inline-block rounded-full bg-(--color-taupe) px-8 py-3 font-semibold text-(--color-paper) shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-sage-dark)"
      >
        {text.open}
      </Link>
      <FundDetails fund={fund} art={fundArt} />
    </Section>
  );
}
