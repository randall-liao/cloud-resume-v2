import { expect, test } from '@playwright/test';

// Standalone Spyfall intro page (spyfall-arena.html) served as a real file by
// nginx. Keep assertions resilient: the page is a GSAP scrollytelling
// experience, so verify it boots and mounts rather than asserting on animation.
test.describe('spyfall intro page', () => {
  test('serves the standalone scrollytelling entry', async ({ page }) => {
    await page.goto('/spyfall-arena.html');
    await expect(page).toHaveTitle(/Spyfall Arena/);
  });

  test('mounts the React root', async ({ page }) => {
    await page.goto('/spyfall-arena.html');
    const root = page.locator('#root');
    await expect(root).toBeAttached();
    await expect.poll(async () => (await root.innerHTML()).trim().length).toBeGreaterThan(0);
  });
});
