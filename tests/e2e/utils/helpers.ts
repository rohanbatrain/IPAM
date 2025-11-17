import type { Page } from '@playwright/test';

/**
 * Wait for API response with specific endpoint
 */
export async function waitForAPIResponse(
  page: Page,
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET'
) {
  return await page.waitForResponse(
    (response) =>
      response.url().includes(endpoint) && response.request().method() === method
  );
}

/**
 * Mock API response
 */
export async function mockAPIResponse(
  page: Page,
  endpoint: string,
  data: any,
  status: number = 200
) {
  await page.route(`**/${endpoint}`, (route) => {
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(data),
    });
  });
}

/**
 * Wait for loading to complete
 */
export async function waitForLoadingComplete(page: Page) {
  await page.waitForSelector('[data-testid="loading-skeleton"]', {
    state: 'hidden',
    timeout: 10000,
  });
}

/**
 * Take screenshot with timestamp
 */
export async function takeTimestampedScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({
    path: `test-results/screenshots/${name}-${timestamp}.png`,
    fullPage: true,
  });
}

/**
 * Check if element is in viewport
 */
export async function isInViewport(page: Page, selector: string): Promise<boolean> {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }, selector);
}

/**
 * Scroll element into view
 */
export async function scrollIntoView(page: Page, selector: string) {
  await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, selector);
}

/**
 * Wait for toast notification
 */
export async function waitForToast(page: Page, message?: string) {
  const toast = page.locator('[data-testid="toast"]');
  await toast.waitFor({ state: 'visible' });
  
  if (message) {
    await toast.filter({ hasText: message }).waitFor({ state: 'visible' });
  }
  
  return toast;
}

/**
 * Clear all cookies and local storage
 */
export async function clearBrowserData(page: Page) {
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Set authentication token in local storage
 */
export async function setAuthToken(page: Page, token: string) {
  await page.evaluate((authToken) => {
    localStorage.setItem('auth-token', authToken);
  }, token);
}

/**
 * Get table row count
 */
export async function getTableRowCount(page: Page, tableSelector: string): Promise<number> {
  return await page.locator(`${tableSelector} tbody tr`).count();
}

/**
 * Wait for table to load
 */
export async function waitForTableLoad(page: Page, tableSelector: string) {
  await page.waitForSelector(tableSelector);
  await page.waitForSelector(`${tableSelector} tbody tr`, { timeout: 10000 });
}
