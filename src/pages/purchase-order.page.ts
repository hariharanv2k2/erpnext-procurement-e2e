import type { Page } from '@playwright/test';
import { ErpFormPage } from './base/erp-form.page';
import { ErpListPage } from './base/erp-list.page';
import { PO_FIELDS, PO_ITEM_FIELDS } from '../selectors/purchase-order.selectors';
import type { PurchaseOrderData } from '../data/types/doctype.types';

export class PurchaseOrderFormPage extends ErpFormPage {
  constructor(page: Page) {
    super(page, 'Purchase Order');
  }

  async fillPurchaseOrderForm(data: PurchaseOrderData): Promise<void> {
    await this.fillLinkField(PO_FIELDS.supplier, data.supplier);
    await this.fillDateField(PO_FIELDS.scheduleDate, data.scheduleDate);

    const itemRows: Record<string, string>[] = [];
    for (const item of data.items) {
      const row: Record<string, string> = {
        [PO_ITEM_FIELDS.itemCode]: item.item_code,
        [PO_ITEM_FIELDS.qty]: item.qty,
      };
      if (item.rate) {
        row[PO_ITEM_FIELDS.rate] = item.rate;
      }
      if (item.schedule_date) {
        row[PO_ITEM_FIELDS.scheduleDate] = item.schedule_date;
      }
      itemRows.push(row);
    }
    await this.setChildTableRows(PO_FIELDS.items, itemRows);
  }

  async getSupplier(): Promise<string> {
    return await this.getFieldValue(PO_FIELDS.supplier);
  }

  async getGrandTotal(): Promise<string> {
    return await this.getFieldValue('grand_total');
  }

  async getPercentReceived(): Promise<string> {
    return await this.getFieldValue('per_received');
  }

  async getPercentBilled(): Promise<string> {
    return await this.getFieldValue('per_billed');
  }
}

export class PurchaseOrderListPage extends ErpListPage {
  constructor(page: Page) {
    super(page, 'Purchase Order');
  }
}
