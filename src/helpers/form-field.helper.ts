import type { Page } from '@playwright/test';
import { FIELD } from '../selectors';

export class FormFieldHelper {
  constructor(private page: Page) {}

  // Shared method — sets any field value via Frappe's cur_frm.set_value API
  private async setFormValue(fieldname: string, value: string | number): Promise<void> {
    await this.page.evaluate(
      ({ fieldname, value }) => {
        const frm = (window as any).cur_frm;
        if (frm) {
          frm.set_value(fieldname, value);
        }
      },
      { fieldname, value }
    );
    await this.page.waitForTimeout(300);
  }

  private fieldContainer(fieldname: string) {
    return this.page.locator(FIELD.container(fieldname)).first();
  }

  async fillField(fieldname: string, value: string): Promise<void> {
    const container = this.fieldContainer(fieldname);
    const input = container.locator(FIELD.inputOrTextarea).first();
    await input.click();
    await input.fill('');
    await input.fill(value);
    await input.press('Tab');
  }

  async fillLinkField(fieldname: string, value: string): Promise<void> {
    await this.setFormValue(fieldname, value);
    await this.page.waitForTimeout(200); // extra wait for link field data fetch
  }

  async selectField(fieldname: string, value: string): Promise<void> {
    await this.setFormValue(fieldname, value);
  }

  async fillCurrencyField(fieldname: string, value: string): Promise<void> {
    await this.setFormValue(fieldname, parseFloat(value));
  }

  async fillDateField(fieldname: string, value: string): Promise<void> {
    await this.setFormValue(fieldname, value);
  }

  async checkField(fieldname: string, checked: boolean = true): Promise<void> {
    await this.setFormValue(fieldname, checked ? 1 : 0);
  }

  async fillTextEditor(fieldname: string, value: string): Promise<void> {
    const container = this.fieldContainer(fieldname);
    const quill = container.locator(FIELD.quillEditor);
    if (await quill.isVisible().catch(() => false)) {
      await quill.click();
      await quill.fill(value);
    } else {
      const textarea = container.locator('textarea').first();
      await textarea.click();
      await textarea.fill(value);
    }
  }

  async getFieldValue(fieldname: string): Promise<string> {
    return await this.page.evaluate((fieldname) => {
      const frm = (window as any).cur_frm;
      if (frm) {
        return String(frm.doc[fieldname] ?? '');
      }
      return '';
    }, fieldname);
  }

  async clearChildTable(tablename: string): Promise<void> {
    await this.page.evaluate((tablename) => {
      const frm = (window as any).cur_frm;
      if (frm) {
        frm.doc[tablename] = [];
        frm.refresh_field(tablename);
      }
    }, tablename);
    await this.page.waitForTimeout(300);
  }

  async addChildTableRow(tablename: string, rowData: Record<string, string>): Promise<void> {
    await this.page.evaluate(
      ({ tablename, rowData }) => {
        const frm = (window as any).cur_frm;
        if (frm) {
          const row = frm.add_child(tablename);
          for (const [key, val] of Object.entries(rowData)) {
            (window as any).frappe.model.set_value(row.doctype, row.name, key, val);
          }
          frm.refresh_field(tablename);
        }
      },
      { tablename, rowData }
    );
    await this.page.waitForTimeout(500);
  }

  async setChildTableRows(tablename: string, rows: Record<string, string>[]): Promise<void> {
    // Clear existing rows, add new ones, then set values via frappe.model.set_value
    // to trigger Frappe's change handlers (recalculation of rate, amount, totals)
    await this.page.evaluate(
      async ({ tablename, rows }) => {
        const frm = (window as any).cur_frm;
        const frappe = (window as any).frappe;
        if (frm) {
          frm.doc[tablename] = [];
          const addedRows = [];
          for (const rowData of rows) {
            const row = frm.add_child(tablename);
            addedRows.push({ row, data: rowData });
          }
          frm.refresh_field(tablename);

          // Use frappe.model.set_value for each field to trigger change handlers
          for (const { row, data } of addedRows) {
            for (const [key, val] of Object.entries(data)) {
              await frappe.model.set_value(row.doctype, row.name, key, val);
            }
          }
          frm.refresh_field(tablename);
          frm.dirty();
        }
      },
      { tablename, rows }
    );
    await this.page.waitForTimeout(1000);
  }

  async fillFieldInRow(tablename: string, fieldname: string, value: string): Promise<void> {
    // Use Frappe API to set value in the last row of a child table
    await this.page.evaluate(
      ({ tablename, fieldname, value }) => {
        const frm = (window as any).cur_frm;
        if (frm) {
          const rows = frm.doc[tablename];
          if (rows && rows.length > 0) {
            const lastRow = rows[rows.length - 1];
            (window as any).frappe.model.set_value(lastRow.doctype, lastRow.name, fieldname, value);
          }
          frm.refresh_field(tablename);
        }
      },
      { tablename, fieldname, value }
    );
    await this.page.waitForTimeout(300);
  }

  async getChildTableRowCount(tablename: string): Promise<number> {
    return await this.page.evaluate((tablename) => {
      const frm = (window as any).cur_frm;
      if (frm && frm.doc[tablename]) {
        return frm.doc[tablename].length;
      }
      return 0;
    }, tablename);
  }
}
