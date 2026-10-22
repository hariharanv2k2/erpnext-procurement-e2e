import { test, expect } from '../../src/fixtures/base.fixture';
import { SupplierFormPage, SupplierListPage } from '../../src/pages/supplier.page';
import { createSupplierData } from '../../src/data/factories/supplier.factory';
import { SUPPLIER_FIELDS } from '../../src/selectors/supplier.selectors';

test.describe('Supplier Master Data', () => {
  let supplierForm: SupplierFormPage;
  let supplierList: SupplierListPage;

  test.beforeEach(async ({ page }) => {
    supplierForm = new SupplierFormPage(page);
    supplierList = new SupplierListPage(page);
  });

  test('should create a new Supplier with all required fields', async () => {
    const data = createSupplierData();

    await supplierForm.navigateToNew();
    await supplierForm.fillSupplierForm(data);
    await supplierForm.save();

    await supplierForm.expectSaved();
    const savedName = await supplierForm.getSupplierName();
    expect(savedName).toBe(data.supplierName);
  });

  test('should display created Supplier in list view', async () => {
    const data = createSupplierData();

    await supplierForm.navigateToNew();
    await supplierForm.fillSupplierForm(data);
    await supplierForm.save();
    await supplierForm.expectSaved();

    await supplierList.navigateToList();
    await supplierList.expectDocInList(data.supplierName);
  });

  test('should open Supplier from list and verify field values', async () => {
    const data = createSupplierData();

    await supplierForm.navigateToNew();
    await supplierForm.fillSupplierForm(data);
    await supplierForm.save();
    await supplierForm.expectSaved();
    const docName = await supplierForm.getDocName();

    await supplierForm.navigateToDoc(docName);
    const savedName = await supplierForm.getSupplierName();
    const savedType = await supplierForm.getSupplierType();
    expect(savedName).toBe(data.supplierName);
    expect(savedType).toBe(data.supplierType);
  });

  test('should edit Supplier and save updated values', async () => {
    const data = createSupplierData();

    await supplierForm.navigateToNew();
    await supplierForm.fillSupplierForm(data);
    await supplierForm.save();
    await supplierForm.expectSaved();

    // Update supplier type
    await supplierForm.setFieldValue(SUPPLIER_FIELDS.supplierType, 'Individual');
    await supplierForm.save();

    const updatedType = await supplierForm.getSupplierType();
    expect(updatedType).toBe('Individual');
  });

  test('should show error when saving without supplier name', async () => {
    await supplierForm.navigateToNew();
    // Try to save without filling required fields — save will fail with validation error
    await supplierForm.trySave();
    await supplierForm.expectError();
    await supplierForm.closeErrorDialog();
  });
});
