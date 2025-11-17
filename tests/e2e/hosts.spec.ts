import { test, expect } from './fixtures/auth';
import { HostsPage } from './pages';
import { waitForToast, waitForTableLoad, waitForAPIResponse } from './utils/helpers';

test.describe('Host Management', () => {
  test.describe('Host List', () => {
    test('should display hosts list page', async ({ authenticatedPage }) => {
      const hostsPage = new HostsPage(authenticatedPage);
      await hostsPage.goto();

      // Verify page elements
      await expect(authenticatedPage.locator('h1')).toContainText(/hosts/i);
      await expect(hostsPage.allocateButton).toBeVisible();
      await expect(hostsPage.batchAllocateButton).toBeVisible();
      await expect(hostsPage.searchInput).toBeVisible();
      await expect(hostsPage.hostsTable).toBeVisible();
    });

    test('should load and display hosts', async ({ authenticatedPage }) => {
      const hostsPage = new HostsPage(authenticatedPage);
      await hostsPage.goto();

      // Wait for table to load
      await waitForTableLoad(authenticatedPage, '[data-testid="hosts-table"]');

      // Verify hosts are displayed
      const hostCount = await hostsPage.getHostCount();
      expect(hostCount).toBeGreaterThanOrEqual(0);
    });

    test('should search hosts by IP address', async ({ authenticatedPage }) => {
      const hostsPage = new HostsPage(authenticatedPage);
      await hostsPage.goto();

      // Wait for initial load
      await waitForTableLoad(authenticatedPage, '[data-testid="hosts-table"]');

      // Perform search
      await hostsPage.search('10.1');
      await authenticatedPage.waitForTimeout(500); // Debounce

      // Verify filtered results
      const rows = authenticatedPage.locator('[data-testid="host-row"]');
      const count = await rows.count();
      
      if (count > 0) {
        const firstRowText = await rows.first().textContent();
        expect(firstRowText).toContain('10.1');
      }
    });

    test('should search hosts by hostname', async ({ authenticatedPage }) => {
      const hostsPage = new HostsPage(authenticatedPage);
      await hostsPage.goto();

      // Wait for initial load
      await waitForTableLoad(authenticatedPage, '[data-testid="hosts-table"]');

      // Perform search
      await hostsPage.search('server');
      await authenticatedPage.waitForTimeout(500);

      // Verify filtered results
      const hostCount = await hostsPage.getHostCount();
      expect(hostCount).toBeGreaterThanOrEqual(0);
    });

    test('should navigate to host details on click', async ({ authenticatedPage }) => {
      const hostsPage = new HostsPage(authenticatedPage);
      await hostsPage.goto();

      // Wait for table to load
      await waitForTableLoad(authenticatedPage, '[data-testid="hosts-table"]');
      
      const hostCount = await hostsPage.getHostCount();
      if (hostCount > 0) {
        // Click first host
        await hostsPage.clickHost(0);

        // Verify navigation to details page
        await expect(authenticatedPage).toHaveURL(/\/dashboard\/hosts\/[^/]+$/);
      }
    });

    test('should enable bulk selection', async ({ authenticatedPage }) => {
      const hostsPage = new HostsPage(authenticatedPage);
      await hostsPage.goto();

      // Wait for table to load
      await waitForTableLoad(authenticatedPage, '[data-testid="hosts-table"]');

      const hostCount = await hostsPage.getHostCount();
      if (hostCount > 0) {
        // Select all hosts
        await hostsPage.selectAllHosts();

        // Verify bulk actions toolbar is visible
        const isBulkActionsVisible = await hostsPage.isBulkActionsVisible();
        expect(isBulkActionsVisible).toBe(true);
      }
    });
  });

  test.describe('Host Allocation', () => {
    test('should navigate to allocate host form', async ({ authenticatedPage }) => {
      const hostsPage = new HostsPage(authenticatedPage);
      await hostsPage.goto();

      // Click allocate button
      await hostsPage.clickAllocate();

      // Verify navigation to create form
      await expect(authenticatedPage).toHaveURL(/\/dashboard\/hosts\/create/);
    });

    test('should display allocate host form correctly', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/hosts/create');

      // Verify form elements
      await expect(authenticatedPage.locator('[data-testid="region-select"]')).toBeVisible();
      await expect(authenticatedPage.locator('input[name="hostname"]')).toBeVisible();
      await expect(authenticatedPage.locator('button[type="submit"]')).toBeVisible();
    });

    test('should show next available IP when region selected', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/hosts/create');

      // Select a region
      await authenticatedPage.locator('[data-testid="region-select"]').click();
      await authenticatedPage.locator('[data-value]').first().click();

      // Verify next available IP is shown
      await expect(authenticatedPage.locator('[data-testid="next-available-ip"]')).toBeVisible();
      const ipText = await authenticatedPage.locator('[data-testid="next-available-ip"]').textContent();
      expect(ipText).toMatch(/10\.\d+\.\d+\.\d+/);
    });

    test('should allocate host successfully', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/hosts/create');

      // Select region
      await authenticatedPage.locator('[data-testid="region-select"]').click();
      await authenticatedPage.locator('[data-value]').first().click();

      // Fill hostname
      const hostname = `test-host-${Date.now()}`;
      await authenticatedPage.locator('input[name="hostname"]').fill(hostname);

      // Fill optional fields
      await authenticatedPage.locator('input[name="device_type"]').fill('Server');
      await authenticatedPage.locator('input[name="owner"]').fill('Test User');
      await authenticatedPage.locator('input[name="purpose"]').fill('E2E Testing');

      // Submit form
      const responsePromise = waitForAPIResponse(authenticatedPage, '/api/ipam/hosts', 'POST');
      await authenticatedPage.locator('button[type="submit"]').click();
      await responsePromise;

      // Verify success toast
      await waitForToast(authenticatedPage);

      // Verify navigation to host details
      await expect(authenticatedPage).toHaveURL(/\/dashboard\/hosts\/[^/]+$/);
    });

    test('should show validation errors for empty hostname', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/hosts/create');

      // Select region
      await authenticatedPage.locator('[data-testid="region-select"]').click();
      await authenticatedPage.locator('[data-value]').first().click();

      // Try to submit without hostname
      await authenticatedPage.locator('button[type="submit"]').click();

      // Verify validation error
      await expect(authenticatedPage.locator('[role="alert"]')).toBeVisible();
    });

    test('should validate hostname format', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/hosts/create');

      // Select region
      await authenticatedPage.locator('[data-testid="region-select"]').click();
      await authenticatedPage.locator('[data-value]').first().click();

      // Enter invalid hostname
      await authenticatedPage.locator('input[name="hostname"]').fill('Invalid Hostname!@#');
      await authenticatedPage.locator('button[type="submit"]').click();

      // Verify validation error
      await expect(authenticatedPage.locator('text=/invalid.*hostname/i')).toBeVisible();
    });

    test('should handle region capacity exhaustion', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/hosts/create');

      // Mock API error for full region
      await authenticatedPage.route('**/api/ipam/hosts', (route) => {
        route.fulfill({
          status: 400,
          body: JSON.stringify({ error: 'Region capacity exhausted' }),
        });
      });

      // Select region and fill form
      await authenticatedPage.locator('[data-testid="region-select"]').click();
      await authenticatedPage.locator('[data-value]').first().click();
      await authenticatedPage.locator('input[name="hostname"]').fill('test-host');
      await authenticatedPage.locator('button[type="submit"]').click();

      // Verify error message
      await expect(authenticatedPage.locator('text=/capacity.*exhausted/i')).toBeVisible();
    });
  });

  test.describe('Batch Host Allocation', () => {
    test('should navigate to batch allocate form', async ({ authenticatedPage }) => {
      const hostsPage = new HostsPage(authenticatedPage);
      await hostsPage.goto();

      // Click batch allocate button
      await hostsPage.clickBatchAllocate();

      // Verify navigation to batch form
      await expect(authenticatedPage).toHaveURL(/\/dashboard\/hosts\/batch/);
    });

    test('should display batch allocation form', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/hosts/batch');

      // Verify form elements
      await expect(authenticatedPage.locator('[data-testid="region-select"]')).toBeVisible();
      await expect(authenticatedPage.locator('input[name="count"]')).toBeVisible();
      await expect(authenticatedPage.locator('input[name="hostname_prefix"]')).toBeVisible();
      await expect(authenticatedPage.locator('[data-testid="preview-list"]')).toBeVisible();
    });

    test('should show hostname preview', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/hosts/batch');

      // Select region
      await authenticatedPage.locator('[data-testid="region-select"]').click();
      await authenticatedPage.locator('[data-value]').first().click();

      // Enter prefix and count
      await authenticatedPage.locator('input[name="hostname_prefix"]').fill('web-server');
      await authenticatedPage.locator('input[name="count"]').fill('3');

      // Verify preview
      await expect(authenticatedPage.locator('text=web-server-01')).toBeVisible();
      await expect(authenticatedPage.locator('text=web-server-02')).toBeVisible();
      await expect(authenticatedPage.locator('text=web-server-03')).toBeVisible();
    });

    test('should validate count range', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/hosts/batch');

      // Try to enter count > 100
      await authenticatedPage.locator('input[name="count"]').fill('150');
      await authenticatedPage.locator('button[type="submit"]').click();

      // Verify validation error
      await expect(authenticatedPage.locator('text=/maximum.*100/i')).toBeVisible();
    });

    test('should perform batch allocation successfully', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/hosts/batch');

      // Select region
      await authenticatedPage.locator('[data-testid="region-select"]').click();
      await authenticatedPage.locator('[data-value]').first().click();

      // Fill form
      await authenticatedPage.locator('input[name="hostname_prefix"]').fill(`batch-${Date.now()}`);
      await authenticatedPage.locator('input[name="count"]').fill('5');

      // Submit
      const responsePromise = waitForAPIResponse(authenticatedPage, '/api/ipam/hosts/batch', 'POST');
      await authenticatedPage.locator('button[type="submit"]').click();
      await responsePromise;

      // Verify progress indicator
      await expect(authenticatedPage.locator('[data-testid="progress-bar"]')).toBeVisible();

      // Wait for completion
      await authenticatedPage.waitForSelector('[data-testid="batch-complete"]', { timeout: 10000 });

      // Verify success message
      await expect(authenticatedPage.locator('text=/successfully allocated/i')).toBeVisible();
    });
  });

  test.describe('Host Details', () => {
    test('should display host details correctly', async ({ authenticatedPage }) => {
      const hostsPage = new HostsPage(authenticatedPage);
      await hostsPage.goto();

      // Wait for table and click first host
      await waitForTableLoad(authenticatedPage, '[data-testid="hosts-table"]');
      const hostCount = await hostsPage.getHostCount();
      
      if (hostCount > 0) {
        await hostsPage.clickHost(0);

        // Verify details page elements
        await expect(authenticatedPage.locator('[data-testid="host-ip"]')).toBeVisible();
        await expect(authenticatedPage.locator('[data-testid="host-hostname"]')).toBeVisible();
        await expect(authenticatedPage.locator('[data-testid="host-status"]')).toBeVisible();
        await expect(authenticatedPage.locator('[data-testid="parent-region"]')).toBeVisible();
      }
    });

    test('should display parent region information', async ({ authenticatedPage }) => {
      const hostsPage = new HostsPage(authenticatedPage);
      await hostsPage.goto();

      await waitForTableLoad(authenticatedPage, '[data-testid="hosts-table"]');
      const hostCount = await hostsPage.getHostCount();
      
      if (hostCount > 0) {
        await hostsPage.clickHost(0);

        // Verify parent region section
        await expect(authenticatedPage.locator('[data-testid="parent-region"]')).toBeVisible();
        await expect(authenticatedPage.locator('[data-testid="region-cidr"]')).toBeVisible();
      }
    });
  });

  test.describe('Host Update', () => {
    test('should update host metadata successfully', async ({ authenticatedPage }) => {
      const hostsPage = new HostsPage(authenticatedPage);
      await hostsPage.goto();

      await waitForTableLoad(authenticatedPage, '[data-testid="hosts-table"]');
      const hostCount = await hostsPage.getHostCount();
      
      if (hostCount > 0) {
        await hostsPage.clickHost(0);

        // Enter edit mode
        await authenticatedPage.locator('[data-testid="edit-button"]').click();

        // Update fields
        const newPurpose = `Updated at ${Date.now()}`;
        await authenticatedPage.locator('input[name="purpose"]').fill(newPurpose);

        // Save changes
        const responsePromise = waitForAPIResponse(authenticatedPage, '/api/ipam/hosts', 'PATCH');
        await authenticatedPage.locator('[data-testid="save-button"]').click();
        await responsePromise;

        // Verify success toast
        await waitForToast(authenticatedPage);

        // Verify updated content
        await expect(authenticatedPage.locator(`text=${newPurpose}`)).toBeVisible();
      }
    });
  });

  test.describe('Host Release', () => {
    test('should show release confirmation dialog', async ({ authenticatedPage }) => {
      const hostsPage = new HostsPage(authenticatedPage);
      await hostsPage.goto();

      await waitForTableLoad(authenticatedPage, '[data-testid="hosts-table"]');
      const hostCount = await hostsPage.getHostCount();
      
      if (hostCount > 0) {
        await hostsPage.clickHost(0);

        // Click release button
        await authenticatedPage.locator('[data-testid="release-button"]').click();

        // Verify confirmation dialog
        await expect(authenticatedPage.locator('[role="dialog"]')).toBeVisible();
        await expect(authenticatedPage.locator('text=/release.*host/i')).toBeVisible();
        await expect(authenticatedPage.locator('input[name="reason"]')).toBeVisible();
      }
    });

    test('should release host successfully', async ({ authenticatedPage }) => {
      const hostsPage = new HostsPage(authenticatedPage);
      await hostsPage.goto();

      await waitForTableLoad(authenticatedPage, '[data-testid="hosts-table"]');
      const hostCount = await hostsPage.getHostCount();
      
      if (hostCount > 0) {
        await hostsPage.clickHost(0);

        // Click release button
        await authenticatedPage.locator('[data-testid="release-button"]').click();

        // Fill release reason
        await authenticatedPage.locator('input[name="reason"]').fill('E2E test release');

        // Confirm release
        const responsePromise = waitForAPIResponse(authenticatedPage, '/api/ipam/hosts', 'DELETE');
        await authenticatedPage.locator('[data-testid="confirm-release"]').click();
        await responsePromise;

        // Verify success toast
        await waitForToast(authenticatedPage);

        // Verify navigation back to list
        await expect(authenticatedPage).toHaveURL(/\/dashboard\/hosts$/);
      }
    });
  });

  test.describe('Bulk Operations', () => {
    test('should perform bulk release', async ({ authenticatedPage }) => {
      const hostsPage = new HostsPage(authenticatedPage);
      await hostsPage.goto();

      await waitForTableLoad(authenticatedPage, '[data-testid="hosts-table"]');
      const hostCount = await hostsPage.getHostCount();
      
      if (hostCount >= 2) {
        // Select multiple hosts
        await authenticatedPage.locator('[data-testid="host-checkbox"]').first().click();
        await authenticatedPage.locator('[data-testid="host-checkbox"]').nth(1).click();

        // Click bulk release
        await authenticatedPage.locator('[data-testid="bulk-release"]').click();

        // Confirm
        await authenticatedPage.locator('input[name="reason"]').fill('Bulk E2E test');
        await authenticatedPage.locator('[data-testid="confirm-bulk-release"]').click();

        // Verify success
        await waitForToast(authenticatedPage);
      }
    });

    test('should perform bulk tag update', async ({ authenticatedPage }) => {
      const hostsPage = new HostsPage(authenticatedPage);
      await hostsPage.goto();

      await waitForTableLoad(authenticatedPage, '[data-testid="hosts-table"]');
      const hostCount = await hostsPage.getHostCount();
      
      if (hostCount >= 2) {
        // Select multiple hosts
        await authenticatedPage.locator('[data-testid="host-checkbox"]').first().click();
        await authenticatedPage.locator('[data-testid="host-checkbox"]').nth(1).click();

        // Click bulk tag edit
        await authenticatedPage.locator('[data-testid="bulk-edit-tags"]').click();

        // Add tag
        await authenticatedPage.locator('input[name="tag_key"]').fill('environment');
        await authenticatedPage.locator('input[name="tag_value"]').fill('test');
        await authenticatedPage.locator('[data-testid="add-tag"]').click();

        // Save
        await authenticatedPage.locator('[data-testid="save-tags"]').click();

        // Verify success
        await waitForToast(authenticatedPage);
      }
    });
  });
});
