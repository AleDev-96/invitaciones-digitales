import { useCallback, useEffect, useRef, useState } from 'react';
import type { OwnerPanel } from '../../domain/owners';
import { clearOwnerKey, readOwnerKey, saveOwnerKey } from '../../infra/ownerKeyStorage';
import { callRpc, type RpcCaller } from '../../infra/supabase';
import {
  fetchOwnerPanel,
  runOwnerAction,
  type OwnerAction,
  type OwnerActionKind,
} from '../../services/owners';

export type LoginProblem = 'wrong' | 'locked' | 'error';
export type PanelNotice = 'sold_out' | 'past_deadline' | 'error' | null;

export type OwnerPhase =
  | { kind: 'checking' }
  | { kind: 'login'; problem: LoginProblem | null }
  | { kind: 'panel'; panel: OwnerPanel };

export function useOwnerPanel(slug: string, rpc: RpcCaller = callRpc) {
  const [phase, setPhase] = useState<OwnerPhase>(() =>
    readOwnerKey(slug) ? { kind: 'checking' } : { kind: 'login', problem: null },
  );
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<PanelNotice>(null);
  const busyRef = useRef(false);

  const start = () => {
    if (busyRef.current) return false;
    busyRef.current = true;
    setBusy(true);
    return true;
  };
  const finish = () => {
    busyRef.current = false;
    setBusy(false);
  };

  // Lee el panel con la clave; si la base la rechaza, la olvida y vuelve a pedirla.
  const load = useCallback(
    async (key: string, fromLogin: boolean): Promise<boolean> => {
      const result = await fetchOwnerPanel(slug, key, rpc);
      if (result.kind === 'ok') {
        saveOwnerKey(slug, key);
        setPhase({ kind: 'panel', panel: result.panel });
        return true;
      }
      if (result.kind === 'error' && !fromLogin) {
        setNotice('error');
        setPhase((current) =>
          current.kind === 'checking' ? { kind: 'login', problem: 'error' } : current,
        );
        return false;
      }
      clearOwnerKey(slug);
      const problem: LoginProblem =
        result.kind === 'locked' ? 'locked' : result.kind === 'error' ? 'error' : 'wrong';
      setPhase({ kind: 'login', problem: fromLogin || problem !== 'wrong' ? problem : null });
      return false;
    },
    [slug, rpc],
  );

  useEffect(() => {
    const key = readOwnerKey(slug);
    if (!key) return;
    let cancelled = false;
    fetchOwnerPanel(slug, key, rpc).then((result) => {
      if (cancelled) return;
      if (result.kind === 'ok') setPhase({ kind: 'panel', panel: result.panel });
      else if (result.kind === 'error') setPhase({ kind: 'login', problem: 'error' });
      else {
        clearOwnerKey(slug);
        setPhase({ kind: 'login', problem: result.kind === 'locked' ? 'locked' : null });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [slug, rpc]);

  const login = useCallback(
    async (key: string) => {
      if (!start()) return;
      await load(key, true);
      finish();
    },
    [load],
  );

  const refresh = useCallback(async () => {
    const key = readOwnerKey(slug);
    if (!key) return setPhase({ kind: 'login', problem: null });
    if (!start()) return;
    setNotice(null);
    await load(key, false);
    finish();
  }, [slug, load]);

  const act = useCallback(
    async (action: OwnerAction): Promise<OwnerActionKind> => {
      const key = readOwnerKey(slug);
      if (!key) {
        setPhase({ kind: 'login', problem: null });
        return 'wrong';
      }
      if (!start()) return 'error';
      setNotice(null);
      const result = await runOwnerAction(slug, key, action, rpc);
      if (result === 'wrong' || result === 'locked' || result === 'missing') {
        clearOwnerKey(slug);
        setPhase({ kind: 'login', problem: result === 'locked' ? 'locked' : null });
      } else if (result === 'error') {
        setNotice('error');
      } else {
        if (result === 'sold_out' || result === 'past_deadline') setNotice(result);
        if (result !== 'invalid_name') await load(key, false);
      }
      finish();
      return result;
    },
    [slug, rpc, load],
  );

  const logout = useCallback(() => {
    clearOwnerKey(slug);
    setNotice(null);
    setPhase({ kind: 'login', problem: null });
  }, [slug]);

  return { phase, busy, notice, login, refresh, act, logout };
}
