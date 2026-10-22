import { test, expect } from '../../src/fixtures/base.fixture';
import { PurchaseReceiptFormPage, PurchaseReceiptListPage } from '../../src/pages/purchase-receipt.page';
import { PurchaseOrderFormPage } from '../../src/pages/purchase-order.page';
import { SupplierFormPage } from '../../src/pages/supplier.page';
import { ItemFormPage } from '../../src/pages/item.page';
import { createSupplierData } from '../../src/data/factories/supplier.factory';
import { createItemData } from '../../src/data/factories/item.factory';
import { createPurchaseReceiptData } from '../../src/data/factories/purchase-receipt.factory';
import { createPurchaseOrderData } from '../../src/data/factories/purchase-order.factory';
import { futureDate } from '../../src/data/utils/date.utils';

test.describe('Purchase Receipt', () => {
  let prForm: PurchaseReceiptFormPage;
  let prList: PurchaseReceiptListPage;
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
    prForm = new PurchaseReceiptFormPage(page);
    prList = new PurchaseReceiptListPage(page);
  });

  test('should create a Purchase Receipt and save as Draft', async () => {
    const data = createPurchaseReceiptData(testSupplierName, [testItemCode]);

    await prForm.navigateToNew();
    await prForm.fillPurchaseReceiptForm(data);
    await prForm.save();

    await prForm.expectSaved();
    const supplier = await prForm.getSupplier();
    expect(supplier).toBe(testSupplierName);
  });

  test('should submit a Purchase Receipt', async () => {
    const data = createPurchaseReceiptData(testSupplierName, [testItemCode]);

    await prForm.navigateToNew();
    await prForm.fillPurchaseReceiptForm(data);
    await prForm.save();
    await prForm.expectSaved();

    await prForm.submit();
    await prForm.expectSubmitted();
  });

  test('should create Purchase Receipt from submitted Purchase Order', async ({ page }) => {
    const poForm = new PurchaseOrderFormPage(page);
    const poData = createPurchaseOrderData(testSupplierName, [testItemCode]);

    await poForm.navigateToNew();
    await poForm.fillPurchaseOrderForm(poData);
    await poForm.save();
    await poForm.expectSaved();
    await poForm.submit();
    await poForm.expectSubmitted();

    // Create Purchase Receipt from PO
    await poForm.clickCreateButton('Purchase Receipt');

    // Should be on a new Purchase Receipt form with auto-populated fields
    const supplier = await prForm.getSupplier();
    expect(supplier).toBe(testSupplierName);

    await prForm.save();
    await prForm.expectSaved();

    await prForm.submit();
    await prForm.expectSubmitted();
  });

  test('should update PO received percentage after PR submission', async ({ page }) => {
    const poForm = new PurchaseOrderFormPage(page);
    const poData = createPurchaseOrderData(testSupplierName, [testItemCode], {
      items: [{
        item_code: testItemCode,
        qty: '5',
        rate: '200',
        schedule_date: futureDate(14),
      }],
    });

    await poForm.navigateToNew();
    await poForm.fillPurchaseOrderForm(poData);
    await poForm.save();
    await poForm.expectSaved();
    const poName = await poForm.getDocName();
    await poForm.submit();
    await poForm.expectSubmitted();

    // Create PR from PO
    await poForm.clickCreateButton('Purchase Receipt');
    await prForm.save();
    await prForm.expectSaved();
    await prForm.submit();
    await prForm.expectSubmitted();

    // Navigate back to PO and verify received percentage
    await poForm.navigateToDoc(poName);
    const perReceived = await poForm.getPercentReceived();
    expect(parseFloat(perReceived)).toBe(100);
  });

  test('should display Purchase Receipt in list view', async () => {
    const data = createPurchaseReceiptData(testSupplierName, [testItemCode]);

    await prForm.navigateToNew();
    await prForm.fillPurchaseReceiptForm(data);
    await prForm.save();
    await prForm.expectSaved();
    const docName = await prForm.getDocName();

    await prList.navigateToList();
    await prList.expectDocInList(docName);
  });

  test('should cancel a submitted Purchase Receipt', async () => {
    const data = createPurchaseReceiptData(testSupplierName, [testItemCode]);

    await prForm.navigateToNew();
    await prForm.fillPurchaseReceiptForm(data);
    await prForm.save();
    await prForm.expectSaved();

    await prForm.submit();
    await prForm.expectSubmitted();

    await prForm.cancel();
    await prForm.expectCancelled();
  });

  test('should show error when saving without supplier', async () => {
    await prForm.navigateToNew();
    await prForm.trySave();
    await prForm.expectError();
    await prForm.closeErrorDialog();
  });
});
