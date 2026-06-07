import { test, expect } from '@playwright/test';

test.describe('CSV export', () => {
  test('opens the export modal from search page', async ({ page }) => {
    await page.goto('/search');
    await page.getByRole('button', { name: 'Export CSV' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Export to CSV')).toBeVisible();
  });

  test('shows all column checkboxes in export modal', async ({ page }) => {
    await page.goto('/search');
    await page.getByRole('button', { name: 'Export CSV' }).click();
    await expect(page.getByLabel('Name')).toBeChecked();
    await expect(page.getByLabel('Phone')).toBeChecked();
    await expect(page.getByLabel('Email')).toBeChecked();
  });

  test('can uncheck a column before exporting', async ({ page }) => {
    await page.goto('/search');
    await page.getByRole('button', { name: 'Export CSV' }).click();
    await page.getByLabel('Email').uncheck();
    await expect(page.getByLabel('Email')).not.toBeChecked();
  });

  test('Export CSV button is disabled when no columns selected', async ({ page }) => {
    await page.goto('/search');
    await page.getByRole('button', { name: 'Export CSV' }).click();
    const columns = ['Name', 'Address', 'Phone', 'Email', 'Specialties', 'Ownership', 'City', 'LGA', 'Rating'];
    for (const col of columns) {
      await page.getByLabel(col).uncheck();
    }
    await expect(page.getByRole('button', { name: 'Export CSV' }).last()).toBeDisabled();
  });
});
