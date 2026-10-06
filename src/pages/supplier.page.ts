import type { Page } from '@playwright/test';
import { ErpFormPage } from './base/erp-form.page';
import { ErpListPage } from './base/erp-list.page';
import { SUPPLIER_FIELDS } from '../selectors/supplier.selectors';
import type { SupplierData } from '../data/types/doctype.types';

export class SupplierFormPage extends ErpFormPage {
  constructor(page: Page) {
    super(page, 'Supplier');
  }

  async fillSupplierForm(data: SupplierData): Promise<void> {
    await this.fillField(SUPPLIER_FIELDS.supplierName, data.supplierName);
    await this.fillLinkField(SUPPLIER_FIELDS.supplierGroup, data.supplierGroup);
    await this.selectField(SUPPLIER_FIELDS.supplierType, data.supplierType);
    await this.fillLinkField(SUPPLIER_FIELDS.country, data.country);
  }

  async getSupplierName(): Promise<string> {
    return await this.getFieldValue(SUPPLIER_FIELDS.supplierName);
  }

  async getSupplierGroup(): Promise<string> {
    return await this.getFieldValue(SUPPLIER_FIELDS.supplierGroup);
  }

  async getSupplierType(): Promise<string> {
    return await this.getFieldValue(SUPPLIER_FIELDS.supplierType);
  }
}

export class SupplierListPage extends ErpListPage {
  constructor(page: Page) {
    super(page, 'Supplier');
  }
}
