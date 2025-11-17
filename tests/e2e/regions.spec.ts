import { test, expect } from './fixtures/auth';
import { RegionsPage, RegionFormPage } from './pages';
import { waitForToast, waitForTableLoad, waitForAPIResponse } from './utils/helpers';

test.describe('Region Management', () => {
  test.describe('Region List', () => {
    test('should display regions list page', async ({ authenticatedPage }) => {
      const regionsPage = new RegionsPage(authenticatedPage);
      await regionsPage.goto();

      // Verify page elements
      await expect(authenticatedPage.locator('h1')).toContainText(/regions/i);
      await expect(regionsPage.createButton).toBeVisible();
      await expect(regionsPage.searchInput).toBeVisible();
      await expect(regionsPage.regionTable).toBeVisible();
    });

    test('should load and display regions', async ({ authenticatedPage }) => {
      const regionsPage = new RegionsPage(authenticatedPage);
      await regionsPage.goto();

      // Wait for table to load
      await waitForTableLoad(authenticatedPage, '[data-testid="regions-table"]');

      // Verify regions are displayed
      const regionCount = await regionsPage.getRegionCount();
      expect(regionCount).toBeGreaterThan(0);
    });

    test('should search regions by name', async ({ authenticatedPage }) => {
      const regionsPage = new RegionsPage(authenticatedPage);
      await regionsPage.goto();

      // Wait for initial load
      await waitForTableLoad(authenticatedPage, '[data-testid="regions-table"]');
      const initialCount = await regionsPage.getRegionCount();

      // Perform search
      await regionsPage.search('test');
      await authenticatedPage.waitForTimeout(500); // Debounce

      // Verify filtered results
      const filteredCount = await regionsPage.getRegionCount();
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    });

    test('should filter regions by country', async ({ authenticatedPage }) => {
      const regionsPage = new RegionsPage(authenticatedPage);
      await regionsPage.goto();

      // Wait for initial load
      await waitForTableLoad(authenticatedPage, '[data-testid="regions-table"]');

      // Apply country filter
      await regionsPage.filterByCountry('India');
      await authenticatedPage.waitForTimeout(500);

      // Verify filtered results contain only India regions
      const rows = authenticatedPage.locator('[data-testid="region-row"]');
      const count = await rows.count();
      
      if (count > 0) {
        const firstRowText = await rows.first().textContent();
        expect(firstRowText).toContain('India');
      }
    });

    test('should navigate to region details on click', async ({ authenticatedPage }) => {
      const regionsPage = new RegionsPage(authenticatedPage);
      await regionsPage.goto();

      // Wait for table to load
      await waitForTableLoad(authenticatedPage, '[data-testid="regions-table"]');

      // Click first region
      await regionsPage.clickRegion(0);

      // Verify navigation to details page
      await expect(authenticatedPage).toHaveURL(/\/dashboard\/regions\/[^/]+$/);
    });

    test('should sort regions by column', async ({ authenticatedPage }) => {
      const regionsPage = new RegionsPage(authenticatedPage);
      await regionsPage.goto();

      // Wait for table to load
      await waitForTableLoad(authenticatedPage, '[data-testid="regions-table"]');

      // Click column header to sort
      await authenticatedPage.locator('th:has-text("Region Name")').click();
      await authenticatedPage.waitForTimeout(500);

      // Verify sorting (check if first item changed)
      const firstRegionName = await authenticatedPage
        .locator('[data-testid="region-row"]')
        .first()
        .locator('[data-testid="region-name"]')
        .textContent();

      expect(firstRegionName).toBeTruthy();
    });

    test('should paginate regions', async ({ authenticatedPage }) => {
      const regionsPage = new RegionsPage(authenticatedPage);
      await regionsPage.goto();

      // Wait for table to load
      await waitForTableLoad(authenticatedPage, '[data-testid="regions-table"]');

      // Check if pagination exists
      const pagination = authenticatedPage.locator('[data-testid="pagination"]');
      const hasPagination = await pagination.isVisible();

      if (hasPagination) {
        // Click next page
        await authenticatedPage.locator('[data-testid="next-page"]').click();
        await authenticatedPage.waitForTimeout(500);

        // Verify URL or content changed
        const currentPage = await authenticatedPage
          .locator('[data-testid="current-page"]')
          .textContent();
        expect(currentPage).toContain('2');
      }
    });
  });

  test.describe('Region Creation', () => {
    test('should navigate to create region form', async ({ authenticatedPage }) => {
      const regionsPage = new RegionsPage(authenticatedPage);
      await regionsPage.goto();

      // Click create button
      await regionsPage.clickCreate();

      // Verify navigation to create form
      await expect(authenticatedPage).toHaveURL(/\/dashboard\/regions\/create/);
    });

    test('should display create region form correctly', async ({ authenticatedPage }) => {
      const regionFormPage = new RegionFormPage(authenticatedPage);
      await regionFormPage.goto();

      // Verify form elements
      await expect(regionFormPage.countrySelect).toBeVisible();
      await expect(regionFormPage.regionNameInput).toBeVisible();
      await expect(regionFormPage.descriptionInput).toBeVisible();
      await expect(regionFormPage.submitButton).toBeVisible();
      await expect(regionFormPage.cancelButton).toBeVisible();
    });

    test('should show next available IP preview when country selected', async ({ authenticatedPage }) => {
      const regionFormPage = new RegionFormPage(authenticatedPage);
      await regionFormPage.goto();

      // Select a country
      await regionFormPage.selectCountry('India');

      // Verify next available IP is shown
      await expect(regionFormPage.nextAvailablePreview).toBeVisible();
      const previewText = await regionFormPage.getNextAvailableIP();
      expect(previewText).toMatch(/10\.\d+\.\d+\.0\/24/);
    });

    test('should create region successfully', async ({ authenticatedPage }) => {
      const regionFormPage = new RegionFormPage(authenticatedPage);
      await regionFormPage.goto();

      // Fill form
      await regionFormPage.fillForm({
        country: 'India',
        regionName: `Test Region ${Date.now()}`,
        description: 'E2E test region',
        owner: 'Test User',
      });

      // Submit form
      const responsePromise = waitForAPIResponse(authenticatedPage, '/api/ipam/regions', 'POST');
      await regionFormPage.submit();
      await responsePromise;

      // Verify success toast
      await waitForToast(authenticatedPage, /success|created/i);

      // Verify navigation to region details
      await expect(authenticatedPage).toHaveURL(/\/dashboard\/regions\/[^/]+$/);
    });

    test('should show validation errors for empty required fields', async ({ authenticatedPage }) => {
      const regionFormPage = new RegionFormPage(authenticatedPage);
      await regionFormPage.goto();

      // Try to submit without filling fields
      await regionFormPage.submit();

      // Verify validation errors
      const hasErrors = await regionFormPage.hasErrors();
      expect(hasErrors).toBe(true);
    });

    test('should validate region name format', async ({ authenticatedPage }) => {
      const regionFormPage = new RegionFormPage(authenticatedPage);
      await regionFormPage.goto();

      // Select country
      await regionFormPage.selectCountry('India');

      // Enter invalid region name (special characters)
      await regionFormPage.regionNameInput.fill('Invalid@Name#123');
      await regionFormPage.submit();

      // Verify validation error
      await expect(authenticatedPage.locator('text=/invalid.*name/i')).toBeVisible();
    });

    test('should cancel region creation', async ({ authenticatedPage }) => {
      const regionFormPage = new RegionFormPage(authenticatedPage);
      await regionFormPage.goto();

      // Fill some data
      await regionFormPage.selectCountry('India');
      await regionFormPage.regionNameInput.fill('Test Region');

      // Cancel
      await regionFormPage.cancel();

      // Verify navigation back to list
      await expect(authenticatedPage).toHaveURL(/\/dashboard\/regions$/);
    });

    test('should handle API errors gracefully', async ({ authenticatedPage }) => {
      const regionFormPage = new RegionFormPage(authenticatedPage);
      await regionFormPage.goto();

      // Mock API error
      await authenticatedPage.route('**/api/ipam/regions', (route) => {
        route.fulfill({
          status: 400,
          body: JSON.stringify({ error: 'Region already exists' }),
        });
      });

      // Fill and submit form
      await regionFormPage.fillForm({
        country: 'India',
        regionName: 'Duplicate Region',
      });
      await regionFormPage.submit();

      // Verify error message
      await expect(authenticatedPage.locator('[role="alert"]')).toBeVisible();
      await expect(authenticatedPage.locator('text=/already exists/i')).toBeVisible();
    });
  });

  test.describe('Region Details', () => {
    test('should display region details correctly', async ({ authenticatedPage }) => {
      const regionsPage = new RegionsPage(authenticatedPage);
      await regionsPage.goto();

      // Wait for table and click first region
      await waitForTableLoad(authenticatedPage, '[data-testid="regions-table"]');
      await regionsPage.clickRegion(0);

      // Verify details page elements
      await expect(authenticatedPage.locator('[data-testid="region-name"]')).toBeVisible();
      await expect(authenticatedPage.locator('[data-testid="region-cidr"]')).toBeVisible();
      await expect(authenticatedPage.locator('[data-testid="region-status"]')).toBeVisible();
      await expect(authenticatedPage.locator('[data-testid="utilization-gauge"]')).toBeVisible();
    });

    test('should display allocated hosts list', async ({ authenticatedPage }) => {
      const regionsPage = new RegionsPage(authenticatedPage);
      await regionsPage.goto();

      // Navigate to region details
      await waitForTableLoad(authenticatedPage, '[data-testid="regions-table"]');
      await regionsPage.clickRegion(0);

      // Verify hosts section
      await expect(authenticatedPage.locator('text=/allocated hosts/i')).toBeVisible();
      await expect(authenticatedPage.locator('[data-testid="hosts-list"]')).toBeVisible();
    });

    test('should display comments section', async ({ authenticatedPage }) => {
      const regionsPage = new RegionsPage(authenticatedPage);
      await regionsPage.goto();

      // Navigate to region details
      await waitForTableLoad(authenticatedPage, '[data-testid="regions-table"]');
      await regionsPage.clickRegion(0);

      // Verify comments section
      await expect(authenticatedPage.locator('[data-testid="comments-section"]')).toBeVisible();
    });
  });

  test.describe('Region Update', () => {
    test('should enable edit mode', async ({ authenticatedPage }) => {
      const regionsPage = new RegionsPage(authenticatedPage);
      await regionsPage.goto();

      // Navigate to region details
      await waitForTableLoad(authenticatedPage, '[data-testid="regions-table"]');
      await regionsPage.clickRegion(0);

      // Click edit button
      await authenticatedPage.locator('[data-testid="edit-button"]').click();

      // Verify form is in edit mode
      await expect(authenticatedPage.locator('input[name="region_name"]')).toBeEnabled();
      await expect(authenticatedPage.locator('[data-testid="save-button"]')).toBeVisible();
    });

    test('should update region successfully', async ({ authenticatedPage }) => {
      const regionsPage = new RegionsPage(authenticatedPage);
      await regionsPage.goto();

      // Navigate to region details
      await waitForTableLoad(authenticatedPage, '[data-testid="regions-table"]');
      await regionsPage.clickRegion(0);

      // Enter edit mode
      await authenticatedPage.locator('[data-testid="edit-button"]').click();

      // Update description
      const newDescription = `Updated at ${Date.now()}`;
      await authenticatedPage.locator('textarea[name="description"]').fill(newDescription);

      // Save changes
      const responsePromise = waitForAPIResponse(authenticatedPage, '/api/ipam/regions', 'PATCH');
      await authenticatedPage.locator('[data-testid="save-button"]').click();
      await responsePromise;

      // Verify success toast
      await waitForToast(authenticatedPage, /success|updated/i);

      // Verify updated content
      await expect(authenticatedPage.locator(`text=${newDescription}`)).toBeVisible();
    });

    test('should cancel edit without saving', async ({ authenticatedPage }) => {
      const regionsPage = new RegionsPage(authenticatedPage);
      await regionsPage.goto();

      // Navigate to region details
      await waitForTableLoad(authenticatedPage, '[data-testid="regions-table"]');
      await regionsPage.clickRegion(0);

      // Get original description
      const originalDescription = await authenticatedPage
        .locator('[data-testid="region-description"]')
        .textContent();

      // Enter edit mode and change description
      await authenticatedPage.locator('[data-testid="edit-button"]').click();
      await authenticatedPage.locator('textarea[name="description"]').fill('Changed description');

      // Cancel
      await authenticatedPage.locator('[data-testid="cancel-button"]').click();

      // Verify original description is still shown
      await expect(authenticatedPage.locator('[data-testid="region-description"]')).toContainText(
        originalDescription || ''
      );
    });
  });

  test.describe('Region Retirement', () => {
    test('should show retirement confirmation dialog', async ({ authenticatedPage }) => {
      const regionsPage = new RegionsPage(authenticatedPage);
      await regionsPage.goto();

      // Navigate to region details
      await waitForTableLoad(authenticatedPage, '[data-testid="regions-table"]');
      await regionsPage.clickRegion(0);

      // Click retire button
      await authenticatedPage.locator('[data-testid="retire-button"]').click();

      // Verify confirmation dialog
      await expect(authenticatedPage.locator('[role="dialog"]')).toBeVisible();
      await expect(authenticatedPage.locator('text=/retire.*region/i')).toBeVisible();
      await expect(authenticatedPage.locator('input[name="reason"]')).toBeVisible();
      await expect(authenticatedPage.locator('input[name="cascade"]')).toBeVisible();
    });

    test('should retire region successfully', async ({ authenticatedPage }) => {
      const regionsPage = new RegionsPage(authenticatedPage);
      await regionsPage.goto();

      // Navigate to region details
      await waitForTableLoad(authenticatedPage, '[data-testid="regions-table"]');
      await regionsPage.clickRegion(0);

      // Click retire button
      await authenticatedPage.locator('[data-testid="retire-button"]').click();

      // Fill retirement reason
      await authenticatedPage.locator('input[name="reason"]').fill('E2E test retirement');

      // Confirm retirement
      const responsePromise = waitForAPIResponse(authenticatedPage, '/api/ipam/regions', 'DELETE');
      await authenticatedPage.locator('[data-testid="confirm-retire"]').click();
      await responsePromise;

      // Verify success toast
      await waitForToast(authenticatedPage, /success|retired/i);

      // Verify navigation back to list
      await expect(authenticatedPage).toHaveURL(/\/dashboard\/regions$/);
    });

    test('should cancel retirement', async ({ authenticatedPage }) => {
      const regionsPage = new RegionsPage(authenticatedPage);
      await regionsPage.goto();

      // Navigate to region details
      await waitForTableLoad(authenticatedPage, '[data-testid="regions-table"]');
      await regionsPage.clickRegion(0);

      // Click retire button
      await authenticatedPage.locator('[data-testid="retire-button"]').click();

      // Cancel
      await authenticatedPage.locator('[data-testid="cancel-retire"]').click();

      // Verify dialog is closed
      await expect(authenticatedPage.locator('[role="dialog"]')).not.toBeVisible();

      // Verify still on details page
      await expect(authenticatedPage).toHaveURL(/\/dashboard\/regions\/[^/]+$/);
    });
  });
});
