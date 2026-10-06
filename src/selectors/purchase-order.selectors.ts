// Purchase Order doctype field names
export const PO_FIELDS = {
  supplier: 'supplier',
  transactionDate: 'transaction_date',
  scheduleDate: 'schedule_date',
  company: 'company',
  items: 'items',
  taxes: 'taxes',
} as const;

// Purchase Order items child table fields
export const PO_ITEM_FIELDS = {
  itemCode: 'item_code',
  qty: 'qty',
  rate: 'rate',
  scheduleDate: 'schedule_date',
  warehouse: 'warehouse',
  uom: 'uom',
} as const;
