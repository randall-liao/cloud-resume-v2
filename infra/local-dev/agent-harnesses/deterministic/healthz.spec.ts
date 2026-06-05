import { expect, test } from '@playwright/test';

// Smoke checks for the infra/local-dev nginx host itself: the healthcheck
// endpoint and the immutable-asset caching contract from nginx/default.conf.
test.describe('nginx host', () => {
  test('exposes /healthz with "ok"', async ({ request }) => {
    const response = await request.get('/healthz');
    expect(response.status()).toBe(200);
    expect((await response.text()).trim()).toBe('ok');
  });

  test('falls back unknown paths to the resume entry point', async ({ page }) => {
    const response = await page.goto('/this-path-does-not-exist');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Cloud Architect Dashboard/);
  });
});
