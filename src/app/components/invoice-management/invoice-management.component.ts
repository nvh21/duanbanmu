import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HoaDonDTO, HoaDonFilter } from '../../interfaces/hoa-don.interface';
import { HoaDonService } from '../../services/hoa-don.service';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-invoice-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-management.component.html',
  styleUrls: ['./invoice-management.component.scss'],
})
export class InvoiceManagementComponent implements OnInit, OnDestroy {
  invoices: HoaDonDTO[] = [];
  filteredInvoices: HoaDonDTO[] = [];
  paginatedInvoices: HoaDonDTO[] = [];

  // Math object for templatee
  Math = Math;

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
  showProductModal: boolean = false;
  loadingProducts: boolean = false;
  loadingInvoices: boolean = false;

  // Form data
  newInvoice: Partial<HoaDonDTO> = {
    maHoaDon: '',
    tenKhachHang: '',
    soDienThoaiKhachHang: '',
    emailKhachHang: '',
    nhanVienId: 1,
    tenNhanVien: 'Nguyễn Văn A',
    tongTien: 0,
    tienGiamGia: 0,
    thanhTien: 0,
    ghiChu: '',
    trangThai: 'CHO_XAC_NHAN',
    viTriBanHang: 'Tại quầy',
    danhSachSanPham: [],
  };

  selectedInvoice: HoaDonDTO | null = null;
  editingInvoice: HoaDonDTO | null = null;

  // Additional properties for detail modal
  invoiceDetail: any = null;
  loadingDetail: boolean = false;
  isEditMode: boolean = false;
  editingInvoiceDetail: any = null;

  // Product selection properties
  availableProducts: any[] = [];
  selectedProducts: any[] = [];
  discountPercentage: number = 0;

  // Customer data cache
  customerCache: { [key: number]: string } = {};

