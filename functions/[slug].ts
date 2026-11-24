import { isValidSlug } from '../src/domain/invitation';
import { injectPreview, parsePreview, type LinkPreview } from '../src/domain/preview';

type Env = {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
};

type PagesContext = {
  request: Request;
  env: Env;
  params: { slug?: string | string[] };
  next: () => Promise<Response>;
};

async function fetchPreview(slug: string, env: Env): Promise<LinkPreview | null> {
  if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) return null;
  const response = await fetch(`${env.VITE_SUPABASE_URL}/rest/v1/rpc/get_invitation_preview`, {
    method: 'POST',
    headers: { apikey: env.VITE_SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_slug: slug }),
    signal: AbortSignal.timeout(3000),
  });
  if (!response.ok) return null;
  return parsePreview(await response.json());
}

export async function onRequestGet(context: PagesContext): Promise<Response> {
  const page = await context.next();
  const slug = typeof context.params.slug === 'string' ? context.params.slug : '';
  const isHtml = page.headers.get('content-type')?.includes('text/html');
  if (!isValidSlug(slug) || !page.ok || !isHtml) return page;

  try {
    const preview = await fetchPreview(slug, context.env);
    if (!preview) return page;
    const html = injectPreview(await page.clone().text(), preview, context.request.url);
    const headers = new Headers(page.headers);
    headers.delete('content-length');
    return new Response(html, { status: page.status, headers });
  } catch {
    return page;
  }
}
