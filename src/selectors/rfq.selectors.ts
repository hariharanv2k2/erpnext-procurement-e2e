// Request for Quotation doctype field names
export const RFQ_FIELDS = {
  transactionDate: 'transaction_date',
  scheduleDate: 'schedule_date',
  company: 'company',
  suppliers: 'suppliers',
  items: 'items',
  messageForSupplier: 'message_for_supplier',
} as const;

// RFQ suppliers child table fields
export const RFQ_SUPPLIER_FIELDS = {
  supplier: 'supplier',
} as const;

// RFQ items child table fields
export const RFQ_ITEM_FIELDS = {
  itemCode: 'item_code',
  qty: 'qty',
  scheduleDate: 'schedule_date',
  warehouse: 'warehouse',
  uom: 'uom',
} as const;
