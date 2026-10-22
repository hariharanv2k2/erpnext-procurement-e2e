import type { Page } from '@playwright/test';
import { ErpFormPage, ErpListPage } from './base.page';
import { MR_FIELDS } from '../selectors/material-request.selectors';
import type { MaterialRequestData } from '../data/types/doctype.types';

export class MaterialRequestFormPage extends ErpFormPage {
  constructor(page: Page) { super(page, 'material-request'); }

  async fillMaterialRequestForm(data: MaterialRequestData): Promise<void> {
    await this.setFieldValue(MR_FIELDS.materialRequestType, data.materialRequestType);
    await this.setFieldValue(MR_FIELDS.scheduleDate, data.requiredBy);
    await this.setChildTableRows(MR_FIELDS.items, this.buildChildRows(data.items));
  }

  async getMaterialRequestType() { return this.getFieldValue(MR_FIELDS.materialRequestType); }
}

export class MaterialRequestListPage extends ErpListPage {
  constructor(page: Page) { super(page, 'material-request'); }
}
