import { expect, test } from '@playwright/test';

// Exercise the nginx health endpoint and SPA fallback through the served build.
test.describe('nginx host', () => {
  test('exposes /healthz with "ok"', {
    annotation: { type: 'evidence', description: 'api-only' },
  }, async ({ request }) => {
    const response = await request.get('/healthz');
    expect(response.status()).toBe(200);
    expect((await response.text()).trim()).toBe('ok');
  });

  test('falls back unknown paths to the resume entry point', async ({ page }) => {
    const response = await page.goto('/this-path-does-not-exist');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Cloud Architect Dashboard/);
    await expect(page.getByRole('heading', { level: 2, name: /Side Projects/i })).toBeVisible();
    const toggle = page.getByRole('button', { name: 'Toggle theme', exact: true });
    const wasDark = await page.locator('html').evaluate((element) => element.classList.contains('dark'));
    await toggle.click();
    await expect.poll(() => page.locator('html').evaluate((element) => element.classList.contains('dark'))).toBe(!wasDark);
    await expect(page.getByRole('link', { name: 'Back to resume', exact: true })).toHaveCount(0);
  });
});
