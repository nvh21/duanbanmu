import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HoaDonService } from '../../services/hoa-don.service';
import { HoaDonDTO, HoaDonPaginatedResponse, HoaDonFilter, HoaDonAdvancedFilter } from '../../interfaces/hoa-don.interface';

@Component({
  selector: 'app-invoice-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-management.component.html',
  styleUrls: ['./invoice-management.component.scss'],
})
export class InvoiceManagementComponent implements OnInit {
  invoices: HoaDonDTO[] = [];
  paginatedInvoices: HoaDonDTO[] = [];
  loading: boolean = false;
  error: string = '';

  // Math object for template
  Math = Math;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  // Sorting
  sortColumn: string = 'ngayTao';
  sortDirection: 'asc' | 'desc' = 'desc';

  // Filter
  searchTerm: string = '';
  selectedStatus: string = 'all';
  
  // Search suggestions
  searchSuggestions: string[] = [];
  showSuggestions: boolean = false;
  selectedSuggestionIndex: number = -1;

  // Modal states
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showViewModal: boolean = false;
  showDeleteModal: boolean = false;

  // Form data
  newInvoice: Partial<HoaDonDTO> = {
    maHoaDon: '',
    tenKhachHang: '',
    emailKhachHang: '',
    soDienThoaiKhachHang: '',
    tenNhanVien: 'Nguyễn Văn A',
    tongTien: 0,
    tienGiamGia: 0,
    thanhTien: 0,
    trangThai: 'CHO_XAC_NHAN',
    ghiChu: '',
  };

  selectedInvoice: HoaDonDTO | null = null;
  editingInvoice: HoaDonDTO | null = null;

  // Product management
  showProductModal: boolean = false;
  editingProduct: any = null;
  newProduct: any = {
    tenSanPham: '',
    soLuong: 1,
    donGia: 0,
    thanhTien: 0,
    ghiChu: '',
    sanPhamId: null,
    soLuongTon: 0
  };

  // Available products from database
  availableProducts: any[] = [];
  loadingProducts: boolean = false;

