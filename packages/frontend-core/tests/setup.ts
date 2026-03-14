import { afterEach, vi } from 'vitest';

let storage = new Map<string, string>();

Object.defineProperty(window, 'localStorage', {
  writable: true,
  value: {
    getItem: vi.fn((key: string) => storage.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      storage.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      storage.delete(key);
    }),
    clear: vi.fn(() => {
      storage.clear();
    }),
  },
});

afterEach(() => {
  storage = new Map<string, string>();
  if (window.localStorage && typeof window.localStorage.clear === 'function') {
    window.localStorage.clear();
  }
});
