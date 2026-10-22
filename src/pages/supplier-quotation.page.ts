import type { Page } from '@playwright/test';
import { ErpFormPage, ErpListPage } from './base.page';
import { SQ_FIELDS } from '../selectors/supplier-quotation.selectors';
import type { SupplierQuotationData } from '../data/types/doctype.types';

export class SupplierQuotationFormPage extends ErpFormPage {
  constructor(page: Page) { super(page, 'supplier-quotation'); }

  async fillSupplierQuotationForm(data: SupplierQuotationData): Promise<void> {
    await this.setFieldValue(SQ_FIELDS.supplier, data.supplier);
    await this.setChildTableRows(SQ_FIELDS.items, this.buildChildRows(data.items));
  }

  async getSupplier() { return this.getFieldValue(SQ_FIELDS.supplier); }
}

export class SupplierQuotationListPage extends ErpListPage {
  constructor(page: Page) { super(page, 'supplier-quotation'); }
}
