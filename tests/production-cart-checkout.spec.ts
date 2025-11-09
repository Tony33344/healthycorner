import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://healthycornersonnet.netlify.app';

// More generous timeouts for prod
test.setTimeout(120_000);

// Helper to scroll to an anchor section
async function scrollTo(page: Page, selector: string) {
  const el = page.locator(selector).first();
  await el.scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(800);
}

test.describe('Production - Cart and Checkout', () => {
  test('Add to cart and place order (happy path)', async ({ page }: { page: Page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Scroll to shop
    await scrollTo(page, '#shop');

    // Wait a bit for products to load
    await page.waitForTimeout(2000);

    const addToCart = page.getByTestId('add-to-cart').first();
    await expect(addToCart).toBeVisible({ timeout: 10_000 });

    await addToCart.click();
    await page.waitForTimeout(800);

    // Open floating cart button (bottom-right)
    const cartButton = page.getByTestId('open-cart');
    await expect(cartButton).toBeVisible({ timeout: 10_000 });
    await cartButton.click();
    await expect(page.getByText('Your Cart')).toBeVisible({ timeout: 10_000 });

    // Proceed to checkout
    const proceed = page.getByRole('button', { name: 'Proceed to Checkout' });
    await expect(proceed).toBeVisible({ timeout: 10_000 });
    await proceed.click();

    // On checkout page
    await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible({ timeout: 10_000 });

    // Fill contact form
    await page.getByLabel('Full Name *').fill('Test User');
    await page.getByLabel('Email *').fill(`test+${Date.now()}@example.com`);
    await page.getByLabel('Phone *').fill('040 123 456');

    // Fill address
    await page.getByLabel('Address *').fill('Test Street 1');
    await page.getByLabel('City *').fill('Ljubljana');
    await page.getByLabel('Postal Code *').fill('1000');
    await page.getByLabel('Country *').fill('Slovenia');

    // Place order
    const placeOrder = page.getByRole('button', { name: 'Place Order' });
    await placeOrder.click();

    // Expect confirmation
    await expect(page.locator('text=Order Confirmed')).toBeVisible({ timeout: 20_000 });
    const orderText = await page.locator('text=Order Number').first().innerText().catch(() => '');
    console.log('Order confirmation text:', orderText);
  });
});
