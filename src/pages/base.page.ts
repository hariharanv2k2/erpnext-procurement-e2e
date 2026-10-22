import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { FIELD, PAGE, DIALOG, MESSAGE, BUTTON, LIST } from '../selectors';
import type { ItemRow } from '../data/types/doctype.types';

// Base class for all ERPNext form pages.
// Handles navigation, save/submit/cancel, overlays, child tables, assertions.
// Specific pages extend this and only add their unique fill/get methods.

export class ErpFormPage {
  constructor(protected page: Page, protected route: string) {}

  // --- Navigation ---

  async navigateToNew(): Promise<void> {
    await this.page.goto(`/app/${this.route}/new`);
    await this.waitForForm();
  }

  async navigateToDoc(name: string): Promise<void> {
    await this.page.goto(`/app/${this.route}/${encodeURIComponent(name)}`);
    await this.waitForForm();
  }

  // --- Field Operations ---

  async setFieldValue(fieldname: string, value: string): Promise<void> {
    await this.page.evaluate(
      ({ f, v }) => (window as any).cur_frm?.set_value(f, v),
      { f: fieldname, v: value },
    );
    await this.page.waitForTimeout(500);
  }

  async getFieldValue(fieldname: string): Promise<string> {
    return this.page.evaluate(
      (f) => String((window as any).cur_frm?.doc[f] ?? ''),
      fieldname,
    );
  }

  async fillInputField(fieldname: string, value: string): Promise<void> {
    const input = this.page.locator(FIELD.container(fieldname))
      .first().locator(FIELD.inputOrTextarea).first();
    await input.click();
    await input.fill('');
    await input.fill(value);
    await input.press('Tab');
  }

  // --- Child Table ---

  async setChildTableRows(tablename: string, rows: Record<string, string>[]): Promise<void> {
    await this.page.evaluate(async ({ tablename, rows }) => {
      const frm = (window as any).cur_frm;
      const frappe = (window as any).frappe;
      if (!frm) return;
      frm.doc[tablename] = [];
      const added: any[] = [];
      for (const rowData of rows) {
        added.push({ row: frm.add_child(tablename), data: rowData });
      }
      frm.refresh_field(tablename);
      for (const { row, data } of added) {
        for (const [key, val] of Object.entries(data)) {
          await frappe.model.set_value(row.doctype, row.name, key, val);
        }
      }
      frm.refresh_field(tablename);
      frm.dirty();
    }, { tablename, rows });
    await this.page.waitForTimeout(1000);
  }

  // Converts ItemRow objects to child table rows, stripping undefined values.
  protected buildChildRows(items: ItemRow[]): Record<string, string>[] {
    return items.map(item =>
      Object.fromEntries(
        Object.entries(item).filter(([, v]) => v !== undefined),
      ) as Record<string, string>,
    );
  }

  // --- Actions ---

  async save(): Promise<void> {
    await this.dismissOverlays();
    await this.page.keyboard.press('Control+s');
    await this.page.waitForFunction(() => {
      const frm = (window as any).cur_frm;
      return frm && !frm.dirty_dialog_shown && !frm.is_dirty();
    }, { timeout: 15000 });
    await this.page.waitForTimeout(500);
  }

  async trySave(): Promise<void> {
    await this.page.keyboard.press('Control+s');
    await this.page.waitForTimeout(1000);
  }

  async submit(): Promise<void> {
    await this.dismissOverlays();
    await this.page.locator(BUTTON.submit).first().click();
    await this.confirmDialog();
    await this.page.waitForFunction(
      () => (window as any).cur_frm?.doc.docstatus === 1,
      { timeout: 15000 },
    );
    await this.page.waitForTimeout(500);
  }

  async cancel(): Promise<void> {
    await this.page.locator(BUTTON.cancel).first().click();
    await this.confirmDialog();
    await this.page.waitForTimeout(1000);
  }

