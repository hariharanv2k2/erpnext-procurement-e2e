import type { Page } from '@playwright/test';
import { ErpFormPage } from './base/erp-form.page';
import { ErpListPage } from './base/erp-list.page';
import { ITEM_FIELDS } from '../selectors/item.selectors';
import type { ItemData } from '../data/types/doctype.types';

export class ItemFormPage extends ErpFormPage {
  constructor(page: Page) {
    super(page, 'Item');
  }

  async fillItemForm(data: ItemData): Promise<void> {
    await this.fillField(ITEM_FIELDS.itemCode, data.itemCode);
    await this.fillLinkField(ITEM_FIELDS.itemGroup, data.itemGroup);
    await this.fillLinkField(ITEM_FIELDS.stockUom, data.stockUom);
  }

  async getItemCode(): Promise<string> {
    return await this.getFieldValue(ITEM_FIELDS.itemCode);
  }

  async getItemName(): Promise<string> {
    return await this.getFieldValue(ITEM_FIELDS.itemName);
  }

  async getItemGroup(): Promise<string> {
    return await this.getFieldValue(ITEM_FIELDS.itemGroup);
  }
}

export class ItemListPage extends ErpListPage {
  constructor(page: Page) {
    super(page, 'Item');
  }
}
