import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@healthycorner.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

test.setTimeout(90000);

test.describe('Homepage - All Sections Load', () => {
  test('should load and display all homepage sections', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000); // Wait for animations
    
    // Check Hero section
    await expect(page.locator('#home')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('h1:has-text("healthy corner")')).toBeVisible({ timeout: 15000 });
    
    // Check About section
    const aboutSection = page.locator('#about');
    await aboutSection.scrollIntoViewIfNeeded();
    await expect(aboutSection).toBeVisible();
    
    // Check Services section
    const servicesSection = page.locator('#services');
    await servicesSection.scrollIntoViewIfNeeded();
    await expect(servicesSection).toBeVisible();
    
    // Check Gallery section
    const gallerySection = page.locator('#gallery');
    await gallerySection.scrollIntoViewIfNeeded();
    await expect(gallerySection).toBeVisible();
    
    // Check Shop section
    const shopSection = page.locator('#shop');
    await shopSection.scrollIntoViewIfNeeded();
    await expect(shopSection).toBeVisible();
    await expect(page.locator('text=Wellness Products')).toBeVisible();
    
    // Check Booking section
    const bookingSection = page.locator('#booking');
    await bookingSection.scrollIntoViewIfNeeded();
    await expect(bookingSection).toBeVisible();
    
    // Check Contact section
    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await expect(contactSection).toBeVisible();
  });
});

test.describe('Shop E-Commerce Flow', () => {
  test('should complete full shopping flow: browse -> add to cart -> checkout', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Navigate to shop
    await page.locator('#shop').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Wait for products to load
    const addToCartBtn = page.locator('button:has-text("Add to Cart")').first();
    await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
    
    // Add product to cart
    await addToCartBtn.click();
    await page.waitForTimeout(1000);
    
    // Verify cart button appears
    const cartFloatingButton = page.locator('button').filter({ has: page.locator('[class*="lucide-shopping"]') });
    await expect(cartFloatingButton.first()).toBeVisible({ timeout: 5000 });
    
    // Open cart sidebar
    await cartFloatingButton.first().click();
    await page.waitForTimeout(500);
    
    // Verify cart sidebar is open
    await expect(page.locator('text=Your Cart')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Total')).toBeVisible();
    
    // Go to checkout
    const checkoutBtn = page.locator('button:has-text("Checkout"), a:has-text("Checkout")').first();
    if (await checkoutBtn.isVisible()) {
      await checkoutBtn.click();
      await page.waitForURL('**/checkout', { timeout: 10000 });
      
      // Verify checkout page
      await expect(page.locator('text=Checkout')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('input[type="email"]')).toBeVisible();
    }
  });
  
  test('should update cart quantity', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#shop').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    const addToCartBtn = page.locator('button:has-text("Add to Cart")').first();
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      await page.waitForTimeout(500);
      
      // Open cart
      const cartBtn = page.locator('button').filter({ has: page.locator('svg') }).last();
      await cartBtn.click();
      await page.waitForTimeout(500);
      
      // Find and click plus button
      const buttons = page.locator('button').filter({ has: page.locator('svg') });
      const count = await buttons.count();
      
      // Click plus button if found
      for (let i = 0; i < count; i++) {
        const btn = buttons.nth(i);
        const ariaLabel = await btn.getAttribute('aria-label');
        if (ariaLabel?.includes('Increase') || ariaLabel?.includes('plus')) {
          await btn.click();
          await page.waitForTimeout(500);
          break;
        }
      }
    }
  });
});

