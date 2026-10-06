import { test, expect } from '../../src/fixtures/base.fixture';
import { SupplierFormPage } from '../../src/pages/supplier.page';
import { ItemFormPage } from '../../src/pages/item.page';
import { MaterialRequestFormPage } from '../../src/pages/material-request.page';
import { RFQFormPage } from '../../src/pages/request-for-quotation.page';
import { SupplierQuotationFormPage } from '../../src/pages/supplier-quotation.page';
import { PurchaseOrderFormPage } from '../../src/pages/purchase-order.page';
import { PurchaseReceiptFormPage } from '../../src/pages/purchase-receipt.page';
import { PurchaseInvoiceFormPage } from '../../src/pages/purchase-invoice.page';
import { createSupplierData } from '../../src/data/factories/supplier.factory';
import { createItemData } from '../../src/data/factories/item.factory';
import { createMaterialRequestData } from '../../src/data/factories/material-request.factory';
import { createRFQData } from '../../src/data/factories/rfq.factory';
import { createSupplierQuotationData } from '../../src/data/factories/supplier-quotation.factory';
import { createPurchaseOrderData } from '../../src/data/factories/purchase-order.factory';

test.describe('Procure-to-Pay E2E Flow', () => {
  test.setTimeout(180_000); // 3 minutes — this test covers 8 document types

  test('full procurement cycle: Supplier → Item → MR → RFQ → SQ → PO → PR → PI', async ({ page }) => {
    // ─── Step 1: Create Supplier ───
    const supplierForm = new SupplierFormPage(page);
    const supplierData = createSupplierData();
    const supplierName = supplierData.supplierName;

    await supplierForm.navigateToNew();
    await supplierForm.fillSupplierForm(supplierData);
    await supplierForm.save();
    await supplierForm.expectSaved();

    // ─── Step 2: Create Item ───
    const itemForm = new ItemFormPage(page);
    const itemData = createItemData();
    const itemCode = itemData.itemCode;

    await itemForm.navigateToNew();
    await itemForm.fillItemForm(itemData);
    await itemForm.save();
    await itemForm.expectSaved();

    // ─── Step 3: Create and Submit Material Request ───
    const mrForm = new MaterialRequestFormPage(page);
    const mrData = createMaterialRequestData([itemCode]);

    await mrForm.navigateToNew();
    await mrForm.fillMaterialRequestForm(mrData);
    await mrForm.save();
    await mrForm.expectSaved();
    await mrForm.submit();
    await mrForm.expectSubmitted();

    // ─── Step 4: Create and Submit RFQ ───
    const rfqForm = new RFQFormPage(page);
    const rfqData = createRFQData([supplierName], [itemCode]);

    await rfqForm.navigateToNew();
    await rfqForm.fillRFQForm(rfqData);
    await rfqForm.save();
    await rfqForm.expectSaved();
    await rfqForm.submit();
    await rfqForm.expectSubmitted();

    // ─── Step 5: Create and Submit Supplier Quotation ───
    const sqForm = new SupplierQuotationFormPage(page);
    const sqData = createSupplierQuotationData(supplierName, [itemCode]);

    await sqForm.navigateToNew();
    await sqForm.fillSupplierQuotationForm(sqData);
    await sqForm.save();
    await sqForm.expectSaved();
    await sqForm.submit();
    await sqForm.expectSubmitted();

    // ─── Step 6: Create and Submit Purchase Order ───
    const poForm = new PurchaseOrderFormPage(page);
    const poData = createPurchaseOrderData(supplierName, [itemCode]);

    await poForm.navigateToNew();
    await poForm.fillPurchaseOrderForm(poData);
    await poForm.save();
    await poForm.expectSaved();
    const poName = await poForm.getDocName();
    await poForm.submit();
    await poForm.expectSubmitted();

    // ─── Step 7: Create Purchase Receipt from PO and Submit ───
    const prForm = new PurchaseReceiptFormPage(page);
    await poForm.clickCreateButton('Purchase Receipt');

    const prSupplier = await prForm.getSupplier();
    expect(prSupplier).toBe(supplierName);

    await prForm.save();
    await prForm.expectSaved();
    await prForm.submit();
    await prForm.expectSubmitted();

    // Verify PO is fully received
    await poForm.navigateToDoc(poName);
    const perReceived = await poForm.getPercentReceived();
    expect(parseFloat(perReceived)).toBe(100);

    // ─── Step 8: Create Purchase Invoice from PO and Submit ───
    const piForm = new PurchaseInvoiceFormPage(page);
    await poForm.clickCreateButton('Purchase Invoice');

    const piSupplier = await piForm.getSupplier();
    expect(piSupplier).toBe(supplierName);

    await piForm.save();
    await piForm.expectSaved();
    await piForm.submit();
    await piForm.expectSubmitted();

    // Verify PO is fully billed
    await poForm.navigateToDoc(poName);
    const perBilled = await poForm.getPercentBilled();
    expect(parseFloat(perBilled)).toBe(100);
  });
});
