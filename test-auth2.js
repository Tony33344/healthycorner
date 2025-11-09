const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error' || type === 'warning' || msg.text().includes('Error')) {
      console.log(`CONSOLE ${type.toUpperCase()}:`, msg.text());
    }
  });
  
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
  
  await page.goto('http://localhost:3000/login');
  await page.waitForLoadState('networkidle');
  
  console.log('Filling form...');
  await page.fill('input[type="email"]', 'admin@healthycorner.com');
  await page.fill('input[type="password"]', 'admin123');
  
  console.log('Submitting form...');
  const submitButton = page.locator('button[type="submit"]');
  await submitButton.scrollIntoViewIfNeeded();
  await submitButton.click({ force: true });
  
  console.log('Waiting...');
  await page.waitForTimeout(8000);
  
  console.log('Current URL:', page.url());
  console.log('Page title:', await page.title());
  
  await page.screenshot({ path: 'test-auth-result2.png', fullPage: true });
  
  await browser.close();
})();
