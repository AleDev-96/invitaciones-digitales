import { useCallback, useEffect, useRef, useState } from 'react';
import type { RsvpAnswer } from '../../domain/rsvp';
import {
  clearStoredRsvp,
  readStoredRsvp,
  rsvpTokenFor,
  saveStoredRsvp,
} from '../../infra/rsvpStorage';
import { callRpc, type RpcCaller } from '../../infra/supabase';
import { checkRsvp, submitRsvp } from '../../services/rsvp';

export type RsvpPhase =
  { kind: 'form' } | { kind: 'answered'; answer: RsvpAnswer } | { kind: 'closed' };

export type RsvpSubmitOutcome = 'saved' | 'closed' | 'invalid_name' | 'error';

function initialPhase(slug: string, open: boolean): RsvpPhase {
  const stored = readStoredRsvp(slug);
  if (stored)
    return { kind: 'answered', answer: { name: stored.name, attending: stored.attending } };
  return open ? { kind: 'form' } : { kind: 'closed' };
}

export function useRsvp(slug: string, open: boolean, rpc: RpcCaller = callRpc) {
  const [phase, setPhase] = useState<RsvpPhase>(() => initialPhase(slug, open));
  const [submitting, setSubmitting] = useState(false);
  const busy = useRef(false);
  // El mismo código viaja en cada reintento: la base no crea una segunda respuesta.
  const pendingToken = useRef<string | null>(null);

  useEffect(() => {
    const stored = readStoredRsvp(slug);
    if (!stored) return;
    let cancelled = false;
    checkRsvp(slug, stored.token, rpc).then((result) => {
      if (cancelled) return;
      if (result.kind === 'missing') {
        clearStoredRsvp(slug);
        setPhase(open ? { kind: 'form' } : { kind: 'closed' });
      } else if (result.kind === 'found') {
        saveStoredRsvp(slug, { token: stored.token, ...result.answer });
        setPhase({ kind: 'answered', answer: result.answer });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [slug, open, rpc]);

  const submit = useCallback(
    async (name: string, attending: boolean): Promise<RsvpSubmitOutcome> => {
      if (busy.current) return 'error';
      busy.current = true;
      setSubmitting(true);
      const token = pendingToken.current ?? readStoredRsvp(slug)?.token ?? rsvpTokenFor(slug);
      pendingToken.current = token;
      const result = await submitRsvp(slug, { name, attending, token }, rpc);
      busy.current = false;
      setSubmitting(false);

      if (result.kind === 'saved') {
        pendingToken.current = null;
        saveStoredRsvp(slug, { token, ...result.answer });
        setPhase({ kind: 'answered', answer: result.answer });
      } else if (result.kind === 'closed') {
        setPhase({ kind: 'closed' });
      }
      return result.kind;
    },
    [slug, rpc],
  );

  return { phase, submitting, submit };
}
