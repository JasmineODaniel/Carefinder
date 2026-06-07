import { test, expect } from '@playwright/test';

test.describe('Admin flow', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('shows the login form on /admin/login', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('#email', 'wrong@example.com');
    await page.fill('#password', 'wrongpassword');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('admin dashboard shows add hospital button after login', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('#email', process.env.TEST_ADMIN_EMAIL ?? 'admin@test.com');
    await page.fill('#password', process.env.TEST_ADMIN_PASSWORD ?? 'testpass');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL('/admin');
    await expect(page.getByRole('button', { name: 'Add hospital' })).toBeVisible();
  });
});
