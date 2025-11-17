import type { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Regions Page
 */
export class RegionsPage {
  readonly page: Page;
  readonly createButton: Locator;
  readonly searchInput: Locator;
  readonly regionTable: Locator;
  readonly regionRows: Locator;
  readonly filterDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createButton = page.locator('[data-testid="create-region-button"]');
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.regionTable = page.locator('[data-testid="regions-table"]');
    this.regionRows = page.locator('[data-testid="region-row"]');
    this.filterDropdown = page.locator('[data-testid="filter-dropdown"]');
  }

  async goto() {
    await this.page.goto('/dashboard/regions');
  }

  async clickCreate() {
    await this.createButton.click();
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async getRegionCount() {
    return await this.regionRows.count();
  }

  async clickRegion(index: number) {
    await this.regionRows.nth(index).click();
  }

  async filterByCountry(country: string) {
    await this.filterDropdown.click();
    await this.page.locator(`[data-value="${country}"]`).click();
  }
}
