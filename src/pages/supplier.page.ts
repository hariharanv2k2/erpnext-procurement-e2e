import type { Page } from '@playwright/test';
import { ErpFormPage, ErpListPage } from './base.page';
import { SUPPLIER_FIELDS } from '../selectors/supplier.selectors';
import type { SupplierData } from '../data/types/doctype.types';

export class SupplierFormPage extends ErpFormPage {
  constructor(page: Page) { super(page, 'supplier'); }

  async fillSupplierForm(data: SupplierData): Promise<void> {
    await this.fillInputField(SUPPLIER_FIELDS.supplierName, data.supplierName);
    await this.setFieldValue(SUPPLIER_FIELDS.supplierGroup, data.supplierGroup);
    await this.setFieldValue(SUPPLIER_FIELDS.supplierType, data.supplierType);
    await this.setFieldValue(SUPPLIER_FIELDS.country, data.country);
  }

  async getSupplierName() { return this.getFieldValue(SUPPLIER_FIELDS.supplierName); }
  async getSupplierGroup() { return this.getFieldValue(SUPPLIER_FIELDS.supplierGroup); }
  async getSupplierType() { return this.getFieldValue(SUPPLIER_FIELDS.supplierType); }
}

export class SupplierListPage extends ErpListPage {
  constructor(page: Page) { super(page, 'supplier'); }
}
