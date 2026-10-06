import { faker } from '@faker-js/faker';
import type { SupplierQuotationData, ItemRow } from '../types/doctype.types';

export function createSupplierQuotationData(
  supplierName: string,
  itemCodes: string[],
  overrides?: Partial<SupplierQuotationData>,
): SupplierQuotationData {
  return {
    supplier: supplierName,
    items: itemCodes.map((code): ItemRow => ({
      item_code: code,
      qty: String(faker.number.int({ min: 5, max: 50 })),
      rate: String(faker.number.int({ min: 100, max: 5000 })),
    })),
    ...overrides,
  };
}
