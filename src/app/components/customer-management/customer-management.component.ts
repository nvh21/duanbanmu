import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService, Customer, CustomerPageResponse } from '../../services/customer.service';

@Component({
  selector: 'app-customer-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.scss'],
})
export class CustomerManagementComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;
  
  searchTerm: string = '';
  selectedStatus: string = 'all';
  
  isLoading: boolean = false;
  initialLoad: boolean = true;
  errorMessage: string = '';
  
  showModal: boolean = false;
  isEditMode: boolean = false;
  isViewMode: boolean = false;
  selectedCustomer: Customer | null = null;
  newCustomer: Partial<Customer> = {
    maKhachHang: '',
    tenKhachHang: '',
    email: '',
    soDienThoai: '',
    diaChi: null,
    ngaySinh: null,
    gioiTinh: false,
    trangThai: true,
  };
  
  ghiChu: string = '';
  addresses: Array<{
    id?: number;
    diaChiCuThe: string;
    tinhThanhPho: string;
    quanHuyen: string;
    xaPhuong: string;
    macDinh: boolean;
  }> = [];
  
  showAddressModal: boolean = false;
  editingAddressIndex: number | null = null;
  currentAddressIndex: number = 0;
  newAddress: {
    diaChiCuThe: string;
    tinhThanhPho: string;
    quanHuyen: string;
    xaPhuong: string;
    macDinh: boolean;
  } = {
    diaChiCuThe: '',
    tinhThanhPho: '',
    quanHuyen: '',
    xaPhuong: '',
    macDinh: false,
  };
  
  formErrors = {
    tenKhachHang: '',
    maKhachHang: '',
    email: '',
    soDienThoai: '',
    ngaySinh: '',
  };
  
  provinces: string[] = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'];
  districts: string[] = ['Quận 1', 'Quận 2', 'Quận 3', 'Huyện A', 'Huyện B'];
  wards: string[] = ['Phường 1', 'Phường 2', 'Xã A', 'Xã B'];

  constructor(
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initialLoad = true;
    this.loadCustomers();
  }

  loadCustomers(showLoading: boolean = false) {
    if (showLoading) {
      this.isLoading = true;
      this.cdr.markForCheck();
    }
    this.errorMessage = '';
    
    let statusParam: string | undefined = undefined;
    if (this.selectedStatus === 'active') {
      statusParam = 'active';
    } else if (this.selectedStatus === 'inactive') {
      statusParam = 'inactive';
    }
    
    const loadSize = (this.searchTerm && this.searchTerm.trim() !== '') ? 1000 : this.pageSize;
    const loadPage = (this.searchTerm && this.searchTerm.trim() !== '') ? 0 : this.currentPage;
    
    this.customerService
      .getCustomers(loadPage, loadSize, this.searchTerm || undefined, statusParam)
      .subscribe({
        next: (response: CustomerPageResponse) => {
          this.customers = response.content || [];
          this.applyFilters();
          
          if (!(this.searchTerm && this.searchTerm.trim() !== '') && this.selectedStatus === 'all') {
            this.totalElements = response.totalElements || 0;
            this.totalPages = response.totalPages || 0;
          }
          
          this.isLoading = false;
          this.initialLoad = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading customers:', error);
          this.isLoading = false;
          this.initialLoad = false;
          
          if (error.status === 0) {
            this.errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.';
          } else if (error.status === 404) {
            this.errorMessage = 'Không tìm thấy API endpoint. Vui lòng kiểm tra URL API.';
          } else {
            this.errorMessage = `Lỗi khi tải dữ liệu: ${error.message || 'Unknown error'}`;
          }
          
          this.cdr.markForCheck();
          alert(this.errorMessage);
        },
      });
  }

  onSearchChange() {
    this.currentPage = 0;
    this.loadCustomers(true);
  }

  applyFilters() {
    let tempFiltered = [...this.customers];
    
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const searchLower = this.searchTerm.toLowerCase().trim();
      tempFiltered = tempFiltered.filter(c => {
        return (
          (c.maKhachHang && c.maKhachHang.toLowerCase().includes(searchLower)) ||
          (c.tenKhachHang && c.tenKhachHang.toLowerCase().includes(searchLower)) ||
          (c.email && c.email.toLowerCase().includes(searchLower)) ||
          (c.soDienThoai && c.soDienThoai.toLowerCase().includes(searchLower))
        );
      });
    }
    
    if (this.selectedStatus === 'active') {
      tempFiltered = tempFiltered.filter(c => c.trangThai === true);
    } else if (this.selectedStatus === 'inactive') {
      tempFiltered = tempFiltered.filter(c => c.trangThai === false);
    }
    
    this.filteredCustomers = tempFiltered;
    
    if ((this.searchTerm && this.searchTerm.trim() !== '') || this.selectedStatus !== 'all') {
      this.totalElements = this.filteredCustomers.length;
      this.totalPages = Math.ceil(this.totalElements / this.pageSize) || 1;
      if (this.currentPage >= this.totalPages && this.totalPages > 0) {
        this.currentPage = this.totalPages - 1;
      }
      if (this.currentPage < 0) {
        this.currentPage = 0;
      }
    }
    
    this.cdr.markForCheck();
  }

  onStatusChange() {
    this.currentPage = 0;
    this.loadCustomers(true);
  }

  resetFilter() {
    this.searchTerm = '';
    this.selectedStatus = 'all';
    this.currentPage = 0;
    this.loadCustomers(true);
  }

  toggleCustomerStatus(customer: Customer) {
    const newStatus = !customer.trangThai;
    this.customerService.updateCustomerStatus(customer.id, newStatus).subscribe({
      next: () => {
        customer.trangThai = newStatus;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error updating customer status:', error);
        alert(`Có lỗi xảy ra khi cập nhật trạng thái: ${error.message || 'Unknown error'}`);
      },
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.isViewMode = false;
    this.selectedCustomer = null;
    this.newCustomer = {
      maKhachHang: '',
      tenKhachHang: '',
      email: '',
      soDienThoai: '',
      diaChi: null,
      ngaySinh: null,
      gioiTinh: false,
      trangThai: true,
    };
    this.ghiChu = '';
    this.addresses = [];
    this.currentAddressIndex = 0;
    this.resetFormErrors();
    this.showModal = true;
    this.cdr.markForCheck();
  }

  openEditModal(customer: Customer) {
    this.isEditMode = true;
    this.isViewMode = false;
    this.selectedCustomer = customer;
    this.newCustomer = {
      maKhachHang: customer.maKhachHang,
      tenKhachHang: customer.tenKhachHang,
      email: customer.email,
      soDienThoai: customer.soDienThoai,
      diaChi: customer.diaChi,
      ngaySinh: customer.ngaySinh,
      gioiTinh: customer.gioiTinh,
      trangThai: customer.trangThai,
    };
    if (customer.diaChi) {
      this.addresses = [{
        diaChiCuThe: customer.diaChi,
        tinhThanhPho: '',
        quanHuyen: '',
        xaPhuong: '',
        macDinh: true,
      }];
    } else {
      this.addresses = [];
    }
    this.currentAddressIndex = 0;
    this.resetFormErrors();
    this.showModal = true;
    this.cdr.markForCheck();
  }

  viewCustomer(customer: Customer) {
    this.isViewMode = true;
    this.isEditMode = false;
    this.selectedCustomer = customer;
    this.newCustomer = { ...customer };
    if (customer.diaChi) {
      this.addresses = [{
        diaChiCuThe: customer.diaChi,
        tinhThanhPho: '',
        quanHuyen: '',
        xaPhuong: '',
        macDinh: true,
      }];
    } else {
      this.addresses = [];
    }
    this.currentAddressIndex = 0;
    this.showModal = true;
    this.cdr.markForCheck();
  }

  closeModal() {
    this.showModal = false;
    this.isEditMode = false;
    this.isViewMode = false;
    this.selectedCustomer = null;
    this.cdr.markForCheck();
  }

  resetFormErrors() {
    this.formErrors = {
      tenKhachHang: '',
      maKhachHang: '',
      email: '',
      soDienThoai: '',
      ngaySinh: '',
    };
  }

  validateCustomerForm(): boolean {
    let hasError = false;

    if (!this.newCustomer.tenKhachHang || this.newCustomer.tenKhachHang.trim() === '') {
      this.formErrors.tenKhachHang = 'Tên khách hàng không được để trống';
      hasError = true;
    } else {
      this.formErrors.tenKhachHang = '';
    }

    if (!this.newCustomer.soDienThoai || this.newCustomer.soDienThoai.trim() === '') {
      this.formErrors.soDienThoai = 'Số điện thoại không được để trống';
      hasError = true;
    } else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(this.newCustomer.soDienThoai.trim())) {
      this.formErrors.soDienThoai = 'Số điện thoại không đúng định dạng';
      hasError = true;
    } else {
      this.formErrors.soDienThoai = '';
    }

    if (!this.newCustomer.email || this.newCustomer.email.trim() === '') {
      this.formErrors.email = 'Email không được để trống';
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.newCustomer.email.trim())) {
        this.formErrors.email = 'Email không đúng định dạng';
        hasError = true;
      } else {
        this.formErrors.email = '';
      }
    }

    if (!this.isViewMode && this.isEditMode) {
      if (!this.newCustomer.maKhachHang || this.newCustomer.maKhachHang.trim() === '') {
        this.formErrors.maKhachHang = 'Mã khách hàng không được để trống';
        hasError = true;
      } else if (!/^KH\d{6}$/.test(this.newCustomer.maKhachHang.trim())) {
        this.formErrors.maKhachHang = 'Mã khách hàng phải có định dạng KHxxxxxx';
        hasError = true;
      } else {
        this.formErrors.maKhachHang = '';
      }
    } else {
      this.formErrors.maKhachHang = '';
    }

    if (this.newCustomer.ngaySinh) {
      const birthDate = new Date(this.newCustomer.ngaySinh);
      const today = new Date();
      if (birthDate > today) {
        this.formErrors.ngaySinh = 'Ngày sinh không thể lớn hơn ngày hiện tại';
        hasError = true;
      } else {
        this.formErrors.ngaySinh = '';
      }
    } else {
      this.formErrors.ngaySinh = '';
    }

    return !hasError;
  }

  saveCustomer(form: any) {
    if (!this.validateCustomerForm()) {
      return;
    }

    if (this.isEditMode && this.selectedCustomer) {
      this.customerService
        .updateCustomer(this.selectedCustomer.id, this.newCustomer)
        .subscribe({
          next: () => {
            this.loadCustomers(true);
            this.closeModal();
            this.cdr.markForCheck();
          },
          error: (error) => {
            console.error('Error updating customer:', error);
            alert('Có lỗi xảy ra khi cập nhật khách hàng');
          },
        });
    } else {
      this.customerService.createCustomer(this.newCustomer).subscribe({
        next: () => {
          this.loadCustomers(true);
          this.closeModal();
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error creating customer:', error);
          alert('Có lỗi xảy ra khi tạo khách hàng');
        },
      });
    }
  }

  deleteCustomer(customer: Customer) {
    if (confirm(`Bạn có chắc chắn muốn xóa khách hàng "${customer.tenKhachHang}"?`)) {
      this.customerService.deleteCustomer(customer.id).subscribe({
        next: () => {
          this.loadCustomers(true);
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error deleting customer:', error);
          alert('Có lỗi xảy ra khi xóa khách hàng');
        },
      });
    }
  }

  getStatusText(status: boolean): string {
    return status ? 'Kích Hoạt' : 'Đã Hủy';
  }

  getStatusClass(status: boolean): string {
    return status ? 'status-badge active' : 'status-badge inactive';
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadCustomers(true);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = Math.min(5, this.totalPages);
    let startPage = Math.max(0, this.currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + maxPages - 1);
    
    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(0, endPage - maxPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  getStartIndex(): number {
    if (this.totalElements === 0) return 0;
    return this.currentPage * this.pageSize + 1;
  }

  getPaginatedCustomers(): Customer[] {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredCustomers.slice(start, end);
  }

  getEndIndex(): number {
    if (this.totalElements === 0) return 0;
    const totalItems = (this.searchTerm && this.searchTerm.trim() !== '') || this.selectedStatus !== 'all' 
      ? this.filteredCustomers.length 
      : this.totalElements;
    return Math.min((this.currentPage + 1) * this.pageSize, totalItems);
  }

  onPageSizeChange() {
    this.currentPage = 0;
    this.loadCustomers(true);
  }

  exportExcel() {
    alert('Chức năng xuất Excel sẽ được phát triển');
  }

  importExcel() {
    alert('Chức năng nhập từ Excel sẽ được phát triển');
  }

  downloadTemplate() {
    alert('Chức năng tải mẫu Excel sẽ được phát triển');
  }

  openAddAddressModal() {
    this.editingAddressIndex = null;
    this.showAddressModal = true;
    this.newAddress = {
      diaChiCuThe: '',
      tinhThanhPho: '',
      quanHuyen: '',
      xaPhuong: '',
      macDinh: false,
    };
    this.cdr.markForCheck();
  }
  
  openEditAddressModal(index: number) {
    this.editingAddressIndex = index;
    const address = this.addresses[index];
    this.newAddress = {
      diaChiCuThe: address.diaChiCuThe,
      tinhThanhPho: address.tinhThanhPho,
      quanHuyen: address.quanHuyen,
      xaPhuong: address.xaPhuong,
      macDinh: address.macDinh,
    };
    this.showAddressModal = true;
    this.cdr.markForCheck();
  }

  closeAddressModal() {
    this.showAddressModal = false;
    this.newAddress = {
      diaChiCuThe: '',
      tinhThanhPho: '',
      quanHuyen: '',
      xaPhuong: '',
      macDinh: false,
    };
    this.editingAddressIndex = null;
    this.cdr.markForCheck();
  }

  addAddress() {
    if (!this.newAddress.diaChiCuThe.trim()) {
      alert('Vui lòng nhập địa chỉ cụ thể');
      return;
    }

    if (this.newAddress.macDinh) {
      this.addresses.forEach(addr => addr.macDinh = false);
    }

    if (this.editingAddressIndex !== null) {
      this.addresses[this.editingAddressIndex] = { ...this.newAddress };
    } else {
      this.addresses.push({ ...this.newAddress });
    }

    this.closeAddressModal();
    if (this.addresses.length > 0) {
      this.currentAddressIndex = this.addresses.length - 1;
    }
    this.cdr.markForCheck();
  }

  clearAddressInput() {
    this.newAddress.diaChiCuThe = '';
    this.cdr.markForCheck();
  }

  removeAddress(index: number) {
    if (confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      this.addresses.splice(index, 1);
      if (this.currentAddressIndex >= this.addresses.length && this.addresses.length > 0) {
        this.currentAddressIndex = this.addresses.length - 1;
      } else if (this.addresses.length === 0) {
        this.currentAddressIndex = 0;
      }
      this.cdr.markForCheck();
    }
  }

  getCurrentAddress() {
    return this.addresses[this.currentAddressIndex] || null;
  }

  goToPreviousAddress() {
    if (this.currentAddressIndex > 0) {
      this.currentAddressIndex--;
      this.cdr.markForCheck();
    }
  }

  goToNextAddress() {
    if (this.currentAddressIndex < this.addresses.length - 1) {
      this.currentAddressIndex++;
      this.cdr.markForCheck();
    }
  }

  setDefaultAddress(index: number) {
    this.addresses.forEach(addr => addr.macDinh = false);
    this.addresses[index].macDinh = true;
    this.cdr.markForCheck();
  }
}
