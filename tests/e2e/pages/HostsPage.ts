import type { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Hosts Page
 */
export class HostsPage {
  readonly page: Page;
  readonly allocateButton: Locator;
  readonly batchAllocateButton: Locator;
  readonly searchInput: Locator;
  readonly hostsTable: Locator;
  readonly hostRows: Locator;
  readonly filterDropdown: Locator;
  readonly bulkSelectCheckbox: Locator;
  readonly bulkActionsToolbar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.allocateButton = page.locator('[data-testid="allocate-host-button"]');
    this.batchAllocateButton = page.locator('[data-testid="batch-allocate-button"]');
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.hostsTable = page.locator('[data-testid="hosts-table"]');
    this.hostRows = page.locator('[data-testid="host-row"]');
    this.filterDropdown = page.locator('[data-testid="filter-dropdown"]');
    this.bulkSelectCheckbox = page.locator('[data-testid="bulk-select-checkbox"]');
    this.bulkActionsToolbar = page.locator('[data-testid="bulk-actions-toolbar"]');
  }

  async goto() {
    await this.page.goto('/dashboard/hosts');
  }

  async clickAllocate() {
    await this.allocateButton.click();
  }

  async clickBatchAllocate() {
    await this.batchAllocateButton.click();
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async getHostCount() {
    return await this.hostRows.count();
  }

  async clickHost(index: number) {
    await this.hostRows.nth(index).click();
  }

  async selectAllHosts() {
    await this.bulkSelectCheckbox.click();
  }

  async isBulkActionsVisible() {
    return await this.bulkActionsToolbar.isVisible();
  }
}
