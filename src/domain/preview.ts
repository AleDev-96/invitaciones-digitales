export type LinkPreview = {
  title: string;
  description: string;
  imageUrl: string | null;
};

export const DEFAULT_PREVIEW_IMAGE = '/og/default.png';

const PREVIEW_BLOCK = /<!-- preview:start -->[\s\S]*?<!-- preview:end -->/;

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function absoluteUrl(url: string, pageUrl: string): string {
  try {
    return new URL(url, pageUrl).toString();
  } catch {
    return new URL(DEFAULT_PREVIEW_IMAGE, pageUrl).toString();
  }
}

export function buildPreviewTags(preview: LinkPreview, pageUrl: string): string {
  const title = escapeHtml(preview.title);
  const description = escapeHtml(preview.description);
  const image = escapeHtml(absoluteUrl(preview.imageUrl ?? DEFAULT_PREVIEW_IMAGE, pageUrl));
  const url = escapeHtml(pageUrl);
  return [
    '<!-- preview:start -->',
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:image" content="${image}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    '<!-- preview:end -->',
  ].join('\n    ');
}

export function injectPreview(html: string, preview: LinkPreview, pageUrl: string): string {
  if (!PREVIEW_BLOCK.test(html)) return html;
  return html.replace(PREVIEW_BLOCK, () => buildPreviewTags(preview, pageUrl));
}

export function parsePreview(data: unknown): LinkPreview | null {
  if (typeof data !== 'object' || data === null) return null;
  const row = data as Record<string, unknown>;
  if (typeof row.title !== 'string' || row.title === '') return null;
  return {
    title: row.title,
    description: typeof row.description === 'string' ? row.description : '',
    imageUrl: typeof row.image_url === 'string' && row.image_url !== '' ? row.image_url : null,
  };
}
