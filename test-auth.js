const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Enable console logging
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(2000);
  
  console.log('Filling email...');
  await page.fill('input[type="email"]', 'admin@healthycorner.com');
  
  console.log('Filling password...');
  await page.fill('input[type="password"]', 'admin123');
  
  console.log('Clicking submit...');
  await page.click('button[type="submit"]');
  
  console.log('Waiting for navigation...');
  await page.waitForTimeout(5000);
  
  console.log('Current URL:', page.url());
  
  await page.screenshot({ path: 'test-auth-result.png' });
  
  await browser.close();
})();
