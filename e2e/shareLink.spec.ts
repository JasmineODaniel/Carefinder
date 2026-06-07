import { test, expect } from '@playwright/test';

test.describe('Share link', () => {
  test('opens the share modal', async ({ page }) => {
    await page.goto('/search');
    await page.getByRole('button', { name: 'Share' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Share hospitals')).toBeVisible();
  });

  test('shows a shareable URL in the modal', async ({ page }) => {
    await page.goto('/search?q=Lagos');
    await page.getByRole('button', { name: 'Share' }).click();
    const linkInput = page.getByLabel('Shareable link');
    await expect(linkInput).toHaveValue(/\/search/);
  });

  test('copy button updates to show confirmation', async ({ page }) => {
    await page.goto('/search');
    await page.getByRole('button', { name: 'Share' }).click();
    await page.getByRole('button', { name: 'Copy link' }).click();
    await expect(page.getByText('Copied!')).toBeVisible();
  });

  test('shareable link encodes search parameters', async ({ page }) => {
    await page.goto('/search?q=Lagos&ownership=public');
    await page.getByRole('button', { name: 'Share' }).click();
    const linkInput = page.getByLabel('Shareable link');
    const url = await linkInput.inputValue();
    expect(url).toContain('q=Lagos');
    expect(url).toContain('ownership=public');
  });
});
