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

  // Math object for template
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
    danhSachSanPham: []
  };

  selectedInvoice: HoaDonDTO | null = null;
  editingInvoice: HoaDonDTO | null = null;

  // Additional properties for detail modal
  invoiceDetail: any = null;
  loadingDetail: boolean = false;
  isEditMode: boolean = false;
  editingInvoiceDetail: any = null;
  
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
    { value: 'card', label: 'Thẻ' },
    { value: 'transfer', label: 'Chuyển khoản' },
    { value: 'other', label: 'Khác' },
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
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.currentPage = 1;
      this.loadHoaDon();
    });
  }

  loadHoaDon(): void {
    const filter: HoaDonFilter = {
      page: this.currentPage - 1,
      size: this.itemsPerPage,
      sortBy: this.sortColumn,
      sortDir: this.sortDirection,
      search: this.searchTerm || undefined,
      trangThai: this.selectedStatus !== 'all' ? this.selectedStatus : undefined,
      paymentStatus: this.selectedPaymentStatus !== 'all' ? this.selectedPaymentStatus : undefined,
      paymentMethod: this.selectedPaymentMethod !== 'all' ? this.selectedPaymentMethod : undefined
    };

    this.hoaDonService.getHoaDonPaginated(filter).subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
        this.paginatedInvoices = response.hoaDonList || response.content || [];
        this.totalItems = response.totalItems || response.totalElements || 0;
        this.filteredInvoices = this.paginatedInvoices;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
        // Fallback to sample data if API fails
        this.loadSampleData();
      }
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
        danhSachSanPham: []
      }
    ];
    this.filteredInvoices = this.paginatedInvoices;
    this.totalItems = 1;
    this.cdr.detectChanges();
  }

  // Methods for template compatibility
  onSearchInput(event: any): void {
    const value = event.target.value;
    this.searchSubject.next(value);
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
      'invoiceNumber': 'maHoaDon',
      'customerName': 'tenKhachHang',
      'totalAmount': 'tongTien',
      'status': 'trangThai',
      'paymentStatus': 'ngayThanhToan',
      'paymentMethod': 'viTriBanHang',
      'createdAt': 'ngayTao'
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
      }
    });
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'CHO_XAC_NHAN': 'Chờ xác nhận',
      'DA_XAC_NHAN': 'Đã xác nhận',
      'DANG_GIAO_HANG': 'Đang giao hàng',
      'DA_GIAO_HANG': 'Đã giao hàng',
      'HUY': 'Hủy'
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
      'CHO_XAC_NHAN': 'badge-warning',
      'DA_XAC_NHAN': 'badge-primary',
      'DANG_GIAO_HANG': 'badge-info',
      'DA_GIAO_HANG': 'badge-success',
      'HUY': 'badge-danger',
    };
    return statusClasses[status] || 'badge-secondary';
  }

  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'CHO_XAC_NHAN': 'Chờ xác nhận',
      'DA_XAC_NHAN': 'Đã xác nhận',
      'DANG_GIAO_HANG': 'Đang giao hàng',
      'DA_GIAO_HANG': 'Đã giao hàng',
      'HUY': 'Hủy',
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
      'Tại quầy': 'Tại quầy',
      'Online': 'Online',
    };
    return methodLabels[method] || method;
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

  // CRUD Operations
  saveInvoice(): void {
    if (this.newInvoice.maHoaDon && this.newInvoice.tenKhachHang) {
      this.hoaDonService.createHoaDon(this.newInvoice).subscribe({
        next: (result) => {
          console.log('Invoice created:', result);
          this.closeModals();
          this.loadHoaDon();
          // Show success message
          alert('Tạo hóa đơn thành công!');
        },
        error: (error) => {
          console.error('Error creating invoice:', error);
          alert('Lỗi khi tạo hóa đơn: ' + error.message);
        }
      });
    } else {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
    }
  }

  updateInvoice(): void {
    if (this.editingInvoice && this.editingInvoice.id) {
      this.hoaDonService.updateHoaDonNew(this.editingInvoice.id, this.editingInvoice).subscribe({
        next: (result) => {
          console.log('Invoice updated:', result);
          this.closeModals();
          this.loadHoaDon();
          alert('Cập nhật hóa đơn thành công!');
        },
        error: (error) => {
          console.error('Error updating invoice:', error);
          alert('Lỗi khi cập nhật hóa đơn: ' + error.message);
        }
      });
    }
  }

  deleteInvoice(): void {
    if (this.selectedInvoice && this.selectedInvoice.id) {
      if (confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) {
    this.hoaDonService.deleteHoaDonNew(this.selectedInvoice.id).subscribe({
      next: () => {
            console.log('Invoice deleted');
        this.closeModals();
        this.loadHoaDon();
            alert('Xóa hóa đơn thành công!');
      },
      error: (error) => {
        console.error('Error deleting invoice:', error);
            alert('Lỗi khi xóa hóa đơn: ' + error.message);
          }
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
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
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
      danhSachSanPham: []
    };
  }
}