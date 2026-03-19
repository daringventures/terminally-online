import { test, expect } from '@playwright/test';

test.describe('Terminally Online — Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Collect console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('http://localhost:4173');
    // Wait for panels to start rendering
    await page.waitForTimeout(5000);

    // Attach errors to test context for assertions
    (test.info() as unknown as { errors: string[] }).errors = errors;
  });

  test('page loads and header renders', async ({ page }) => {
    await expect(page.locator('.header-title')).toHaveText('terminally online');
    await expect(page.locator('.header-status')).toContainText('live');
  });

  test('all 22 panels are present in the grid', async ({ page }) => {
    const panels = page.locator('.panel');
    const count = await panels.count();
    expect(count).toBe(22);
  });

  test('each panel has a header with title', async ({ page }) => {
    const titles = page.locator('.panel-title');
    const count = await titles.count();
    expect(count).toBe(22);

    // Verify each title has non-empty text
    for (let i = 0; i < count; i++) {
      const text = await titles.nth(i).textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

  test('at least 5 panels loaded data (not stuck on loading)', async ({ page }) => {
    // Wait longer for API calls to resolve
    await page.waitForTimeout(10000);

    // Count panels that have feed items (successfully loaded)
    const loadedPanels = page.locator('.panel:has(.feed-item)');
    const loadedCount = await loadedPanels.count();

    // Some APIs might be rate-limited or blocked by CORS in browser,
    // but at minimum the no-auth JSON APIs should work
    expect(loadedCount).toBeGreaterThanOrEqual(5);
  });

  test('Hacker News panel has items', async ({ page }) => {
    await page.waitForTimeout(10000);
    const hnPanel = page.locator('#panel-hackernews');
    await expect(hnPanel).toBeVisible();

    const items = hnPanel.locator('.feed-item');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Fear & Greed panel shows a number', async ({ page }) => {
    await page.waitForTimeout(10000);
    const fgPanel = page.locator('#panel-fear-greed');
    await expect(fgPanel).toBeVisible();

    // Should contain a number 0-100
    const content = await fgPanel.locator('.panel-content').textContent();
    expect(content).toMatch(/\d+/);
  });

  test('no uncaught JavaScript errors on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('http://localhost:4173');
    await page.waitForTimeout(3000);

    // Filter out CORS/network errors (expected for some RSS feeds in browser)
    const realErrors = errors.filter(
      (e) =>
        !e.includes('CORS') &&
        !e.includes('Failed to fetch') &&
        !e.includes('NetworkError') &&
        !e.includes('Load failed')
    );

    expect(realErrors).toEqual([]);
  });

  test('panels scroll independently', async ({ page }) => {
    await page.waitForTimeout(10000);

    // Find a panel with enough items to scroll
    const hnContent = page.locator('#panel-hackernews .panel-content');
    const scrollHeight = await hnContent.evaluate((el) => el.scrollHeight);
    const clientHeight = await hnContent.evaluate((el) => el.clientHeight);

    // If content overflows, it should be scrollable
    if (scrollHeight > clientHeight) {
      await hnContent.evaluate((el) => el.scrollTo(0, 100));
      const scrollTop = await hnContent.evaluate((el) => el.scrollTop);
      expect(scrollTop).toBeGreaterThan(0);
    }
  });
});
