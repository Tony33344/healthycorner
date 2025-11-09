const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Opening production site...');
  await page.goto('https://healthycornersonnet.netlify.app');
  await page.waitForLoadState('networkidle');
  
  // Check logo
  const logos = await page.locator('img[alt*="Logo"]').count();
  console.log(`Found ${logos} logo images`);
  
  for (let i = 0; i < logos; i++) {
    const logo = page.locator('img[alt*="Logo"]').nth(i);
    const src = await logo.getAttribute('src');
    const visible = await logo.isVisible();
    console.log(`Logo ${i}: src=${src}, visible=${visible}`);
  }
  
  // Check all images
  const allImages = await page.locator('img').count();
  console.log(`\nTotal images on page: ${allImages}`);
  
  // Check for failed resources
  const failed = [];
  page.on('response', response => {
    if (response.status() >= 400) {
      failed.push({ url: response.url(), status: response.status() });
    }
  });
  
  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  if (failed.length > 0) {
    console.log('\nFailed resources:');
    failed.forEach(f => console.log(`  ${f.status}: ${f.url}`));
  } else {
    console.log('\nAll resources loaded successfully!');
  }
  
  // Take screenshot
  await page.screenshot({ path: 'production-check.png', fullPage: true });
  console.log('\nScreenshot saved to production-check.png');
  
  await page.waitForTimeout(5000);
  await browser.close();
})();
