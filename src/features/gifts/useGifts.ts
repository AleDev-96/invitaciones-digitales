import { useCallback, useEffect, useRef, useState } from 'react';
import type { GiftList } from '../../domain/gift';
import { readStoredRsvp } from '../../infra/rsvpStorage';
import { callRpc, type RpcCaller } from '../../infra/supabase';
import { fetchGifts, releaseGift, reserveGift } from '../../services/gifts';

export type GiftsState =
  { kind: 'loading' } | { kind: 'error' } | { kind: 'ready'; list: GiftList };

export type GiftProblem = 'sold_out' | 'closed' | 'error';

function markMine(list: GiftList, giftId: string, mine: boolean): GiftList {
  return {
    ...list,
    gifts: list.gifts.map((gift) => (gift.id === giftId ? { ...gift, mine } : gift)),
  };
}

export function useGifts(slug: string, rpc: RpcCaller = callRpc) {
  const [state, setState] = useState<GiftsState>({ kind: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [saving, setSaving] = useState(false);
  const [problem, setProblem] = useState<GiftProblem | null>(null);
  // Un solo pedido a la vez: un doble clic no manda una segunda elección.
  const busy = useRef(false);

  const token = useCallback(() => readStoredRsvp(slug)?.token ?? null, [slug]);

  const refresh = useCallback(async () => {
    const result = await fetchGifts(slug, token(), rpc);
    if (result.kind === 'found') setState({ kind: 'ready', list: result.list });
    return result.kind === 'found';
  }, [slug, rpc, token]);

  useEffect(() => {
    let cancelled = false;
    fetchGifts(slug, token(), rpc).then((result) => {
      if (cancelled) return;
      setState(result.kind === 'found' ? { kind: 'ready', list: result.list } : { kind: 'error' });
    });
    return () => {
      cancelled = true;
    };
  }, [slug, rpc, token, attempt]);

  const retry = useCallback(() => {
    setState({ kind: 'loading' });
    setAttempt((n) => n + 1);
  }, []);

  const change = useCallback(
    async (giftId: string, action: 'choose' | 'release') => {
      const code = token();
      if (busy.current || !code) return;
      busy.current = true;
      setSaving(true);
      setProblem(null);

      const result =
        action === 'choose'
          ? await reserveGift(slug, giftId, code, rpc)
          : await releaseGift(slug, giftId, code, rpc);

      if (result.kind === 'reserved' || result.kind === 'released') {
        const mine = result.kind === 'reserved';
        setState((current) =>
          current.kind === 'ready'
            ? { kind: 'ready', list: markMine(current.list, giftId, mine) }
            : current,
        );
      }
      if (result.kind === 'sold_out' || result.kind === 'closed' || result.kind === 'error') {
        setProblem(result.kind);
      }
      if (result.kind !== 'error') await refresh();

      busy.current = false;
      setSaving(false);
    },
    [slug, rpc, token, refresh],
  );

  const choose = useCallback((giftId: string) => change(giftId, 'choose'), [change]);
  const release = useCallback((giftId: string) => change(giftId, 'release'), [change]);

  return { state, saving, problem, choose, release, retry };
}
