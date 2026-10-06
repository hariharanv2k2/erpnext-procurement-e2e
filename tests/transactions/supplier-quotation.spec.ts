import { test, expect } from '../../src/fixtures/base.fixture';
import { SupplierQuotationFormPage, SupplierQuotationListPage } from '../../src/pages/supplier-quotation.page';
import { SupplierFormPage } from '../../src/pages/supplier.page';
import { ItemFormPage } from '../../src/pages/item.page';
import { createSupplierData } from '../../src/data/factories/supplier.factory';
import { createItemData } from '../../src/data/factories/item.factory';
import { createSupplierQuotationData } from '../../src/data/factories/supplier-quotation.factory';

test.describe('Supplier Quotation', () => {
  let sqForm: SupplierQuotationFormPage;
  let sqList: SupplierQuotationListPage;
  let testSupplierName: string;
  let testItemCode: string;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();

    const supplierForm = new SupplierFormPage(page);
    const supplierData = createSupplierData();
    testSupplierName = supplierData.supplierName;
    await supplierForm.navigateToNew();
    await supplierForm.fillSupplierForm(supplierData);
    await supplierForm.save();

    const itemForm = new ItemFormPage(page);
    const itemData = createItemData();
    testItemCode = itemData.itemCode;
    await itemForm.navigateToNew();
    await itemForm.fillItemForm(itemData);
    await itemForm.save();

    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    sqForm = new SupplierQuotationFormPage(page);
    sqList = new SupplierQuotationListPage(page);
  });

  test('should create a Supplier Quotation and save as Draft', async () => {
    const data = createSupplierQuotationData(testSupplierName, [testItemCode]);

    await sqForm.navigateToNew();
    await sqForm.fillSupplierQuotationForm(data);
    await sqForm.save();

    await sqForm.expectSaved();
    const supplier = await sqForm.getSupplier();
    expect(supplier).toBe(testSupplierName);
  });

  test('should submit a Supplier Quotation', async () => {
    const data = createSupplierQuotationData(testSupplierName, [testItemCode]);

    await sqForm.navigateToNew();
    await sqForm.fillSupplierQuotationForm(data);
    await sqForm.save();
    await sqForm.expectSaved();

    await sqForm.submit();
    await sqForm.expectSubmitted();
  });

  test('should display Supplier Quotation in list view', async () => {
    const data = createSupplierQuotationData(testSupplierName, [testItemCode]);

    await sqForm.navigateToNew();
    await sqForm.fillSupplierQuotationForm(data);
    await sqForm.save();
    await sqForm.expectSaved();
    const docName = await sqForm.getDocName();

    await sqList.navigateToList();
    await sqList.expectDocInList(docName);
  });

  test('should show error when saving without supplier', async () => {
    await sqForm.navigateToNew();
    await sqForm.trySave();
    await sqForm.expectError();
    await sqForm.closeErrorDialog();
  });
});
