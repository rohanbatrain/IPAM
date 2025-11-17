import { test as base, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * Test user credentials for authentication
 */
export const TEST_USER = {
  username: 'test@example.com',
  password: 'testpassword123',
  email: 'test@example.com',
};

/**
 * Extended test fixture with authenticated page
 */
type AuthFixtures = {
  authenticatedPage: Page;
};

/**
 * Custom test fixture that provides an authenticated page
 */
export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Fill in login form
    await page.fill('input[name="username"]', TEST_USER.username);
    await page.fill('input[name="password"]', TEST_USER.password);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await page.waitForURL('/dashboard');
    
    // Verify we're authenticated
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    
    // Use the authenticated page
    await use(page);
  },
});

export { expect };
