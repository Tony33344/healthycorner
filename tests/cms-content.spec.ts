import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'admin@healthycorner.com';
const ADMIN_PASSWORD = 'admin123';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('CMS Content Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login to admin
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin');
  });

  test('should navigate to Content Manager', async ({ page }) => {
    await page.click('text=Content Manager');
    await page.waitForURL('**/admin/content');
    await expect(page.locator('h1')).toContainText('Content Manager');
  });

  test('should display all 12 website sections', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/content`);
    
    // Check all section headings are present
    await expect(page.locator('text=1. Hero Section')).toBeVisible();
    await expect(page.locator('text=2. About Section')).toBeVisible();
    await expect(page.locator('text=3. Brand Section')).toBeVisible();
    await expect(page.locator('text=4. Services Section')).toBeVisible();
    await expect(page.locator('text=5. Menu Section')).toBeVisible();
    await expect(page.locator('text=6. Schedule Section')).toBeVisible();
    await expect(page.locator('text=7. Gallery Section')).toBeVisible();
    await expect(page.locator('text=8. Testimonials Section')).toBeVisible();
    await expect(page.locator('text=9. Shop Section')).toBeVisible();
    await expect(page.locator('text=10. Booking Section')).toBeVisible();
    await expect(page.locator('text=11. Newsletter Section')).toBeVisible();
    await expect(page.locator('text=12. Contact Section')).toBeVisible();
  });

  test('should edit Hero section title and see changes on homepage', async ({ page, context }) => {
    await page.goto(`${BASE_URL}/admin/content`);
    
    // Find Hero section title input
    const titleInput = page.locator('label:has-text("Main Title")').locator('..').locator('input');
    
    // Get original value
    const originalValue = await titleInput.inputValue();
    
    // Change the title
    const newTitle = 'Test Healthy Corner';
    await titleInput.fill(newTitle);
    await titleInput.blur(); // Trigger auto-save
    
    // Wait a bit for save
    await page.waitForTimeout(1000);
    
    // Open homepage in new tab
    const homePage = await context.newPage();
    await homePage.goto(BASE_URL);
    
    // Check if new title appears
    await expect(homePage.locator('h1')).toContainText(newTitle);
    
    // Restore original value
    await page.goto(`${BASE_URL}/admin/content`);
    await titleInput.fill(originalValue);
    await titleInput.blur();
    
    await homePage.close();
  });

  test('should edit About section and see changes', async ({ page, context }) => {
    await page.goto(`${BASE_URL}/admin/content`);
    
    // Find About heading input
    const headingInput = page.locator('text=2. About Section').locator('..').locator('label:has-text("Section Heading")').locator('..').locator('input');
    
    const originalValue = await headingInput.inputValue();
    const newHeading = 'Test About Heading';
    
    await headingInput.fill(newHeading);
    await headingInput.blur();
    await page.waitForTimeout(1000);
    
    // Check on homepage
    const homePage = await context.newPage();
    await homePage.goto(BASE_URL);
    await homePage.locator('#about').scrollIntoViewIfNeeded();
    
    await expect(homePage.locator('#about h2')).toContainText(newHeading);
    
    // Restore
    await page.goto(`${BASE_URL}/admin/content`);
    await headingInput.fill(originalValue);
    await headingInput.blur();
    
    await homePage.close();
  });

  test('should edit Contact section details', async ({ page, context }) => {
    await page.goto(`${BASE_URL}/admin/content`);
    
    // Scroll to Contact section
    await page.locator('text=12. Contact Section').scrollIntoViewIfNeeded();
    
    // Find phone input
    const phoneInput = page.locator('text=12. Contact Section').locator('..').locator('label:has-text("Phone Number")').locator('..').locator('input');
    
    const originalPhone = await phoneInput.inputValue();
    const newPhone = '+386 99 999 9999';
    
    await phoneInput.fill(newPhone);
    await phoneInput.blur();
    await page.waitForTimeout(1000);
    
    // Check on homepage
    const homePage = await context.newPage();
    await homePage.goto(BASE_URL);
    await homePage.locator('#contact').scrollIntoViewIfNeeded();
    
    await expect(homePage.locator('#contact')).toContainText(newPhone);
    
    // Restore
    await page.goto(`${BASE_URL}/admin/content`);
    await page.locator('text=12. Contact Section').scrollIntoViewIfNeeded();
    await phoneInput.fill(originalPhone);
    await phoneInput.blur();
    
    await homePage.close();
  });

  test('should have persistent navigation on Content Manager', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/content`);
    
    // Check all nav buttons are present
    await expect(page.locator('button:has-text("Bookings")')).toBeVisible();
    await expect(page.locator('button:has-text("Messages")')).toBeVisible();
    await expect(page.locator('button:has-text("Products")')).toBeVisible();
    await expect(page.locator('button:has-text("Services")')).toBeVisible();
    await expect(page.locator('button:has-text("Orders")')).toBeVisible();
    await expect(page.locator('button:has-text("Media")')).toBeVisible();
    await expect(page.locator('button:has-text("Content")').first()).toBeDisabled();
  });

  test('should navigate between admin sections', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/content`);
    
    // Navigate to Media Manager
    await page.click('button:has-text("Media")');
    await page.waitForURL('**/admin/media');
    await expect(page.locator('h1')).toContainText('Media Manager');
    
    // Navigate back to Content
    await page.click('button:has-text("Content")');
    await page.waitForURL('**/admin/content');
    await expect(page.locator('h1')).toContainText('Content Manager');
    
    // Navigate to main dashboard
    await page.click('button:has-text("Bookings")');
    await page.waitForURL('**/admin#bookings');
  });

  test('should show auto-save feedback', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/content`);
    
    // Edit a field
    const input = page.locator('label:has-text("Main Title")').locator('..').locator('input').first();
    await input.fill('Test Auto Save');
    await input.blur();
    
    // Look for "Saving..." text
    await expect(page.locator('text=Saving...')).toBeVisible({ timeout: 2000 });
  });

  test('should edit Newsletter section', async ({ page, context }) => {
    await page.goto(`${BASE_URL}/admin/content`);
    
    // Scroll to Newsletter section
    await page.locator('text=11. Newsletter Section').scrollIntoViewIfNeeded();
    
    // Find button text input
    const buttonInput = page.locator('text=11. Newsletter Section').locator('..').locator('label:has-text("Button Text")').locator('..').locator('input');
    
    const originalText = await buttonInput.inputValue();
    const newText = 'Join Now';
    
    await buttonInput.fill(newText);
    await buttonInput.blur();
    await page.waitForTimeout(1000);
    
    // Check on homepage
    const homePage = await context.newPage();
    await homePage.goto(BASE_URL);
    await homePage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    await expect(homePage.locator('button:has-text("' + newText + '")')).toBeVisible();
    
    // Restore
    await page.goto(`${BASE_URL}/admin/content`);
    await page.locator('text=11. Newsletter Section').scrollIntoViewIfNeeded();
    await buttonInput.fill(originalText);
    await buttonInput.blur();
    
    await homePage.close();
  });

  test('should edit Services section heading', async ({ page, context }) => {
    await page.goto(`${BASE_URL}/admin/content`);
    
    // Find Services section heading
    const headingInput = page.locator('text=4. Services Section').locator('..').locator('label:has-text("Section Heading")').locator('..').locator('input');
    
    const originalValue = await headingInput.inputValue();
    const newHeading = 'Our Wellness Services';
    
    await headingInput.fill(newHeading);
    await headingInput.blur();
    await page.waitForTimeout(1000);
    
    // Check on homepage
    const homePage = await context.newPage();
    await homePage.goto(BASE_URL);
    await homePage.locator('#services').scrollIntoViewIfNeeded();
    
    await expect(homePage.locator('#services h2')).toContainText(newHeading);
    
    // Restore
    await page.goto(`${BASE_URL}/admin/content`);
    await headingInput.fill(originalValue);
    await headingInput.blur();
    
    await homePage.close();
  });

  test('should edit Booking section', async ({ page, context }) => {
    await page.goto(`${BASE_URL}/admin/content`);
    
    // Scroll to Booking section
    await page.locator('text=10. Booking Section').scrollIntoViewIfNeeded();
    
    // Find heading input
    const headingInput = page.locator('text=10. Booking Section').locator('..').locator('label:has-text("Section Heading")').locator('..').locator('input');
    
    const originalValue = await headingInput.inputValue();
    const newHeading = 'Reserve Your Spot';
    
    await headingInput.fill(newHeading);
    await headingInput.blur();
    await page.waitForTimeout(1000);
    
    // Check on homepage
    const homePage = await context.newPage();
    await homePage.goto(BASE_URL);
    await homePage.locator('#booking').scrollIntoViewIfNeeded();
    
    await expect(homePage.locator('#booking h2')).toContainText(newHeading);
    
    // Restore
    await page.goto(`${BASE_URL}/admin/content`);
    await page.locator('text=10. Booking Section').scrollIntoViewIfNeeded();
    await headingInput.fill(originalValue);
    await headingInput.blur();
    
    await homePage.close();
  });
});

test.describe('Public Website Content Display', () => {
  test('should display Hero section with CMS content', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Check Hero section elements
    await expect(page.locator('section#home h1')).toBeVisible();
    await expect(page.locator('section#home p').first()).toBeVisible();
  });

  test('should display About section with CMS content', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#about').scrollIntoViewIfNeeded();
    
    await expect(page.locator('#about h2')).toBeVisible();
    await expect(page.locator('#about p').first()).toBeVisible();
  });

  test('should display Contact section with CMS content', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#contact').scrollIntoViewIfNeeded();
    
    await expect(page.locator('#contact h2')).toBeVisible();
    // Check for contact details
    await expect(page.locator('#contact')).toContainText('Location');
    await expect(page.locator('#contact')).toContainText('Phone');
    await expect(page.locator('#contact')).toContainText('Email');
  });

  test('should display Services section with CMS heading', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#services').scrollIntoViewIfNeeded();
    
    await expect(page.locator('#services h2')).toBeVisible();
  });

  test('should display Newsletter section with CMS content', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    await expect(page.locator('text=Stay Connected')).toBeVisible();
    await expect(page.locator('button:has-text("Subscribe")')).toBeVisible();
  });
});
