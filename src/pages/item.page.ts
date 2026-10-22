import type { Page } from '@playwright/test';
import { ErpFormPage, ErpListPage } from './base.page';
import { ITEM_FIELDS } from '../selectors/item.selectors';
import type { ItemData } from '../data/types/doctype.types';

export class ItemFormPage extends ErpFormPage {
  constructor(page: Page) { super(page, 'item'); }

  async fillItemForm(data: ItemData): Promise<void> {
    await this.fillInputField(ITEM_FIELDS.itemCode, data.itemCode);
    await this.setFieldValue(ITEM_FIELDS.itemGroup, data.itemGroup);
    await this.setFieldValue(ITEM_FIELDS.stockUom, data.stockUom);
  }

  async getItemCode() { return this.getFieldValue(ITEM_FIELDS.itemCode); }
  async getItemName() { return this.getFieldValue(ITEM_FIELDS.itemName); }
  async getItemGroup() { return this.getFieldValue(ITEM_FIELDS.itemGroup); }
}

export class ItemListPage extends ErpListPage {
  constructor(page: Page) { super(page, 'item'); }
}