test.describe('Booking Form', () => {
  test('should submit booking form successfully', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Navigate to booking section
    await page.locator('#booking').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Fill out booking form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="tel"]', '+386123456789');
    
    // Select service
    const serviceSelect = page.locator('select').first();
    await serviceSelect.selectOption({ index: 1 });
    
    // Select date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    await page.fill('input[type="date"]', dateStr);
    
    // Select time
    const timeSelect = page.locator('select').nth(1);
    await timeSelect.selectOption({ index: 1 });
    
    // Enter guests
    await page.fill('input[type="number"]', '2');
    
    // Submit form
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Verify success message appears
    await expect(page.locator('text=submitted')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Contact Form', () => {
  test('should submit contact form successfully', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Navigate to contact section
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Find contact form inputs
    const contactSection = page.locator('#contact');
    await contactSection.locator('input[name="name"]').fill('Contact Test');
    await contactSection.locator('input[type="email"]').fill('contact@test.com');
    await contactSection.locator('input[name="subject"]').fill('Test Subject');
    await contactSection.locator('textarea').fill('This is a test message');
    
    // Submit
    await contactSection.locator('button[type="submit"]').click();
    await page.waitForTimeout(2000);
    
    // Verify success message
    await expect(page.locator('text=sent')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Admin Login and Dashboard', () => {
  test('should login to admin dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Fill login form
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await page.waitForURL(`${BASE_URL}/admin`, { timeout: 15000 });
    
    // Verify admin dashboard loaded
    await expect(page.locator('h1')).toContainText('Admin', { timeout: 10000 });
    await expect(page.locator('button:has-text("Bookings")')).toBeVisible({ timeout: 10000 });
  });
  
  test('should navigate between admin tabs', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/admin`, { timeout: 15000 });
    
    // Click Bookings tab
    const bookingsTab = page.locator('button').filter({ hasText: 'Bookings' }).first();
    await bookingsTab.click();
    await page.waitForTimeout(500);
    
    // Click Messages tab
    const messagesTab = page.locator('button').filter({ hasText: 'Messages' }).first();
    await messagesTab.click();
    await page.waitForTimeout(1000);
    
    // Verify we're on messages tab (button should be highlighted)
    const btnClass = await messagesTab.getAttribute('class');
    expect(btnClass).toContain('bg-primary');
  });
  
  test('should navigate to media manager', async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/admin`, { timeout: 15000 });
    
    // Click Media Manager button
    const mediaBtn = page.locator('button, a').filter({ hasText: 'Media' }).first();
    await mediaBtn.click();
    
    // Verify navigation
    await page.waitForURL(`${BASE_URL}/admin/media`, { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Media', { timeout: 10000 });
  });
});

test.describe('Gallery', () => {
  test('should display gallery images', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Navigate to gallery
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    
    // Check for gallery heading
    await expect(page.locator('h2:has-text("Experience Healthy Corner")')).toBeVisible({ timeout: 10000 });
    
    // Check for images (even if just logo)
    const allImages = page.locator('img');
    const count = await allImages.count();
    expect(count).toBeGreaterThan(0);
  });
  
  test('should filter gallery by category', async ({ page }) => {
    await page.goto(BASE_URL);
    
    await page.locator('#gallery').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Click category button
    const categoryBtn = page.locator('button').filter({ hasText: 'Ice Bath' }).first();
    if (await categoryBtn.isVisible()) {
      await categoryBtn.click();
      await page.waitForTimeout(500);
      
      // Verify button is highlighted
      const btnClass = await categoryBtn.getAttribute('class');
      expect(btnClass).toContain('primary');
    }
  });
});

test.describe('Newsletter Subscription', () => {
  test('should subscribe to newsletter', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Scroll to bottom to reach newsletter
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    
    // Find newsletter section and fill input
    const newsletterSection = page.locator('text=Stay Connected').locator('..');
    await newsletterSection.scrollIntoViewIfNeeded();
    
    const newsletterForm = newsletterSection.locator('form');
    const emailInput = newsletterForm.locator('input[type="email"]');
    await emailInput.fill('test-newsletter@example.com');
    
    // Click subscribe button within the form
    const subscribeBtn = newsletterForm.locator('button[type="submit"]');
    await subscribeBtn.click();
    await page.waitForTimeout(3000);
    
    // Verify success message appears
    await expect(page.locator('text=Thank you for subscribing!')).toBeVisible({ timeout: 10000 });
  });
});