  // Status options
  statusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'CHO_XAC_NHAN', label: 'Chờ xác nhận' },
    { value: 'DA_XAC_NHAN', label: 'Đã xác nhận' },
    { value: 'DANG_GIAO_HANG', label: 'Đang giao hàng' },
    { value: 'DA_GIAO_HANG', label: 'Đã giao hàng' },
    { value: 'HUY', label: 'Hủy' },
  ];

  constructor(private hoaDonService: HoaDonService) {}

  ngOnInit(): void {
    console.log('InvoiceManagementComponent: ngOnInit called');
    // Đảm bảo load dữ liệu ngay khi component khởi tạo
    setTimeout(() => {
      this.loadHoaDon();
    }, 100);
    
    // Tạo dữ liệu mẫu nếu cần (chỉ trong development)
    this.createSampleDataIfNeeded();
    
    // Load sản phẩm từ database
    this.loadAvailableProducts();
  }

  loadAvailableProducts(): void {
    this.loadingProducts = true;
    this.hoaDonService.getAvailableSanPham().subscribe({
      next: (products) => {
        this.availableProducts = products;
        this.loadingProducts = false;
        console.log('InvoiceManagementComponent: Loaded products:', products.length);
      },
      error: (error) => {
        console.error('InvoiceManagementComponent: Error loading products:', error);
        this.loadingProducts = false;
        // Tạo sản phẩm mẫu nếu không load được
        this.createSampleProducts();
      }
    });
  }

  createSampleProducts(): void {
    this.hoaDonService.createHoaDonNew({
      maHoaDon: 'CREATE-SAMPLE-PRODUCTS',
      tenKhachHang: 'System',
      emailKhachHang: 'system@email.com',
      soDienThoaiKhachHang: '0000000000',
      tongTien: 0,
      tienGiamGia: 0,
      thanhTien: 0,
      trangThai: 'CHO_XAC_NHAN',
      ghiChu: 'Tạo sản phẩm mẫu'
    }).subscribe({
      next: () => {
        console.log('InvoiceManagementComponent: Sample products created');
        this.loadAvailableProducts();
      },
      error: (error) => {
        console.log('InvoiceManagementComponent: Sample products already exist or error:', error);
      }
    });
  }

  createSampleDataIfNeeded(): void {
    // Chỉ tạo dữ liệu mẫu trong development mode
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('InvoiceManagementComponent: Creating sample data...');
      this.hoaDonService.createHoaDonNew({
        maHoaDon: 'HD-SAMPLE-001',
        tenKhachHang: 'Khách hàng mẫu',
        emailKhachHang: 'sample@email.com',
        soDienThoaiKhachHang: '0123456789',
        tenNhanVien: 'Nhân viên mẫu',
        tongTien: 1000000,
        tienGiamGia: 0,
        thanhTien: 1000000,
        trangThai: 'CHO_XAC_NHAN',
        ghiChu: 'Hóa đơn mẫu tự động tạo',
        danhSachSanPham: [
          {
            tenSanPham: 'Áo thun nam',
            soLuong: 2,
            donGia: 200000,
            thanhTien: 400000,
            ghiChu: 'Màu xanh'
          },
          {
            tenSanPham: 'Quần jean',
            soLuong: 1,
            donGia: 600000,
            thanhTien: 600000,
            ghiChu: 'Size L'
          }
        ]
      }).subscribe({
        next: (result) => {
          console.log('InvoiceManagementComponent: Sample data created:', result);
        },
        error: (error) => {
          console.log('InvoiceManagementComponent: Sample data already exists or error:', error);
        }
      });
    }
    
  }

  loadHoaDon(): void {
    console.log('InvoiceManagementComponent: loadHoaDon called');
    this.loading = true;
    this.error = '';

    const filter: HoaDonFilter = {
      page: this.currentPage - 1, // Backend sử dụng 0-based pagination
      size: this.itemsPerPage,
      sortBy: this.sortColumn,
      sortDir: this.sortDirection,
      search: this.searchTerm || undefined,
      trangThai: this.selectedStatus !== 'all' ? this.selectedStatus : undefined
    };

    console.log('InvoiceManagementComponent: Calling API with filter:', filter);

    this.hoaDonService.getHoaDonPaginated(filter).subscribe({
      next: (response: HoaDonPaginatedResponse) => {
        console.log('InvoiceManagementComponent: API response received:', response);
        this.invoices = response.hoaDonList;
        this.paginatedInvoices = response.hoaDonList;
        this.totalItems = response.totalItems;
        this.totalPages = response.totalPages;
        this.currentPage = response.currentPage + 1; // Convert back to 1-based
        this.loading = false;
        console.log('InvoiceManagementComponent: Data loaded successfully, invoices count:', this.invoices.length);
        
        // Nếu không có dữ liệu, thử load lại sau 2 giây
        if (this.invoices.length === 0 && this.totalItems === 0) {
          console.log('InvoiceManagementComponent: No data found, will retry in 2 seconds');
          setTimeout(() => {
            this.loadHoaDon();
          }, 2000);
        }
      },
      error: (error) => {
        console.error('InvoiceManagementComponent: Error loading hóa đơn:', error);
        this.error = 'Không thể tải dữ liệu hóa đơn. Vui lòng thử lại.';
        this.loading = false;
        
        // Thử load lại sau 3 giây nếu có lỗi
        setTimeout(() => {
          console.log('InvoiceManagementComponent: Retrying after error...');
          this.loadHoaDon();
        }, 3000);
      }
    });
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.currentPage = 1;
    this.loadHoaDon();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadHoaDon();
  }

  onItemsPerPageChange(event: any): void {
    this.itemsPerPage = parseInt(event.target.value, 10);
    this.currentPage = 1;
    this.loadHoaDon();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.loadHoaDon();
    
    // Load suggestions if search term is not empty
    if (this.searchTerm && this.searchTerm.length >= 2) {
      this.loadSearchSuggestions();
    } else {
      this.hideSuggestions();
    }
  }

  onSearchInput(event: any): void {
    const value = event.target.value;
    this.searchTerm = value;
    
    if (value && value.length >= 2) {
      this.loadSearchSuggestions();
    } else {
      this.hideSuggestions();
    }
  }

  loadSearchSuggestions(): void {
    // Tạm thời tắt suggestions do lỗi routing backend
    // TODO: Sửa lỗi routing backend sau
    this.hideSuggestions();
    return;
    
    this.hoaDonService.getSearchSuggestions(this.searchTerm).subscribe({
      next: (suggestions) => {
        this.searchSuggestions = suggestions;
        this.showSuggestions = suggestions.length > 0;
        this.selectedSuggestionIndex = -1;
      },
      error: (error: any) => {
        console.error('Error loading suggestions:', error);
        this.hideSuggestions();
      }
    });
  }

  selectSuggestion(suggestion: string): void {
    this.searchTerm = suggestion;
    this.hideSuggestions();
    this.onSearchChange();
  }

  hideSuggestions(): void {
    this.showSuggestions = false;
    this.searchSuggestions = [];
    this.selectedSuggestionIndex = -1;
  }

  onSearchKeyDown(event: KeyboardEvent): void {
    if (!this.showSuggestions) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedSuggestionIndex = Math.min(
          this.selectedSuggestionIndex + 1,
          this.searchSuggestions.length - 1
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedSuggestionIndex = Math.max(this.selectedSuggestionIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.selectedSuggestionIndex >= 0) {
          this.selectSuggestion(this.searchSuggestions[this.selectedSuggestionIndex]);
        } else {
          this.onSearchChange();
        }
        break;
      case 'Escape':
        this.hideSuggestions();
        break;
    }
  }

  onStatusChange(): void {
    this.currentPage = 1;
    this.loadHoaDon();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'all';
    this.currentPage = 1;
    this.hideSuggestions();
    this.loadHoaDon();
  }

  openAddModal(): void {
    this.newInvoice = {
      maHoaDon: this.generateInvoiceNumber(),
      tenKhachHang: '',
      emailKhachHang: '',
      soDienThoaiKhachHang: '',
      tenNhanVien: 'Nguyễn Văn A',
      tongTien: 0,
      tienGiamGia: 0,
      thanhTien: 0,
      trangThai: 'CHO_XAC_NHAN',
      ghiChu: '',
      danhSachSanPham: []
    };
    this.showAddModal = true;
  }

  openEditModal(invoice: HoaDonDTO): void {
    this.editingInvoice = { 
      ...invoice,
      danhSachSanPham: invoice.danhSachSanPham || []
    };
    this.showEditModal = true;
  }

  openViewModal(invoice: HoaDonDTO): void {
    this.selectedInvoice = invoice;
    this.showViewModal = true;
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
    this.showProductModal = false;
    this.selectedInvoice = null;
    this.editingInvoice = null;
    this.editingProduct = null;
  }

  closeAllResetStates(): void {
    // Đóng tất cả các modal
    this.closeModals();
    
    // Reset tất cả các trạng thái
    this.loading = false;
    this.error = '';
    
    // Reset search và filter
    this.searchTerm = '';
    this.selectedStatus = 'all';
    this.hideSuggestions();
    
    // Reset pagination
    this.currentPage = 1;
    
    // Reset selection
    this.selectedInvoices.clear();
    
    // Reset form data
    this.newInvoice = {
      maHoaDon: '',
      tenKhachHang: '',
      emailKhachHang: '',
      soDienThoaiKhachHang: '',
      tenNhanVien: 'Nguyễn Văn A',
      tongTien: 0,
      tienGiamGia: 0,
      thanhTien: 0,
      trangThai: 'CHO_XAC_NHAN',
      ghiChu: '',
      danhSachSanPham: []
    };
    
    this.selectedInvoice = null;
    this.editingInvoice = null;
    this.editingProduct = null;
    
           // Reset product modal
           this.showProductModal = false;
           this.newProduct = {
             tenSanPham: '',
             soLuong: 1,
             donGia: 0,
             thanhTien: 0,
             ghiChu: '',
             sanPhamId: null,
             soLuongTon: 0
           };
    
    console.log('InvoiceManagementComponent: All reset states closed');
  }

  generateInvoiceNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `HD-${year}${month}${day}-${random}`;
  }

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
    const statusLabels: { [key: string]: string } = {
      CHO_XAC_NHAN: 'Chờ xác nhận',
      DA_XAC_NHAN: 'Đã xác nhận',
      DANG_GIAO_HANG: 'Đang giao hàng',
      DA_GIAO_HANG: 'Đã giao hàng',
      HUY: 'Hủy',
    };
    return statusLabels[status] || status;
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

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getRowNumber(invoice: HoaDonDTO): number {
    const index = this.paginatedInvoices.findIndex(inv => inv.id === invoice.id);
    return (this.currentPage - 1) * this.itemsPerPage + index + 1;
  }

  getLocationBadgeClass(viTriBanHang?: string): string {
    if (viTriBanHang === 'Tại quầy') {
      return 'badge bg-primary';
    } else {
      return 'badge bg-success';
    }
  }

  getInvoiceType(nhanVienId?: number): string {
    // Nếu có nhanVienId và > 0 -> Tại quầy
    if (nhanVienId && nhanVienId > 0) {
      return 'Tại quầy';
    }
    // Nếu không có nhanVienId hoặc nhanVienId <= 0 hoặc null -> Online
    return 'Online';
  }

  getTypeBadgeClass(nhanVienId?: number): string {
    if (nhanVienId && nhanVienId > 0) {
      return 'badge bg-primary';
    } else {
      return 'badge bg-success';
    }
  }

  // Method để tạo dữ liệu mẫu cho sản phẩm
  generateSampleProducts(): any[] {
    return [
      {
        tenSanPham: 'Áo thun nam',
        soLuong: 2,
        donGia: 200000,
        thanhTien: 400000,
        ghiChu: 'Màu xanh'
      },
      {
        tenSanPham: 'Quần jean',
        soLuong: 1,
        donGia: 600000,
        thanhTien: 600000,
        ghiChu: 'Size L'
      }
    ];
  }

  // Input validation methods
  validateNumberInput(event: any, field: string): void {
    const value = event.target.value;
    const numericValue = parseFloat(value);
    
    if (isNaN(numericValue) || numericValue < 0) {
      event.target.value = '0';
      this.showErrorMessage(`${field} phải là số dương`);
    }
  }

  validateEmailInput(event: any): void {
    const value = event.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (value && !emailRegex.test(value)) {
      this.showErrorMessage('Email không đúng định dạng');
    }
  }

  validatePhoneInput(event: any): void {
    const value = event.target.value;
    const phoneRegex = /^[0-9]{10,11}$/;
    
    if (value && !phoneRegex.test(value)) {
      this.showErrorMessage('Số điện thoại phải có 10-11 chữ số');
    }
  }

  // CRUD Operations
  saveInvoice(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    
    // Tính toán thành tiền trước khi lưu
    this.calculateFinalAmount();
    
    if (this.editingInvoice) {
      // Update existing invoice
      this.hoaDonService.updateHoaDonNew(this.editingInvoice.id, this.editingInvoice).subscribe({
        next: (updatedInvoice) => {
          this.loading = false;
          this.closeModals();
          this.loadHoaDon();
          this.showSuccessMessage('Cập nhật hóa đơn thành công!');
        },
        error: (error) => {
          this.loading = false;
          console.error('Error updating invoice:', error);
          this.showErrorMessage('Lỗi khi cập nhật hóa đơn: ' + (error.error?.message || error.message || 'Unknown error'));
        }
      });
    } else {
      // Create new invoice
      this.hoaDonService.createHoaDonNew(this.newInvoice).subscribe({
        next: (createdInvoice) => {
          this.loading = false;
          this.closeModals();
          this.loadHoaDon();
          this.showSuccessMessage('Tạo hóa đơn thành công!');
        },
        error: (error) => {
          this.loading = false;
          console.error('Error creating invoice:', error);
          this.showErrorMessage('Lỗi khi tạo hóa đơn: ' + (error.error?.message || error.message || 'Unknown error'));
        }
      });
    }
  }

  deleteInvoice(): void {
    if (!this.selectedInvoice) return;

    this.loading = true;
    this.hoaDonService.deleteHoaDonNew(this.selectedInvoice.id).subscribe({
      next: () => {
        this.loading = false;
        this.closeModals();
        this.loadHoaDon();
        this.showSuccessMessage('Xóa hóa đơn thành công!');
      },
      error: (error) => {
        this.loading = false;
        console.error('Error deleting invoice:', error);
        this.showErrorMessage('Lỗi khi xóa hóa đơn: ' + (error.error?.message || error.message || 'Unknown error'));
      }
    });
  }

  updateInvoiceStatus(invoice: HoaDonDTO, newStatus: string): void {
    this.loading = true;
    this.hoaDonService.updateTrangThaiHoaDonNew(invoice.id, newStatus).subscribe({
      next: (updatedInvoice) => {
        this.loading = false;
        this.loadHoaDon();
        this.showSuccessMessage('Cập nhật trạng thái thành công!');
      },
      error: (error) => {
        this.loading = false;
        console.error('Error updating invoice status:', error);
        this.showErrorMessage('Lỗi khi cập nhật trạng thái: ' + (error.error?.message || error.message || 'Unknown error'));
      }
    });
  }

  // Export Excel functionality
  exportToExcel(): void {
    this.loading = true;
    this.hoaDonService.exportExcel().subscribe({
      next: (response) => {
        this.loading = false;
        this.showSuccessMessage('Xuất Excel thành công! (Chức năng đang được phát triển)');
      },
      error: (error) => {
        this.loading = false;
        console.error('Error exporting Excel:', error);
        this.showErrorMessage('Lỗi khi xuất Excel: ' + (error.error?.message || error.message || 'Unknown error'));
      }
    });
  }

  // Form validation
  validateForm(): boolean {
    if (this.editingInvoice) {
      if (!this.editingInvoice.maHoaDon?.trim()) {
        this.showErrorMessage('Mã hóa đơn không được để trống');
        return false;
      }
      if (!this.editingInvoice.tenKhachHang?.trim()) {
        this.showErrorMessage('Tên khách hàng không được để trống');
        return false;
      }
      if (!this.editingInvoice.tongTien || this.editingInvoice.tongTien <= 0) {
        this.showErrorMessage('Tổng tiền phải lớn hơn 0');
        return false;
      }
      if (this.editingInvoice.tienGiamGia && this.editingInvoice.tienGiamGia < 0) {
        this.showErrorMessage('Tiền giảm giá không được âm');
        return false;
      }
      if (this.editingInvoice.tienGiamGia && this.editingInvoice.tienGiamGia > this.editingInvoice.tongTien) {
        this.showErrorMessage('Tiền giảm giá không được lớn hơn tổng tiền');
        return false;
      }
    } else {
      if (!this.newInvoice.maHoaDon?.trim()) {
        this.showErrorMessage('Mã hóa đơn không được để trống');
        return false;
      }
      if (!this.newInvoice.tenKhachHang?.trim()) {
        this.showErrorMessage('Tên khách hàng không được để trống');
        return false;
      }
      if (!this.newInvoice.tongTien || this.newInvoice.tongTien <= 0) {
        this.showErrorMessage('Tổng tiền phải lớn hơn 0');
        return false;
      }
      if (this.newInvoice.tienGiamGia && this.newInvoice.tienGiamGia < 0) {
        this.showErrorMessage('Tiền giảm giá không được âm');
        return false;
      }
      if (this.newInvoice.tienGiamGia && this.newInvoice.tienGiamGia > this.newInvoice.tongTien) {
        this.showErrorMessage('Tiền giảm giá không được lớn hơn tổng tiền');
        return false;
      }
    }
    return true;
  }

  // Calculate final amount
  calculateFinalAmount(): void {
    if (this.editingInvoice) {
      const tongTien = this.editingInvoice.tongTien || 0;
      const tienGiamGia = this.editingInvoice.tienGiamGia || 0;
      this.editingInvoice.thanhTien = tongTien - tienGiamGia;
    } else {
      const tongTien = this.newInvoice.tongTien || 0;
      const tienGiamGia = this.newInvoice.tienGiamGia || 0;
      this.newInvoice.thanhTien = tongTien - tienGiamGia;
    }
  }

  // Message handling
  showSuccessMessage(message: string): void {
    console.log('Success:', message);
    alert(message); // Temporary solution
  }

  showErrorMessage(message: string): void {
    console.error('Error:', message);
    alert(message); // Temporary solution
  }

  // Quick status update buttons
  confirmInvoice(invoice: HoaDonDTO): void {
    this.updateInvoiceStatus(invoice, 'DA_XAC_NHAN');
  }

  shipInvoice(invoice: HoaDonDTO): void {
    this.updateInvoiceStatus(invoice, 'DANG_GIAO_HANG');
  }

  completeInvoice(invoice: HoaDonDTO): void {
    this.updateInvoiceStatus(invoice, 'DA_GIAO_HANG');
  }

  cancelInvoice(invoice: HoaDonDTO): void {
    this.updateInvoiceStatus(invoice, 'HUY');
  }

  // Bulk operations
  selectedInvoices: Set<number> = new Set();

  toggleInvoiceSelection(invoice: HoaDonDTO): void {
    if (this.selectedInvoices.has(invoice.id)) {
      this.selectedInvoices.delete(invoice.id);
    } else {
      this.selectedInvoices.add(invoice.id);
    }
  }

  isInvoiceSelected(invoice: HoaDonDTO): boolean {
    return this.selectedInvoices.has(invoice.id);
  }

  selectAllInvoices(): void {
    this.paginatedInvoices.forEach(invoice => {
      this.selectedInvoices.add(invoice.id);
    });
  }

  deselectAllInvoices(): void {
    this.selectedInvoices.clear();
  }

  bulkUpdateStatus(newStatus: string): void {
    if (this.selectedInvoices.size === 0) {
      this.showErrorMessage('Vui lòng chọn ít nhất một hóa đơn');
      return;
    }

    const selectedCount = this.selectedInvoices.size;
    const promises = Array.from(this.selectedInvoices).map(id => {
      return this.hoaDonService.updateTrangThaiHoaDonNew(id, newStatus).toPromise();
    });

    Promise.all(promises).then(() => {
      this.loadHoaDon();
      this.selectedInvoices.clear();
      this.showSuccessMessage(`Cập nhật trạng thái ${this.getStatusLabel(newStatus)} cho ${selectedCount} hóa đơn thành công!`);
    }).catch(error => {
      console.error('Error bulk updating status:', error);
      this.showErrorMessage('Lỗi khi cập nhật hàng loạt: ' + (error.error?.message || error.message || 'Unknown error'));
    });
  }

  bulkDeleteInvoices(): void {
    if (this.selectedInvoices.size === 0) {
      this.showErrorMessage('Vui lòng chọn ít nhất một hóa đơn');
      return;
    }

    const selectedCount = this.selectedInvoices.size;
    if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedCount} hóa đơn đã chọn?`)) {
      return;
    }

    const promises = Array.from(this.selectedInvoices).map(id => {
      return this.hoaDonService.deleteHoaDonNew(id).toPromise();
    });

    Promise.all(promises).then(() => {
      this.loadHoaDon();
      this.selectedInvoices.clear();
      this.showSuccessMessage(`Xóa ${selectedCount} hóa đơn thành công!`);
    }).catch(error => {
      console.error('Error bulk deleting invoices:', error);
      this.showErrorMessage('Lỗi khi xóa hàng loạt: ' + (error.error?.message || error.message || 'Unknown error'));
    });
  }

  // Form getters/setters for ngModel
  get currentInvoice(): Partial<HoaDonDTO> {
    return this.editingInvoice || this.newInvoice;
  }

  get maHoaDon(): string {
    return this.currentInvoice.maHoaDon || '';
  }

  set maHoaDon(value: string) {
    if (this.editingInvoice) {
      this.editingInvoice.maHoaDon = value;
    } else {
      this.newInvoice.maHoaDon = value;
    }
  }

  get trangThai(): string {
    return this.currentInvoice.trangThai || 'CHO_XAC_NHAN';
  }

  set trangThai(value: string) {
    if (this.editingInvoice) {
      this.editingInvoice.trangThai = value as any;
    } else {
      this.newInvoice.trangThai = value as any;
    }
  }

  get tenKhachHang(): string {
    return this.currentInvoice.tenKhachHang || '';
  }

  set tenKhachHang(value: string) {
    if (this.editingInvoice) {
      this.editingInvoice.tenKhachHang = value;
    } else {
      this.newInvoice.tenKhachHang = value;
    }
  }

  get emailKhachHang(): string {
    return this.currentInvoice.emailKhachHang || '';
  }

  set emailKhachHang(value: string) {
    if (this.editingInvoice) {
      this.editingInvoice.emailKhachHang = value;
    } else {
      this.newInvoice.emailKhachHang = value;
    }
  }

  get soDienThoaiKhachHang(): string {
    return this.currentInvoice.soDienThoaiKhachHang || '';
  }

  set soDienThoaiKhachHang(value: string) {
    if (this.editingInvoice) {
      this.editingInvoice.soDienThoaiKhachHang = value;
    } else {
      this.newInvoice.soDienThoaiKhachHang = value;
    }
  }

  get tenNhanVien(): string {
    return this.currentInvoice.tenNhanVien || '';
  }

  set tenNhanVien(value: string) {
    if (this.editingInvoice) {
      this.editingInvoice.tenNhanVien = value;
    } else {
      this.newInvoice.tenNhanVien = value;
    }
  }

  get tongTien(): number {
    return this.currentInvoice.tongTien || 0;
  }

  set tongTien(value: number) {
    if (this.editingInvoice) {
      this.editingInvoice.tongTien = value;
    } else {
      this.newInvoice.tongTien = value;
    }
    this.calculateFinalAmount();
  }

  get tienGiamGia(): number {
    return this.currentInvoice.tienGiamGia || 0;
  }

  set tienGiamGia(value: number) {
    if (this.editingInvoice) {
      this.editingInvoice.tienGiamGia = value;
    } else {
      this.newInvoice.tienGiamGia = value;
    }
    this.calculateFinalAmount();
  }

  get thanhTien(): number {
    return this.currentInvoice.thanhTien || 0;
  }

  set thanhTien(value: number) {
    if (this.editingInvoice) {
      this.editingInvoice.thanhTien = value;
    } else {
      this.newInvoice.thanhTien = value;
    }
  }

  get ghiChu(): string {
    return this.currentInvoice.ghiChu || '';
  }

  set ghiChu(value: string) {
    if (this.editingInvoice) {
      this.editingInvoice.ghiChu = value;
    } else {
      this.newInvoice.ghiChu = value;
    }
  }

  // Product management methods
  openAddProductModal(): void {
    this.newProduct = {
      tenSanPham: '',
      soLuong: 1,
      donGia: 0,
      thanhTien: 0,
      ghiChu: '',
      sanPhamId: null,
      soLuongTon: 0
    };
    this.editingProduct = null;
    this.showProductModal = true;
  }

  openEditProductModal(product: any, index: number): void {
    this.editingProduct = { ...product, index };
    this.newProduct = { 
      ...product,
      sanPhamId: product.sanPhamId || null,
      soLuongTon: product.soLuongTon || 0
    };
    this.showProductModal = true;
  }

  closeProductModal(): void {
    this.showProductModal = false;
    this.editingProduct = null;
    this.newProduct = {
      tenSanPham: '',
      soLuong: 1,
      donGia: 0,
      thanhTien: 0,
      ghiChu: '',
      sanPhamId: null,
      soLuongTon: 0
    };
  }

  calculateProductTotal(): void {
    const soLuong = this.newProduct.soLuong || 0;
    const donGia = this.newProduct.donGia || 0;
    this.newProduct.thanhTien = soLuong * donGia;
  }

  onProductSelected(event: any): void {
    const selectedProductName = event.target.value;
    const selectedProduct = this.availableProducts.find(p => p.tenSanPham === selectedProductName);
    
    if (selectedProduct) {
      this.newProduct.tenSanPham = selectedProduct.tenSanPham;
      this.newProduct.donGia = selectedProduct.donGia;
      this.newProduct.sanPhamId = selectedProduct.id; // Lưu ID sản phẩm
      this.newProduct.soLuongTon = selectedProduct.soLuongTon; // Lưu số lượng tồn
      this.calculateProductTotal();
      
      console.log('InvoiceManagementComponent: Selected product:', selectedProduct);
    }
  }

  saveProduct(): void {
    if (!this.newProduct.tenSanPham?.trim()) {
      this.showErrorMessage('Vui lòng chọn sản phẩm từ database');
      return;
    }
    if (!this.newProduct.soLuong || this.newProduct.soLuong <= 0) {
      this.showErrorMessage('Số lượng phải lớn hơn 0');
      return;
    }
    if (this.newProduct.soLuong > (this.newProduct.soLuongTon || 0)) {
      this.showErrorMessage(`Số lượng không được vượt quá tồn kho (${this.newProduct.soLuongTon || 0})`);
      return;
    }
    if (!this.newProduct.donGia || this.newProduct.donGia <= 0) {
      this.showErrorMessage('Đơn giá phải lớn hơn 0');
      return;
    }

    // Khởi tạo danh sách sản phẩm nếu chưa có
    if (!this.currentInvoice.danhSachSanPham) {
      this.currentInvoice.danhSachSanPham = [];
    }

    if (this.editingProduct) {
      // Cập nhật sản phẩm
      this.currentInvoice.danhSachSanPham[this.editingProduct.index] = { ...this.newProduct };
    } else {
      // Thêm sản phẩm mới
      this.currentInvoice.danhSachSanPham.push({ ...this.newProduct });
    }

    // Cập nhật tổng tiền
    this.updateTotalFromProducts();
    this.closeProductModal();
    this.showSuccessMessage(this.editingProduct ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!');
  }

  deleteProduct(index: number): void {
    if (this.currentInvoice.danhSachSanPham && this.currentInvoice.danhSachSanPham.length > index) {
      this.currentInvoice.danhSachSanPham.splice(index, 1);
      this.updateTotalFromProducts();
      this.showSuccessMessage('Xóa sản phẩm thành công!');
    }
  }

  updateTotalFromProducts(): void {
    if (this.currentInvoice.danhSachSanPham && this.currentInvoice.danhSachSanPham.length > 0) {
      const total = this.calculateTotalFromProducts(this.currentInvoice.danhSachSanPham);
      this.currentInvoice.tongTien = total;
      this.calculateFinalAmount();
    }
  }

  calculateTotalFromProducts(products: any[]): number {
    return products.reduce((total, product) => total + product.thanhTien, 0);
  }

}
