import { test, expect } from '../../src/fixtures/base.fixture';
import { ItemFormPage, ItemListPage } from '../../src/pages/item.page';
import { createItemData } from '../../src/data/factories/item.factory';

test.describe('Item Master Data', () => {
  let itemForm: ItemFormPage;
  let itemList: ItemListPage;

  test.beforeEach(async ({ page }) => {
    itemForm = new ItemFormPage(page);
    itemList = new ItemListPage(page);
  });

  test('should create a new Item with required fields', async () => {
    const data = createItemData();

    await itemForm.navigateToNew();
    await itemForm.fillItemForm(data);
    await itemForm.save();

    await itemForm.expectSaved();
    const savedCode = await itemForm.getItemCode();
    expect(savedCode).toBe(data.itemCode);
  });

  test('should display created Item in list view', async () => {
    const data = createItemData();

    await itemForm.navigateToNew();
    await itemForm.fillItemForm(data);
    await itemForm.save();
    await itemForm.expectSaved();

    await itemList.navigateToList();
    await itemList.expectDocInList(data.itemCode);
  });

  test('should open Item from list and verify field values', async () => {
    const data = createItemData();

    await itemForm.navigateToNew();
    await itemForm.fillItemForm(data);
    await itemForm.save();
    await itemForm.expectSaved();
    const docName = await itemForm.getDocName();

    await itemForm.navigateToDoc(docName);
    const savedCode = await itemForm.getItemCode();
    const savedGroup = await itemForm.getItemGroup();
    expect(savedCode).toBe(data.itemCode);
    expect(savedGroup).toBe(data.itemGroup);
  });

  test('should show error when saving without item code', async () => {
    await itemForm.navigateToNew();
    await itemForm.trySave();
    await itemForm.expectError();
    await itemForm.closeErrorDialog();
  });
});
