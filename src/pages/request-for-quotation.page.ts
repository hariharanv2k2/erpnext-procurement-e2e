import type { Page } from '@playwright/test';
import { ErpFormPage, ErpListPage } from './base.page';
import { RFQ_FIELDS, RFQ_SUPPLIER_FIELDS } from '../selectors/rfq.selectors';
import type { RFQData } from '../data/types/doctype.types';

export class RFQFormPage extends ErpFormPage {
  constructor(page: Page) { super(page, 'request-for-quotation'); }

  async fillRFQForm(data: RFQData): Promise<void> {
    await this.setFieldValue(RFQ_FIELDS.scheduleDate, data.scheduleDate);

    const supplierRows = data.suppliers.map(s => ({ [RFQ_SUPPLIER_FIELDS.supplier]: s }));
    await this.setChildTableRows(RFQ_FIELDS.suppliers, supplierRows);

    await this.setChildTableRows(RFQ_FIELDS.items, this.buildChildRows(data.items));
  }
}

export class RFQListPage extends ErpListPage {
  constructor(page: Page) { super(page, 'request-for-quotation'); }
}
