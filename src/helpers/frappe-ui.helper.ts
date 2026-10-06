import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { PAGE, INDICATOR, DIALOG, MESSAGE } from '../selectors';

export class FrappeUIHelper {
  constructor(private page: Page) {}

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.locator(PAGE.container).first().waitFor({ state: 'visible', timeout: 30000 });
    const loader = this.page.locator(PAGE.loader);
    if (await loader.isVisible().catch(() => false)) {
      await loader.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    }
  }

  async waitForFormLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    // Wait for Frappe's cur_frm and its doc to exist (form loaded)
    await this.page.waitForFunction(() => {
      const frm = (window as any).cur_frm;
      return frm && frm.doc && frm.fields_dict;
    }, { timeout: 30000 });
    await this.page.waitForTimeout(500);
  }

  async waitForSaveComplete(): Promise<void> {
    await this.page.waitForFunction(() => {
      const frm = (window as any).cur_frm;
      return frm && !frm.dirty_dialog_shown && !frm.is_dirty();
    }, { timeout: 15000 });
  }

  async waitForSubmitComplete(): Promise<void> {
    await this.page.waitForFunction(() => {
      const frm = (window as any).cur_frm;
      return frm && frm.doc.docstatus === 1;
    }, { timeout: 15000 });
  }

  async expectIndicator(color: 'blue' | 'green' | 'red' | 'orange'): Promise<void> {
    const indicator = this.page.locator(INDICATOR.colored(color)).first();
    await expect(indicator).toBeVisible({ timeout: 10000 });
  }

  async expectIndicatorText(text: string): Promise<void> {
    const indicator = this.page.locator(INDICATOR.pill).first();
    await expect(indicator).toContainText(text, { timeout: 10000 });
  }

  async expectDocStatus(status: 0 | 1 | 2): Promise<void> {
    // 0=Draft, 1=Submitted, 2=Cancelled — most reliable check
    await this.page.waitForFunction((expected) => {
      const frm = (window as any).cur_frm;
      return frm && frm.doc.docstatus === expected;
    }, status, { timeout: 15000 });
  }

  async dismissDialog(): Promise<void> {
    const dialog = this.page.locator(DIALOG.visible);
    if (await dialog.isVisible().catch(() => false)) {
      const primaryBtn = dialog.locator(DIALOG.primaryBtn).first();
      if (await primaryBtn.isVisible().catch(() => false)) {
        await primaryBtn.click();
      }
      await dialog.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    }
  }

  async confirmDialog(): Promise<void> {
    const dialog = this.page.locator(DIALOG.visible);
    await dialog.waitFor({ state: 'visible', timeout: 10000 });
    const yesBtn = dialog.locator(DIALOG.primaryBtn).first();
    await yesBtn.click();
    await dialog.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }

  async expectSuccessToast(): Promise<void> {
    const toast = this.page.locator(MESSAGE.success);
    await toast.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  }

  async expectErrorMessage(): Promise<void> {
    const errorIndicator = this.page.locator(MESSAGE.error);
    await expect(errorIndicator.first()).toBeVisible({ timeout: 10000 });
  }

  async closeErrorDialog(): Promise<void> {
    const dialog = this.page.locator(MESSAGE.errorDialog);
    if (await dialog.isVisible().catch(() => false)) {
      const closeBtn = dialog.locator(DIALOG.closeBtn).first();
      if (await closeBtn.isVisible().catch(() => false)) {
        await closeBtn.click();
      }
      await dialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }
  }

  async dismissOverlays(): Promise<void> {
    // Close any visible modal dialogs (informational popups like "Expense Head Changed")
    const modal = this.page.locator(DIALOG.visible);
    if (await modal.isVisible().catch(() => false)) {
      const closeBtn = modal.locator(DIALOG.closeBtn).first();
      if (await closeBtn.isVisible().catch(() => false)) {
        await closeBtn.click();
        await modal.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
      }
    }
    // Close "Getting Started" setup wizard panel
    await this.page.evaluate(() => {
      // Find and hide any Getting Started / onboarding widget
      const selectors = [
        '.setup-wizard-dialog',
        '.onboarding-widget-box',
        '.widget.onboarding-widget',
        '.setup-wizard',
      ];
      for (const sel of selectors) {
        document.querySelectorAll(sel).forEach((el) => {
          (el as HTMLElement).style.display = 'none';
        });
      }
      // Also find the Getting Started panel by its heading text and hide it
      document.querySelectorAll('.widget').forEach((el) => {
        if (el.textContent?.includes('Getting Started')) {
          (el as HTMLElement).style.display = 'none';
        }
      });
    }).catch(() => {});
  }
}
