import { faker } from '@faker-js/faker';
import type { MaterialRequestData, ItemRow } from '../types/doctype.types';
import { futureDate } from '../utils/date.utils';

export function createMaterialRequestItem(
  itemCode: string,
  overrides?: Partial<ItemRow>,
): ItemRow {
  return {
    item_code: itemCode,
    qty: String(faker.number.int({ min: 1, max: 50 })),
    schedule_date: futureDate(7),
    ...overrides,
  };
}

export function createMaterialRequestData(
  itemCodes: string[],
  overrides?: Partial<MaterialRequestData>,
): MaterialRequestData {
  return {
    materialRequestType: 'Purchase',
    requiredBy: futureDate(14),
    items: itemCodes.map((code) => createMaterialRequestItem(code)),
    ...overrides,
  };
}
