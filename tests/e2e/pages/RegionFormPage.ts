import type { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Region Form (Create/Edit)
 */
export class RegionFormPage {
  readonly page: Page;
  readonly countrySelect: Locator;
  readonly regionNameInput: Locator;
  readonly descriptionInput: Locator;
  readonly ownerInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessages: Locator;
  readonly nextAvailablePreview: Locator;

  constructor(page: Page) {
    this.page = page;
    this.countrySelect = page.locator('[data-testid="country-select"]');
    this.regionNameInput = page.locator('input[name="region_name"]');
    this.descriptionInput = page.locator('textarea[name="description"]');
    this.ownerInput = page.locator('input[name="owner"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.cancelButton = page.locator('[data-testid="cancel-button"]');
    this.errorMessages = page.locator('[role="alert"]');
    this.nextAvailablePreview = page.locator('[data-testid="next-available-preview"]');
  }

  async goto() {
    await this.page.goto('/dashboard/regions/create');
  }

  async selectCountry(country: string) {
    await this.countrySelect.click();
    await this.page.locator(`[data-value="${country}"]`).click();
  }

  async fillForm(data: {
    country: string;
    regionName: string;
    description?: string;
    owner?: string;
  }) {
    await this.selectCountry(data.country);
    await this.regionNameInput.fill(data.regionName);
    
    if (data.description) {
      await this.descriptionInput.fill(data.description);
    }
    
    if (data.owner) {
      await this.ownerInput.fill(data.owner);
    }
  }

  async submit() {
    await this.submitButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async getNextAvailableIP() {
    return await this.nextAvailablePreview.textContent();
  }

  async hasErrors() {
    return (await this.errorMessages.count()) > 0;
  }
}
