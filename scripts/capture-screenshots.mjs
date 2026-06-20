/**
 * Capture English UI screenshots for the Call-Helper-showcase README.
 * Requires Call-Helper app running locally (frontend + backend).
 *
 *   CH_APP_URL=http://localhost:3002 node scripts/capture-screenshots.mjs
 */
import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'screenshots');
const BASE = process.env.CH_APP_URL || 'http://localhost:3000';

const PRIVACY_MASK_STYLE_ID = 'screenshot-privacy-mask';

const PRIVACY_MASK_CSS = `
  [data-screenshot-safe="true"] .recharts-wrapper,
  [data-screenshot-safe="true"] .recharts-responsive-container,
  [data-screenshot-safe="true"] .dash-chart-canvas,
  [data-screenshot-safe="true"] .dash-kpi__value,
  [data-screenshot-safe="true"] .dash-kpi__delta,
  [data-screenshot-safe="true"] .dash-kpi__value--sm,
  [data-screenshot-safe="true"] .dash-inline-stat,
  [data-screenshot-safe="true"] .admin-dash-kpi__value,
  [data-screenshot-safe="true"] .admin-dash-bar-row,
  [data-screenshot-safe="true"] .text-lg.font-bold.leading-none,
  [data-screenshot-safe="true"] .text-xs.font-bold.tabular-nums,
  [data-screenshot-safe="true"] .glass-panel .grid p.font-bold,
  [data-screenshot-safe="true"] table tbody,
  [data-screenshot-safe="true"] [data-slot="table-body"],
  [data-screenshot-safe="true"] [data-slot="table-row"],
  [data-screenshot-safe="true"] article.rounded-xl.border,
  [data-screenshot-safe="true"] .glass-card:has(table),
  [data-screenshot-safe="true"] .ops-intel-sheet__body,
  [data-screenshot-safe="true"] .admin-dash-panel .px-4.py-3,
  [data-screenshot-safe="true"] input:not([type="checkbox"]):not([type="radio"]):not(:placeholder-shown),
  [data-screenshot-safe="true"] textarea:not(:placeholder-shown),
  [data-screenshot-safe="true"] select {
    filter: blur(14px) !important;
    user-select: none !important;
  }

  [data-screenshot-safe="true"] .flex.items-center.gap-2.text-sm.text-muted-foreground > span {
    filter: blur(10px) !important;
  }
`;

async function applyPrivacyMask(page) {
  await page.evaluate(({ styleId, css }) => {
    document.documentElement.dataset.screenshotSafe = 'true';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = css;
      document.head.appendChild(style);
    }
  }, { styleId: PRIVACY_MASK_STYLE_ID, css: PRIVACY_MASK_CSS });
  await page.waitForTimeout(200);
}

async function removePrivacyMask(page) {
  await page.evaluate((styleId) => {
    delete document.documentElement.dataset.screenshotSafe;
    document.getElementById(styleId)?.remove();
  }, PRIVACY_MASK_STYLE_ID);
}

async function forceEnglish(page) {
  await page.evaluate(() => {
    localStorage.setItem('rafiq_locale', 'en');
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  });
  const enToggle = page.locator('button[aria-label="English"]');
  if (await enToggle.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await enToggle.click();
  }
}

async function screenshot(page, file, { maskData = false } = {}) {
  const filePath = path.join(OUT, file);
  if (maskData) await applyPrivacyMask(page);
  await page.screenshot({ path: filePath });
  if (maskData) await removePrivacyMask(page);
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    locale: 'en-US',
  });
  const page = await context.newPage();

  await page.addInitScript(() => {
    localStorage.setItem('rafiq_locale', 'en');
  });

  console.log('Start page…');
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 120_000 });
  await page.waitForSelector('#start-btn', { timeout: 60_000 });
  await page.waitForTimeout(1500);
  await screenshot(page, '01-start-page.png');

  const logo = page.locator('.logo-block').first();
  if (await logo.count()) {
    await logo.screenshot({ path: path.join(OUT, '03-logo.png') });
  }

  console.log('Login page…');
  await page.click('#start-btn');
  await page.waitForSelector('#emailOrUsername', { timeout: 15_000 });
  await forceEnglish(page);
  await page.waitForTimeout(1200);
  await screenshot(page, '02-login-page.png');

  console.log('Dashboard (This month)…');
  await page.fill('#emailOrUsername', 'admin');
  await page.fill('#password', 'admin123');
  await page.locator('form.login-form button[type="submit"]').click();
  await page.waitForSelector('header.topbar', { timeout: 30_000 });
  await forceEnglish(page);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForSelector('header.topbar', { timeout: 30_000 });
  await page.getByRole('tab', { name: 'This month' }).click();
  await page.waitForTimeout(2000);
  await screenshot(page, '04-dashboard.png', { maskData: true });

  await browser.close();
  console.log('Done:', OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
