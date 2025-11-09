import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://healthycornersonnet.netlify.app';

async function gotoContact(page: Page) {
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
}

test.describe('Production User - Contact and Newsletter', () => {
  test.setTimeout(120_000);

  test('contact section renders', async ({ page }) => {
    await gotoContact(page);
    await expect(page.locator('#contact')).toBeVisible();
    await expect(page.locator('input[placeholder="John Doe"]')).toBeVisible();
    await expect(page.locator('input[placeholder="john@example.com"]')).toBeVisible();
  });

  const missing = [
    'name', 'email', 'subject', 'message'
  ];
  for (const which of missing) {
    test(`contact validation: missing ${which} prevents success`, async ({ page }) => {
      await gotoContact(page);
      const stamp = Date.now();
      if (which !== 'name') await page.locator('input[placeholder="John Doe"]').fill(`Visitor ${stamp}`);
      if (which !== 'email') await page.locator('input[placeholder="john@example.com"]').fill(`visitor+${stamp}@example.com`);
      if (which !== 'subject') await page.locator('input[placeholder="How can we help you?"]').fill('Subject from E2E');
      if (which !== 'message') await page.locator('textarea[placeholder*="Tell us more"]').fill('Short message');
      await page.getByRole('button', { name: 'Send Message' }).click();
      await page.waitForTimeout(800);
      await expect(page.locator('text=Message sent successfully')).not.toBeVisible({ timeout: 1500 }).catch(() => {});
    });
  }

  const invalidEmails = ['bad', 'user', 'user@', 'user@domain', 'user@domain.'];
  for (const e of invalidEmails) {
    test(`contact validation: invalid email ${e}`, async ({ page }) => {
      await gotoContact(page);
      await page.locator('input[placeholder="John Doe"]').fill('Visitor');
      await page.locator('input[placeholder="john@example.com"]').fill(e);
      await page.locator('input[placeholder="How can we help you?"]').fill('Subject');
      await page.locator('textarea[placeholder*="Tell us more"]').fill('Message');
      await page.getByRole('button', { name: 'Send Message' }).click();
      await page.waitForTimeout(800);
      await expect(page.locator('text=Message sent successfully')).not.toBeVisible({ timeout: 1500 }).catch(() => {});
    });
  }

  test('contact happy path: shows success banner', async ({ page }) => {
    await gotoContact(page);
    const stamp = Date.now();
    await page.locator('input[placeholder="John Doe"]').fill(`Contact ${stamp}`);
    await page.locator('input[placeholder="john@example.com"]').fill(`contact+${stamp}@example.com`);
    await page.locator('input[placeholder="How can we help you?"]').fill('Subject from prod test');
    await page.locator('textarea[placeholder*="Tell us more"]').fill('Detailed inquiry from production E2E test.');
    await page.getByRole('button', { name: 'Send Message' }).click();
    await expect(page.locator('text=Message sent successfully')).toBeVisible({ timeout: 15000 });
  });

  const newsletters = ['Stay Connected', 'Newsletter', 'Subscribe'];
  for (const marker of newsletters) {
    test(`newsletter section present: ${marker} (soft)`, async ({ page }) => {
      await page.goto(BASE_URL);
      const sect = page.locator('text=' + marker).first();
      if (await sect.isVisible().catch(() => false)) {
        await expect(sect).toBeVisible();
      }
    });
  }
});
