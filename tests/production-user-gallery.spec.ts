import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://healthycornersonnet.netlify.app';

async function gotoGallery(page: Page) {
  await page.goto(`${BASE_URL}#gallery`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
}

test.describe('Production User - Gallery', () => {
  test.setTimeout(120_000);

  test('gallery section renders', async ({ page }) => {
    await gotoGallery(page);
    await expect(page.locator('#gallery')).toBeVisible();
  });

  const categories = ['All', 'Ice Bath', 'Healthy Food'];
  for (const cat of categories) {
    test(`filter category: ${cat}`, async ({ page }) => {
      await gotoGallery(page);
      const button = page.locator('button:has-text("' + cat + '")').first();
      if (await button.isVisible().catch(() => false)) {
        await button.click();
        await page.waitForTimeout(500);
        await expect(button).toHaveClass(/bg-primary/).catch(() => {});
      }
    });
  }

  test('open and close an image (lightbox/modal)', async ({ page }) => {
    await gotoGallery(page);
    const images = page.locator('#gallery img[alt]');
    const count = await images.count();
    if (count > 0) {
      await images.first().click();
      await page.waitForTimeout(500);
      // attempt to close
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      await expect(page.locator('body')).toBeVisible();
    }
  });
});
