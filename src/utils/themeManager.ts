class ThemeManager {
  private readonly storageKey = 'theme-preference';

  /**
   * Gets the initial theme from localStorage or system preference.
   * Returns true if dark mode is preferred, false for light mode.
   */
  public getInitialTheme(): boolean {
    if (typeof window === 'undefined') return false;

    // Read from localStorage first
    const savedTheme = localStorage.getItem(this.storageKey);
    if (savedTheme !== null) {
      return savedTheme === 'dark';
    }

    // Fall back to browser/system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Saves the theme preference to localStorage.
   */
  public saveTheme(isDark: boolean): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, isDark ? 'dark' : 'light');
  }
}

export const themeManager = new ThemeManager();
