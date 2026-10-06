// --- Master Data Types ---

export interface SupplierData {
  supplierName: string;
  supplierGroup: string;
  supplierType: 'Company' | 'Individual';
  country: string;
}

export interface ItemData {
  itemCode: string;
  itemName: string;
  itemGroup: string;
  stockUom: string;
  description?: string;
}

// --- Transaction Item Row ---

export interface ItemRow {
  item_code: string;
  qty: string;
  rate?: string;
  schedule_date?: string;
  warehouse?: string;
  uom?: string;
}

// --- Transaction Types ---

export interface MaterialRequestData {
  materialRequestType: 'Purchase' | 'Material Transfer' | 'Material Issue' | 'Manufacture';
  requiredBy: string;
  items: ItemRow[];
}

export interface RFQData {
  suppliers: string[];
  scheduleDate: string;
  items: ItemRow[];
}

export interface SupplierQuotationData {
  supplier: string;
  items: ItemRow[];
}

export interface PurchaseOrderData {
  supplier: string;
  scheduleDate: string;
  items: ItemRow[];
}

export interface PurchaseReceiptData {
  supplier: string;
  items: ItemRow[];
}

export interface PurchaseInvoiceData {
  supplier: string;
  billNo?: string;
  billDate?: string;
  items: ItemRow[];
}