  // Search debounce
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Status options
  statusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'CHO_XAC_NHAN', label: 'Chờ xác nhận' },
    { value: 'DA_XAC_NHAN', label: 'Đã xác nhận' },
    { value: 'DANG_GIAO_HANG', label: 'Đang giao hàng' },
    { value: 'DA_GIAO_HANG', label: 'Đã giao hàng' },
    { value: 'HUY', label: 'Hủy' },
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
    { value: 'transfer', label: 'Chuyển khoản' },
  ];

  constructor(
    private hoaDonService: HoaDonService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupAutoSearch();
    this.loadHoaDon();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupAutoSearch(): void {
    this.searchSubject
      .pipe(
        debounceTime(200), // Giảm từ 300ms xuống 200ms để phản hồi nhanh hơn
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((searchTerm) => {
        this.searchTerm = searchTerm;
        this.currentPage = 1;
        this.loadHoaDon();
      });
  }

  loadHoaDon(): void {
    this.loadingInvoices = true;

    // Build filter parameters
    const filterParams: any = {
      page: this.currentPage - 1, // Backend uses 0-based pagination
      size: this.itemsPerPage,
    };

    // Add search term if provided
    if (this.searchTerm && this.searchTerm.trim()) {
      filterParams.keyword = this.searchTerm.trim();
    }

    // Add status filter if not 'all'
    if (this.selectedStatus && this.selectedStatus !== 'all') {
      filterParams.trangThai = this.selectedStatus;
    }

    // Add payment status filter if not 'all'
    if (this.selectedPaymentStatus && this.selectedPaymentStatus !== 'all') {
      filterParams.trangThaiThanhToan = this.selectedPaymentStatus;
    }

    // Add payment method filter if not 'all'
    if (this.selectedPaymentMethod && this.selectedPaymentMethod !== 'all') {
      filterParams.phuongThucThanhToan = this.selectedPaymentMethod;
    }

    // Add sorting if specified
    if (this.sortColumn) {
      filterParams.sortBy = this.sortColumn;
      filterParams.sortDirection = this.sortDirection;
    }

    console.log('Filter params:', filterParams);

    this.hoaDonService.getAllHoaDon(filterParams).subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
        // Handle different response structures
        if (response.content) {
          this.paginatedInvoices = response.content;
          this.totalItems = response.totalElements || 0;
        } else if (response.hoaDonList) {
          this.paginatedInvoices = response.hoaDonList;
          this.totalItems = response.totalItems || 0;
        } else if (Array.isArray(response)) {
          this.paginatedInvoices = response;
          this.totalItems = response.length;
        } else {
          this.paginatedInvoices = [];
          this.totalItems = 0;
        }
        this.filteredInvoices = this.paginatedInvoices;

        // Load customer names for invoices that have khachHangId but no tenKhachHang
        this.loadCustomerNames();

        this.loadingInvoices = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
        this.loadingInvoices = false;
        // Fallback to sample data if API fails
        this.loadSampleData();
      },
    });
  }

  loadSampleData(): void {
    // Fallback sample data if API fails
    this.paginatedInvoices = [
      {
        id: 1,
        maHoaDon: 'INV-2024-001',
        khachHangId: 1,
        tenKhachHang: 'Nguyễn Văn An',
        soDienThoaiKhachHang: '0123456789',
        emailKhachHang: 'an.nguyen@email.com',
        nhanVienId: 1,
        tenNhanVien: 'Nguyễn Văn A',
        tongTien: 3135000,
        tienGiamGia: 150000,
        thanhTien: 2985000,
        phuongThucThanhToan: 'cash',
        trangThai: 'DA_GIAO_HANG',
        ghiChu: 'Giao hàng tận nơi',
        ngayTao: '2024-01-15T10:00:00',
        ngayThanhToan: '2024-01-15T10:30:00',
        soLuongSanPham: 1,
        viTriBanHang: 'Tại quầy',
        danhSachSanPham: [],
      },
      {
        id: 2,
        maHoaDon: 'INV-2024-002',
        khachHangId: 2,
        tenKhachHang: 'Lê Thị Bình',
        soDienThoaiKhachHang: '0987654321',
        emailKhachHang: 'binh.le@email.com',
        nhanVienId: 1,
        tenNhanVien: 'Nguyễn Văn A',
        tongTien: 2500000,
        tienGiamGia: 0,
        thanhTien: 2500000,
        phuongThucThanhToan: 'transfer',
        trangThai: 'CHO_XAC_NHAN',
        ghiChu: 'Thanh toán chuyển khoản',
        ngayTao: '2024-01-15T14:00:00',
        ngayThanhToan: undefined,
        soLuongSanPham: 2,
        viTriBanHang: 'Online',
        danhSachSanPham: [],
      },
    ];

    this.filteredInvoices = this.paginatedInvoices;
    this.totalItems = 2;
    this.cdr.detectChanges();
  }

  // Methods for template compatibility
  onSearchInput(event: any): void {
    const value = event.target.value;
    this.searchSubject.next(value);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchSubject.next('');
  }

  clearStatusFilter(): void {
    this.selectedStatus = 'all';
    this.currentPage = 1;
    this.loadHoaDon();
  }

  clearPaymentStatusFilter(): void {
    this.selectedPaymentStatus = 'all';
    this.currentPage = 1;
    this.loadHoaDon();
  }

  clearPaymentMethodFilter(): void {
    this.selectedPaymentMethod = 'all';
    this.currentPage = 1;
    this.loadHoaDon();
  }

  getActiveFilterCount(): number {
    let count = 0;
    if (this.searchTerm && this.searchTerm.trim()) count++;
    if (this.selectedStatus !== 'all') count++;
    if (this.selectedPaymentStatus !== 'all') count++;
    if (this.selectedPaymentMethod !== 'all') count++;
    return count;
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.loadHoaDon();
  }

  onStatusChange(): void {
    this.currentPage = 1;
    this.loadHoaDon();
  }

  onPaymentStatusChange(): void {
    this.currentPage = 1;
    this.loadHoaDon();
  }

  onPaymentMethodChange(): void {
    this.currentPage = 1;
    this.loadHoaDon();
  }

  filterInvoices(): void {
    this.currentPage = 1;
    this.loadHoaDon();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= Math.ceil(this.totalItems / this.itemsPerPage)) {
      this.currentPage = page;
      this.loadHoaDon();
    }
  }

  onItemsPerPageChange(event: any): void {
    this.itemsPerPage = parseInt(event.target.value);
    this.currentPage = 1;
    this.loadHoaDon();
  }

  sort(column: string): void {
    // Map frontend column names to backend field names
    const columnMapping: { [key: string]: string } = {
      invoiceNumber: 'maHoaDon',
      customerName: 'tenKhachHang',
      totalAmount: 'tongTien',
      status: 'trangThai',
      paymentStatus: 'ngayThanhToan',
      paymentMethod: 'viTriBanHang',
      createdAt: 'ngayTao',
    };

    const backendColumn = columnMapping[column] || column;

    if (this.sortColumn === backendColumn) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = backendColumn;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1;
    this.loadHoaDon();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'all';
    this.selectedPaymentStatus = 'all';
    this.selectedPaymentMethod = 'all';
    this.currentPage = 1;
    this.loadHoaDon();
  }

  // Modal methods
  openAddModal(): void {
    this.initializeNewInvoice();
    this.showAddModal = true;
  }

  openEditModal(invoice: HoaDonDTO): void {
    this.selectedInvoice = invoice;
    this.editingInvoice = { ...invoice };
    this.showEditModal = true;
  }

  openViewModal(invoice: HoaDonDTO): void {
    // Navigate to detail view instead of opening modal
    this.router.navigate(['/invoices', invoice.id]);
  }

  openDeleteModal(invoice: HoaDonDTO): void {
    this.selectedInvoice = invoice;
    this.showDeleteModal = true;
  }

  closeModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showViewModal = false;
    this.showDeleteModal = false;
    this.selectedInvoice = null;
    this.editingInvoice = null;
    this.invoiceDetail = null;
    this.isEditMode = false;
    this.editingInvoiceDetail = null;
  }

  // Additional methods for detail modal
  loadInvoiceDetail(id: number): void {
    this.loadingDetail = true;
    this.hoaDonService.getHoaDonDetail(id).subscribe({
      next: (detail) => {
        this.invoiceDetail = detail;
        this.loadingDetail = false;
      },
      error: (error) => {
        console.error('Error loading invoice detail:', error);
        this.loadingDetail = false;
      },
    });
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      CHO_XAC_NHAN: 'Chờ xác nhận',
      DA_XAC_NHAN: 'Đã xác nhận',
      DANG_GIAO_HANG: 'Đang giao hàng',
      DA_GIAO_HANG: 'Đã giao hàng',
      HUY: 'Hủy',
    };
    return statusMap[status] || status;
  }

  printInvoice(): void {
    window.print();
  }

  closeDetailModal(): void {
    this.closeModals();
  }

  // Status and display methods
  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      CHO_XAC_NHAN: 'badge-warning',
      DA_XAC_NHAN: 'badge-primary',
      DANG_GIAO_HANG: 'badge-info',
      DA_GIAO_HANG: 'badge-success',
      HUY: 'badge-danger',
    };
    return statusClasses[status] || 'badge-secondary';
  }

  getStatusLabel(status: string): string {
    const option = this.statusOptions.find((opt) => opt.value === status);
    return option ? option.label : status;
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
    const option = this.paymentStatusOptions.find((opt) => opt.value === paymentStatus);
    return option ? option.label : paymentStatus;
  }

  getPaymentMethodLabel(method: string): string {
    const option = this.paymentMethodOptions.find((opt) => opt.value === method);
    return option ? option.label : method;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('vi-VN').format(new Date(date));
  }

  formatDateTimeForAPI(dateTime: string): string | undefined {
    if (!dateTime) return undefined;
    // Chuyển đổi từ datetime-local format sang ISO string
    const date = new Date(dateTime);
    return date.toISOString();
  }

  // CRUD Operations
  async saveInvoice(): Promise<void> {
    try {
      let customerCreated = false;

      // Tự động tạo khách hàng nếu chưa có
      if (this.newInvoice.tenKhachHang && !this.newInvoice.khachHangId) {
        this.newInvoice.khachHangId = await this.createCustomerIfNotExists(
          this.newInvoice.tenKhachHang
        );
        customerCreated = true;
      }

      if (this.newInvoice.maHoaDon && this.newInvoice.tenKhachHang) {
        // Prepare invoice data for backend
        const invoiceData = {
          ...this.newInvoice,
          ngayTao: new Date().toISOString(),
          danhSachSanPham: this.selectedProducts.map((product) => ({
            sanPhamId: product.id,
            tenSanPham: product.tenSanPham,
            soLuong: product.soLuong,
            donGia: product.giaBan,
            thanhTien: product.giaBan * product.soLuong,
          })),
        };

        this.hoaDonService.createHoaDon(invoiceData).subscribe({
          next: (result) => {
            this.closeModals();
            this.loadHoaDon();

            // Show success message with customer creation info
            let message = 'Tạo hóa đơn thành công!';
            if (customerCreated) {
              message += `\nĐã tự động tạo khách hàng mới: ${this.newInvoice.tenKhachHang}`;
            }
            alert(message);
          },
          error: (error) => {
            console.error('Error creating invoice:', error);
            alert('Lỗi khi tạo hóa đơn: ' + (error.error?.message || error.message));
          },
        });
      } else {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      }
    } catch (error) {
      console.error('Lỗi khi xử lý hóa đơn:', error);
      alert('Lỗi: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  updateInvoice(): void {
    if (this.editingInvoice && this.editingInvoice.id) {
      // Chuẩn hóa dữ liệu trước khi gửi
      const invoiceData = {
        ...this.editingInvoice,
        tongTien: this.editingInvoice.tongTien ? Number(this.editingInvoice.tongTien) : 0,
        tienGiamGia: this.editingInvoice.tienGiamGia ? Number(this.editingInvoice.tienGiamGia) : 0,
        thanhTien: this.editingInvoice.thanhTien ? Number(this.editingInvoice.thanhTien) : 0,
        nhanVienId: this.editingInvoice.nhanVienId
          ? Number(this.editingInvoice.nhanVienId)
          : undefined,
        khachHangId: this.editingInvoice.khachHangId
          ? Number(this.editingInvoice.khachHangId)
          : undefined,
        // Chuẩn hóa định dạng ngày tháng
        ngayThanhToan: this.editingInvoice.ngayThanhToan
          ? this.formatDateTimeForAPI(this.editingInvoice.ngayThanhToan)
          : undefined,
        ngayTao: this.editingInvoice.ngayTao
          ? this.formatDateTimeForAPI(this.editingInvoice.ngayTao)
          : undefined,
      };

      this.hoaDonService.updateHoaDon(this.editingInvoice.id, invoiceData).subscribe({
        next: (result) => {
          this.closeModals();
          this.loadHoaDon();
          alert('Cập nhật hóa đơn thành công!');
        },
        error: (error) => {
          console.error('Error updating invoice:', error);
          alert('Lỗi khi cập nhật hóa đơn: ' + (error.error?.message || error.message));
        },
      });
    }
  }

  deleteInvoice(): void {
    if (this.selectedInvoice && this.selectedInvoice.id) {
      if (confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) {
        this.hoaDonService.deleteHoaDon(this.selectedInvoice.id).subscribe({
          next: () => {
            this.closeModals();
            this.loadHoaDon();
            alert('Xóa hóa đơn thành công!');
          },
          error: (error) => {
            console.error('Error deleting invoice:', error);
            alert('Lỗi khi xóa hóa đơn: ' + (error.error?.message || error.message));
          },
        });
      }
    }
  }

  // Additional utility methods
  generateInvoiceNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `HD${year}${month}${day}${random}`;
  }

  initializeNewInvoice(): void {
    this.newInvoice = {
      maHoaDon: this.generateInvoiceNumber(),
      tenKhachHang: '',
      soDienThoaiKhachHang: '',
      emailKhachHang: '',
      nhanVienId: 1,
      tenNhanVien: 'Nguyễn Văn A',
      tongTien: 0,
      tienGiamGia: 0,
      thanhTien: 0,
      ghiChu: '',
      trangThai: 'CHO_XAC_NHAN',
      viTriBanHang: 'Tại quầy',
      danhSachSanPham: [],
    };
    this.selectedProducts = [];
    this.discountPercentage = 0;
  }

  // Product selection methods
  openProductModal(): void {
    this.selectedProductIds.clear(); // Reset selection when opening modal
    this.showProductModal = true;
    this.loadProducts();
    this.cdr.detectChanges(); // Force change detection
  }

  closeProductModal(): void {
    this.showProductModal = false;
    this.selectedProductIds.clear(); // Clear selection when closing modal
  }

  loadProducts(): void {
    this.loadingProducts = true;

    this.hoaDonService.getProducts().subscribe({
      next: (products) => {
        // Map API response to match frontend expected format
        this.availableProducts = products.map((product: any) => ({
          id: product.id,
          maSanPham: product.maSanPham,
          tenSanPham: product.tenSanPham,
          giaBan: product.giaBan,
          donGia: product.giaBan, // Map giaBan to donGia for compatibility
          soLuongTon: product.soLuongTon || 0,
          moTa: product.moTa,
          trangThai: product.trangThai,
          danhMuc: product.loaiMuBaoHiemTen,
          thuongHieu: product.nhaSanXuatTen,
          chatLieu: product.chatLieuVoTen,
          trongLuong: product.trongLuongTen,
          xuatXu: product.xuatXuTen,
          kieuDang: product.kieuDangMuTen,
          congNgheAnToan: product.congNgheAnToanTen,
          mauSac: product.mauSacTen,
          anhSanPham: product.anhSanPham,
        }));
        this.loadingProducts = false;
        this.cdr.detectChanges(); // Force change detection
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loadingProducts = false;
        // Fallback sample products
        this.availableProducts = [
          {
            id: 1,
            maSanPham: 'SP001',
            tenSanPham: 'Mũ bảo hiểm AGV K1',
            giaBan: 1500000,
            donGia: 1500000,
            soLuongTon: 10,
            moTa: 'Mũ bảo hiểm cao cấp',
            trangThai: true,
            danhMuc: 'Mũ bảo hiểm',
            thuongHieu: 'AGV',
          },
          {
            id: 2,
            maSanPham: 'SP002',
            tenSanPham: 'Mũ bảo hiểm Shoei X-14',
            giaBan: 2500000,
            donGia: 2500000,
            soLuongTon: 5,
            moTa: 'Mũ bảo hiểm thể thao',
            trangThai: true,
            danhMuc: 'Mũ bảo hiểm',
            thuongHieu: 'Shoei',
          },
          {
            id: 3,
            maSanPham: 'SP003',
            tenSanPham: 'Mũ bảo hiểm Arai RX-7V',
            giaBan: 3200000,
            donGia: 3200000,
            soLuongTon: 3,
            moTa: 'Mũ bảo hiểm cao cấp',
            trangThai: true,
            danhMuc: 'Mũ bảo hiểm',
            thuongHieu: 'Arai',
          },
        ];
        this.cdr.detectChanges(); // Force change detection
      },
    });
  }

  updateProductQuantity(product: any, quantity: number): void {
    const selectedProduct = this.selectedProducts.find((p) => p.id === product.id);
    if (selectedProduct) {
      // Đảm bảo số lượng là số nguyên dương
      const validQuantity = Math.max(1, Math.floor(quantity || 1));
      selectedProduct.soLuong = validQuantity;

      // Tính lại tổng tiền
      this.calculateTotal();
    }
  }

  onQuantityInputChange(product: any, event: any): void {
    const quantity = parseInt(event.target.value) || 1;
    this.updateProductQuantity(product, quantity);
  }

  removeProduct(product: any): void {
    const index = this.selectedProducts.findIndex((p) => p.id === product.id);
    if (index > -1) {
      this.selectedProducts.splice(index, 1);
      this.calculateTotal();
    }
  }

  calculateTotal(): void {
    // Tính tổng tiền từ các sản phẩm đã chọn
    // Công thức: Σ(đơn giá × số lượng) cho tất cả sản phẩm
    this.newInvoice.tongTien = this.selectedProducts.reduce((total, product) => {
      const productTotal = product.giaBan * product.soLuong;
      return total + productTotal;
    }, 0);

    // Tính tiền giảm giá
    this.newInvoice.tienGiamGia = (this.newInvoice.tongTien || 0) * (this.discountPercentage / 100);

    // Tính thành tiền
    this.newInvoice.thanhTien =
      (this.newInvoice.tongTien || 0) - (this.newInvoice.tienGiamGia || 0);
  }

  // Method để hiển thị chi tiết tính toán
  getCalculationDetails(): string {
    if (this.selectedProducts.length === 0) {
      return 'Chưa có sản phẩm nào được chọn';
    }

    let details = 'Chi tiết tính toán:\n';
    let total = 0;

    this.selectedProducts.forEach((product, index) => {
      const productTotal = product.giaBan * product.soLuong;
      total += productTotal;
      details += `${index + 1}. ${product.tenSanPham}: ${this.formatCurrency(product.giaBan)} × ${
        product.soLuong
      } = ${this.formatCurrency(productTotal)}\n`;
    });

    details += `\nTổng cộng: ${this.formatCurrency(total)}`;

    if (this.discountPercentage > 0) {
      const discountAmount = total * (this.discountPercentage / 100);
      details += `\nGiảm giá ${this.discountPercentage}%: -${this.formatCurrency(discountAmount)}`;
      details += `\nThành tiền: ${this.formatCurrency(total - discountAmount)}`;
    }

    return details;
  }

  // Tự động tạo khách hàng mới nếu chưa có
  async createCustomerIfNotExists(customerName: string): Promise<number> {
    if (!customerName || customerName.trim() === '') {
      throw new Error('Tên khách hàng không được để trống');
    }

    try {
      // Tìm khách hàng theo tên (tìm chính xác)
      const existingCustomers = await this.hoaDonService
        .searchCustomerByName(customerName.trim())
        .toPromise();
      if (existingCustomers && existingCustomers.length > 0) {
        // Tìm khách hàng có tên chính xác
        const exactMatch = existingCustomers.find(
          (customer) => customer.tenKhachHang.toLowerCase() === customerName.trim().toLowerCase()
        );
        if (exactMatch) {
          return exactMatch.id;
        }
      }

      // Tạo khách hàng mới
      const newCustomer = {
        tenKhachHang: customerName.trim(),
        email: `${customerName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        soDienThoai: 'Chưa có',
        gioiTinh: null, // Không xác định
        ngaySinh: null,
        diemTichLuy: 0,
        trangThai: true,
        ngayTao: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
      };

      const createdCustomer = await this.hoaDonService.createCustomer(newCustomer).toPromise();

      // Reload danh sách khách hàng để hiển thị khách hàng mới
      this.loadCustomerNames();

      return createdCustomer.id;
    } catch (error) {
      console.error('Lỗi khi tạo khách hàng:', error);
      // Fallback: tạo ID tạm thời
      return Math.floor(Math.random() * 1000) + 1;
    }
  }

  confirmProductSelection(): void {
    // Thêm các sản phẩm đã chọn vào hóa đơn
    const selectedProducts = this.getSelectedProducts();
    selectedProducts.forEach((product) => {
      const existingProduct = this.selectedProducts.find((p) => p.id === product.id);
      if (existingProduct) {
        // Nếu sản phẩm đã tồn tại, chỉ tăng số lượng nếu người dùng chưa chỉnh sửa
        if (existingProduct.soLuong === 1) {
          existingProduct.soLuong += 1;
        }
      } else {
        this.selectedProducts.push({
          ...product,
          soLuong: 1,
        });
      }
    });

    // Tính lại tổng tiền
    this.calculateTotal();

    // Đóng modal
    this.closeProductModal();
  }

  // Load customer names for all invoices
  loadCustomerNames(): void {
    const invoicesToUpdate = this.paginatedInvoices.filter(
      (invoice) => invoice.khachHangId && !invoice.tenKhachHang
    );

    invoicesToUpdate.forEach((invoice) => {
      if (invoice.khachHangId) {
        this.hoaDonService.getCustomerById(invoice.khachHangId).subscribe({
          next: (customer) => {
            invoice.tenKhachHang = customer.tenKhachHang || 'Khách hàng không xác định';
            invoice.soDienThoaiKhachHang = customer.soDienThoai || invoice.soDienThoaiKhachHang;
            invoice.emailKhachHang = customer.email || invoice.emailKhachHang;
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Error loading customer:', error);
            invoice.tenKhachHang = 'Khách hàng không xác định';
            this.cdr.detectChanges();
          },
        });
      }
    });
  }

  // Customer methods
  getCustomerName(customerId: number): string {
    if (this.customerCache[customerId]) {
      return this.customerCache[customerId];
    }

    // Load customer name if not cached
    if (customerId) {
      this.hoaDonService.getCustomerById(customerId).subscribe({
        next: (customer) => {
          this.customerCache[customerId] = customer.tenKhachHang || 'Khách hàng không xác định';
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading customer:', error);
          this.customerCache[customerId] = 'Khách hàng không xác định';
          this.cdr.detectChanges();
        },
      });
    }

    return 'Đang tải...';
  }

  // Enhanced product modal methods
  addProductToInvoice(product: any): void {
    const existingProduct = this.selectedProducts.find((p) => p.id === product.id);
    if (existingProduct) {
      existingProduct.soLuong += 1;
    } else {
      this.selectedProducts.push({
        ...product,
        soLuong: 1,
      });
    }
    this.calculateTotal();
  }

  removeProductFromInvoice(product: any): void {
    const index = this.selectedProducts.findIndex((p) => p.id === product.id);
    if (index > -1) {
      this.selectedProducts.splice(index, 1);
      this.calculateTotal();
    }
  }

  isProductInInvoice(product: any): boolean {
    return this.selectedProducts.some((p) => p.id === product.id);
  }

  getProductQuantityInInvoice(product: any): number {
    const selectedProduct = this.selectedProducts.find((p) => p.id === product.id);
    return selectedProduct ? selectedProduct.soLuong : 0;
  }

  // Product selection methods
  selectedProductIds: Set<number> = new Set();

  isProductSelected(product: any): boolean {
    return this.selectedProductIds.has(product.id);
  }

  toggleProductSelection(product: any, event: any): void {
    if (event.target.checked) {
      this.selectedProductIds.add(product.id);
    } else {
      this.selectedProductIds.delete(product.id);
    }
  }

  isAllProductsSelected(): boolean {
    const availableProducts = this.availableProducts.filter((p) => p.trangThai && p.soLuongTon > 0);
    return (
      availableProducts.length > 0 &&
      availableProducts.every((p) => this.selectedProductIds.has(p.id))
    );
  }

  isSomeProductsSelected(): boolean {
    const availableProducts = this.availableProducts.filter((p) => p.trangThai && p.soLuongTon > 0);
    const selectedCount = availableProducts.filter((p) => this.selectedProductIds.has(p.id)).length;
    return selectedCount > 0 && selectedCount < availableProducts.length;
  }

  toggleSelectAll(event: any): void {
    const availableProducts = this.availableProducts.filter((p) => p.trangThai && p.soLuongTon > 0);

    if (event.target.checked) {
      availableProducts.forEach((product) => {
        this.selectedProductIds.add(product.id);
      });
    } else {
      availableProducts.forEach((product) => {
        this.selectedProductIds.delete(product.id);
      });
    }
  }

  getSelectedProducts(): any[] {
    return this.availableProducts.filter((p) => this.selectedProductIds.has(p.id));
  }

  onDiscountChange(): void {
    this.calculateTotal();
  }
}
