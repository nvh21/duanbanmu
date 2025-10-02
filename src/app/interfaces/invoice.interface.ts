export interface InvoiceItem {
  id: number;
  productId: number;
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount: number;
  discountAmount: number;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  customerId?: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  staffId: number;
  staffName: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  discountAmount: number;
  tax: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'other';
  paymentStatus: 'pending' | 'paid' | 'partial' | 'refunded';
  status: 'draft' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy: number;
}

export interface InvoiceFilter {
  searchTerm: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  dateFrom?: Date;
  dateTo?: Date;
  staffId?: number;
  customerId?: number;
}
