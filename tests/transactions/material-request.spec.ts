import { test, expect } from '../../src/fixtures/base.fixture';
import { MaterialRequestFormPage, MaterialRequestListPage } from '../../src/pages/material-request.page';
import { ItemFormPage } from '../../src/pages/item.page';
import { createItemData } from '../../src/data/factories/item.factory';
import { createMaterialRequestData } from '../../src/data/factories/material-request.factory';

test.describe('Material Request', () => {
  let mrForm: MaterialRequestFormPage;
  let mrList: MaterialRequestListPage;
  let itemForm: ItemFormPage;
  let testItemCode: string;

  test.beforeAll(async ({ browser }) => {
    // Create a test item to use across all MR tests
    const page = await browser.newPage();
    itemForm = new ItemFormPage(page);
    const itemData = createItemData();
    testItemCode = itemData.itemCode;

    await itemForm.navigateToNew();
    await itemForm.fillItemForm(itemData);
    await itemForm.save();
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    mrForm = new MaterialRequestFormPage(page);
    mrList = new MaterialRequestListPage(page);
  });

  test('should create a Material Request and save as Draft', async () => {
    const data = createMaterialRequestData([testItemCode]);

    await mrForm.navigateToNew();
    await mrForm.fillMaterialRequestForm(data);
    await mrForm.save();

    await mrForm.expectSaved();
    const mrType = await mrForm.getMaterialRequestType();
    expect(mrType).toBe('Purchase');
  });

  test('should submit a Material Request', async () => {
    const data = createMaterialRequestData([testItemCode]);

    await mrForm.navigateToNew();
    await mrForm.fillMaterialRequestForm(data);
    await mrForm.save();
    await mrForm.expectSaved();

    await mrForm.submit();
    await mrForm.expectSubmitted();
  });

  test('should display Material Request in list view', async () => {
    const data = createMaterialRequestData([testItemCode]);

    await mrForm.navigateToNew();
    await mrForm.fillMaterialRequestForm(data);
    await mrForm.save();
    await mrForm.expectSaved();
    const docName = await mrForm.getDocName();

    await mrList.navigateToList();
    await mrList.expectDocInList(docName);
  });

  test('should cancel a submitted Material Request', async () => {
    const data = createMaterialRequestData([testItemCode]);

    await mrForm.navigateToNew();
    await mrForm.fillMaterialRequestForm(data);
    await mrForm.save();
    await mrForm.expectSaved();

    await mrForm.submit();
    await mrForm.expectSubmitted();

    await mrForm.cancel();
    await mrForm.expectCancelled();
  });

  test('should show error when submitting without items', async () => {
    await mrForm.navigateToNew();
    await mrForm.trySave();
    await mrForm.expectError();
    await mrForm.closeErrorDialog();
  });
});
