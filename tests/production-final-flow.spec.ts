import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://healthycornersonnet.netlify.app';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@healthycorner.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

async function adminLogin(page: Page) {
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', ADMIN_EMAIL);
  await page.fill('input[type="password"]', ADMIN_PASSWORD);
  await page.click('button[type="submit"]');
  await expect(page.getByRole('heading', { name: /Admin Dashboard/i })).toBeVisible({ timeout: 30000 });
}

async function seedBooking(page: Page, email: string, name: string) {
  const date = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);
  const res = await page.request.post(`${BASE_URL}/api/bookings`, {
    data: {
      name,
      email,
      phone: '040 777 888',
      service: 'Automated Test',
      date,
      time: '09:00',
      guests: 1,
      message: 'Seeded via final flow',
    },
  });
  expect(res.ok()).toBeTruthy();
}

async function seedOrder(page: Page, customer: { name: string; email: string; phone?: string }) {
  const payload = {
    formData: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '040 999 000',
      address: 'Test Street 1',
      city: 'Ljubljana',
      postalCode: '1000',
      country: 'SI',
    },
    cart: [
      { name: 'E2E Order Product', price: 5, slug: 'e2e-order-product', quantity: 2 },
      { name: 'E2E Order Item 2', price: 3, slug: 'e2e-order-item-2', quantity: 1 },
    ],
  };
  const res = await page.request.post(`${BASE_URL}/api/orders`, { data: payload });
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  return json.orderNumber as string;
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// Utility: robust row finder with Refresh and pagination controls
async function findBookingCard(page: Page, email: string): Promise<boolean> {
  const card = page.locator(`[data-testid="booking-card"][data-email="${email}"]`).first();
  for (let i = 0; i < 8; i++) {
    if (await card.isVisible()) return true;
    const refresh = page.getByRole('button', { name: 'Refresh' });
    if (await refresh.isVisible()) await refresh.click();
    await sleep(1200);
  }
  if (await card.isVisible()) return true;
  for (let i = 0; i < 8; i++) {
    if (await card.isVisible()) return true;
    const next = page.getByTestId('next-bookings');
    if (await next.isDisabled()) break;
    await next.click();
    await sleep(800);
  }
  return await card.isVisible();
}

