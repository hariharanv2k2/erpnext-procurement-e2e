// Purchase Invoice doctype field names
export const PI_FIELDS = {
  supplier: 'supplier',
  postingDate: 'posting_date',
  dueDate: 'due_date',
  billNo: 'bill_no',
  billDate: 'bill_date',
  company: 'company',
  items: 'items',
  taxes: 'taxes',
} as const;

// Purchase Invoice items child table fields
export const PI_ITEM_FIELDS = {
  itemCode: 'item_code',
  qty: 'qty',
  rate: 'rate',
  warehouse: 'warehouse',
  uom: 'uom',
} as const;
