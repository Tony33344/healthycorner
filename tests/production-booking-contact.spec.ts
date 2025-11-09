import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://healthycornersonnet.netlify.app';

test.setTimeout(120_000);

async function scrollTo(page: Page, selector: string) {
  const el = page.locator(selector).first();
  await el.scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(500);
}

test.describe('Production - Booking and Contact', () => {
  test('Submit booking form (happy path)', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await scrollTo(page, '#booking');

    const booking = page.locator('#booking');
    await expect(booking.getByPlaceholder('John Doe')).toBeVisible({ timeout: 10000 });
    await booking.getByPlaceholder('John Doe').fill('Prod Test User');
    await booking.getByPlaceholder('john@example.com').fill(`prod+${Date.now()}@example.com`);
    await booking.getByPlaceholder('+386 XX XXX XXX').fill('040 111 222');

    // Select service
    await booking.getByLabel('Select Service *').selectOption({ label: 'Ice Bath Session' });

    // Date & Time
    await booking.getByLabel('Date *').fill(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
    await booking.getByLabel('Time *').selectOption({ label: '09:00' });

    // Guests
    await booking.getByLabel('Number of Guests *').fill('2');

    // Message optional
    await booking.getByPlaceholder('Any special requirements or questions...').fill('See you soon.');

    // Submit
    await booking.getByRole('button', { name: 'Book Now' }).click();

    // Expect success toast
    await expect(booking.getByTestId('booking-success')).toBeVisible({ timeout: 20_000 });
  });

  test('Submit contact form (happy path)', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await scrollTo(page, '#contact');

    const contact = page.locator('#contact');
    await expect(contact.getByPlaceholder('John Doe')).toBeVisible({ timeout: 10000 });
    await contact.getByPlaceholder('John Doe').fill('Prod Test User');
    await contact.getByPlaceholder('john@example.com').fill(`prod+${Date.now()}@example.com`);
    await contact.getByPlaceholder('How can we help you?').fill('Question');
    await contact.getByPlaceholder('Tell us more about your inquiry...').fill('This is a production test message.');

    await contact.getByRole('button', { name: 'Send Message' }).click();

    await expect(contact.locator('text=Message sent successfully')).toBeVisible({ timeout: 20_000 });
  });
});
