const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Attempting') || text.includes('Login') || text.includes('Error') || text.includes('successful')) {
      console.log('>>>', text);
    }
  });
  
  await page.goto('http://localhost:3000/login');
  
  // Wait for React to hydrate
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Wait for the submit button to be ready
  const submitButton = page.locator('button[type="submit"]');
  await submitButton.waitFor({ state: 'visible' });
  
  console.log('Filling form...');
  await page.fill('input[type="email"]', 'admin@healthycorner.com');
  await page.fill('input[type="password"]', 'admin123');
  
  console.log('Clicking submit button...');
  await submitButton.click();
  
  await page.waitForTimeout(8000);
  console.log('Final URL:', page.url());
  
  // Check for error message
  const errorMsg = await page.locator('.text-red-500, .text-red-700').textContent().catch(() => null);
  if (errorMsg) console.log('Error message:', errorMsg);
  
  await browser.close();
})();
