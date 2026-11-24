import { describe, expect, it } from 'vitest';
import { hasOpenedEnvelope, markEnvelopeOpened } from '../../src/infra/envelopeStorage';

function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => void data.delete(key),
    setItem: (key, value) => void data.set(key, value),
  };
}

const failingStorage = {
  getItem: () => {
    throw new Error('blocked');
  },
  setItem: () => {
    throw new Error('blocked');
  },
} as unknown as Storage;

describe('envelope storage', () => {
  it('remembers the envelope per invitation', () => {
    const storage = memoryStorage();
    expect(hasOpenedEnvelope('demo', storage)).toBe(false);
    markEnvelopeOpened('demo', storage);
    expect(hasOpenedEnvelope('demo', storage)).toBe(true);
    expect(hasOpenedEnvelope('otra', storage)).toBe(false);
  });

  it('shows the envelope again when the browser does not allow storage', () => {
    expect(() => markEnvelopeOpened('demo', failingStorage)).not.toThrow();
    expect(hasOpenedEnvelope('demo', failingStorage)).toBe(false);
    expect(hasOpenedEnvelope('demo', null)).toBe(false);
  });
});
