import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PhieuGiamGiaService } from '../../services/phieu-giam-gia.service';
import { PhieuGiamGiaRequest, KhachHang } from '../../interfaces/phieu-giam-gia.interface';

@Component({
  selector: 'app-phieu-giam-gia-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './phieu-giam-gia-form.component.html',
  styleUrls: ['./phieu-giam-gia-form.component.scss']
})
export class PhieuGiamGiaFormComponent implements OnInit {
  
  private phieuGiamGiaService = inject(PhieuGiamGiaService);
  private router = inject(Router);
  
  // Form data
  phieuCode = '';
  phieuName = '';
  phieuType: boolean = true; // true = tiền mặt, false = phần trăm
  maxDiscount = 0;
  minDiscount = 0; // Số tiền giảm tối thiểu
  minInvoice = 0;
  quantity = 0;
  startDate = '';
  endDate = '';
  trangThai = true; // Trạng thái: true = hoạt động, false = không hoạt động

  // Suggested codes
  suggestedCodes: string[] = [];
  showSuggestions = false;
  
  // Customer selection
  searchTerm = '';
  selectedCustomers: KhachHang[] = [];
  customers: KhachHang[] = [];
  filteredCustomers: KhachHang[] = [];
  
  // Loading states
  isLoading = false;
  isSaving = false;
  
  // Error handling
  errorMessage = '';
  successMessage = '';

  ngOnInit() {
    this.initializeForm();
    this.loadCustomers();
  }

  initializeForm() {
    // Generate suggested codes
    this.generateSuggestedCodes();
    
    // Set default dates
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    
    this.startDate = this.formatDateForInput(today);
    this.endDate = this.formatDateForInput(nextMonth);
  }

  loadCustomers() {
    this.isLoading = true;
    this.phieuGiamGiaService.getAllCustomers().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.customers = response.data;
          this.filteredCustomers = this.customers;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading customers:', error);
        this.errorMessage = 'Không thể tải danh sách khách hàng';
        this.isLoading = false;
      }
    });
  }

  // Customer search and selection
  filterCustomers() {
    if (!this.searchTerm.trim()) {
      this.filteredCustomers = this.customers;
    } else {
      const searchLower = this.searchTerm.toLowerCase();
      this.filteredCustomers = this.customers.filter(customer =>
        customer.maKhachHang.toLowerCase().includes(searchLower) ||
        customer.tenKhachHang.toLowerCase().includes(searchLower)
      );
    }
  }

  selectCustomer(customer: KhachHang) {
    if (!this.selectedCustomers.find(c => c.id === customer.id)) {
      this.selectedCustomers.push(customer);
    }
  }

  removeCustomer(customer: KhachHang) {
    this.selectedCustomers = this.selectedCustomers.filter(c => c.id !== customer.id);
  }

  // Helper method to check if customer is selected
  isCustomerSelected(customer: KhachHang): boolean {
    return this.selectedCustomers.some(c => c.id === customer.id);
  }

  // Form validation
  validateForm(): boolean {
    this.errorMessage = '';
    
    if (!this.phieuCode.trim()) {
      this.errorMessage = 'Mã phiếu không được để trống';
      return false;
    }
    
    if (!this.phieuName.trim()) {
      this.errorMessage = 'Tên phiếu không được để trống';
      return false;
    }
    
    if (this.maxDiscount <= 0) {
      this.errorMessage = 'Số tiền giảm tối đa phải lớn hơn 0';
      return false;
    }

    if (this.minDiscount < 0) {
      this.errorMessage = 'Số tiền giảm tối thiểu không được âm';
      return false;
    }

    if (this.minDiscount > this.maxDiscount) {
      this.errorMessage = 'Số tiền giảm tối thiểu không được lớn hơn số tiền giảm tối đa';
      return false;
    }
    
    if (this.minInvoice < 0) {
      this.errorMessage = 'Hóa đơn tối thiểu không được âm';
      return false;
    }
    
    if (this.quantity <= 0) {
      this.errorMessage = 'Số lượng phải lớn hơn 0';
      return false;
    }
    
    if (!this.startDate || !this.endDate) {
      this.errorMessage = 'Ngày bắt đầu và ngày kết thúc không được để trống';
      return false;
    }
    
    if (new Date(this.startDate) >= new Date(this.endDate)) {
      this.errorMessage = 'Ngày bắt đầu phải trước ngày kết thúc';
      return false;
    }
    
    return true;
  }

  // Save phiếu giảm giá
  savePhieuGiamGia() {
    if (!this.validateForm()) {
      return;
    }
    
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const phieuData: PhieuGiamGiaRequest = {
      maPhieu: this.phieuCode,
      tenPhieuGiamGia: this.phieuName,
      loaiPhieuGiamGia: this.phieuType,
      giaTriGiam: this.maxDiscount,
      giaTriToiThieu: this.minDiscount, // Sử dụng minDiscount cho giaTriToiThieu
      soTienToiDa: this.maxDiscount,
      hoaDonToiThieu: this.minInvoice,
      soLuongDung: this.quantity,
      ngayBatDau: this.phieuGiamGiaService.formatDateForAPI(this.startDate),
      ngayKetThuc: this.phieuGiamGiaService.formatDateForAPI(this.endDate),
      trangThai: this.trangThai
    };
    
    this.phieuGiamGiaService.createPhieuGiamGia(phieuData).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.successMessage = 'Tạo phiếu giảm giá thành công!';
          
          // Reset form after successful creation
          setTimeout(() => {
            this.initializeForm();
            this.selectedCustomers = [];
            this.successMessage = '';
          }, 2000);
        } else {
          this.errorMessage = response.message || 'Không thể tạo phiếu giảm giá';
        }
        this.isSaving = false;
      },
      error: (error: any) => {
        console.error('Error creating phiếu giảm giá:', error);
        this.errorMessage = 'Lỗi khi tạo phiếu giảm giá: ' + error.message;
        this.isSaving = false;
      }
    });
  }

  // Navigation
  goBack() {
    this.router.navigate(['/dashboard']);
  }

  navigateToHome() {
    this.router.navigate(['/dashboard']);
  }

  // Utility methods
  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getPhieuTypeText(): string {
    return this.phieuType ? 'Tiền mặt' : 'Phần trăm';
  }

  getGenderText(gender: boolean): string {
    return gender ? 'Nam' : 'Nữ';
  }

  // Generate suggested codes
  generateSuggestedCodes() {
    this.suggestedCodes = [
      this.phieuGiamGiaService.generatePhieuCode(),
      this.phieuGiamGiaService.generatePhieuCode(),
      this.phieuGiamGiaService.generatePhieuCode(),
      this.phieuGiamGiaService.generatePhieuCode(),
      this.phieuGiamGiaService.generatePhieuCode()
    ];
  }

  // Select suggested code
  selectSuggestedCode(code: string) {
    this.phieuCode = code;
    this.showSuggestions = false;
  }

  // Toggle suggestions
  toggleSuggestions() {
    this.showSuggestions = !this.showSuggestions;
  }

  // Generate new suggestions
  generateNewSuggestions() {
    this.generateSuggestedCodes();
  }

  // Handle input focus
  onCodeInputFocus() {
    this.showSuggestions = true;
  }

  // Handle input blur (with delay to allow clicking suggestions)
  onCodeInputBlur() {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }
}
