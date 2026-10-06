import { test, expect } from '../../src/fixtures/base.fixture';
import { PurchaseInvoiceFormPage, PurchaseInvoiceListPage } from '../../src/pages/purchase-invoice.page';
import { PurchaseOrderFormPage } from '../../src/pages/purchase-order.page';
import { SupplierFormPage } from '../../src/pages/supplier.page';
import { ItemFormPage } from '../../src/pages/item.page';
import { createSupplierData } from '../../src/data/factories/supplier.factory';
import { createItemData } from '../../src/data/factories/item.factory';
import { createPurchaseInvoiceData } from '../../src/data/factories/purchase-invoice.factory';
import { createPurchaseOrderData } from '../../src/data/factories/purchase-order.factory';

test.describe('Purchase Invoice', () => {
  let piForm: PurchaseInvoiceFormPage;
  let piList: PurchaseInvoiceListPage;
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
    piForm = new PurchaseInvoiceFormPage(page);
    piList = new PurchaseInvoiceListPage(page);
  });

  test('should create a Purchase Invoice and save as Draft', async () => {
    const data = createPurchaseInvoiceData(testSupplierName, [testItemCode]);

    await piForm.navigateToNew();
    await piForm.fillPurchaseInvoiceForm(data);
    await piForm.save();

    await piForm.expectSaved();
    const supplier = await piForm.getSupplier();
    expect(supplier).toBe(testSupplierName);
  });

  test('should submit a Purchase Invoice', async () => {
    const data = createPurchaseInvoiceData(testSupplierName, [testItemCode]);

    await piForm.navigateToNew();
    await piForm.fillPurchaseInvoiceForm(data);
    await piForm.save();
    await piForm.expectSaved();

    await piForm.submit();
    await piForm.expectSubmitted();
  });

  test('should verify grand total is calculated correctly', async () => {
    const rate = 500;
    const qty = 4;
    const data = createPurchaseInvoiceData(testSupplierName, [testItemCode], {
      items: [{
        item_code: testItemCode,
        qty: String(qty),
        rate: String(rate),
      }],
    });

    await piForm.navigateToNew();
    await piForm.fillPurchaseInvoiceForm(data);
    await piForm.save();
    await piForm.expectSaved();

    const grandTotal = await piForm.getGrandTotal();
    expect(parseFloat(grandTotal)).toBe(rate * qty);
  });

  test('should create Purchase Invoice from submitted Purchase Order', async ({ page }) => {
    const poForm = new PurchaseOrderFormPage(page);
    const poData = createPurchaseOrderData(testSupplierName, [testItemCode]);

    await poForm.navigateToNew();
    await poForm.fillPurchaseOrderForm(poData);
    await poForm.save();
    await poForm.expectSaved();
    await poForm.submit();
    await poForm.expectSubmitted();

    await poForm.clickCreateButton('Purchase Invoice');

    const supplier = await piForm.getSupplier();
    expect(supplier).toBe(testSupplierName);

    await piForm.save();
    await piForm.expectSaved();

    await piForm.submit();
    await piForm.expectSubmitted();
  });

  test('should display Purchase Invoice in list view', async () => {
    const data = createPurchaseInvoiceData(testSupplierName, [testItemCode]);

    await piForm.navigateToNew();
    await piForm.fillPurchaseInvoiceForm(data);
    await piForm.save();
    await piForm.expectSaved();
    const docName = await piForm.getDocName();

    await piList.navigateToList();
    await piList.expectDocInList(docName);
  });

  test('should cancel a submitted Purchase Invoice', async () => {
    const data = createPurchaseInvoiceData(testSupplierName, [testItemCode]);

    await piForm.navigateToNew();
    await piForm.fillPurchaseInvoiceForm(data);
    await piForm.save();
    await piForm.expectSaved();

    await piForm.submit();
    await piForm.expectSubmitted();

    await piForm.cancel();
    await piForm.expectCancelled();
  });

  test('should show error when saving without supplier', async () => {
    await piForm.navigateToNew();
    await piForm.trySave();
    await piForm.expectError();
    await piForm.closeErrorDialog();
  });
});
