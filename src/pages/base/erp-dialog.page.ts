import type { Page } from '@playwright/test';
import { DIALOG } from '../../selectors';

export class ErpDialogPage {
  constructor(private page: Page) {}

  async waitForDialog(): Promise<void> {
    await this.page.locator(DIALOG.visible).waitFor({ state: 'visible', timeout: 10000 });
  }

  async clickPrimary(): Promise<void> {
    const dialog = this.page.locator(DIALOG.visible);
    await dialog.locator(DIALOG.primaryBtn).first().click();
    await dialog.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }

  async clickSecondary(): Promise<void> {
    const dialog = this.page.locator(DIALOG.visible);
    await dialog.locator(DIALOG.secondaryBtn).first().click();
    await dialog.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }

  async close(): Promise<void> {
    const dialog = this.page.locator(DIALOG.visible);
    const closeBtn = dialog.locator(DIALOG.closeBtn).first();
    await closeBtn.click();
    await dialog.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }

  async isVisible(): Promise<boolean> {
    return await this.page.locator(DIALOG.visible).isVisible().catch(() => false);
  }

  async fillDialogField(fieldname: string, value: string): Promise<void> {
    const dialog = this.page.locator(DIALOG.visible);
    const input = dialog.locator(DIALOG.fieldInput(fieldname)).first();
    await input.fill(value);
  }

  async selectDialogOption(fieldname: string, value: string): Promise<void> {
    const dialog = this.page.locator(DIALOG.visible);
    const select = dialog.locator(DIALOG.fieldSelect(fieldname)).first();
    await select.selectOption(value);
  }
}
