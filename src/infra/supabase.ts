import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type RpcResult = { data: unknown; error: unknown };
export type RpcCaller = (fn: string, args: Record<string, unknown>) => Promise<RpcResult>;

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (client) return client;
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

export const callRpc: RpcCaller = async (fn, args) => {
  const { data, error } = await getClient().rpc(fn, args);
  return { data, error };
};
