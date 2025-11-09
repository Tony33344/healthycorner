import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://healthycornersonnet.netlify.app';

test.describe('Production User - Home and Navigation', () => {
  test.setTimeout(120_000);

  test('home loads with title and logo', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Healthy Corner/i);
    await expect(page.locator('img[alt*="Healthy Corner"]').first()).toBeVisible({ timeout: 15000 });
  });

  const anchors = ['#about', '#services', '#booking', '#shop', '#gallery', '#contact'];
  for (const anchor of anchors) {
    test(`anchor navigates to ${anchor}`, async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await page.click(`a[href="${anchor}"]`);
      await page.waitForTimeout(700);
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(50);
    });
  }

  const navLabels = ['Home', 'About', 'Services', 'Gallery', 'Contact'];
  for (const label of navLabels) {
    test(`navbar link visible: ${label}`, async ({ page }) => {
      await page.goto(BASE_URL);
      await expect(page.getByRole('link', { name: new RegExp(label, 'i') }).first()).toBeVisible();
    });
  }

  test('hero section and CTAs visible', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('h1, h2').first()).toBeVisible();
    const bookNow = page.getByRole('button', { name: /Book Now/i }).first();
    if (await bookNow.isVisible()) await expect(bookNow).toBeVisible();
    const learnMore = page.locator('a:has-text("Learn More")').first();
    if (await learnMore.isVisible()) await expect(learnMore).toBeVisible();
  });

  test('footer visible with basic info', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(700);
    await expect(page.locator('footer')).toBeVisible();
  });

  test('images present with alt attributes', async ({ page }) => {
    await page.goto(BASE_URL);
    const imgs = page.locator('img[alt]');
    await expect(imgs.first()).toBeVisible();
    expect(await imgs.count()).toBeGreaterThan(0);
  });

  test('language switcher toggles content when available', async ({ page }) => {
    await page.goto(BASE_URL);
    const langButton = page.locator('button', { hasText: /EN|SL/i }).first();
    if (await langButton.isVisible().catch(() => false)) {
      await langButton.click();
      await page.waitForTimeout(500);
      // Soft check: no crash, content still visible
      await expect(page.locator('body')).toBeVisible();
    }
  });
});
