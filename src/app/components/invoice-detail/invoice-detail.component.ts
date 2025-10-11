import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HoaDonService } from '../../services/hoa-don.service';
import { HoaDonDTO } from '../../interfaces/hoa-don.interface';
import { Subject, interval, takeUntil } from 'rxjs';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss']
})

export class InvoiceDetailComponent implements OnInit, OnDestroy {
  invoiceId: number = 0;
  invoice: HoaDonDTO | null = null;
  customer: any = null;
  loading: boolean = true;
  error: string = '';
  isEditMode: boolean = false;
  editingInvoice: HoaDonDTO | null = null;

  // Auto-refreshhhh
  private destroy$ = new Subject<void>();
  private refreshInterval = interval(5000); // 5 seconds

  // Status mapping
  statusSteps = [
    { key: 'CHO_XAC_NHAN', label: 'Chờ xác nhận', iconClass: 'fas fa-clock', color: '#ffc107' },
    { key: 'DA_XAC_NHAN', label: 'Đã xác nhận', iconClass: 'fas fa-check-circle', color: '#17a2b8' },
    { key: 'DANG_GIAO_HANG', label: 'Đang giao hàng', iconClass: 'fas fa-truck', color: '#007bff' },
    { key: 'DA_GIAO_HANG', label: 'Đã giao hàng', iconClass: 'fas fa-box-open', color: '#28a745' },
    { key: 'HUY', label: 'Hủy', iconClass: 'fas fa-times-circle', color: '#dc3545' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hoaDonService: HoaDonService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.invoiceId = +params['id'];
      if (this.invoiceId) {
        this.loadInvoiceDetail();
        this.startAutoRefresh();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private startAutoRefresh(): void {
    this.refreshInterval.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (!this.isEditMode) {
        this.loadInvoiceDetail();
      }
    });
  }

  loadInvoiceDetail(): void {
    this.loading = true;
    this.error = '';

    this.hoaDonService.getHoaDonById(this.invoiceId).subscribe({
      next: (invoice) => {
        this.invoice = invoice;

        // Load customer information if khachHangId exists
        if (invoice.khachHangId) {
          this.hoaDonService.getCustomerById(invoice.khachHangId).subscribe({
            next: (customer) => {
              this.customer = customer;
              this.loading = false;
              this.cdr.detectChanges();
            },
            error: (error) => {
              console.error('Error loading customer:', error);
              this.customer = null;
              this.loading = false;
              this.cdr.detectChanges();
            }
          });
        } else {
          this.customer = null;
          this.loading = false;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error loading invoice detail:', error);
        this.error = 'Không thể tải thông tin hóa đơn';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });


  }


  goBack(): void {
    this.router.navigate(['/invoices']);
  }

  toggleEditMode(): void {
    if (this.isEditMode) {
      // Cancel edit mode
      this.isEditMode = false;
      this.editingInvoice = null;
      this.startAutoRefresh(); // Resume auto-refresh
    } else {
      // Enter edit mode
      this.isEditMode = true;
      this.editingInvoice = this.invoice ? { ...this.invoice } : null;
      this.destroy$.next(); // Stop auto-refresh during edit
    }
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.editingInvoice = null;
    this.startAutoRefresh(); // Resume auto-refresh
  }

  async saveChanges(): Promise<void> {
    if (this.editingInvoice && this.invoiceId) {
      // Validation
      if (!this.editingInvoice.tenKhachHang || this.editingInvoice.tenKhachHang.trim() === '') {
        alert('Vui lòng nhập tên khách hàng!');
        return;
      }

      if (!this.editingInvoice.tongTien || this.editingInvoice.tongTien <= 0) {
        alert('Tổng tiền phải lớn hơn 0!');
        return;
      }

      // Show loading state
      const saveButton = document.querySelector('.btn-success') as HTMLButtonElement;
      if (saveButton) {
        saveButton.disabled = true;
        saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
      }

      try {
        // Check if customer exists, if not create new one
        let customerId = this.editingInvoice.khachHangId;
        if (this.editingInvoice.tenKhachHang && this.editingInvoice.tenKhachHang.trim() !== '') {
          customerId = await this.createCustomerIfNotExists(this.editingInvoice.tenKhachHang.trim());
          this.editingInvoice.khachHangId = customerId;
        }

        // Chuẩn hóa dữ liệu trước khi gửi
        const invoiceData = {
          ...this.editingInvoice,
          tongTien: this.editingInvoice.tongTien ? Number(this.editingInvoice.tongTien) : 0,
          tienGiamGia: this.editingInvoice.tienGiamGia ? Number(this.editingInvoice.tienGiamGia) : 0,
          thanhTien: this.editingInvoice.thanhTien ? Number(this.editingInvoice.thanhTien) : 0,
          nhanVienId: this.editingInvoice.nhanVienId ? Number(this.editingInvoice.nhanVienId) : undefined,
          khachHangId: this.editingInvoice.khachHangId ? Number(this.editingInvoice.khachHangId) : undefined,
          // Chuẩn hóa định dạng ngày tháng
          ngayThanhToan: this.editingInvoice.ngayThanhToan ? this.formatDateTimeForAPI(this.editingInvoice.ngayThanhToan) : undefined,
          ngayTao: this.editingInvoice.ngayTao ? this.formatDateTimeForAPI(this.editingInvoice.ngayTao) : undefined
        };

        console.log('Sending invoice data:', invoiceData);

        this.hoaDonService.updateHoaDon(this.invoiceId, invoiceData).subscribe({
          next: (updatedInvoice) => {
            this.invoice = updatedInvoice;
            this.isEditMode = false;
            this.editingInvoice = null;
            this.startAutoRefresh(); // Resume auto-refresh

            // Reload customer information
            if (customerId) {
              this.loadCustomerInfo(customerId);
            }

            alert('Cập nhật hóa đơn thành công!');
          },
          error: (error) => {
            console.error('Error updating invoice:', error);
            alert('Lỗi khi cập nhật hóa đơn: ' + (error.error?.message || error.message));
          },
          complete: () => {
            // Reset button state
            if (saveButton) {
              saveButton.disabled = false;
              saveButton.innerHTML = '<i class="fas fa-save"></i> Lưu thay đổi';
            }
          }
        });
      } catch (error) {
        console.error('Error creating customer:', error);
        alert('Lỗi khi tạo khách hàng: ' + (error instanceof Error ? error.message : 'Unknown error'));

        // Reset button state
        if (saveButton) {
          saveButton.disabled = false;
          saveButton.innerHTML = '<i class="fas fa-save"></i> Lưu thay đổi';
        }
      }
    }
  }

  async createCustomerIfNotExists(customerName: string): Promise<number> {
    return new Promise((resolve, reject) => {
      // First, search for existing customer by name
      this.hoaDonService.searchCustomerByName(customerName).subscribe({
        next: (customers) => {
          if (customers && customers.length > 0) {
            // Customer exists, return the first match
            console.log('Customer found:', customers[0]);
            resolve(customers[0].id);
          } else {
            // Customer doesn't exist, create new one
            const newCustomer = {
              tenKhachHang: customerName,
              email: `${customerName.toLowerCase().replace(/\s+/g, '')}@example.com`,
              soDienThoai: 'Chưa có',
              gioiTinh: true,
              ngaySinh: new Date().toISOString().split('T')[0],
              diemTichLuy: 0,
              ngayTao: new Date().toISOString().split('T')[0],
              trangThai: true
            };

            this.hoaDonService.createCustomer(newCustomer).subscribe({
              next: (createdCustomer) => {
                console.log('New customer created:', createdCustomer);
                resolve(createdCustomer.id);
              },
              error: (error) => {
                console.error('Error creating customer:', error);
                reject(error);
              }
            });
          }
        },
        error: (error) => {
          console.error('Error searching customer:', error);
          reject(error);
        }
      });
    });
  }

  loadCustomerInfo(customerId: number): void {
    this.hoaDonService.getCustomerById(customerId).subscribe({
      next: (customer) => {
        this.customer = customer;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading customer info:', error);
        this.customer = null;
      }
    });
  }

  getCurrentStatusIndex(): number {
    if (!this.invoice) return 0;
    return this.statusSteps.findIndex(step => step.key === this.invoice!.trangThai);
  }

  getProgressPercentage(): number {
    const currentIndex = this.getCurrentStatusIndex();
    if (currentIndex === -1) return 0;
    return ((currentIndex + 1) / this.statusSteps.length) * 100;
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'CHO_XAC_NHAN': 'status-pending',
      'DA_XAC_NHAN': 'status-confirmed',
      'DANG_GIAO_HANG': 'status-shipping',
      'DA_GIAO_HANG': 'status-delivered',
      'HUY': 'status-cancelled'
    };
    return statusMap[status] || 'status-unknown';
  }

  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'CHO_XAC_NHAN': 'Chờ xác nhận',
      'DA_XAC_NHAN': 'Đã xác nhận',
      'DANG_GIAO_HANG': 'Đang giao hàng',
      'DA_GIAO_HANG': 'Đã giao hàng',
      'HUY': 'Hủy'
    };
    return statusMap[status] || status;
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

  printInvoice(): void {
    window.print();
  }
}
