import type { Page } from '@playwright/test';
import { ErpFormPage } from './base/erp-form.page';
import { ErpListPage } from './base/erp-list.page';
import { SQ_FIELDS, SQ_ITEM_FIELDS } from '../selectors/supplier-quotation.selectors';
import type { SupplierQuotationData } from '../data/types/doctype.types';

export class SupplierQuotationFormPage extends ErpFormPage {
  constructor(page: Page) {
    super(page, 'Supplier Quotation');
  }

  async fillSupplierQuotationForm(data: SupplierQuotationData): Promise<void> {
    await this.fillLinkField(SQ_FIELDS.supplier, data.supplier);

    const itemRows: Record<string, string>[] = [];
    for (const item of data.items) {
      const row: Record<string, string> = {
        [SQ_ITEM_FIELDS.itemCode]: item.item_code,
        [SQ_ITEM_FIELDS.qty]: item.qty,
      };
      if (item.rate) {
        row[SQ_ITEM_FIELDS.rate] = item.rate;
      }
      itemRows.push(row);
    }
    await this.setChildTableRows(SQ_FIELDS.items, itemRows);
  }

  async getSupplier(): Promise<string> {
    return await this.getFieldValue(SQ_FIELDS.supplier);
  }
}

export class SupplierQuotationListPage extends ErpListPage {
  constructor(page: Page) {
    super(page, 'Supplier Quotation');
  }
}
