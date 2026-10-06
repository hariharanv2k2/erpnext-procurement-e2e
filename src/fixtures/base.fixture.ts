import { test as base } from '@playwright/test';
import { ErpFormPage } from '../pages/base/erp-form.page';
import { ErpListPage } from '../pages/base/erp-list.page';
import { ErpDialogPage } from '../pages/base/erp-dialog.page';
import { FormFieldHelper } from '../helpers/form-field.helper';
import { FrappeUIHelper } from '../helpers/frappe-ui.helper';

type Fixtures = {
  formHelper: FormFieldHelper;
  frappeUI: FrappeUIHelper;
  dialog: ErpDialogPage;
};

export const test = base.extend<Fixtures>({
  formHelper: async ({ page }, use) => {
    await use(new FormFieldHelper(page));
  },
  frappeUI: async ({ page }, use) => {
    await use(new FrappeUIHelper(page));
  },
  dialog: async ({ page }, use) => {
    await use(new ErpDialogPage(page));
  },
});

export { expect } from '@playwright/test';
export { ErpFormPage, ErpListPage, ErpDialogPage };
