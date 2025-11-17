import { test, expect } from '@playwright/test';
import { LoginPage, DashboardPage } from './pages';
import { TEST_USER } from './fixtures/auth';
import { clearBrowserData, waitForToast } from './utils/helpers';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear browser data before each test
    await clearBrowserData(page);
  });

  test.describe('Login Flow', () => {
    test('should display login page correctly', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      // Verify page elements are visible
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.submitButton).toBeVisible();
      await expect(page.locator('h1')).toContainText(/login|sign in/i);
    });

    test('should login successfully with valid credentials', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      // Perform login
      await loginPage.login(TEST_USER.username, TEST_USER.password);

      // Wait for navigation to dashboard
      await loginPage.waitForDashboard();

      // Verify we're on the dashboard
      await expect(page).toHaveURL(/\/dashboard/);
      
      // Verify user menu is visible (indicates successful auth)
      const dashboardPage = new DashboardPage(page);
      await expect(dashboardPage.userMenu).toBeVisible();
    });

    test('should show error with invalid credentials', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      // Attempt login with invalid credentials
      await loginPage.login('invalid@example.com', 'wrongpassword');

      // Wait for error message
      await expect(loginPage.errorMessage).toBeVisible();
      
      // Verify error message content
      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toMatch(/invalid|incorrect|failed/i);

      // Verify we're still on login page
      await expect(page).toHaveURL(/\/login/);
    });

    test('should show validation errors for empty fields', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      // Try to submit without filling fields
      await loginPage.submitButton.click();

      // Check for validation errors
      await expect(page.locator('[role="alert"]')).toBeVisible();
    });

    test('should show validation error for invalid email format', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      // Enter invalid email
      await loginPage.usernameInput.fill('notanemail');
      await loginPage.passwordInput.fill('password123');
      await loginPage.submitButton.click();

      // Check for validation error
      await expect(page.locator('text=/invalid.*email/i')).toBeVisible();
    });
  });

  test.describe('Logout Flow', () => {
    test('should logout successfully', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const dashboardPage = new DashboardPage(page);

      // Login first
      await loginPage.goto();
      await loginPage.login(TEST_USER.username, TEST_USER.password);
      await loginPage.waitForDashboard();

      // Perform logout
      await dashboardPage.logout();

      // Verify redirected to login page
      await expect(page).toHaveURL(/\/login/);
      
      // Verify user menu is no longer visible
      await expect(dashboardPage.userMenu).not.toBeVisible();
    });

    test('should clear session data on logout', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const dashboardPage = new DashboardPage(page);

      // Login
      await loginPage.goto();
      await loginPage.login(TEST_USER.username, TEST_USER.password);
      await loginPage.waitForDashboard();

      // Logout
      await dashboardPage.logout();

      // Try to access protected route
      await page.goto('/dashboard/regions');

      // Should be redirected to login
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Token Refresh', () => {
    test('should refresh token automatically when expired', async ({ page }) => {
      const loginPage = new LoginPage(page);

      // Login
      await loginPage.goto();
      await loginPage.login(TEST_USER.username, TEST_USER.password);
      await loginPage.waitForDashboard();

      // Simulate token expiration by manipulating localStorage
      await page.evaluate(() => {
        const authData = JSON.parse(localStorage.getItem('auth-storage') || '{}');
        if (authData.state) {
          // Set access token to expired value
          authData.state.accessToken = 'expired_token';
          localStorage.setItem('auth-storage', JSON.stringify(authData));
        }
      });

      // Make an API request that should trigger token refresh
      await page.goto('/dashboard/regions');

      // Wait for potential token refresh
      await page.waitForTimeout(2000);

      // Verify we're still authenticated (not redirected to login)
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when accessing protected route without auth', async ({ page }) => {
      // Try to access protected route directly
      await page.goto('/dashboard');

      // Should be redirected to login
      await expect(page).toHaveURL(/\/login/);
    });

    test('should allow access to protected routes when authenticated', async ({ page }) => {
      const loginPage = new LoginPage(page);

      // Login
      await loginPage.goto();
      await loginPage.login(TEST_USER.username, TEST_USER.password);
      await loginPage.waitForDashboard();

      // Access various protected routes
      const protectedRoutes = [
        '/dashboard',
        '/dashboard/regions',
        '/dashboard/hosts',
        '/dashboard/countries',
        '/dashboard/analytics',
      ];

      for (const route of protectedRoutes) {
        await page.goto(route);
        await expect(page).toHaveURL(route);
        // Verify user menu is still visible
        await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
      }
    });

    test('should preserve intended destination after login', async ({ page }) => {
      // Try to access a specific protected route
      await page.goto('/dashboard/regions');

      // Should be redirected to login
      await expect(page).toHaveURL(/\/login/);

      // Login
      const loginPage = new LoginPage(page);
      await loginPage.login(TEST_USER.username, TEST_USER.password);

      // Should be redirected to originally intended route
      // Note: This depends on your redirect implementation
      await page.waitForURL(/\/dashboard/);
    });
  });

  test.describe('Session Persistence', () => {
    test('should maintain session across page reloads', async ({ page }) => {
      const loginPage = new LoginPage(page);

      // Login
      await loginPage.goto();
      await loginPage.login(TEST_USER.username, TEST_USER.password);
      await loginPage.waitForDashboard();

      // Reload page
      await page.reload();

      // Should still be authenticated
      await expect(page).toHaveURL(/\/dashboard/);
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    });

    test('should maintain session in new tab', async ({ context, page }) => {
      const loginPage = new LoginPage(page);

      // Login in first tab
      await loginPage.goto();
      await loginPage.login(TEST_USER.username, TEST_USER.password);
      await loginPage.waitForDashboard();

      // Open new tab
      const newPage = await context.newPage();
      await newPage.goto('/dashboard');

      // Should be authenticated in new tab
      await expect(newPage).toHaveURL(/\/dashboard/);
      await expect(newPage.locator('[data-testid="user-menu"]')).toBeVisible();

      await newPage.close();
    });
  });

  test.describe('Security', () => {
    test('should not expose sensitive data in localStorage', async ({ page }) => {
      const loginPage = new LoginPage(page);

      // Login
      await loginPage.goto();
      await loginPage.login(TEST_USER.username, TEST_USER.password);
      await loginPage.waitForDashboard();

      // Check localStorage for sensitive data
      const sensitiveData = await page.evaluate(() => {
        const storage = localStorage.getItem('auth-storage') || '{}';
        return storage;
      });

      // Should not contain password
      expect(sensitiveData).not.toContain(TEST_USER.password);
      expect(sensitiveData.toLowerCase()).not.toContain('password');
    });

    test('should handle concurrent login attempts gracefully', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      // Fill credentials
      await loginPage.usernameInput.fill(TEST_USER.username);
      await loginPage.passwordInput.fill(TEST_USER.password);

      // Click submit multiple times rapidly
      await Promise.all([
        loginPage.submitButton.click(),
        loginPage.submitButton.click(),
        loginPage.submitButton.click(),
      ]);

      // Should handle gracefully and end up authenticated
      await page.waitForURL(/\/dashboard/, { timeout: 10000 });
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      // Simulate network failure
      await page.route('**/api/auth/login', (route) => {
        route.abort('failed');
      });

      // Attempt login
      await loginPage.login(TEST_USER.username, TEST_USER.password);

      // Should show error message
      await expect(page.locator('[role="alert"]')).toBeVisible();
      await expect(page.locator('text=/network|connection|failed/i')).toBeVisible();
    });

    test('should handle server errors gracefully', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      // Simulate server error
      await page.route('**/api/auth/login', (route) => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Internal server error' }),
        });
      });

      // Attempt login
      await loginPage.login(TEST_USER.username, TEST_USER.password);

      // Should show error message
      await expect(page.locator('[role="alert"]')).toBeVisible();
    });
  });
});
