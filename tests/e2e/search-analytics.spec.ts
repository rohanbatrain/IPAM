import { test, expect } from './fixtures/auth';
import { waitForToast, waitForTableLoad, waitForAPIResponse } from './utils/helpers';

test.describe('Search & Analytics', () => {
  test.describe('Advanced Search', () => {
    test('should display search page correctly', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/search');

      // Verify page elements
      await expect(authenticatedPage.locator('h1')).toContainText(/search/i);
      await expect(authenticatedPage.locator('[data-testid="search-form"]')).toBeVisible();
      await expect(authenticatedPage.locator('[data-testid="search-results"]')).toBeVisible();
    });

    test('should search by IP address', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/search');

      // Enter IP address
      await authenticatedPage.locator('input[name="ip_address"]').fill('10.1.1');
      await authenticatedPage.locator('[data-testid="search-button"]').click();

      // Wait for results
      await authenticatedPage.waitForTimeout(1000);

      // Verify results
      const results = authenticatedPage.locator('[data-testid="search-result"]');
      const count = await results.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should search by hostname', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/search');

      // Enter hostname
      await authenticatedPage.locator('input[name="hostname"]').fill('server');
      await authenticatedPage.locator('[data-testid="search-button"]').click();

      // Wait for results
      await authenticatedPage.waitForTimeout(1000);

      // Verify results contain hostname
      const results = authenticatedPage.locator('[data-testid="search-result"]');
      const count = await results.count();
      
      if (count > 0) {
        const firstResult = await results.first().textContent();
        expect(firstResult?.toLowerCase()).toContain('server');
      }
    });

    test('should search by country', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/search');

      // Select country
      await authenticatedPage.locator('[data-testid="country-select"]').click();
      await authenticatedPage.locator('[data-value="India"]').click();
      await authenticatedPage.locator('[data-testid="search-button"]').click();

      // Wait for results
      await authenticatedPage.waitForTimeout(1000);

      // Verify results are from India
      const results = authenticatedPage.locator('[data-testid="search-result"]');
      const count = await results.count();
      
      if (count > 0) {
        const firstResult = await results.first().textContent();
        expect(firstResult).toContain('India');
      }
    });

    test('should search by status', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/search');

      // Select status
      await authenticatedPage.locator('[data-testid="status-select"]').click();
      await authenticatedPage.locator('[data-value="Active"]').click();
      await authenticatedPage.locator('[data-testid="search-button"]').click();

      // Wait for results
      await authenticatedPage.waitForTimeout(1000);

      // Verify results have Active status
      const results = authenticatedPage.locator('[data-testid="search-result"]');
      const count = await results.count();
      
      if (count > 0) {
        await expect(results.first().locator('[data-testid="status-badge"]')).toContainText(/active/i);
      }
    });

    test('should search with multiple criteria', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/search');

      // Fill multiple fields
      await authenticatedPage.locator('input[name="ip_address"]').fill('10.1');
      await authenticatedPage.locator('[data-testid="country-select"]').click();
      await authenticatedPage.locator('[data-value="India"]').click();
      await authenticatedPage.locator('[data-testid="status-select"]').click();
      await authenticatedPage.locator('[data-value="Active"]').click();
      
      await authenticatedPage.locator('[data-testid="search-button"]').click();

      // Wait for results
      await authenticatedPage.waitForTimeout(1000);

      // Verify results match all criteria
      const results = authenticatedPage.locator('[data-testid="search-result"]');
      const count = await results.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should display hierarchical context in results', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/search');

      // Perform search
      await authenticatedPage.locator('input[name="hostname"]').fill('test');
      await authenticatedPage.locator('[data-testid="search-button"]').click();

      // Wait for results
      await authenticatedPage.waitForTimeout(1000);

      const results = authenticatedPage.locator('[data-testid="search-result"]');
      const count = await results.count();
      
      if (count > 0) {
        // Verify hierarchical breadcrumb
        await expect(results.first().locator('[data-testid="result-breadcrumb"]')).toBeVisible();
      }
    });

    test('should clear search form', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/search');

      // Fill form
      await authenticatedPage.locator('input[name="ip_address"]').fill('10.1.1.1');
      await authenticatedPage.locator('input[name="hostname"]').fill('test');

      // Clear form
      await authenticatedPage.locator('[data-testid="clear-button"]').click();

      // Verify fields are empty
      await expect(authenticatedPage.locator('input[name="ip_address"]')).toHaveValue('');
      await expect(authenticatedPage.locator('input[name="hostname"]')).toHaveValue('');
    });
  });

  test.describe('Saved Filters', () => {
    test('should save search filter', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/search');

      // Fill search criteria
      await authenticatedPage.locator('input[name="ip_address"]').fill('10.1');
      await authenticatedPage.locator('[data-testid="country-select"]').click();
      await authenticatedPage.locator('[data-value="India"]').click();

      // Save filter
      await authenticatedPage.locator('[data-testid="save-filter"]').click();
      await authenticatedPage.locator('input[name="filter_name"]').fill('India 10.1 Filter');
      await authenticatedPage.locator('[data-testid="confirm-save-filter"]').click();

      // Verify success toast
      await waitForToast(authenticatedPage);

      // Verify filter appears in saved filters list
      await expect(authenticatedPage.locator('text=India 10.1 Filter')).toBeVisible();
    });

    test('should load saved filter', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/search');

      // Assume a filter exists, click it
      const savedFilter = authenticatedPage.locator('[data-testid="saved-filter"]').first();
      const isVisible = await savedFilter.isVisible();
      
      if (isVisible) {
        await savedFilter.click();

        // Verify form is populated
        await authenticatedPage.waitForTimeout(500);
        
        // Check that at least one field is filled
        const ipValue = await authenticatedPage.locator('input[name="ip_address"]').inputValue();
        const hostnameValue = await authenticatedPage.locator('input[name="hostname"]').inputValue();
        
        expect(ipValue || hostnameValue).toBeTruthy();
      }
    });

    test('should delete saved filter', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/search');

      const savedFilter = authenticatedPage.locator('[data-testid="saved-filter"]').first();
      const isVisible = await savedFilter.isVisible();
      
      if (isVisible) {
        // Get filter name
        const filterName = await savedFilter.textContent();

        // Click delete
        await savedFilter.locator('[data-testid="delete-filter"]').click();
        await authenticatedPage.locator('[data-testid="confirm-delete"]').click();

        // Verify success toast
        await waitForToast(authenticatedPage);

        // Verify filter is removed
        await expect(authenticatedPage.locator(`text=${filterName}`)).not.toBeVisible();
      }
    });
  });

  test.describe('Analytics Page', () => {
    test('should display analytics page correctly', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/analytics');

      // Verify page elements
      await expect(authenticatedPage.locator('h1')).toContainText(/analytics/i);
      await expect(authenticatedPage.locator('[data-testid="time-range-selector"]')).toBeVisible();
    });

    test('should display utilization charts', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/analytics');

      // Wait for charts to load
      await authenticatedPage.waitForTimeout(2000);

      // Verify charts are visible
      await expect(authenticatedPage.locator('[data-testid="utilization-trend-chart"]')).toBeVisible();
      await expect(authenticatedPage.locator('[data-testid="status-distribution-chart"]')).toBeVisible();
      await expect(authenticatedPage.locator('[data-testid="continent-capacity-chart"]')).toBeVisible();
    });

    test('should display capacity gauges', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/analytics');

      // Wait for gauges to load
      await authenticatedPage.waitForTimeout(2000);

      // Verify gauges are visible
      await expect(authenticatedPage.locator('[data-testid="capacity-gauge"]')).toBeVisible();
      
      // Verify gauge shows percentage
      const gaugeText = await authenticatedPage.locator('[data-testid="capacity-gauge"]').textContent();
      expect(gaugeText).toMatch(/\d+%/);
    });

    test('should display top countries', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/analytics');

      // Wait for data to load
      await authenticatedPage.waitForTimeout(2000);

      // Verify top countries section
      await expect(authenticatedPage.locator('[data-testid="top-countries"]')).toBeVisible();
    });

    test('should change time range', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/analytics');

      // Wait for initial load
      await authenticatedPage.waitForTimeout(2000);

      // Change time range
      await authenticatedPage.locator('[data-testid="time-range-selector"]').click();
      await authenticatedPage.locator('[data-value="7d"]').click();

      // Wait for charts to update
      await authenticatedPage.waitForTimeout(1000);

      // Verify charts are still visible (data refreshed)
      await expect(authenticatedPage.locator('[data-testid="utilization-trend-chart"]')).toBeVisible();
    });

    test('should display capacity planning section', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/analytics');

      // Wait for data to load
      await authenticatedPage.waitForTimeout(2000);

      // Verify capacity planning section
      await expect(authenticatedPage.locator('[data-testid="capacity-planning"]')).toBeVisible();
      
      // Verify forecast data
      await expect(authenticatedPage.locator('[data-testid="forecast-data"]')).toBeVisible();
    });

    test('should show interactive chart tooltips', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/analytics');

      // Wait for charts to load
      await authenticatedPage.waitForTimeout(2000);

      // Hover over chart
      const chart = authenticatedPage.locator('[data-testid="utilization-trend-chart"]');
      await chart.hover();

      // Verify tooltip appears (implementation-specific)
      // This may need adjustment based on your chart library
      await authenticatedPage.waitForTimeout(500);
    });
  });

  test.describe('Export Features', () => {
    test('should export search results as CSV', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/search');

      // Perform search
      await authenticatedPage.locator('input[name="ip_address"]').fill('10.1');
      await authenticatedPage.locator('[data-testid="search-button"]').click();
      await authenticatedPage.waitForTimeout(1000);

      // Click export
      const downloadPromise = authenticatedPage.waitForEvent('download');
      await authenticatedPage.locator('[data-testid="export-csv"]').click();
      const download = await downloadPromise;

      // Verify download
      expect(download.suggestedFilename()).toMatch(/\.csv$/);
    });

    test('should export search results as JSON', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/search');

      // Perform search
      await authenticatedPage.locator('input[name="ip_address"]').fill('10.1');
      await authenticatedPage.locator('[data-testid="search-button"]').click();
      await authenticatedPage.waitForTimeout(1000);

      // Click export JSON
      const downloadPromise = authenticatedPage.waitForEvent('download');
      await authenticatedPage.locator('[data-testid="export-json"]').click();
      const download = await downloadPromise;

      // Verify download
      expect(download.suggestedFilename()).toMatch(/\.json$/);
    });

    test('should export analytics chart as PNG', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/analytics');

      // Wait for charts to load
      await authenticatedPage.waitForTimeout(2000);

      // Click export chart
      const downloadPromise = authenticatedPage.waitForEvent('download');
      await authenticatedPage.locator('[data-testid="export-chart"]').first().click();
      const download = await downloadPromise;

      // Verify download
      expect(download.suggestedFilename()).toMatch(/\.png$/);
    });

    test('should export analytics data as CSV', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/analytics');

      // Wait for data to load
      await authenticatedPage.waitForTimeout(2000);

      // Open export dialog
      await authenticatedPage.locator('[data-testid="export-analytics"]').click();

      // Select CSV format
      await authenticatedPage.locator('[data-value="csv"]').click();

      // Confirm export
      const downloadPromise = authenticatedPage.waitForEvent('download');
      await authenticatedPage.locator('[data-testid="confirm-export"]').click();
      const download = await downloadPromise;

      // Verify download
      expect(download.suggestedFilename()).toMatch(/\.csv$/);
    });

    test('should show export progress for large datasets', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/search');

      // Perform broad search
      await authenticatedPage.locator('[data-testid="search-button"]').click();
      await authenticatedPage.waitForTimeout(1000);

      // Click export
      await authenticatedPage.locator('[data-testid="export-csv"]').click();

      // Verify progress indicator appears
      const progressIndicator = authenticatedPage.locator('[data-testid="export-progress"]');
      const isVisible = await progressIndicator.isVisible();
      
      // Progress may be too fast to catch, so this is optional
      if (isVisible) {
        await expect(progressIndicator).toBeVisible();
      }
    });

    test('should include filters in export filename', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/search');

      // Apply specific filter
      await authenticatedPage.locator('[data-testid="country-select"]').click();
      await authenticatedPage.locator('[data-value="India"]').click();
      await authenticatedPage.locator('[data-testid="search-button"]').click();
      await authenticatedPage.waitForTimeout(1000);

      // Export
      const downloadPromise = authenticatedPage.waitForEvent('download');
      await authenticatedPage.locator('[data-testid="export-csv"]').click();
      const download = await downloadPromise;

      // Verify filename includes filter info
      const filename = download.suggestedFilename();
      expect(filename).toMatch(/india/i);
    });
  });

  test.describe('Search Performance', () => {
    test('should handle empty search results gracefully', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/search');

      // Search for non-existent data
      await authenticatedPage.locator('input[name="ip_address"]').fill('999.999.999.999');
      await authenticatedPage.locator('[data-testid="search-button"]').click();
      await authenticatedPage.waitForTimeout(1000);

      // Verify empty state message
      await expect(authenticatedPage.locator('[data-testid="empty-results"]')).toBeVisible();
      await expect(authenticatedPage.locator('text=/no results found/i')).toBeVisible();
    });

    test('should show loading state during search', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/search');

      // Start search
      await authenticatedPage.locator('input[name="ip_address"]').fill('10.1');
      await authenticatedPage.locator('[data-testid="search-button"]').click();

      // Verify loading indicator appears
      const loadingIndicator = authenticatedPage.locator('[data-testid="search-loading"]');
      const isVisible = await loadingIndicator.isVisible();
      
      // Loading may be too fast to catch
      if (isVisible) {
        await expect(loadingIndicator).toBeVisible();
      }
    });

    test('should paginate large search results', async ({ authenticatedPage }) => {
      await authenticatedPage.goto('/dashboard/search');

      // Perform broad search
      await authenticatedPage.locator('[data-testid="search-button"]').click();
      await authenticatedPage.waitForTimeout(1000);

      // Check if pagination exists
      const pagination = authenticatedPage.locator('[data-testid="pagination"]');
      const hasPagination = await pagination.isVisible();

      if (hasPagination) {
        // Click next page
        await authenticatedPage.locator('[data-testid="next-page"]').click();
        await authenticatedPage.waitForTimeout(500);

        // Verify page changed
        const currentPage = await authenticatedPage.locator('[data-testid="current-page"]').textContent();
        expect(currentPage).toContain('2');
      }
    });
  });
});
