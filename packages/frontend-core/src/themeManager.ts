export class ThemeManager {
  private readonly storageKey = 'theme-preference';

  public getInitialTheme(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const savedTheme = parseThemePreference(window.localStorage.getItem(this.storageKey));
    if (savedTheme !== null) {
      return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  public saveTheme(isDark: boolean): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(this.storageKey, isDark ? 'dark' : 'light');
  }
}

function parseThemePreference(value: string | null): boolean | null {
  if (value === 'dark') {
    return true;
  }

  if (value === 'light') {
    return false;
  }

  return null;
}

export function applyThemePreference(isDark: boolean): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.classList.toggle('dark', isDark);
}

export const themeManager = new ThemeManager();