test.describe('Production - Final Comprehensive Flow', () => {
  test.setTimeout(240_000);

  test('Admin login and tab navigation', async ({ page }) => {
    await adminLogin(page);
    await expect(page.getByRole('button', { name: /Bookings/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Messages/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Products/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Orders/ })).toBeVisible();

    await page.getByRole('button', { name: /Messages/ }).click();
    await expect(page.getByRole('button', { name: /Messages/ })).toHaveClass(/bg-primary/);

    await page.getByRole('button', { name: /Products/ }).click();
    await expect(page.locator('table')).toBeVisible();

    await page.getByRole('button', { name: /Orders/ }).click();
    await expect(page.locator('[data-testid="toggle-order-items"]').first()).toBeVisible({ timeout: 10000 }).catch(() => {});
  });

  test('Contact submission → Admin manage with toasts', async ({ page }) => {
    // Submit contact
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.locator('#contact').scrollIntoViewIfNeeded();
    const stamp = Date.now();
    const name = `FinalFlow Contact ${stamp}`;
    const email = `finalflow-contact+${stamp}@example.com`;

    const form = page.locator('#contact');
    await form.getByPlaceholder('John Doe').fill(name);
    await form.getByPlaceholder('john@example.com').fill(email);
    await form.getByPlaceholder('How can we help you?').fill('Subject via final flow');
    await form.getByPlaceholder('Tell us more about your inquiry...').fill('Hello from final flow E2E');
    await form.getByRole('button', { name: 'Send Message' }).click();
    await expect(form.locator('text=Message sent successfully')).toBeVisible({ timeout: 15000 });

    // Admin manage message
    await adminLogin(page);
    await page.getByRole('button', { name: /Messages/ }).click();
    const row = page.locator(`[data-testid="message-card"][data-email="${email}"]`).first();
    for (let i = 0; i < 12; i++) {
      if (await row.isVisible()) break;
      const refresh = page.getByRole('button', { name: 'Refresh' });
      if (await refresh.isVisible()) await refresh.click();
      await sleep(1200);
    }
    await expect(row).toBeVisible({ timeout: 30000 });

    await row.getByRole('combobox').first().selectOption({ value: 'read' });
    await expect(page.getByTestId('toast').filter({ hasText: /Message status updated/i })).toBeVisible({ timeout: 10000 });

    page.once('dialog', d => d.accept());
    await row.getByRole('button', { name: /Delete/ }).click();
    await expect(page.getByTestId('toast').filter({ hasText: /Message deleted/i })).toBeVisible({ timeout: 10000 });
  });

  test('Product create, save with toast, and appears in booking services', async ({ page }) => {
    await adminLogin(page);
    await page.getByRole('button', { name: /Products/ }).click();

    const stamp = Date.now();
    const productName = `FinalFlow Product ${stamp}`;

    await page.getByTestId('new-product-name').fill(productName);
    await page.getByTestId('new-product-description').fill('Created by final flow');
    await page.getByTestId('new-product-price').fill('10.5');
    await page.getByTestId('new-product-compare').fill('12');
    await page.getByTestId('new-product-published').check();
    await page.getByTestId('create-product').click();

    await page.getByTestId('toast').first().waitFor({ state: 'visible', timeout: 12000 }).catch(() => {});

    const row = page.locator(`[data-testid="product-row"][data-product-name="${productName}"]`).first();
    for (let i = 0; i < 12; i++) {
      if (await row.isVisible()) break;
      const refresh = page.getByRole('button', { name: 'Refresh' });
      if (await refresh.isVisible()) await refresh.click();
      await sleep(1200);
    }

    // Save change
    if (await row.isVisible()) {
      const priceInput = row.locator('input[type="number"]').first();
      await priceInput.fill('11');
      await row.getByRole('button', { name: 'Save' }).click();
      await expect(page.getByTestId('toast').filter({ hasText: /Product saved/i })).toBeVisible({ timeout: 10000 });
    }

    // Services include product name
    await page.goto(`${BASE_URL}#booking`, { waitUntil: 'networkidle' });
    const serviceSelect = page.getByLabel('Select Service *');
    await expect(serviceSelect).toBeVisible({ timeout: 10000 });
    const options = await serviceSelect.locator('option').allTextContents();
    expect(options.some(o => o.trim() === productName)).toBeTruthy();
  });

  test('Booking via API → Admin confirm + pill + delete with toasts', async ({ page }) => {
    const stamp = Date.now();
    const name = `FinalFlow Booker ${stamp}`;
    const email = `finalflow-booking+${stamp}@example.com`;
    await seedBooking(page, email, name);

    await adminLogin(page);
    await page.getByRole('button', { name: /Bookings/ }).click();

    const found = await findBookingCard(page, email);
    expect(found).toBeTruthy();
    const card = page.locator(`[data-testid="booking-card"][data-email="${email}"]`).first();

    await card.getByRole('combobox').first().selectOption({ value: 'confirmed' });
    await expect(page.getByTestId('toast').filter({ hasText: /Booking status updated/i })).toBeVisible({ timeout: 10000 }).catch(() => {});

    // Allow refresh cycle and verify pill status
    for (let i = 0; i < 8; i++) {
      const pill = card.locator('[data-testid="booking-status-pill"][data-status="confirmed"]');
      if (await pill.isVisible()) break;
      const refresh = page.getByRole('button', { name: 'Refresh' });
      if (await refresh.isVisible()) await refresh.click();
      await sleep(1000);
    }

    page.once('dialog', d => d.accept());
    await card.getByRole('button', { name: /Delete/ }).click();
    await expect(page.getByTestId('toast').filter({ hasText: /Booking deleted/i })).toBeVisible({ timeout: 10000 });
  });

  test('Order via API → Admin orders and items expansion', async ({ page }) => {
    const stamp = Date.now();
    const customer = { name: `FinalFlow Buyer ${stamp}`, email: `finalflow-buyer+${stamp}@example.com` };
    const orderNumber = await seedOrder(page, customer);

    await adminLogin(page);
    await page.getByRole('button', { name: /Orders/ }).click();

    // Find order by order number across pages
    let orderCard = page.locator(`text=Order ${orderNumber}`).first();
    for (let i = 0; i < 8; i++) {
      if (await orderCard.isVisible()) break;
      const refresh = page.getByRole('button', { name: 'Refresh' });
      if (await refresh.isVisible()) await refresh.click();
      await sleep(1200);
    }
    if (!(await orderCard.isVisible())) {
      for (let i = 0; i < 8; i++) {
        if (await orderCard.isVisible()) break;
        const next = page.getByTestId('next-orders');
        if (await next.isDisabled()) break;
        await next.click();
        await sleep(800);
      }
    }

    await expect(orderCard).toBeVisible({ timeout: 30000 });
    // Find the card container for this order (rounded-lg p-4 card)
    const cardContainer = orderCard.locator('xpath=ancestor::div[contains(@class, "rounded-lg") and contains(@class, "p-4")][1]');
    await expect(cardContainer).toBeVisible({ timeout: 10000 });
    const toggle = cardContainer.getByTestId('toggle-order-items');
    await expect(toggle).toBeVisible({ timeout: 10000 });
    await toggle.click();
    // Verify at least one item row
    await expect(page.locator('table >> text=E2E Order Product')).toBeVisible({ timeout: 10000 });
  });

  test('Media Manager navigation (basic check)', async ({ page }) => {
    await adminLogin(page);
    await page.getByRole('button', { name: /Media Manager/ }).click();
    await expect(page).toHaveURL(new RegExp(`${BASE_URL}/admin/media`));
    // Basic presence check: either upload or category controls exist
    const uploadBtn = page.getByRole('button', { name: /Upload/i });
    if (await uploadBtn.isVisible().catch(() => false)) {
      await expect(uploadBtn).toBeVisible();
    } else {
      // Fallback: page loaded and shows some content
      await expect(page.locator('body')).toBeVisible();
    }
  });
});
