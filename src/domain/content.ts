export type Content = Record<string, unknown>;

export function readText(content: Content, key: string): string | null {
  const value = content[key];
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

export function readTextList(content: Content, key: string): string[] {
  const value = content[key];
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item !== '');
}

export function readSection(content: Content, key: string): Content {
  const value = content[key];
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Content)
    : {};
}
