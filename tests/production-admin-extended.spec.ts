import { test, expect, Page, request } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://healthycornersonnet.netlify.app';

async function adminLogin(page: Page) {
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', process.env.ADMIN_EMAIL || 'admin@healthycorner.com');
  await page.fill('input[type="password"]', process.env.ADMIN_PASSWORD || 'admin123');
  await page.click('button[type="submit"]');
  await expect(page.getByRole('heading', { name: /Admin Dashboard/i })).toBeVisible({ timeout: 30000 });
}

test.describe('Production - Admin extended flows', () => {
  test.setTimeout(180_000);

  test('Contact submission -> Admin manage (status update + delete)', async ({ page, request }) => {
    // Submit contact form
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.locator('#contact').scrollIntoViewIfNeeded();
    const stamp = Date.now();
    const name = `Prod Contact ${stamp}`;
    const email = `prod-contact+${stamp}@example.com`;

    const contact = page.locator('#contact');
    await contact.getByPlaceholder('John Doe').fill(name);
    await contact.getByPlaceholder('john@example.com').fill(email);
    await contact.getByPlaceholder('How can we help you?').fill(`Subject ${stamp}`);
    await contact.getByPlaceholder('Tell us more about your inquiry...').fill('Hello from automated production test');
    await contact.getByRole('button', { name: 'Send Message' }).click();
    await expect(contact.locator('text=Message sent successfully')).toBeVisible({ timeout: 15000 });

    // Admin manage
    await adminLogin(page);
    await page.getByRole('button', { name: /Messages/ }).click();

    const row = page.locator(`[data-testid="message-card"][data-email="${email}"]`).first();
    for (let i = 0; i < 12; i++) {
      if (await row.isVisible()) break;
      const refresh = page.getByRole('button', { name: 'Refresh' });
      if (await refresh.isVisible()) await refresh.click();
      await page.waitForTimeout(1500);
    }
    await expect(row).toBeVisible({ timeout: 30000 });

    // Update status to Read
    const statusSelect = row.getByRole('combobox').first();
    await statusSelect.selectOption({ value: 'read' });
    await page.waitForTimeout(1000);

    // Delete message
    const delBtn = row.getByRole('button', { name: /Delete/ });
    page.once('dialog', d => d.accept());
    await delBtn.click();
    await page.waitForTimeout(1000);
  });

  test('Booking status update to confirmed then delete', async ({ page }) => {
    // Create booking via public form
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.locator('#booking').scrollIntoViewIfNeeded();
    const stamp = Date.now();
    const name = `Prod Admin ${stamp}`;
    const email = `prod-admin-booking+${stamp}@example.com`;

    const booking = page.locator('#booking');
    await booking.getByPlaceholder('John Doe').fill(name);
    await booking.getByPlaceholder('john@example.com').fill(email);
    await booking.getByPlaceholder('+386 XX XXX XXX').fill('040 777 888');
    await booking.getByLabel('Select Service *').selectOption({ label: 'Ice Bath Session' });
    await booking.getByLabel('Date *').fill(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
    await booking.getByLabel('Time *').selectOption({ label: '09:00' });
    await booking.getByLabel('Number of Guests *').fill('1');
    await booking.getByRole('button', { name: 'Book Now' }).click();
    await expect(booking.getByTestId('booking-success')).toBeVisible({ timeout: 20000 });

    // Admin
    await adminLogin(page);
    await page.getByRole('button', { name: /Bookings/ }).click();

    // Locate row by email
    let row = page.locator(`[data-testid="booking-card"][data-email="${email}"]`).first();
    for (let i = 0; i < 12; i++) {
      if (await row.isVisible()) break;
      const refresh = page.getByRole('button', { name: 'Refresh' });
      if (await refresh.isVisible()) await refresh.click();
      await page.waitForTimeout(1500);
    }
    await expect(row).toBeVisible({ timeout: 30000 });

    // Update status
    const status = row.getByRole('combobox').first();
    await status.selectOption({ value: 'confirmed' });
    // Wait for pill to show confirmed after data refresh (use data attributes to avoid ambiguity)
    const pill = row.locator('[data-testid="booking-status-pill"][data-status="confirmed"]');
    for (let i = 0; i < 8; i++) {
      if (await pill.isVisible()) break;
      const refresh = page.getByRole('button', { name: 'Refresh' });
      if (await refresh.isVisible()) await refresh.click();
      await page.waitForTimeout(1000);
    }

    // Delete
    const del = row.getByRole('button', { name: /Delete/ });
    page.once('dialog', d => d.accept());
    await del.click();
    await page.waitForTimeout(1000);
  });

  test('Booking services reflect product names (from /api/services)', async ({ page }) => {
    await adminLogin(page);
    await page.getByRole('button', { name: /Products/ }).click();

    const firstRow = page.locator('table tbody tr').first();
    await expect(firstRow).toBeVisible({ timeout: 20000 });

    // Ensure published checked and capture name
    const nameInput = firstRow.locator('input').first();
    const publishedCheckbox = firstRow.locator('input[type="checkbox"]').nth(0); // published checkbox is first
    const productName = await nameInput.inputValue();
    if (!(await publishedCheckbox.isChecked())) {
      await publishedCheckbox.check();
      await firstRow.getByRole('button', { name: 'Save' }).click();
      await page.waitForTimeout(1000);
    }

    // Navigate to booking and verify option
    await page.goto(`${BASE_URL}#booking`, { waitUntil: 'networkidle' });
    const serviceSelect = page.getByLabel('Select Service *');
    await expect(serviceSelect).toBeVisible({ timeout: 10000 });
    const options = await serviceSelect.locator('option').allTextContents();
    expect(options.some(o => o.trim() === productName)).toBeTruthy();
  });
});
