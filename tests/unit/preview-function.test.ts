import { afterEach, describe, expect, it, vi } from 'vitest';
import { onRequestGet } from '../../functions/[slug]';

const html = `<html><head>
    <!-- preview:start -->
    <title>Tenés una invitación</title>
    <!-- preview:end -->
</head><body></body></html>`;

function context(slug: string, headers: Record<string, string> = {}) {
  return {
    request: new Request(`https://example.pages.dev/${slug}`, { headers }),
    env: { VITE_SUPABASE_URL: 'https://db.example', VITE_SUPABASE_ANON_KEY: 'public-key' },
    params: { slug },
    next: vi.fn<(input?: Request) => Promise<Response>>(
      async () => new Response(html, { headers: { 'content-type': 'text/html', etag: '"abc"' } }),
    ),
  };
}

const genericImage = 'content="https://example.pages.dev/og/default.png"';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('preview function', () => {
  it('writes the invitation preview', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({ title: 'Oliver', description: 'Baby shower', image_url: null }),
      ),
    );
    const body = await (await onRequestGet(context('oliver'))).text();
    expect(body).toContain('<title>Oliver</title>');
  });

  it('writes the generic preview with an absolute image when the invitation is not published', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json(null)),
    );
    const body = await (await onRequestGet(context('no-existe'))).text();
    expect(body).toContain('<title>Tenés una invitación</title>');
    expect(body).toContain(genericImage);
  });

  it('always asks for the full page and drops the cache validators', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ title: 'Oliver', description: '', image_url: null })),
    );
    const ctx = context('oliver', { 'if-none-match': '"abc"', 'if-modified-since': 'x' });
    const response = await onRequestGet(ctx);
    const forwarded = ctx.next.mock.calls[0][0] as Request;
    expect(forwarded.headers.has('if-none-match')).toBe(false);
    expect(forwarded.headers.has('if-modified-since')).toBe(false);
    expect(response.headers.has('etag')).toBe(false);
  });

  it('writes the generic preview when the database fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('down');
      }),
    );
    const body = await (await onRequestGet(context('oliver'))).text();
    expect(body).toContain('<title>Tenés una invitación</title>');
    expect(body).toContain(genericImage);
  });

  it('does not call the database for an invalid slug', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    expect(await (await onRequestGet(context('favicon.ico'))).text()).toBe(html);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
