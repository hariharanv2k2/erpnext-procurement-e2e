import { faker } from '@faker-js/faker';
import type { ItemData } from '../types/doctype.types';

export function createItemData(overrides?: Partial<ItemData>): ItemData {
  return {
    itemCode: `ITEM-${faker.string.alphanumeric(6).toUpperCase()}`,
    itemName: `${faker.commerce.productName()}-${faker.string.alphanumeric(3)}`,
    itemGroup: 'All Item Groups',
    stockUom: 'Nos',
    ...overrides,
  };
}
