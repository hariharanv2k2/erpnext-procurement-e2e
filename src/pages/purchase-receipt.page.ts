import type { Page } from '@playwright/test';
import { ErpFormPage, ErpListPage } from './base.page';
import { PR_FIELDS } from '../selectors/purchase-receipt.selectors';
import type { PurchaseReceiptData } from '../data/types/doctype.types';

export class PurchaseReceiptFormPage extends ErpFormPage {
  constructor(page: Page) { super(page, 'purchase-receipt'); }

  async fillPurchaseReceiptForm(data: PurchaseReceiptData): Promise<void> {
    await this.setFieldValue(PR_FIELDS.supplier, data.supplier);
    await this.setChildTableRows(PR_FIELDS.items, this.buildChildRows(data.items));
  }

  async getSupplier() { return this.getFieldValue(PR_FIELDS.supplier); }
  async getGrandTotal() { return this.getFieldValue('grand_total'); }
  async getPercentBilled() { return this.getFieldValue('per_billed'); }
}

export class PurchaseReceiptListPage extends ErpListPage {
  constructor(page: Page) { super(page, 'purchase-receipt'); }
}
