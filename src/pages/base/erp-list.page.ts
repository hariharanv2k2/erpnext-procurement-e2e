import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { FrappeUIHelper } from '../../helpers/frappe-ui.helper';
import { LIST } from '../../selectors';

export class ErpListPage {
  protected frappeUI: FrappeUIHelper;

  constructor(
    protected page: Page,
    protected doctype: string,
  ) {
    this.frappeUI = new FrappeUIHelper(page);
  }

  protected get slug(): string {
    return this.doctype.toLowerCase().replace(/ /g, '-');
  }

  async navigateToList(): Promise<void> {
    await this.page.goto(`/app/${this.slug}`);
    await this.frappeUI.waitForPageLoad();
    await this.page.waitForTimeout(500);
  }

  async searchByName(name: string): Promise<void> {
    const searchInput = this.page.locator(LIST.searchInput).first();
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill(name);
      await searchInput.press('Enter');
      await this.page.waitForTimeout(1000);
    } else {
      await this.page.goto(`/app/${this.slug}?name=%25${encodeURIComponent(name)}%25`);
      await this.frappeUI.waitForPageLoad();
    }
  }

  async openFirstResult(): Promise<void> {
    const firstRow = this.page.locator(LIST.firstRowLink).first();
    await firstRow.click();
    await this.frappeUI.waitForFormLoad();
  }

  async openDocByName(name: string): Promise<void> {
    const link = this.page.locator(LIST.rowLink(name)).first();
    await link.click();
    await this.frappeUI.waitForFormLoad();
  }

  async getRowCount(): Promise<number> {
    const rows = this.page.locator(LIST.row);
    return await rows.count();
  }

  async expectDocInList(name: string): Promise<void> {
    // Use URL filter to ensure the doc is found even with pagination
    await this.page.goto(`/app/${this.slug}?name=%25${encodeURIComponent(name)}%25`);
    await this.frappeUI.waitForPageLoad();
    await this.page.waitForTimeout(500);
    const row = this.page.locator(LIST.rowByName(name));
    await expect(row.first()).toBeVisible({ timeout: 10000 });
  }

  async expectEmptyList(): Promise<void> {
    const noResult = this.page.locator(LIST.noResult);
    await expect(noResult.first()).toBeVisible({ timeout: 10000 });
  }
}
