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
  // La clave de esta sesión; sessionStorage solo la conserva al recargar.
  const keyRef = useRef<string | null>(readOwnerKey(slug));
  // Cambia al tocar "Salir": las respuestas que lleguen después se descartan.
  const sessionRef = useRef(0);

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
  const forget = useCallback(() => {
    keyRef.current = null;
    clearOwnerKey(slug);
  }, [slug]);

  const load = useCallback(
    async (key: string, fromLogin: boolean): Promise<boolean> => {
      const session = sessionRef.current;
      const result = await fetchOwnerPanel(slug, key, rpc);
      if (session !== sessionRef.current) return false;
      if (result.kind === 'ok') {
        keyRef.current = key;
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
      forget();
      const problem: LoginProblem =
        result.kind === 'locked' ? 'locked' : result.kind === 'error' ? 'error' : 'wrong';
      setPhase({ kind: 'login', problem: fromLogin || problem !== 'wrong' ? problem : null });
      return false;
    },
    [slug, rpc, forget],
  );

  useEffect(() => {
    const key = keyRef.current;
    if (!key) return;
    let cancelled = false;
    const session = sessionRef.current;
    fetchOwnerPanel(slug, key, rpc).then((result) => {
      if (cancelled || session !== sessionRef.current) return;
      if (result.kind === 'ok') setPhase({ kind: 'panel', panel: result.panel });
      else if (result.kind === 'error') setPhase({ kind: 'login', problem: 'error' });
      else {
        forget();
        setPhase({ kind: 'login', problem: result.kind === 'locked' ? 'locked' : null });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [slug, rpc, forget]);

  const login = useCallback(
    async (key: string) => {
      if (!start()) return;
      await load(key, true);
      finish();
    },
    [load],
  );

  const refresh = useCallback(async () => {
    const key = keyRef.current;
    if (!key) return setPhase({ kind: 'login', problem: null });
    if (!start()) return;
    setNotice(null);
    await load(key, false);
    finish();
  }, [load]);

  const act = useCallback(
    async (action: OwnerAction): Promise<OwnerActionKind> => {
      const key = keyRef.current;
      if (!key) {
        setPhase({ kind: 'login', problem: null });
        return 'wrong';
      }
      if (!start()) return 'error';
      setNotice(null);
      const session = sessionRef.current;
      const result = await runOwnerAction(slug, key, action, rpc);
      if (session !== sessionRef.current) {
        finish();
        return result;
      }
      if (result === 'wrong' || result === 'locked' || result === 'missing') {
        forget();
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
    [slug, rpc, load, forget],
  );

  const logout = useCallback(() => {
    sessionRef.current += 1;
    forget();
    setNotice(null);
    setPhase({ kind: 'login', problem: null });
  }, [forget]);

  return { phase, busy, notice, login, refresh, act, logout };
}
