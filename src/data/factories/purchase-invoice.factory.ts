import { faker } from '@faker-js/faker';
import type { PurchaseInvoiceData, ItemRow } from '../types/doctype.types';

export function createPurchaseInvoiceData(
  supplierName: string,
  itemCodes: string[],
  overrides?: Partial<PurchaseInvoiceData>,
): PurchaseInvoiceData {
  return {
    supplier: supplierName,
    billNo: `BILL-${faker.string.alphanumeric(6).toUpperCase()}`,
    billDate: new Date().toISOString().split('T')[0],
    items: itemCodes.map((code): ItemRow => ({
      item_code: code,
      qty: String(faker.number.int({ min: 1, max: 20 })),
      rate: String(faker.number.int({ min: 100, max: 5000 })),
    })),
    ...overrides,
  };
}
