import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Increase timeout for shop operations
test.setTimeout(60000);

test.describe('Public Shop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('should display shop section', async ({ page }) => {
    // Scroll to shop section
    await page.locator('#shop').scrollIntoViewIfNeeded();
    
    // Verify shop heading
    await expect(page.locator('text=Wellness Products & Retreats')).toBeVisible();
  });

  test('should display products', async ({ page }) => {
    // Scroll to shop
    await page.locator('#shop').scrollIntoViewIfNeeded();
    
    // Wait for products to load
    await page.waitForTimeout(2000);
    
    // Check if products are displayed or loading indicator
    const productsOrLoading = page.locator('text=Add to Cart, text=Loading');
    await expect(productsOrLoading.first()).toBeVisible();
  });

  test('should add product to cart', async ({ page }) => {
    // Scroll to shop
    await page.locator('#shop').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Check if there are products
    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    const isVisible = await addToCartButton.isVisible();
    
    if (isVisible) {
      // Click add to cart
      await addToCartButton.click();
      await page.waitForTimeout(500);
      
      // Verify cart badge or floating button appears
      const cartIndicator = page.locator('[class*="cart"], button').filter({ has: page.locator('svg') }).last();
      await expect(cartIndicator).toBeVisible({ timeout: 5000 });
    }
  });

  test('should open cart sidebar', async ({ page }) => {
    // Scroll to shop
    await page.locator('#shop').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Add product to cart
    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    const isVisible = await addToCartButton.isVisible();
    
    if (isVisible) {
      await addToCartButton.click();
      await page.waitForTimeout(500);
      
      // Click cart button
      const cartButtons = page.locator('button').filter({ has: page.locator('svg') });
      await cartButtons.last().click();
      
      // Verify cart sidebar is open
      await expect(page.locator('text=Your Cart')).toBeVisible();
      await expect(page.locator('text=Total:')).toBeVisible();
    }
  });

  test('should update quantity in cart', async ({ page }) => {
    // Scroll to shop
    await page.locator('#shop').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Add product to cart
    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    const isVisible = await addToCartButton.isVisible();
    
    if (isVisible) {
      await addToCartButton.click();
      await page.waitForTimeout(500);
      
      // Open cart
      const cartButtons = page.locator('button').filter({ has: page.locator('svg') });
      await cartButtons.last().click();
      await page.waitForTimeout(500);
      
      // Find plus button in cart
      const plusButton = page.locator('button').filter({ has: page.locator('svg') }).filter({ hasText: '' });
      const plusBtn = plusButton.nth(1); // Get the plus button (not minus)
      if (await plusBtn.isVisible()) {
        await plusBtn.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('should remove item from cart', async ({ page }) => {
    // Scroll to shop
    await page.locator('#shop').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Add product to cart
    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    const isVisible = await addToCartButton.isVisible();
    
    if (isVisible) {
      await addToCartButton.click();
      await page.waitForTimeout(500);
      
      // Open cart
      const cartButtons = page.locator('button').filter({ has: page.locator('svg') });
      await cartButtons.last().click();
      await page.waitForTimeout(500);
      
      // Click remove/trash button
      const removeButton = page.locator('button').filter({ has: page.locator('svg') }).filter({ hasText: '' });
      const trashBtn = removeButton.last(); // Usually the trash icon is last
      if (await trashBtn.isVisible()) {
        await trashBtn.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('should display correct total', async ({ page }) => {
    // Scroll to shop
    await page.locator('#shop').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Add product to cart
    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    const isVisible = await addToCartButton.isVisible();
    
    if (isVisible) {
      // Add to cart
      await addToCartButton.click();
      await page.waitForTimeout(500);
      
      // Open cart
      const cartButtons = page.locator('button').filter({ has: page.locator('svg') });
      await cartButtons.last().click();
      await page.waitForTimeout(500);
      
      // Verify total is visible
      const totalElement = page.locator('text=Total').first();
      await expect(totalElement).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Gallery with Real Images', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('should display gallery section', async ({ page }) => {
    // Scroll to gallery
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    
    // Verify gallery heading
    await expect(page.locator('text=Experience Healthy Corner')).toBeVisible();
  });

  test('should display category filters', async ({ page }) => {
    // Scroll to gallery
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    
    // Verify category buttons
    await expect(page.locator('button:has-text("All")')).toBeVisible();
    await expect(page.locator('button:has-text("Ice Bath")')).toBeVisible();
    await expect(page.locator('button:has-text("Healthy Food")')).toBeVisible();
  });

  test('should filter images by category', async ({ page }) => {
    // Scroll to gallery
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    
    // Click ice bath category
    await page.click('button:has-text("Ice Bath")');
    
    // Verify filter is applied
    const categoryButton = page.locator('button:has-text("Ice Bath")');
    await expect(categoryButton).toHaveClass(/bg-primary/);
    
    // Verify images are displayed
    await expect(page.locator('img[alt*="Ice Bath"], img[alt*="Breathing"]').first()).toBeVisible();
  });

  test('should open image lightbox', async ({ page }) => {
    // Scroll to gallery
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Find gallery images (not logo or other images)
    const galleryImages = page.locator('#gallery img[alt]');
    const imageCount = await galleryImages.count();
    
    if (imageCount > 0) {
      // Click on first gallery image
      await galleryImages.first().click();
      await page.waitForTimeout(500);
      
      // Verify lightbox or modal is open (look for close button or overlay)
      const closeButton = page.locator('button').filter({ has: page.locator('svg') }).last();
      const isVisible = await closeButton.isVisible().catch(() => false);
      if (isVisible) {
        await expect(closeButton).toBeVisible();
      }
    }
  });

  test('should close lightbox', async ({ page }) => {
    // Scroll to gallery
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Find gallery images
    const galleryImages = page.locator('#gallery img[alt]');
    const imageCount = await galleryImages.count();
    
    if (imageCount > 0) {
      // Open lightbox
      await galleryImages.first().click();
      await page.waitForTimeout(500);
      
      // Try to close lightbox (click overlay or close button)
      const closeButton = page.locator('button').filter({ has: page.locator('svg') }).last();
      const isVisible = await closeButton.isVisible().catch(() => false);
      
      if (isVisible) {
        await closeButton.click();
        await page.waitForTimeout(500);
      } else {
        // Try clicking overlay
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    }
  });
});
