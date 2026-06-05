import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { ThemeManager, themeManager, applyThemePreference } from '../src/themeManager';

describe('ThemeManager', () => {
  let matchMediaMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Clear localStorage
    window.localStorage.clear();

    // Mock matchMedia
    matchMediaMock = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getInitialTheme', () => {
    it('returns saved theme from localStorage if present (dark)', () => {
      window.localStorage.setItem('theme-preference', 'dark');
      expect(themeManager.getInitialTheme()).toBe(true);
    });

    it('returns saved theme from localStorage if present (light)', () => {
      window.localStorage.setItem('theme-preference', 'light');
      expect(themeManager.getInitialTheme()).toBe(false);
    });

    it('falls back to matchMedia if no saved theme is present', () => {
      matchMediaMock.mockImplementation((query) => ({
        matches: true, // Mock user preferring dark mode
        media: query,
      }));
      expect(themeManager.getInitialTheme()).toBe(true);
      expect(matchMediaMock).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    });

    it('returns false for matchMedia if light mode preferred', () => {
      matchMediaMock.mockImplementation((query) => ({
        matches: false, // Mock user preferring light mode
        media: query,
      }));
      expect(themeManager.getInitialTheme()).toBe(false);
    });

    it('ignores an unrecognized stored value and falls back to matchMedia', () => {
      window.localStorage.setItem('theme-preference', 'chartreuse');
      matchMediaMock.mockImplementation((query) => ({
        matches: true, // system prefers dark
        media: query,
      }));

      expect(themeManager.getInitialTheme()).toBe(true);
      expect(matchMediaMock).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    });

    it('does not consult matchMedia when a valid preference is stored', () => {
      window.localStorage.setItem('theme-preference', 'light');

      expect(themeManager.getInitialTheme()).toBe(false);
      expect(matchMediaMock).not.toHaveBeenCalled();
    });
  });

  describe('class instantiation', () => {
    it('works as a standalone instance independent of the shared singleton', () => {
      const instance = new ThemeManager();
      instance.saveTheme(true);

      expect(window.localStorage.getItem('theme-preference')).toBe('dark');
      expect(instance.getInitialTheme()).toBe(true);
    });
  });

  describe('saveTheme', () => {
    it('saves dark theme correctly', () => {
      themeManager.saveTheme(true);
      expect(window.localStorage.getItem('theme-preference')).toBe('dark');
    });

    it('saves light theme correctly', () => {
      themeManager.saveTheme(false);
      expect(window.localStorage.getItem('theme-preference')).toBe('light');
    });
  });

  describe('applyThemePreference', () => {
    it('adds dark class to document element when isDark is true', () => {
      document.documentElement.className = '';
      applyThemePreference(true);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('removes dark class from document element when isDark is false', () => {
      document.documentElement.className = 'dark';
      applyThemePreference(false);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('preserves unrelated classes when toggling the dark class', () => {
      document.documentElement.className = 'reduced-motion theme-host';

      applyThemePreference(true);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('reduced-motion')).toBe(true);
      expect(document.documentElement.classList.contains('theme-host')).toBe(true);

      applyThemePreference(false);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(document.documentElement.classList.contains('reduced-motion')).toBe(true);
      expect(document.documentElement.classList.contains('theme-host')).toBe(true);
    });
  });
});
