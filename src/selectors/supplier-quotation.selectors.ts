// Supplier Quotation doctype field names
export const SQ_FIELDS = {
  supplier: 'supplier',
  transactionDate: 'transaction_date',
  validTill: 'valid_till',
  company: 'company',
  items: 'items',
} as const;

// Supplier Quotation items child table fields
export const SQ_ITEM_FIELDS = {
  itemCode: 'item_code',
  qty: 'qty',
  rate: 'rate',
  uom: 'uom',
} as const;
