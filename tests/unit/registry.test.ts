import { describe, expect, it } from 'vitest';
import { resolveTemplate } from '../../src/templates/registry';

describe('resolveTemplate', () => {
  it('returns the template for a registered template and theme', () => {
    expect(resolveTemplate('baby-shower', 'sage-geese')).not.toBeNull();
  });

  it.each([
    ['plantilla-inexistente', 'sage-geese'],
    ['baby-shower', 'estilo-inexistente'],
    ['toString', 'sage-geese'],
  ])('returns null for %s / %s', (templateKey, themeKey) => {
    expect(resolveTemplate(templateKey, themeKey)).toBeNull();
  });
});
