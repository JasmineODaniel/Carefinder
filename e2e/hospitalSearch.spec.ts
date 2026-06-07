import { test, expect } from '@playwright/test';

test.describe('Hospital search', () => {
  test('loads the search page with results', async ({ page }) => {
    await page.goto('/search');
    await expect(page.getByPlaceholder('Search by hospital, city, or LGA')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
  });

  test('shows results matching a search query', async ({ page }) => {
    await page.goto('/search?q=Lagos');
    await expect(page.getByText(/hospitals?/)).toBeVisible();
  });

  test('filters update the URL parameters', async ({ page }) => {
    await page.goto('/search');
    await page.fill('[placeholder="Search by hospital, city, or LGA"]', 'Lagos');
    await page.waitForURL(/q=Lagos/);
    expect(page.url()).toContain('q=Lagos');
  });

  test('switching to map view shows the map container', async ({ page }) => {
    await page.goto('/search');
    await page.getByLabel('Map view').click();
    await expect(page.locator('.mapboxgl-canvas, [class*="rounded-card"]')).toBeVisible();
  });

  test('shows empty state when no hospitals match', async ({ page }) => {
    await page.goto('/search?q=xyznonexistenthospital99');
    await expect(page.getByText(/no hospitals found/i)).toBeVisible();
  });
});
