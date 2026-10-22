import type { Page } from '@playwright/test';
import { ErpFormPage, ErpListPage } from './base.page';
import { PI_FIELDS } from '../selectors/purchase-invoice.selectors';
import type { PurchaseInvoiceData } from '../data/types/doctype.types';

export class PurchaseInvoiceFormPage extends ErpFormPage {
  constructor(page: Page) { super(page, 'purchase-invoice'); }

  async fillPurchaseInvoiceForm(data: PurchaseInvoiceData): Promise<void> {
    await this.setFieldValue(PI_FIELDS.supplier, data.supplier);
    if (data.billNo) await this.fillInputField(PI_FIELDS.billNo, data.billNo);
    if (data.billDate) await this.setFieldValue(PI_FIELDS.billDate, data.billDate);
    await this.setChildTableRows(PI_FIELDS.items, this.buildChildRows(data.items));
  }

  async getSupplier() { return this.getFieldValue(PI_FIELDS.supplier); }
  async getGrandTotal() { return this.getFieldValue('grand_total'); }
  async getOutstandingAmount() { return this.getFieldValue('outstanding_amount'); }
}

export class PurchaseInvoiceListPage extends ErpListPage {
  constructor(page: Page) { super(page, 'purchase-invoice'); }
}
