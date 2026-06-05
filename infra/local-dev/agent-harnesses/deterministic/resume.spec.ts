import { expect, test } from '@playwright/test';

// Resume SPA (index.html). Locators are semantic (title / landmark roles /
// level-2 headings) to match how the React app and assistive tech see the page,
// mirroring the existing Vitest smoke test in apps/web/tests/App.smoke.test.tsx.
test.describe('resume page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders the dashboard title and landmark regions', async ({ page }) => {
    await expect(page).toHaveTitle(/Cloud Architect Dashboard/);
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test('composes every major resume section heading', async ({ page }) => {
    for (const name of [
      /Side Projects/i,
      /Commit History/i,
      /Education/i,
      /Certifications/i,
      /Interests/i,
    ]) {
      await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
    }
  });

  test('toggles dark mode from the header control and persists it', async ({ page }) => {
    const html = page.locator('html');
    const wasDark = await html.evaluate((el) => el.classList.contains('dark'));

    await page.getByRole('button', { name: /toggle theme/i }).click();

    if (wasDark) {
      await expect(html).not.toHaveClass(/(^|\s)dark(\s|$)/);
    } else {
      await expect(html).toHaveClass(/(^|\s)dark(\s|$)/);
    }

    const stored = await page.evaluate(() => window.localStorage.getItem('theme-preference'));
    expect(stored).toBe(wasDark ? 'light' : 'dark');
  });
});
