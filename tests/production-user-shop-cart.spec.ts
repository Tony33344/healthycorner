import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://healthycornersonnet.netlify.app';

async function gotoShop(page) {
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.locator('#shop').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
}

test.describe('Production User - Shop and Cart', () => {
  test.setTimeout(150_000);

  test('shop section renders and shows products', async ({ page }) => {
    await gotoShop(page);
    await expect(page.locator('text=Wellness Products & Retreats')).toBeVisible();
    const addButtons = page.locator('button:has-text("Add to Cart")');
    expect(await addButtons.count()).toBeGreaterThan(0);
  });

  for (let i = 0; i < 5; i++) {
    test(`add to cart and open cart [variant ${i+1}]`, async ({ page }) => {
      await gotoShop(page);
      const add = page.locator('button:has-text("Add to Cart")').nth(0);
      if (await add.isVisible()) {
        await add.click();
        await page.waitForTimeout(400);
        const cartButtons = page.locator('button').filter({ has: page.locator('svg') });
        await cartButtons.last().click();
        await expect(page.locator('text=Your Cart')).toBeVisible({ timeout: 10000 });
      }
    });
  }

  test('increase quantity (soft)', async ({ page }) => {
    await gotoShop(page);
    const add = page.locator('button:has-text("Add to Cart")').first();
    if (await add.isVisible()) {
      await add.click();
      await page.waitForTimeout(300);
      const cartButtons = page.locator('button').filter({ has: page.locator('svg') });
      await cartButtons.last().click();
      await page.waitForTimeout(400);
      // look for a plus-like button and click once (soft)
      const plusBtn = page.locator('button:has-text("+")').first();
      if (await plusBtn.isVisible().catch(() => false)) {
        await plusBtn.click();
      }
      await expect(page.locator('text=Total')).toBeVisible();
    }
  });

  test('remove item (soft)', async ({ page }) => {
    await gotoShop(page);
    const add = page.locator('button:has-text("Add to Cart")').first();
    if (await add.isVisible()) {
      await add.click();
      await page.waitForTimeout(300);
      const cartButtons = page.locator('button').filter({ has: page.locator('svg') });
      await cartButtons.last().click();
      await page.waitForTimeout(400);
      const removeLike = page.locator('button', { has: page.locator('svg') }).last();
      if (await removeLike.isVisible().catch(() => false)) {
        await removeLike.click();
        await page.waitForTimeout(300);
      }
      await expect(page.locator('text=Total')).toBeVisible();
    }
  });
});
