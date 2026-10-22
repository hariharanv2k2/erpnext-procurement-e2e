import type { Page } from '@playwright/test';
import { ErpFormPage, ErpListPage } from './base.page';
import { PO_FIELDS } from '../selectors/purchase-order.selectors';
import type { PurchaseOrderData } from '../data/types/doctype.types';

export class PurchaseOrderFormPage extends ErpFormPage {
  constructor(page: Page) { super(page, 'purchase-order'); }

  async fillPurchaseOrderForm(data: PurchaseOrderData): Promise<void> {
    await this.setFieldValue(PO_FIELDS.supplier, data.supplier);
    await this.setFieldValue(PO_FIELDS.scheduleDate, data.scheduleDate);
    await this.setChildTableRows(PO_FIELDS.items, this.buildChildRows(data.items));
  }

  async getSupplier() { return this.getFieldValue(PO_FIELDS.supplier); }
  async getGrandTotal() { return this.getFieldValue('grand_total'); }
  async getPercentReceived() { return this.getFieldValue('per_received'); }
  async getPercentBilled() { return this.getFieldValue('per_billed'); }
}

export class PurchaseOrderListPage extends ErpListPage {
  constructor(page: Page) { super(page, 'purchase-order'); }
}
