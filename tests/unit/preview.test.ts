import { describe, expect, it } from 'vitest';
import { buildPreviewTags, injectPreview, parsePreview } from '../../src/domain/preview';

const html = `<head>
    <!-- preview:start -->
    <title>Tenés una invitación</title>
    <!-- preview:end -->
  </head>`;
const pageUrl = 'https://invitaciones-digitales-bhi.pages.dev/demo';

describe('buildPreviewTags', () => {
  it('writes the invitation title, description, absolute image and url', () => {
    const tags = buildPreviewTags(
      { title: 'Baby shower', description: 'Te esperamos', imageUrl: '/og/demo.png' },
      pageUrl,
    );
    expect(tags).toContain('<title>Baby shower</title>');
    expect(tags).toContain('<meta property="og:title" content="Baby shower" />');
    expect(tags).toContain('<meta property="og:description" content="Te esperamos" />');
    expect(tags).toContain(
      '<meta property="og:image" content="https://invitaciones-digitales-bhi.pages.dev/og/demo.png" />',
    );
    expect(tags).toContain(`<meta property="og:url" content="${pageUrl}" />`);
  });

  it('uses the default image when the invitation has none', () => {
    const tags = buildPreviewTags({ title: 'T', description: '', imageUrl: null }, pageUrl);
    expect(tags).toContain(
      'content="https://invitaciones-digitales-bhi.pages.dev/og/default.png"',
    );
  });

  it('escapes html in the texts', () => {
    const tags = buildPreviewTags(
      { title: '<script>"x"</script>', description: "it's & ok", imageUrl: null },
      pageUrl,
    );
    expect(tags).not.toContain('<script>');
    expect(tags).toContain('&lt;script&gt;&quot;x&quot;&lt;/script&gt;');
    expect(tags).toContain('it&#39;s &amp; ok');
  });
});

describe('injectPreview', () => {
  it('replaces the generic block', () => {
    const result = injectPreview(
      html,
      { title: 'Oliver', description: '', imageUrl: null },
      pageUrl,
    );
    expect(result).toContain('<title>Oliver</title>');
    expect(result).not.toContain('Tenés una invitación');
  });

  it('returns the html unchanged when there is no preview block', () => {
    const plain = '<head><title>x</title></head>';
    expect(
      injectPreview(plain, { title: 'Oliver', description: '', imageUrl: null }, pageUrl),
    ).toBe(plain);
  });

  it('does not interpret $ patterns in the texts', () => {
    const result = injectPreview(
      html,
      { title: "$& $' $1", description: '', imageUrl: null },
      pageUrl,
    );
    expect(result).toContain('<title>$&amp; $&#39; $1</title>');
  });
});

describe('parsePreview', () => {
  it('reads the database answer', () => {
    expect(parsePreview({ title: 'T', description: 'D', image_url: '/og/demo.png' })).toEqual({
      title: 'T',
      description: 'D',
      imageUrl: '/og/demo.png',
    });
  });

  it.each([null, undefined, 'x', {}, { title: '' }])('returns null for %j', (data) => {
    expect(parsePreview(data)).toBeNull();
  });
});
