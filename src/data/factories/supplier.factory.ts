import { faker } from '@faker-js/faker';
import type { SupplierData } from '../types/doctype.types';

export function createSupplierData(overrides?: Partial<SupplierData>): SupplierData {
  return {
    supplierName: `${faker.company.name()}-${faker.string.alphanumeric(4)}`,
    supplierGroup: 'All Supplier Groups',
    supplierType: 'Company',
    country: 'India',
    ...overrides,
  };
}
