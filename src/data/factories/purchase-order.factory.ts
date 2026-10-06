import { faker } from '@faker-js/faker';
import type { PurchaseOrderData, ItemRow } from '../types/doctype.types';
import { futureDate } from '../utils/date.utils';

export function createPurchaseOrderData(
  supplierName: string,
  itemCodes: string[],
  overrides?: Partial<PurchaseOrderData>,
): PurchaseOrderData {
  return {
    supplier: supplierName,
    scheduleDate: futureDate(14),
    items: itemCodes.map((code): ItemRow => ({
      item_code: code,
      qty: String(faker.number.int({ min: 1, max: 20 })),
      rate: String(faker.number.int({ min: 100, max: 5000 })),
      schedule_date: futureDate(14),
    })),
    ...overrides,
  };
}
