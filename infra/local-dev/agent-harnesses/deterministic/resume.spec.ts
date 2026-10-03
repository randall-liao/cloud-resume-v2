import { expect, test } from '@playwright/test';

const darkTheme = /(^|\s)dark(\s|$)/;
const sectionNames = [/Side Projects/i, /Commit History/i, /Education/i, /Certifications/i, /Interests/i];

test.use({ colorScheme: 'light' });
test.describe('resume page', () => {

  test('renders the dashboard title and landmark regions', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Cloud Architect Dashboard/);
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test('composes every major resume section heading', async ({ page }) => {
    await page.goto('/');
    for (const name of sectionNames) {
      await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
    }
  });

  for (const systemTheme of ['light', 'dark'] as const) {
    test(`persists the selected theme across reload over the opposite ${systemTheme} OS preference`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: systemTheme });
      await page.goto('/');
      const html = page.locator('html');
      const selectedTheme = systemTheme === 'light' ? 'dark' : 'light';

      await expect(html).toHaveClass(systemTheme === 'dark' ? darkTheme : /^(?!.*\bdark\b).*$/);
      await page.getByRole('button', { name: 'Toggle theme', exact: true }).click();
      await expect(html).toHaveClass(selectedTheme === 'dark' ? darkTheme : /^(?!.*\bdark\b).*$/);
      await expect.poll(() => page.evaluate(() => localStorage.getItem('theme-preference'))).toBe(selectedTheme);

      await page.reload();
      await expect(page.getByRole('button', { name: 'Toggle theme', exact: true })).toBeVisible();
      await expect(html).toHaveClass(selectedTheme === 'dark' ? darkTheme : /^(?!.*\bdark\b).*$/);
    });
  }

  test('activates the theme control with Enter and Space while retaining focus', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Toggle theme', exact: true });
    await toggle.focus();
    await expect(toggle).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page.locator('html')).toHaveClass(darkTheme);
    await expect(toggle).toBeFocused();

    await page.keyboard.press('Space');
    await expect(page.locator('html')).not.toHaveClass(darkTheme);
    await expect(toggle).toBeFocused();
    await page.reload();
    await expect(page.locator('html')).not.toHaveClass(darkTheme);
  });

  test('keeps resume sections and theme control reachable without mobile page overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Toggle theme', exact: true });
    await expect(toggle).toBeInViewport();
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(darkTheme);

    for (const name of sectionNames) {
      const heading = page.getByRole('heading', { level: 2, name });
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toBeVisible();
      await expect(heading).toBeInViewport();
      const bounds = await heading.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(375);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    }

    await page.keyboard.press('Control+End');
    await expect(page.getByRole('contentinfo')).toBeInViewport();
    await expect(toggle).toBeInViewport();
    await toggle.click();
    await expect(page.locator('html')).not.toHaveClass(darkTheme);
  });
});
