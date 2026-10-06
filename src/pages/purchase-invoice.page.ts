import type { Page } from '@playwright/test';
import { ErpFormPage } from './base/erp-form.page';
import { ErpListPage } from './base/erp-list.page';
import { PI_FIELDS, PI_ITEM_FIELDS } from '../selectors/purchase-invoice.selectors';
import type { PurchaseInvoiceData } from '../data/types/doctype.types';

export class PurchaseInvoiceFormPage extends ErpFormPage {
  constructor(page: Page) {
    super(page, 'Purchase Invoice');
  }

  async fillPurchaseInvoiceForm(data: PurchaseInvoiceData): Promise<void> {
    await this.fillLinkField(PI_FIELDS.supplier, data.supplier);

    if (data.billNo) {
      await this.fillField(PI_FIELDS.billNo, data.billNo);
    }
    if (data.billDate) {
      await this.fillDateField(PI_FIELDS.billDate, data.billDate);
    }

    const itemRows: Record<string, string>[] = [];
    for (const item of data.items) {
      const row: Record<string, string> = {
        [PI_ITEM_FIELDS.itemCode]: item.item_code,
        [PI_ITEM_FIELDS.qty]: item.qty,
      };
      if (item.rate) {
        row[PI_ITEM_FIELDS.rate] = item.rate;
      }
      if (item.warehouse) {
        row[PI_ITEM_FIELDS.warehouse] = item.warehouse;
      }
      itemRows.push(row);
    }
    await this.setChildTableRows(PI_FIELDS.items, itemRows);
  }

  async getSupplier(): Promise<string> {
    return await this.getFieldValue(PI_FIELDS.supplier);
  }

  async getGrandTotal(): Promise<string> {
    return await this.getFieldValue('grand_total');
  }

  async getOutstandingAmount(): Promise<string> {
    return await this.getFieldValue('outstanding_amount');
  }
}

export class PurchaseInvoiceListPage extends ErpListPage {
  constructor(page: Page) {
    super(page, 'Purchase Invoice');
  }
}
