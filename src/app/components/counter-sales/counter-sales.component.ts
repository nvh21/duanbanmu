import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CounterSale,
  CounterSaleItem,
  CartItem,
  CounterSaleFilter,
} from '../../interfaces/counter-sale.interface';

@Component({
  selector: 'app-counter-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './counter-sales.component.html',
  styleUrls: ['./counter-sales.component.scss'],
})
export class CounterSalesComponent implements OnInit {
  counterSales: CounterSale[] = [];
  filteredSales: CounterSale[] = [];
  paginatedSales: CounterSale[] = [];

  // Math object for template
  Math = Math;

  // Cart
  cart: CartItem[] = [];
  cartTotal: number = 0;
  cartSubtotal: number = 0;
  cartDiscount: number = 0;
  cartTax: number = 10;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  // Sorting
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Filter
  searchTerm: string = '';
  selectedStatus: string = 'all';
  selectedPaymentStatus: string = 'all';
  selectedPaymentMethod: string = 'all';

  // Modal states
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showViewModal: boolean = false;
  showDeleteModal: boolean = false;
  showCartModal: boolean = false;

  // Form data
  newSale: Partial<CounterSale> = {
    saleNumber: '',
    customerName: '',
    customerPhone: '',
    staffId: 1,
    staffName: 'Nguyễn Văn A',
    items: [],
    subtotal: 0,
    discount: 0,
    discountAmount: 0,
    tax: 10,
    taxAmount: 0,
    totalAmount: 0,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    status: 'draft',
    notes: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 1,
    updatedBy: 1,
  };

  selectedSale: CounterSale | null = null;
  editingSale: CounterSale | null = null;

  // Product search
  productSearchTerm: string = '';
  availableProducts: any[] = [];

