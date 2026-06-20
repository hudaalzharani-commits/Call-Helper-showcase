import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'screenshots');
const BASE = process.env.CH_APP_URL || 'http://localhost:3000';

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const page = await (await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  })).newPage();

  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForSelector('#start-btn', { timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT, '01-start-page.png') });

  const logo = page.locator('.logo-block').first();
  if (await logo.count()) {
    await logo.screenshot({ path: path.join(OUT, '03-logo.png') });
  }

  await page.click('#start-btn');
  await page.waitForSelector('#emailOrUsername', { timeout: 15000 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUT, '02-login-page.png') });

  await page.fill('#emailOrUsername', 'admin');
  await page.fill('#password', 'admin123');
  await page.locator('form.login-form button[type="submit"]').click();
  await page.waitForSelector('.topbar', { timeout: 30000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(OUT, '04-dashboard.png') });

  await browser.close();
  console.log('Done:', OUT);
}

main().catch((e) => { console.error(e); process.exit(1); });
