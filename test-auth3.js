const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('console', msg => console.log('>>>', msg.text()));
  
  await page.goto('http://localhost:3000/login');
  await page.waitForLoadState('networkidle');
  
  // Check if form exists
  const form = await page.locator('form').count();
  console.log('Forms found:', form);
  
  // Fill inputs
  await page.locator('input[type="email"]').fill('admin@healthycorner.com');
  await page.locator('input[type="password"]').fill('admin123');
  
  // Try to submit via Enter key
  console.log('Pressing Enter...');
  await page.locator('input[type="password"]').press('Enter');
  
  await page.waitForTimeout(5000);
  console.log('URL after Enter:', page.url());
  
  await browser.close();
})();
