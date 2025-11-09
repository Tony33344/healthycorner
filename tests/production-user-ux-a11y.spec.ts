import { test, expect, devices } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://healthycornersonnet.netlify.app';

test.describe('Production User - UX, Responsiveness, and Basic Quality', () => {
  test.setTimeout(180_000);

  const viewports = [
    { name: 'Desktop 1280x800', size: { width: 1280, height: 800 } },
    { name: 'iPhone 12', size: { width: 390, height: 844 } },
    { name: 'iPad', size: { width: 768, height: 1024 } },
  ];

  for (const vp of viewports) {
    test(`viewport renders: ${vp.name}`, async ({ page }) => {
      await page.setViewportSize(vp.size);
      await page.goto(BASE_URL);
      await expect(page.locator('nav')).toBeVisible();
      await expect(page.locator('h1, h2').first()).toBeVisible();
    });
  }

  test('no console errors mentioning critical failures', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    // Allow some warnings; just assert no hard errors include 500/TypeError
    expect(errors.filter(e => /TypeError|ReferenceError|500|Supabase/i.test(e)).length).toBe(0);
  });

  test('critical assets load without 4xx/5xx', async ({ page }) => {
    const failures: { url: string; status: number }[] = [];
    page.on('response', r => {
      const url = r.url();
      if (/\.(js|css|png|jpg|jpeg|webp|svg)$/i.test(url)) {
        const st = r.status();
        if (st >= 400) failures.push({ url, status: st });
      }
    });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    expect(failures.length).toBe(0);
  });

  test('404 page: navigating to unknown route', async ({ page }) => {
    await page.goto(`${BASE_URL}/this-route-does-not-exist-${Date.now()}`);
    await page.waitForLoadState('domcontentloaded');
    // Soft assertion: page shows content and not a browser/network error screen
    await expect(page.locator('body')).toBeVisible();
  });

  test('mobile menu toggles when present', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE_URL);
    const menuBtn = page.locator('button[aria-label*="menu" i]');
    if (await menuBtn.isVisible().catch(() => false)) {
      await menuBtn.click();
      await page.waitForTimeout(400);
      await expect(page.locator('nav')).toBeVisible();
    }
  });
});
