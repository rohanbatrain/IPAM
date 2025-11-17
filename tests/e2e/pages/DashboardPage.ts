import type { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Dashboard Page
 */
export class DashboardPage {
  readonly page: Page;
  readonly userMenu: Locator;
  readonly logoutButton: Locator;
  readonly statsWidgets: Locator;
  readonly utilizationChart: Locator;
  readonly recentActivity: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userMenu = page.locator('[data-testid="user-menu"]');
    this.logoutButton = page.locator('[data-testid="logout-button"]');
    this.statsWidgets = page.locator('[data-testid="stats-widget"]');
    this.utilizationChart = page.locator('[data-testid="utilization-chart"]');
    this.recentActivity = page.locator('[data-testid="recent-activity"]');
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async logout() {
    await this.userMenu.click();
    await this.logoutButton.click();
  }

  async getStatsCount() {
    return await this.statsWidgets.count();
  }

  async isChartVisible() {
    return await this.utilizationChart.isVisible();
  }
}