  // Status options
  statusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'draft', label: 'Nháp' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Hủy' },
  ];

  paymentStatusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'pending', label: 'Chờ thanh toán' },
    { value: 'paid', label: 'Đã thanh toán' },
    { value: 'partial', label: 'Thanh toán một phần' },
    { value: 'refunded', label: 'Hoàn tiền' },
  ];

  paymentMethodOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'cash', label: 'Tiền mặt' },
    { value: 'card', label: 'Thẻ' },
    { value: 'transfer', label: 'Chuyển khoản' },
    { value: 'other', label: 'Khác' },
  ];

  constructor() {}

  ngOnInit(): void {
    this.loadSampleData();
    this.loadAvailableProducts();
    this.filterSales();
  }

  loadSampleData(): void {
    this.counterSales = [
      {
        id: 1,
        saleNumber: 'CS-2024-001',
        customerId: 1,
        customerName: 'Nguyễn Văn An',
        customerPhone: '0123456789',
        staffId: 1,
        staffName: 'Nguyễn Văn A',
        items: [
          {
            id: 1,
            productId: 1,
            productCode: 'P001',
            productName: 'AGV K1 Helmet',
            category: 'Mũ bảo hiểm toàn đầu',
            quantity: 1,
            unitPrice: 1500000,
            totalPrice: 1500000,
            discount: 5,
            discountAmount: 75000,
            stockQuantity: 50,
          },
        ],
        subtotal: 1500000,
        discount: 5,
        discountAmount: 75000,
        tax: 10,
        taxAmount: 142500,
        totalAmount: 1567500,
        paymentMethod: 'cash',
        paymentStatus: 'paid',
        status: 'completed',
        notes: 'Bán tại quầy',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        createdBy: 1,
        updatedBy: 1,
      },
      {
        id: 2,
        saleNumber: 'CS-2024-002',
        customerId: 2,
        customerName: 'Trần Thị Bình',
        customerPhone: '0987654321',
        staffId: 2,
        staffName: 'Trần Thị B',
        items: [
          {
            id: 2,
            productId: 2,
            productCode: 'P002',
            productName: 'Shoei X14 Helmet',
            category: 'Mũ bảo hiểm đua xe',
            quantity: 1,
            unitPrice: 2500000,
            totalPrice: 2500000,
            discount: 0,
            discountAmount: 0,
            stockQuantity: 30,
          },
        ],
        subtotal: 2500000,
        discount: 0,
        discountAmount: 0,
        tax: 10,
        taxAmount: 250000,
        totalAmount: 2750000,
        paymentMethod: 'card',
        paymentStatus: 'paid',
        status: 'completed',
        notes: '',
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-16'),
        createdBy: 2,
        updatedBy: 2,
      },
    ];
  }

  loadAvailableProducts(): void {
    this.availableProducts = [
      {
        id: 1,
        code: 'P001',
        name: 'AGV K1 Helmet',
        category: 'Mũ bảo hiểm toàn đầu',
        price: 1500000,
        stock: 50,
      },
      {
        id: 2,
        code: 'P002',
        name: 'Shoei X14 Helmet',
        category: 'Mũ bảo hiểm đua xe',
        price: 2500000,
        stock: 30,
      },
      {
        id: 3,
        code: 'P003',
        name: 'Arai RX7V Helmet',
        category: 'Mũ bảo hiểm toàn đầu',
        price: 3200000,
        stock: 25,
      },
    ];
  }

  filterSales(): void {
    this.filteredSales = this.counterSales.filter((sale) => {
      const matchesSearch =
        !this.searchTerm ||
        sale.saleNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        sale.customerName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        sale.customerPhone?.includes(this.searchTerm);

      const matchesStatus = this.selectedStatus === 'all' || sale.status === this.selectedStatus;
      const matchesPaymentStatus =
        this.selectedPaymentStatus === 'all' || sale.paymentStatus === this.selectedPaymentStatus;
      const matchesPaymentMethod =
        this.selectedPaymentMethod === 'all' || sale.paymentMethod === this.selectedPaymentMethod;

      return matchesSearch && matchesStatus && matchesPaymentStatus && matchesPaymentMethod;
    });

    this.applySorting();
    this.updatePagination();
  }

  applySorting(): void {
    if (this.sortColumn && this.sortDirection) {
      this.filteredSales.sort((a, b) => {
        let aValue: any = a[this.sortColumn as keyof CounterSale];
        let bValue: any = b[this.sortColumn as keyof CounterSale];

        if (this.sortColumn === 'createdAt' || this.sortColumn === 'updatedAt') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.applySorting();
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalItems = this.filteredSales.length;
    this.currentPage = 1;
    this.paginateSales();
  }

  paginateSales(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedSales = this.filteredSales.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.paginateSales();
  }

  onItemsPerPageChange(event: any): void {
    this.itemsPerPage = parseInt(event.target.value, 10);
    this.currentPage = 1;
    this.paginateSales();
  }

  onSearchChange(): void {
    this.filterSales();
  }

  onStatusChange(): void {
    this.filterSales();
  }

  onPaymentStatusChange(): void {
    this.filterSales();
  }

  onPaymentMethodChange(): void {
    this.filterSales();
  }

  openAddModal(): void {
    this.newSale = {
      saleNumber: this.generateSaleNumber(),
      customerName: '',
      customerPhone: '',
      staffId: 1,
      staffName: 'Nguyễn Văn A',
      items: [],
      subtotal: 0,
      discount: 0,
      discountAmount: 0,
      tax: 10,
      taxAmount: 0,
      totalAmount: 0,
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      status: 'draft',
      notes: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 1,
      updatedBy: 1,
    };
    this.cart = [];
    this.calculateCartTotal();
    this.showAddModal = true;
  }

  openEditModal(sale: CounterSale): void {
    this.editingSale = { ...sale };
    this.showEditModal = true;
  }

  openViewModal(sale: CounterSale): void {
    this.selectedSale = sale;
    this.showViewModal = true;
  }

  openDeleteModal(sale: CounterSale): void {
    this.selectedSale = sale;
    this.showDeleteModal = true;
  }

  openCartModal(): void {
    this.showCartModal = true;
  }

  closeModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showViewModal = false;
    this.showDeleteModal = false;
    this.showCartModal = false;
    this.selectedSale = null;
    this.editingSale = null;
  }

  generateSaleNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `CS-${year}${month}${day}-${random}`;
  }

  // Cart methods
  addToCart(product: any): void {
    const existingItem = this.cart.find((item) => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        productId: product.id,
        productCode: product.code,
        productName: product.name,
        category: product.category,
        quantity: 1,
        unitPrice: product.price,
        totalPrice: product.price,
        discount: 0,
        discountAmount: 0,
        stockQuantity: product.stock,
      });
    }

    this.calculateCartTotal();
  }

  removeFromCart(productId: number): void {
    this.cart = this.cart.filter((item) => item.productId !== productId);
    this.calculateCartTotal();
  }

  updateCartQuantity(productId: number, quantity: string | number): void {
    const item = this.cart.find((item) => item.productId === productId);
    if (item) {
      const qty = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;
      item.quantity = Math.max(1, qty);
      item.totalPrice = item.unitPrice * item.quantity;
      this.calculateCartTotal();
    }
  }

  updateCartDiscount(productId: number, discount: string | number): void {
    const item = this.cart.find((item) => item.productId === productId);
    if (item) {
      const disc = typeof discount === 'string' ? parseFloat(discount) : discount;
      item.discount = Math.max(0, Math.min(100, disc));
      item.discountAmount = (item.totalPrice * item.discount) / 100;
      this.calculateCartTotal();
    }
  }

  calculateCartTotal(): void {
    this.cartSubtotal = this.cart.reduce((sum, item) => sum + item.totalPrice, 0);
    this.cartDiscount = this.cart.reduce((sum, item) => sum + item.discountAmount, 0);
    this.cartTotal =
      this.cartSubtotal -
      this.cartDiscount +
      (this.cartSubtotal - this.cartDiscount) * (this.cartTax / 100);
  }

  processSale(): void {
    if (this.cart.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }

    const newSale: CounterSale = {
      id: this.counterSales.length + 1,
      saleNumber: this.newSale.saleNumber!,
      customerId: this.newSale.customerId,
      customerName: this.newSale.customerName,
      customerPhone: this.newSale.customerPhone,
      staffId: this.newSale.staffId!,
      staffName: this.newSale.staffName!,
      items: this.cart.map((item) => ({
        id: item.productId,
        productId: item.productId,
        productCode: item.productCode,
        productName: item.productName,
        category: item.category,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        discount: item.discount,
        discountAmount: item.discountAmount,
        stockQuantity: item.stockQuantity,
      })),
      subtotal: this.cartSubtotal,
      discount: this.cartDiscount,
      discountAmount: this.cartDiscount,
      tax: this.cartTax,
      taxAmount: (this.cartSubtotal - this.cartDiscount) * (this.cartTax / 100),
      totalAmount: this.cartTotal,
      paymentMethod: this.newSale.paymentMethod!,
      paymentStatus: this.newSale.paymentStatus!,
      status: 'completed',
      notes: this.newSale.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: this.newSale.createdBy!,
      updatedBy: this.newSale.updatedBy!,
    };

    this.counterSales.unshift(newSale);
    this.cart = [];
    this.calculateCartTotal();
    this.closeModals();
    this.filterSales();
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      draft: 'badge-secondary',
      processing: 'badge-primary',
      completed: 'badge-success',
      cancelled: 'badge-danger',
    };
    return statusClasses[status] || 'badge-secondary';
  }

  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      draft: 'Nháp',
      processing: 'Đang xử lý',
      completed: 'Hoàn thành',
      cancelled: 'Hủy',
    };
    return statusLabels[status] || status;
  }

  getPaymentStatusClass(paymentStatus: string): string {
    const statusClasses: { [key: string]: string } = {
      pending: 'badge-warning',
      paid: 'badge-success',
      partial: 'badge-info',
      refunded: 'badge-danger',
    };
    return statusClasses[paymentStatus] || 'badge-secondary';
  }

  getPaymentStatusLabel(paymentStatus: string): string {
    const statusLabels: { [key: string]: string } = {
      pending: 'Chờ thanh toán',
      paid: 'Đã thanh toán',
      partial: 'Thanh toán một phần',
      refunded: 'Hoàn tiền',
    };
    return statusLabels[paymentStatus] || paymentStatus;
  }

  getPaymentMethodLabel(method: string): string {
    const methodLabels: { [key: string]: string } = {
      cash: 'Tiền mặt',
      card: 'Thẻ',
      transfer: 'Chuyển khoản',
      other: 'Khác',
    };
    return methodLabels[method] || method;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN').format(new Date(date));
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'all';
    this.selectedPaymentStatus = 'all';
    this.selectedPaymentMethod = 'all';
    this.filterSales();
  }
}
