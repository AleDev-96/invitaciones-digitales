import { afterEach, describe, expect, it, vi } from 'vitest';
import { onRequestGet } from '../../functions/[slug]';

const html = `<html><head>
    <!-- preview:start -->
    <title>Tenés una invitación</title>
    <!-- preview:end -->
</head><body></body></html>`;

function context(slug: string) {
  return {
    request: new Request(`https://example.pages.dev/${slug}`),
    env: { VITE_SUPABASE_URL: 'https://db.example', VITE_SUPABASE_ANON_KEY: 'public-key' },
    params: { slug },
    next: async () => new Response(html, { headers: { 'content-type': 'text/html' } }),
  };
}

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

  it('returns the generic page when the invitation is not published', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json(null)),
    );
    expect(await (await onRequestGet(context('no-existe'))).text()).toBe(html);
  });

  it('returns the generic page when the database fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('down');
      }),
    );
    expect(await (await onRequestGet(context('oliver'))).text()).toBe(html);
  });

  it('does not call the database for an invalid slug', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    expect(await (await onRequestGet(context('favicon.ico'))).text()).toBe(html);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
