import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { FrappeUIHelper } from '../../helpers/frappe-ui.helper';
import { FormFieldHelper } from '../../helpers/form-field.helper';
import { BUTTON, TITLE } from '../../selectors';

export class ErpFormPage {
  protected frappeUI: FrappeUIHelper;
  protected fields: FormFieldHelper;

  constructor(
    protected page: Page,
    protected doctype: string,
  ) {
    this.frappeUI = new FrappeUIHelper(page);
    this.fields = new FormFieldHelper(page);
  }

  protected get slug(): string {
    return this.doctype.toLowerCase().replace(/ /g, '-');
  }

  // --- Navigation ---

  async navigateToNew(): Promise<void> {
    await this.page.goto(`/app/${this.slug}/new`);
    await this.frappeUI.waitForFormLoad();
  }

  async navigateToList(): Promise<void> {
    await this.page.goto(`/app/${this.slug}`);
    await this.frappeUI.waitForPageLoad();
  }

  async navigateToDoc(name: string): Promise<void> {
    await this.page.goto(`/app/${this.slug}/${encodeURIComponent(name)}`);
    await this.frappeUI.waitForFormLoad();
  }

  // --- Field interactions (delegated to FormFieldHelper) ---

  async fillField(fieldname: string, value: string): Promise<void> {
    await this.fields.fillField(fieldname, value);
  }

  async fillLinkField(fieldname: string, value: string): Promise<void> {
    await this.fields.fillLinkField(fieldname, value);
  }

  async selectField(fieldname: string, value: string): Promise<void> {
    await this.fields.selectField(fieldname, value);
  }

  async fillCurrencyField(fieldname: string, value: string): Promise<void> {
    await this.fields.fillCurrencyField(fieldname, value);
  }

  async fillDateField(fieldname: string, value: string): Promise<void> {
    await this.fields.fillDateField(fieldname, value);
  }

  async checkField(fieldname: string, checked: boolean = true): Promise<void> {
    await this.fields.checkField(fieldname, checked);
  }

  async getFieldValue(fieldname: string): Promise<string> {
    return await this.fields.getFieldValue(fieldname);
  }

  async addChildTableRow(tablename: string, rowData: Record<string, string>): Promise<void> {
    await this.fields.addChildTableRow(tablename, rowData);
  }

  async setChildTableRows(tablename: string, rows: Record<string, string>[]): Promise<void> {
    await this.fields.setChildTableRows(tablename, rows);
  }

  async clearChildTable(tablename: string): Promise<void> {
    await this.fields.clearChildTable(tablename);
  }

  // --- Workflow Actions ---

  async save(): Promise<void> {
    await this.frappeUI.dismissOverlays();
    await this.page.keyboard.press('Control+s');
    await this.frappeUI.waitForSaveComplete();
    await this.page.waitForTimeout(500);
  }

  async trySave(): Promise<void> {
    // Trigger save without waiting for completion — used for validation tests
    await this.page.keyboard.press('Control+s');
    await this.page.waitForTimeout(1000);
  }

  async submit(): Promise<void> {
    await this.frappeUI.dismissOverlays();
    const submitBtn = this.page.locator(BUTTON.submit).first();
    await submitBtn.click();
    await this.frappeUI.confirmDialog();
    await this.frappeUI.waitForSubmitComplete();
    await this.page.waitForTimeout(500);
  }

  async amend(): Promise<void> {
    await this.page.locator(BUTTON.amend).first().click();
    // Amend may or may not show a confirm dialog depending on version
    await this.page.waitForTimeout(500);
    await this.frappeUI.dismissDialog();
    await this.frappeUI.waitForFormLoad();
  }

  async cancel(): Promise<void> {
    await this.page.locator(BUTTON.cancel).first().click();
    await this.frappeUI.confirmDialog();
    await this.page.waitForTimeout(1000);
  }

  async closeDoc(): Promise<void> {
    await this.page.locator(BUTTON.close).first().click();
    await this.frappeUI.confirmDialog();
    await this.page.waitForTimeout(1000);
  }

  // --- Assertions ---

  async expectIndicator(color: 'blue' | 'green' | 'red' | 'orange'): Promise<void> {
    await this.frappeUI.expectIndicator(color);
  }

  async expectIndicatorText(text: string): Promise<void> {
    await this.frappeUI.expectIndicatorText(text);
  }

  async expectSaved(): Promise<void> {
    const url = this.page.url();
    expect(url).not.toContain('/new');
  }

  async expectSubmitted(): Promise<void> {
    await this.frappeUI.expectDocStatus(1);
  }

  async expectCancelled(): Promise<void> {
    await this.frappeUI.expectDocStatus(2);
  }

  async expectError(): Promise<void> {
    await this.frappeUI.expectErrorMessage();
  }

  async closeErrorDialog(): Promise<void> {
    await this.frappeUI.closeErrorDialog();
  }

  // --- Utility ---

  async getDocName(): Promise<string> {
    const url = this.page.url();
    const parts = url.split('/');
    return decodeURIComponent(parts[parts.length - 1] ?? '');
  }

  async getDocNameFromBreadcrumb(): Promise<string> {
    const title = this.page.locator(TITLE.text).first();
    return await title.textContent() ?? '';
  }

  async clickCreateButton(doctype: string): Promise<void> {
    const createBtn = this.page.locator(BUTTON.create).first();
    await createBtn.click();
    await this.page.waitForTimeout(300);
    await this.page.locator(BUTTON.dropdownItem(doctype)).first().click();
    await this.frappeUI.waitForFormLoad();
  }
}
