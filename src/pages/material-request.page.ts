import type { Page } from '@playwright/test';
import { ErpFormPage } from './base/erp-form.page';
import { ErpListPage } from './base/erp-list.page';
import { MR_FIELDS, MR_ITEM_FIELDS } from '../selectors/material-request.selectors';
import type { MaterialRequestData } from '../data/types/doctype.types';

export class MaterialRequestFormPage extends ErpFormPage {
  constructor(page: Page) {
    super(page, 'Material Request');
  }

  async fillMaterialRequestForm(data: MaterialRequestData): Promise<void> {
    await this.selectField(MR_FIELDS.materialRequestType, data.materialRequestType);
    await this.fillDateField(MR_FIELDS.scheduleDate, data.requiredBy);

    const itemRows: Record<string, string>[] = [];
    for (const item of data.items) {
      const row: Record<string, string> = {
        [MR_ITEM_FIELDS.itemCode]: item.item_code,
        [MR_ITEM_FIELDS.qty]: item.qty,
      };
      if (item.schedule_date) {
        row[MR_ITEM_FIELDS.scheduleDate] = item.schedule_date;
      }
      itemRows.push(row);
    }
    await this.setChildTableRows(MR_FIELDS.items, itemRows);
  }

  async getMaterialRequestType(): Promise<string> {
    return await this.getFieldValue(MR_FIELDS.materialRequestType);
  }
}

export class MaterialRequestListPage extends ErpListPage {
  constructor(page: Page) {
    super(page, 'Material Request');
  }
}