  async amend(): Promise<void> {
    await this.page.locator(BUTTON.amend).first().click();
    await this.page.waitForTimeout(500);
    const dialog = this.page.locator(DIALOG.visible);
    if (await dialog.isVisible().catch(() => false)) {
      const btn = dialog.locator(DIALOG.primaryBtn).first();
      if (await btn.isVisible().catch(() => false)) await btn.click();
      await dialog.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    }
    await this.waitForForm();
  }

  async clickCreateButton(doctype: string): Promise<void> {
    await this.page.locator(BUTTON.create).first().click();
    await this.page.waitForTimeout(300);
    await this.page.locator(BUTTON.dropdownItem(doctype)).first().click();
    await this.waitForForm();
  }

  // --- Assertions ---

  async expectSaved(): Promise<void> {
    expect(this.page.url()).not.toContain('/new');
  }

  async expectSubmitted(): Promise<void> {
    await this.page.waitForFunction(
      () => (window as any).cur_frm?.doc.docstatus === 1,
      { timeout: 15000 },
    );
  }

  async expectCancelled(): Promise<void> {
    await this.page.waitForFunction(
      () => (window as any).cur_frm?.doc.docstatus === 2,
      { timeout: 15000 },
    );
  }

  async expectError(): Promise<void> {
    await expect(this.page.locator(MESSAGE.error).first()).toBeVisible({ timeout: 10000 });
  }

  async closeErrorDialog(): Promise<void> {
    const dialog = this.page.locator(MESSAGE.errorDialog);
    if (await dialog.isVisible().catch(() => false)) {
      const closeBtn = dialog.locator(DIALOG.closeBtn).first();
      if (await closeBtn.isVisible().catch(() => false)) await closeBtn.click();
      await dialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }
  }

  // --- Getters ---

  async getDocName(): Promise<string> {
    const parts = this.page.url().split('/');
    return decodeURIComponent(parts[parts.length - 1] ?? '');
  }

  // --- Internal ---

  protected async waitForForm(): Promise<void> {
    await this.page.waitForFunction(() => {
      const frm = (window as any).cur_frm;
      return frm && frm.doc && frm.fields_dict;
    }, { timeout: 30000 });
    await this.page.waitForTimeout(500);
    await this.dismissOverlays();
  }

  protected async dismissOverlays(): Promise<void> {
    // Close any visible modal dialog
    const modal = this.page.locator(DIALOG.visible);
    if (await modal.isVisible().catch(() => false)) {
      const closeBtn = modal.locator(DIALOG.closeBtn).first();
      if (await closeBtn.isVisible().catch(() => false)) {
        await closeBtn.click();
        await modal.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
      }
    }
    // Permanently hide onboarding / setup wizard overlays via injected CSS
    // (inline style.display gets overwritten by Frappe re-renders, CSS rule persists)
    await this.page.addStyleTag({
      content: `.setup-wizard-dialog, .onboarding-widget-box, .widget.onboarding-widget, .setup-wizard { display: none !important; }`,
    }).catch(() => {});
  }

  protected async confirmDialog(): Promise<void> {
    const dialog = this.page.locator(DIALOG.visible);
    await dialog.waitFor({ state: 'visible', timeout: 10000 });
    await dialog.locator(DIALOG.primaryBtn).first().click();
    await dialog.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }
}

// Base class for all ERPNext list pages.
// Only needs the route slug — navigateToList and expectDocInList are fully generic.

export class ErpListPage {
  constructor(protected page: Page, protected route: string) {}

  async navigateToList(): Promise<void> {
    await this.page.goto(`/app/${this.route}`);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.locator(PAGE.container).first().waitFor({ state: 'visible', timeout: 30000 });
    await this.page.waitForTimeout(500);
  }

  async expectDocInList(name: string): Promise<void> {
    await this.page.goto(`/app/${this.route}?name=%25${encodeURIComponent(name)}%25`);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.locator(PAGE.container).first().waitFor({ state: 'visible', timeout: 30000 });
    await this.page.waitForTimeout(500);
    await expect(this.page.locator(LIST.rowByName(name)).first()).toBeVisible({ timeout: 10000 });
  }
}
