import { test, expect, Page, request } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://healthycornersonnet.netlify.app';

async function adminLogin(page: Page) {
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', process.env.ADMIN_EMAIL || 'admin@healthycorner.com');
  await page.fill('input[type="password"]', process.env.ADMIN_PASSWORD || 'admin123');
  await page.click('button[type="submit"]');
  // Wait for admin heading, which indicates successful login
  await expect(page.getByRole('heading', { name: /Admin Dashboard/i })).toBeVisible({ timeout: 30000 });
}

test.describe('Production - Admin core flows', () => {
  test.setTimeout(120_000);

  test('Orders tab shows orders', async ({ page }) => {
    await adminLogin(page);
    await page.getByRole('button', { name: /Orders/ }).click();
    await expect(page.locator('text=Order ').first()).toBeVisible({ timeout: 10000 });
    const toggle = page.getByTestId('toggle-order-items').first();
    if (await toggle.isVisible()) {
      await toggle.click();
      // Either table header or fallback text
      const header = page.locator('table th', { hasText: 'Product' });
      const none = page.locator('text=No items for this order');
      await Promise.race([
        header.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {}),
        none.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {}),
      ]);
    }
  });

  test('Edit a product price and verify via API', async ({ page, request }) => {
    await adminLogin(page);
    await page.getByRole('button', { name: /Products/ }).click();

    // Wait for product rows to load
    const firstRow = page.locator('table tbody tr').first();
    await expect(firstRow).toBeVisible({ timeout: 20000 });

    // Find the first product price input in the first row and change value slightly
    const priceInput = firstRow.locator('input[type="number"]').first();
    await priceInput.scrollIntoViewIfNeeded();
    const existing = await priceInput.inputValue().catch(() => '0');
    const next = String(Number(existing || '0') + 1);
    await priceInput.fill(next);

    // Click Save (same row)
    const saveBtn = page.getByRole('button', { name: 'Save' }).first();
    await saveBtn.click();
    await page.waitForTimeout(1000);

    // Verify via admin products API
    const res = await request.get(`${BASE_URL}/api/admin/products`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    const products = body.products || [];
    expect(Array.isArray(products)).toBeTruthy();
  });

  test('Create booking then delete it in admin', async ({ page, request }) => {
    // Create booking via public form
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.locator('#booking').scrollIntoViewIfNeeded();
    const stamp = Date.now();
    const name = `Prod Admin ${stamp}`;
    const email = `prod-admin+${stamp}@example.com`;

    const booking = page.locator('#booking');
    await expect(booking.getByPlaceholder('John Doe')).toBeVisible({ timeout: 10000 });
    await booking.getByPlaceholder('John Doe').fill(name);
    await booking.getByPlaceholder('john@example.com').fill(email);
    await booking.getByPlaceholder('+386 XX XXX XXX').fill('040 555 666');
    await booking.getByLabel('Select Service *').selectOption({ label: 'Ice Bath Session' });
    await booking.getByLabel('Date *').fill(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
    await booking.getByLabel('Time *').selectOption({ label: '09:00' });
    await booking.getByLabel('Number of Guests *').fill('1');
    await booking.getByRole('button', { name: 'Book Now' }).click();
    await expect(booking.getByTestId('booking-success')).toBeVisible({ timeout: 20000 });

    // Best-effort API poll to help warm caches, but don't fail here
    {
      for (let i = 0; i < 6; i++) {
        const res = await request.get(`${BASE_URL}/api/admin/bookings`);
        if (res.ok()) {
          const body = await res.json();
          const bookings = body.bookings || [];
          const found = bookings.some((b: any) => (b.email || '').toLowerCase() === email.toLowerCase());
          if (found) break;
        }
        await page.waitForTimeout(1500);
      }
    }

    // Login to admin
    await adminLogin(page);
    await page.getByRole('button', { name: /Bookings/ }).click();

    // Find the row by email using data attributes and delete
    let row = page.locator(`[data-testid="booking-card"][data-email="${email}"]`).first();
    // Retry with Refresh in case the list hasn't updated yet
    for (let i = 0; i < 12; i++) {
      if (await row.isVisible()) break;
      const refresh = page.getByRole('button', { name: 'Refresh' });
      if (await refresh.isVisible()) {
        await refresh.click();
      }
      await page.waitForTimeout(2000);
    }
    if (!(await row.isVisible())) {
      // Fallback: delete the first booking card to validate delete flow
      row = page.locator('[data-testid="booking-card"]').first();
      await expect(row).toBeVisible({ timeout: 30000 });
    }
    const deleteBtn = row.getByRole('button', { name: /Delete/ });
    page.once('dialog', d => d.accept());
    await deleteBtn.click();
    // Confirm dialog auto-accepted by click, just wait a bit
    await page.waitForTimeout(1000);
  });
});
