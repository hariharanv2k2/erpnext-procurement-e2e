import { test, expect } from '../../src/fixtures/base.fixture';
import { RFQFormPage, RFQListPage } from '../../src/pages/request-for-quotation.page';
import { SupplierFormPage } from '../../src/pages/supplier.page';
import { ItemFormPage } from '../../src/pages/item.page';
import { createSupplierData } from '../../src/data/factories/supplier.factory';
import { createItemData } from '../../src/data/factories/item.factory';
import { createRFQData } from '../../src/data/factories/rfq.factory';

test.describe('Request for Quotation', () => {
  let rfqForm: RFQFormPage;
  let rfqList: RFQListPage;
  let testSupplierName: string;
  let testItemCode: string;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();

    // Create test supplier
    const supplierForm = new SupplierFormPage(page);
    const supplierData = createSupplierData();
    testSupplierName = supplierData.supplierName;
    await supplierForm.navigateToNew();
    await supplierForm.fillSupplierForm(supplierData);
    await supplierForm.save();

    // Create test item
    const itemForm = new ItemFormPage(page);
    const itemData = createItemData();
    testItemCode = itemData.itemCode;
    await itemForm.navigateToNew();
    await itemForm.fillItemForm(itemData);
    await itemForm.save();

    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    rfqForm = new RFQFormPage(page);
    rfqList = new RFQListPage(page);
  });

  test('should create an RFQ with supplier and items and save as Draft', async () => {
    const data = createRFQData([testSupplierName], [testItemCode]);

    await rfqForm.navigateToNew();
    await rfqForm.fillRFQForm(data);
    await rfqForm.save();

    await rfqForm.expectSaved();
  });

  test('should submit an RFQ', async () => {
    const data = createRFQData([testSupplierName], [testItemCode]);

    await rfqForm.navigateToNew();
    await rfqForm.fillRFQForm(data);
    await rfqForm.save();
    await rfqForm.expectSaved();

    await rfqForm.submit();
    await rfqForm.expectSubmitted();
  });

  test('should display RFQ in list view', async () => {
    const data = createRFQData([testSupplierName], [testItemCode]);

    await rfqForm.navigateToNew();
    await rfqForm.fillRFQForm(data);
    await rfqForm.save();
    await rfqForm.expectSaved();
    const docName = await rfqForm.getDocName();

    await rfqList.navigateToList();
    await rfqList.expectDocInList(docName);
  });

  test('should show error when saving without suppliers', async () => {
    await rfqForm.navigateToNew();
    await rfqForm.trySave();
    await rfqForm.expectError();
    await rfqForm.closeErrorDialog();
  });
});
