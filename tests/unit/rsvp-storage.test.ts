import { describe, expect, it } from 'vitest';
import {
  clearStoredRsvp,
  newRsvpToken,
  readStoredRsvp,
  rsvpTokenFor,
  saveStoredRsvp,
} from '../../src/infra/rsvpStorage';

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
  removeItem: () => {
    throw new Error('blocked');
  },
} as unknown as Storage;

const stored = { token: 'abc', name: 'Ana', attending: true };

describe('rsvp storage', () => {
  it('remembers the answer per invitation', () => {
    const storage = memoryStorage();
    expect(readStoredRsvp('demo', storage)).toBeNull();
    saveStoredRsvp('demo', stored, storage);
    expect(readStoredRsvp('demo', storage)).toEqual(stored);
    expect(readStoredRsvp('otra', storage)).toBeNull();
    clearStoredRsvp('demo', storage);
    expect(readStoredRsvp('demo', storage)).toBeNull();
  });

  it('ignores corrupted data', () => {
    const storage = memoryStorage();
    storage.setItem('rsvp:demo', '{"token": 1}');
    expect(readStoredRsvp('demo', storage)).toBeNull();
    storage.setItem('rsvp:demo', 'no-json');
    expect(readStoredRsvp('demo', storage)).toBeNull();
  });

  it('works without storage', () => {
    expect(() => saveStoredRsvp('demo', stored, failingStorage)).not.toThrow();
    expect(readStoredRsvp('demo', failingStorage)).toBeNull();
    expect(() => clearStoredRsvp('demo', failingStorage)).not.toThrow();
    expect(readStoredRsvp('demo', null)).toBeNull();
  });

  it('keeps one token per invitation', () => {
    const storage = memoryStorage();
    const token = rsvpTokenFor('demo', storage);
    expect(rsvpTokenFor('demo', storage)).toBe(token);
    expect(rsvpTokenFor('otra', storage)).not.toBe(token);
    expect(rsvpTokenFor('demo', failingStorage)).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('creates random tokens', () => {
    expect(newRsvpToken()).toMatch(/^[0-9a-f-]{36}$/);
    expect(newRsvpToken()).not.toBe(newRsvpToken());
  });
});
