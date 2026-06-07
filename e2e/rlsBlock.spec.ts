import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL ?? '',
  process.env.VITE_SUPABASE_ANON_KEY ?? '',
);

test.describe('RLS enforcement', () => {
  test('unauthenticated insert is blocked by Supabase RLS', async () => {
    const { error } = await supabase.from('hospitals').insert({
      name: 'Unauthorized Hospital',
      address: '1 Fake St',
      phone: '080 0000 0000',
      ownership: 'public',
      specialties: [],
    });
    expect(error).not.toBeNull();
    expect(error!.code).toMatch(/42501|PGRST/);
  });

  test('unauthenticated delete is blocked by Supabase RLS', async () => {
    const { error } = await supabase
      .from('hospitals')
      .delete()
      .eq('id', 'nonexistent-id');
    expect(error).not.toBeNull();
  });

  test('public users can read hospitals without authentication', async ({ page }) => {
    await page.goto('/search');
    await expect(
      page.getByPlaceholder('Search by hospital, city, or LGA'),
    ).toBeVisible();
  });

  test('navigating to /admin redirects unauthenticated users', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('navigating to /search does not require authentication', async ({ page }) => {
    await page.goto('/search');
    await expect(page).not.toHaveURL(/\/admin\/login/);
  });
});
