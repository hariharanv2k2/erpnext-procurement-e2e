import type { Page } from '@playwright/test';
import { ErpFormPage } from './base/erp-form.page';
import { ErpListPage } from './base/erp-list.page';
import { RFQ_FIELDS, RFQ_SUPPLIER_FIELDS, RFQ_ITEM_FIELDS } from '../selectors/rfq.selectors';
import type { RFQData } from '../data/types/doctype.types';

export class RFQFormPage extends ErpFormPage {
  constructor(page: Page) {
    super(page, 'Request for Quotation');
  }

  async fillRFQForm(data: RFQData): Promise<void> {
    await this.fillDateField(RFQ_FIELDS.scheduleDate, data.scheduleDate);

    // Set suppliers
    const supplierRows: Record<string, string>[] = [];
    for (const supplierName of data.suppliers) {
      supplierRows.push({ [RFQ_SUPPLIER_FIELDS.supplier]: supplierName });
    }
    await this.setChildTableRows(RFQ_FIELDS.suppliers, supplierRows);

    // Set items
    const itemRows: Record<string, string>[] = [];
    for (const item of data.items) {
      const row: Record<string, string> = {
        [RFQ_ITEM_FIELDS.itemCode]: item.item_code,
        [RFQ_ITEM_FIELDS.qty]: item.qty,
      };
      if (item.schedule_date) {
        row[RFQ_ITEM_FIELDS.scheduleDate] = item.schedule_date;
      }
      itemRows.push(row);
    }
    await this.setChildTableRows(RFQ_FIELDS.items, itemRows);
  }
}

export class RFQListPage extends ErpListPage {
  constructor(page: Page) {
    super(page, 'Request for Quotation');
  }
}
