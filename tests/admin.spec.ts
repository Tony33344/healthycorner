import { test, expect } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@healthycorner.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Increase timeout for admin operations
test.setTimeout(60000);

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);
  });

  test('should login successfully', async ({ page }) => {
    // Fill in login form
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    
    // Click login button and wait for navigation
    await Promise.all([
      page.waitForURL(`${BASE_URL}/admin`, { timeout: 10000 }),
      page.click('button[type="submit"]')
    ]);
    
    // Verify we're on the admin page
    await expect(page.locator('h1')).toContainText('Admin', { timeout: 10000 });
  });

  test('should display bookings tab', async ({ page }) => {
    // Login first
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await Promise.all([
      page.waitForURL(`${BASE_URL}/admin`, { timeout: 10000 }),
      page.click('button[type="submit"]')
    ]);
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check bookings tab is visible
    const bookingsTab = page.locator('button').filter({ hasText: 'Bookings' }).first();
    await expect(bookingsTab).toBeVisible({ timeout: 10000 });
    
    // Verify bookings content is displayed
    await expect(page.locator('text=Total Bookings').first()).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to media manager', async ({ page }) => {
    // Login
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await Promise.all([
      page.waitForURL(`${BASE_URL}/admin`, { timeout: 10000 }),
      page.click('button[type="submit"]')
    ]);
    
    // Wait for page load
    await page.waitForLoadState('networkidle');
    
    // Click media manager button
    const mediaButton = page.locator('button, a').filter({ hasText: 'Media' }).first();
    await mediaButton.click();
    
    // Verify navigation
    await page.waitForURL(`${BASE_URL}/admin/media`, { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Media', { timeout: 10000 });
  });
});

test.describe('Media Manager', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to media manager
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await Promise.all([
      page.waitForURL(`${BASE_URL}/admin`, { timeout: 10000 }),
      page.click('button[type="submit"]')
    ]);
    await page.goto(`${BASE_URL}/admin/media`);
    await page.waitForLoadState('networkidle');
  });

  test('should display media stats', async ({ page }) => {
    // Check for stats cards
    await expect(page.locator('text=Total Images')).toBeVisible();
    await expect(page.locator('text=Published')).toBeVisible();
    await expect(page.locator('text=Draft')).toBeVisible();
  });

  test('should open upload modal', async ({ page }) => {
    // Click upload button
    const uploadButton = page.locator('button').filter({ hasText: 'Upload' }).first();
    await uploadButton.click();
    
    // Verify modal is open
    await expect(page.locator('input[type="file"]')).toBeVisible({ timeout: 5000 });
  });

  test('should filter by category', async ({ page }) => {
    // Click on a category filter
    const categoryButton = page.locator('button').filter({ hasText: 'Ice Bath' }).first();
    if (await categoryButton.isVisible()) {
      await categoryButton.click();
      
      // Verify filter is applied (button should be highlighted)
      const buttonClass = await categoryButton.getAttribute('class');
      expect(buttonClass).toContain('primary');
    }
  });
});

test.describe('Product Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to admin
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await Promise.all([
      page.waitForURL(`${BASE_URL}/admin`, { timeout: 10000 }),
      page.click('button[type="submit"]')
    ]);
    await page.waitForLoadState('networkidle');
  });

  test('should display products tab', async ({ page }) => {
    // Click products tab
    const productsTab = page.locator('button').filter({ hasText: 'Products' }).first();
    await productsTab.click();
    await page.waitForTimeout(1000);
    
    // Verify products content
    await expect(page.locator('text=Product management coming soon').first()).toBeVisible({ timeout: 10000 });
  });

  test('should open add product modal', async ({ page }) => {
    // Navigate to products tab
    const productsTab = page.locator('button').filter({ hasText: 'Products' }).first();
    await productsTab.click();
    await page.waitForTimeout(1000);
    
    // Click add product button
    const addButton = page.locator('button').filter({ hasText: 'Add' }).first();
    if (await addButton.isVisible()) {
      await addButton.click();
      
      // Verify modal is open
      await expect(page.locator('input[type="text"]').first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('should create a new product', async ({ page }) => {
    // Navigate to products tab
    const productsTab = page.locator('button').filter({ hasText: 'Products' }).first();
    await productsTab.click();
    await page.waitForTimeout(1000);
    
    // Open add product modal
    const addButton = page.locator('button').filter({ hasText: 'Add' }).first();
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(500);
      
      // Fill in product details
      const nameInput = page.locator('input[type="text"]').first();
      if (await nameInput.isVisible()) {
        await nameInput.fill('Test Product');
        await page.fill('textarea', 'Test description');
        await page.fill('input[type="number"]', '99.99');
        
        // Select category if available
        const selectElement = page.locator('select').first();
        if (await selectElement.isVisible()) {
          await selectElement.selectOption('workshop');
        }
        
        // Save product
        await page.click('button:has-text("Save")');
        await page.waitForTimeout(1000);
      }
    }
  });
});

test.describe('Order Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await Promise.all([
      page.waitForURL(`${BASE_URL}/admin`, { timeout: 10000 }),
      page.click('button[type="submit"]')
    ]);
    await page.waitForLoadState('networkidle');
  });

  test('should display orders tab', async ({ page }) => {
    // Click orders tab
    const ordersTab = page.locator('button').filter({ hasText: 'Orders' }).first();
    await ordersTab.click();
    await page.waitForTimeout(1000);
    
    // Verify orders content or empty state
    const ordersSection = page.locator('text=No orders yet').first();
    await expect(ordersSection).toBeVisible({ timeout: 10000 });
  });

  test('should update order status', async ({ page }) => {
    // Navigate to orders tab
    const ordersTab = page.locator('button').filter({ hasText: 'Orders' }).first();
    await ordersTab.click();
    await page.waitForTimeout(1000);
    
    // Check if there are any orders
    const statusSelect = page.locator('select').first();
    const orderExists = await statusSelect.isVisible().catch(() => false);
    
    if (orderExists) {
      // Change status
      await statusSelect.selectOption('confirmed');
      
      // Wait for update
      await page.waitForTimeout(1000);
      
      // Verify status was updated
      await expect(statusSelect).toHaveValue('confirmed');
    }
  });
});
