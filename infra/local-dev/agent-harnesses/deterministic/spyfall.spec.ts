import { expect, test } from '@playwright/test';

// The standalone entry must render its own storyboard, not nginx's resume fallback.
test.describe('spyfall intro page', () => {
  test('serves the standalone scrollytelling entry', async ({ page }) => {
    await page.goto('/spyfall-arena.html');
    await expect(page).toHaveTitle(/Spyfall Arena/);
    await expect(page.getByRole('heading', { level: 1, name: 'The Lie Problem', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next step', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to resume', exact: true })).toBeVisible();
  });

  test('advances and reverses the storyboard with visible rule changes', async ({ page }) => {
    await page.goto('/spyfall-arena.html');
    await expect(page.getByRole('heading', { level: 1, name: 'The Lie Problem', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Next step', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'One Card Is Blind', exact: true })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'Civilians know the secret location.' })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'The Spy receives no location (Location Unknown).' })).toBeVisible();

    await page.getByRole('button', { name: /Previous Step/ }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'The Lie Problem', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /Previous Step/ })).toHaveCount(0);
  });

  test('returns to the resume through its internal navigation link', async ({ page }) => {
    await page.goto('/spyfall-arena.html');
    await page.getByRole('link', { name: 'Back to resume', exact: true }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page).toHaveTitle(/Cloud Architect Dashboard/);
    await expect(page.getByRole('heading', { level: 2, name: /Side Projects/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Toggle theme', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next step', exact: true })).toHaveCount(0);
  });
});
