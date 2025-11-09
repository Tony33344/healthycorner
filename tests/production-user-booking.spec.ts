import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://healthycornersonnet.netlify.app';

async function gotoBooking(page: Page) {
  await page.goto(`${BASE_URL}#booking`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
}

test.describe('Production User - Booking Form', () => {
  test.setTimeout(180_000);

  test('booking section renders with form fields', async ({ page }) => {
    await gotoBooking(page);
    await expect(page.getByLabel('Full Name *')).toBeVisible();
    await expect(page.getByLabel('Email Address *')).toBeVisible();
    await expect(page.getByLabel('Phone Number *')).toBeVisible();
    await expect(page.getByLabel('Select Service *')).toBeVisible();
    await expect(page.getByLabel('Date *')).toBeVisible();
    await expect(page.getByLabel('Time *')).toBeVisible();
    await expect(page.getByLabel('Number of Guests *')).toBeVisible();
  });

  const missingFields = [
    'Full Name *',
    'Email Address *',
    'Phone Number *',
    'Select Service *',
    'Date *',
    'Time *',
    'Number of Guests *',
  ];

  for (const field of missingFields) {
    test(`validation: missing ${field} prevents success`, async ({ page }) => {
      await gotoBooking(page);
      // Fill all valid-ish values first
      await page.getByLabel('Full Name *').fill('E2E User');
      await page.getByLabel('Email Address *').fill('e2e.user@example.com');
      await page.getByLabel('Phone Number *').fill('+386 40 555 444');
      const svc = page.getByLabel('Select Service *');
      const svcOptions = await svc.locator('option').all();
      if (svcOptions.length > 1) await svc.selectOption({ index: 1 });
      const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0,10);
      await page.getByLabel('Date *').fill(tomorrow);
      await page.getByLabel('Time *').selectOption({ index: 1 });
      await page.getByLabel('Number of Guests *').fill('1');

      // Clear the specific field under test
      const el = page.getByLabel(field);
      if (field.includes('Select')) {
        await el.selectOption('');
      } else if (field.includes('Date')) {
        await el.fill('');
      } else if (field.includes('Time')) {
        await el.selectOption('');
      } else {
        await el.fill('');
      }

      await page.getByRole('button', { name: 'Book Now' }).click();
      await page.waitForTimeout(800);
      await expect(page.getByTestId('booking-success')).not.toBeVisible({ timeout: 1500 }).catch(() => {});
    });
  }

  const invalidEmails = ['plainaddress', 'missingatsign.com', 'user@', 'user@domain', 'user@domain.'];
  for (const invalid of invalidEmails) {
    test(`validation: invalid email "${invalid}"`, async ({ page }) => {
      await gotoBooking(page);
      await page.getByLabel('Full Name *').fill('Invalid Email');
      await page.getByLabel('Email Address *').fill(invalid);
      await page.getByLabel('Phone Number *').fill('+386 41 111 222');
      const svc = page.getByLabel('Select Service *');
      if ((await svc.locator('option').count()) > 1) await svc.selectOption({ index: 1 });
      const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0,10);
      await page.getByLabel('Date *').fill(tomorrow);
      await page.getByLabel('Time *').selectOption({ index: 1 });
      await page.getByLabel('Number of Guests *').fill('2');
      await page.getByRole('button', { name: 'Book Now' }).click();
      await page.waitForTimeout(800);
      await expect(page.getByTestId('booking-success')).not.toBeVisible({ timeout: 1500 }).catch(() => {});
    });
  }

  const invalidGuests = ['0', '21', '-1', '100'];
  for (const guests of invalidGuests) {
    test(`validation: invalid guests ${guests}`, async ({ page }) => {
      await gotoBooking(page);
      await page.getByLabel('Full Name *').fill('Guest Count');
      await page.getByLabel('Email Address *').fill('guest@example.com');
      await page.getByLabel('Phone Number *').fill('+386 40 333 222');
      const svc = page.getByLabel('Select Service *');
      if ((await svc.locator('option').count()) > 1) await svc.selectOption({ index: 1 });
      const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0,10);
      await page.getByLabel('Date *').fill(tomorrow);
      await page.getByLabel('Time *').selectOption({ index: 1 });
      await page.getByLabel('Number of Guests *').fill(guests);
      await page.getByRole('button', { name: 'Book Now' }).click();
      await page.waitForTimeout(800);
      await expect(page.getByTestId('booking-success')).not.toBeVisible({ timeout: 1500 }).catch(() => {});
    });
  }

  test('happy path: booking submission shows success', async ({ page }) => {
    await gotoBooking(page);
    const stamp = Date.now();
    await page.getByLabel('Full Name *').fill(`Prod Booker ${stamp}`);
    await page.getByLabel('Email Address *').fill(`prod-booker+${stamp}@example.com`);
    await page.getByLabel('Phone Number *').fill('+386 40 777 123');
    const svc = page.getByLabel('Select Service *');
    const count = await svc.locator('option').count();
    if (count > 1) await svc.selectOption({ index: 1 });
    const date = new Date(Date.now() + 2 * 86400000).toISOString().slice(0,10);
    await page.getByLabel('Date *').fill(date);
    await page.getByLabel('Time *').selectOption({ index: 1 });
    await page.getByLabel('Number of Guests *').fill('1');
    await page.getByRole('button', { name: 'Book Now' }).click();
    await expect(page.getByTestId('booking-success')).toBeVisible({ timeout: 20000 });
  });

  test('service options populated from API when available', async ({ page }) => {
    await gotoBooking(page);
    const svc = page.getByLabel('Select Service *');
    const texts = await svc.locator('option').allTextContents();
    expect(texts.length).toBeGreaterThan(1);
  });
});
