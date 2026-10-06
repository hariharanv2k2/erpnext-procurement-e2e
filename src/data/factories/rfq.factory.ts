import type { RFQData, ItemRow } from '../types/doctype.types';
import { futureDate } from '../utils/date.utils';

export function createRFQData(
  supplierNames: string[],
  itemCodes: string[],
  overrides?: Partial<RFQData>,
): RFQData {
  return {
    suppliers: supplierNames,
    scheduleDate: futureDate(14),
    items: itemCodes.map((code): ItemRow => ({
      item_code: code,
      qty: '10',
      schedule_date: futureDate(14),
    })),
    ...overrides,
  };
}
