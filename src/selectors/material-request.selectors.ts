// Material Request doctype field names
export const MR_FIELDS = {
  materialRequestType: 'material_request_type',
  transactionDate: 'transaction_date',
  scheduleDate: 'schedule_date',
  items: 'items',
  company: 'company',
} as const;

// Material Request items child table fields
export const MR_ITEM_FIELDS = {
  itemCode: 'item_code',
  qty: 'qty',
  scheduleDate: 'schedule_date',
  warehouse: 'warehouse',
  uom: 'uom',
} as const;
