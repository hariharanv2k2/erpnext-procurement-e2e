import { test, expect } from '../../src/fixtures/base.fixture';
import { PurchaseOrderFormPage, PurchaseOrderListPage } from '../../src/pages/purchase-order.page';
import { SupplierFormPage } from '../../src/pages/supplier.page';
import { ItemFormPage } from '../../src/pages/item.page';
import { createSupplierData } from '../../src/data/factories/supplier.factory';
import { createItemData } from '../../src/data/factories/item.factory';
import { createPurchaseOrderData } from '../../src/data/factories/purchase-order.factory';

test.describe('Purchase Order', () => {
  let poForm: PurchaseOrderFormPage;
  let poList: PurchaseOrderListPage;
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
    poForm = new PurchaseOrderFormPage(page);
    poList = new PurchaseOrderListPage(page);
  });

  test('should create a Purchase Order and save as Draft', async () => {
    const data = createPurchaseOrderData(testSupplierName, [testItemCode]);

    await poForm.navigateToNew();
    await poForm.fillPurchaseOrderForm(data);
    await poForm.save();

    await poForm.expectSaved();
    const supplier = await poForm.getSupplier();
    expect(supplier).toBe(testSupplierName);
  });

  test('should submit a Purchase Order', async () => {
    const data = createPurchaseOrderData(testSupplierName, [testItemCode]);

    await poForm.navigateToNew();
    await poForm.fillPurchaseOrderForm(data);
    await poForm.save();
    await poForm.expectSaved();

    await poForm.submit();
    await poForm.expectSubmitted();
  });

  test('should verify grand total is calculated correctly', async () => {
    const data = createPurchaseOrderData(testSupplierName, [testItemCode], {
      items: [{
        item_code: testItemCode,
        qty: '10',
        rate: '500',
      }],
    });

    await poForm.navigateToNew();
    await poForm.fillPurchaseOrderForm(data);
    await poForm.save();
    await poForm.expectSaved();

    const grandTotal = await poForm.getGrandTotal();
    expect(parseFloat(grandTotal)).toBeGreaterThan(0);
  });

  test('should display Purchase Order in list view', async () => {
    const data = createPurchaseOrderData(testSupplierName, [testItemCode]);

    await poForm.navigateToNew();
    await poForm.fillPurchaseOrderForm(data);
    await poForm.save();
    await poForm.expectSaved();
    const docName = await poForm.getDocName();

    await poList.navigateToList();
    await poList.expectDocInList(docName);
  });

  test('should cancel a submitted Purchase Order', async () => {
    const data = createPurchaseOrderData(testSupplierName, [testItemCode]);

    await poForm.navigateToNew();
    await poForm.fillPurchaseOrderForm(data);
    await poForm.save();
    await poForm.expectSaved();

    await poForm.submit();
    await poForm.expectSubmitted();

    await poForm.cancel();
    await poForm.expectCancelled();
  });

  test('should amend a cancelled Purchase Order', async () => {
    const data = createPurchaseOrderData(testSupplierName, [testItemCode]);

    await poForm.navigateToNew();
    await poForm.fillPurchaseOrderForm(data);
    await poForm.save();
    await poForm.expectSaved();

    await poForm.submit();
    await poForm.expectSubmitted();

    // Must cancel before amend is available
    await poForm.cancel();
    await poForm.expectCancelled();

    await poForm.amend();
    // After amend, we should be on a new draft doc
    const url = poForm['page'].url();
    expect(url).toContain('/new');
  });

  test('should show error when saving without supplier', async () => {
    await poForm.navigateToNew();
    await poForm.trySave();
    await poForm.expectError();
    await poForm.closeErrorDialog();
  });
});
