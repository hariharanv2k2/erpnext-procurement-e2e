import type { Page } from '@playwright/test';
import { ErpFormPage } from './base/erp-form.page';
import { ErpListPage } from './base/erp-list.page';
import { PR_FIELDS, PR_ITEM_FIELDS } from '../selectors/purchase-receipt.selectors';
import type { PurchaseReceiptData } from '../data/types/doctype.types';

export class PurchaseReceiptFormPage extends ErpFormPage {
  constructor(page: Page) {
    super(page, 'Purchase Receipt');
  }

  async fillPurchaseReceiptForm(data: PurchaseReceiptData): Promise<void> {
    await this.fillLinkField(PR_FIELDS.supplier, data.supplier);

    const itemRows: Record<string, string>[] = [];
    for (const item of data.items) {
      const row: Record<string, string> = {
        [PR_ITEM_FIELDS.itemCode]: item.item_code,
        [PR_ITEM_FIELDS.qty]: item.qty,
      };
      if (item.rate) {
        row[PR_ITEM_FIELDS.rate] = item.rate;
      }
      if (item.warehouse) {
        row[PR_ITEM_FIELDS.warehouse] = item.warehouse;
      }
      itemRows.push(row);
    }
    await this.setChildTableRows(PR_FIELDS.items, itemRows);
  }

  async getSupplier(): Promise<string> {
    return await this.getFieldValue(PR_FIELDS.supplier);
  }

  async getGrandTotal(): Promise<string> {
    return await this.getFieldValue('grand_total');
  }

  async getPercentBilled(): Promise<string> {
    return await this.getFieldValue('per_billed');
  }
}

export class PurchaseReceiptListPage extends ErpListPage {
  constructor(page: Page) {
    super(page, 'Purchase Receipt');
  }
}
