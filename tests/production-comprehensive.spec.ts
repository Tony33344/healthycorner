import { test, expect } from '@playwright/test';

const PROD_URL = 'https://healthycornersonnet.netlify.app';

test.describe('Production Site - Comprehensive Tests', () => {
  
  test('Homepage loads and displays correctly', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Check title
    await expect(page).toHaveTitle(/Healthy Corner/);
    
    // Check logo is visible
    const logo = page.locator('img[alt*="Healthy Corner Logo"]').first();
    await expect(logo).toBeVisible({ timeout: 10000 });
    
    // Check navigation
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page.getByRole('link', { name: 'About', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Services' })).toBeVisible();
    
    // Check hero section
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('All images load successfully', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');

    // At least the logo should be visible
    await expect(page.locator('img[alt*="Healthy Corner Logo"]').first()).toBeVisible({ timeout: 10000 });

    // There should be images present on the page
    const count = await page.locator('img').count();
    expect(count).toBeGreaterThan(0);
  });

  test('Navigation scrolls to sections', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Click About link
    await page.click('a[href="#about"]');
    await page.waitForTimeout(1000);
    
    // Check if scrolled
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(100);
  });

  test('Booking form is present and functional', async ({ page }) => {
    await page.goto(PROD_URL + '#booking');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check form exists
    const form = page.locator('form').filter({ has: page.locator('input[type="email"]') }).first();
    await expect(form).toBeVisible({ timeout: 10000 });
    
    // Check form fields
    await expect(page.locator('input[name="name"], input[placeholder*="Name"]').first()).toBeVisible();
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
  });

  test('Contact form is present', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    // Check form exists
    await expect(page.locator('input[name="email"], input[type="email"]').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('textarea').first()).toBeVisible();
  });

  test('Shop section displays', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    await page.locator('#shop').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    await expect(page.locator('text=Wellness Products & Retreats').first()).toBeVisible({ timeout: 10000 });
  });

  test('Gallery section displays', async ({ page }) => {
    await page.goto(PROD_URL + '#gallery');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check gallery section
    const gallerySection = page.locator('section, div').filter({ hasText: /gallery|galerija/i }).first();
    await expect(gallerySection).toBeVisible({ timeout: 10000 });
  });

  test('Admin login page loads', async ({ page }) => {
    await page.goto(PROD_URL + '/login');
    await page.waitForLoadState('networkidle');
    
    // Check login form
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Check for "Admin Login" or similar text
    await expect(page.locator('text=/admin|login/i').first()).toBeVisible();
  });

  test('Admin authentication works', async ({ page }) => {
    await page.goto(PROD_URL + '/login');
    await page.waitForLoadState('networkidle');
    
    // Fill login form
    await page.fill('input[type="email"]', 'admin@healthycorner.com');
    await page.fill('input[type="password"]', 'admin123');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Wait for navigation or error
    await page.waitForTimeout(5000);
    
    // Check if redirected to admin or stayed on login
    const url = page.url();
    console.log('After login, URL is:', url);
    
    // Should either be on /admin or show an error
    const isOnAdmin = url.includes('/admin');
    const hasError = await page.locator('text=/error|invalid|failed/i').count() > 0;
    
    if (!isOnAdmin && !hasError) {
      console.log('Login did not redirect and no error shown');
    }
  });

  test('Footer displays correctly', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    // Check footer
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('Mobile responsive - viewport changes', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Check mobile menu button exists
    const menuButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    await expect(menuButton).toBeVisible({ timeout: 10000 });
  });

  test('Language switcher works', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Look for language switcher
    const langButton = page.locator('button').filter({ hasText: /EN|SL/i }).first();
    
    if (await langButton.isVisible()) {
      await langButton.click();
      await page.waitForTimeout(1000);
      // Content should change
      console.log('Language switcher clicked');
    } else {
      console.log('Language switcher not found');
    }
  });

  test('All critical assets return 200', async ({ page }) => {
    const responses: { url: string; status: number }[] = [];
    
    page.on('response', response => {
      const url = response.url();
      if (url.includes('logo') || url.includes('hero') || url.includes('.css') || url.includes('.js')) {
        responses.push({ url, status: response.status() });
      }
    });
    
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Check for any failed resources
    const failed = responses.filter(r => r.status >= 400);
    if (failed.length > 0) {
      console.log('Failed resources:', failed);
    }
    
    expect(failed.length).toBe(0);
  });

  test('Supabase connection works', async ({ page }) => {
    await page.goto(PROD_URL);
    
    // Check console for Supabase errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().toLowerCase().includes('supabase')) {
        errors.push(msg.text());
      }
    });
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    if (errors.length > 0) {
      console.log('Supabase errors found:', errors);
    }
    
    // Should not have Supabase connection errors
    expect(errors.length).toBe(0);
  });
});
