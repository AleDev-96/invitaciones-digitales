import { useCallback, useEffect, useState } from 'react';
import { callRpc } from '../../infra/supabase';
import { loadInvitation, type InvitationResult } from '../../services/invitations';

export type InvitationState = { kind: 'loading' } | InvitationResult;

export function useInvitation(slug: string) {
  const [state, setState] = useState<InvitationState>({ kind: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    loadInvitation(slug, callRpc).then((result) => {
      if (!cancelled) setState(result);
    });
    return () => {
      cancelled = true;
    };
  }, [slug, attempt]);

  const retry = useCallback(() => {
    setState({ kind: 'loading' });
    setAttempt((n) => n + 1);
  }, []);

  return { state, retry };
}
