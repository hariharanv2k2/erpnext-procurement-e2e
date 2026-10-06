import { faker } from '@faker-js/faker';
import type { PurchaseReceiptData, ItemRow } from '../types/doctype.types';

export function createPurchaseReceiptData(
  supplierName: string,
  itemCodes: string[],
  overrides?: Partial<PurchaseReceiptData>,
): PurchaseReceiptData {
  return {
    supplier: supplierName,
    items: itemCodes.map((code): ItemRow => ({
      item_code: code,
      qty: String(faker.number.int({ min: 1, max: 20 })),
      rate: String(faker.number.int({ min: 100, max: 5000 })),
    })),
    ...overrides,
  };
}
