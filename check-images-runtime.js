const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://healthycornersonnet.netlify.app', { waitUntil: 'networkidle' });

  const srcs = await page.$$eval('img', imgs => imgs.map(img => img.getAttribute('src')));
  console.log(`Found ${srcs.length} img tags`);
  let hasOptimizer = false;
  let hasSpaces = false;
  srcs.forEach((s, i) => {
    console.log(`${i}: ${s}`);
    if (s && s.includes('_next/image')) hasOptimizer = true;
    if (s && decodeURIComponent(s).includes('icebath breathing')) hasSpaces = true;
  });
  console.log(`\n_hasOptimizer=${hasOptimizer}`);
  console.log(`_hasSpacesInPaths=${hasSpaces}`);

  await browser.close();
})();
