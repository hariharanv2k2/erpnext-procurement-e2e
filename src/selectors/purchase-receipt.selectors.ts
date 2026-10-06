// Purchase Receipt doctype field names
export const PR_FIELDS = {
  supplier: 'supplier',
  postingDate: 'posting_date',
  company: 'company',
  items: 'items',
} as const;

// Purchase Receipt items child table fields
export const PR_ITEM_FIELDS = {
  itemCode: 'item_code',
  qty: 'qty',
  receivedQty: 'received_qty',
  rate: 'rate',
  warehouse: 'warehouse',
  rejectedWarehouse: 'rejected_warehouse',
  uom: 'uom',
} as const;
