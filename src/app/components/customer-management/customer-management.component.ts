import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Customer, CustomerRequestData } from '../../interfaces/customer.interface';
import { Address, AddressFormData, Province, District, Ward } from '../../interfaces/address.interface';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-management',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './customer-management.component.html',
  styleUrl: './customer-management.component.scss'
})
export class CustomerManagementComponent implements OnInit {
  // Customer data
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  paginatedCustomers: Customer[] = [];
  
  // Loading and error states
  isLoading = false;
  error: string | null = null;
  
  // Modal states
  showAddModal = false;
  showEditModal = false;
  showViewModal = false;
  selectedCustomer: Customer | null = null;
  editingCustomer: Customer | null = null;
  
  // Customer form data
  customerForm = {
    ho_ten: '',
    email: '',
    so_dien_thoai: '',
    ngay_sinh: new Date(),
    gioi_tinh: true, // true = Nam, false = Nữ
    // Các trường bổ sung cho form
    name: '',
    phone: '',
    dateOfBirth: new Date(),
    gender: 'Nam',
    address: '',
    notes: ''
  };

  // Validation errors
  customerFormErrors: any = {};
  addressFormErrors: any = {};

  // Search and filter
  searchTerm = '';
  statusFilter = 'all'; // 'all', 'active', 'inactive'
  pointsFilter = 'all'; // 'all', 'high', 'medium', 'low'
  dateFilter = 'all'; // 'all', 'today', 'week', 'month'

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  
  // Sorting
  sortField = 'ho_ten';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Address management
  addresses: Address[] = [];
  showAddressAddModal = false;
  showAddressEditModal = false;
  selectedAddress: Address | null = null;
  currentAddressIndex = 0;
  newAddress = {
    diaChi: '',
    tinhThanh: '',
    quanHuyen: '',
    phuongXa: '',
    tenNguoiNhan: '',
    soDienThoai: '',
    macDinh: false
  };

  // Address form data
  addressForm: AddressFormData = {
    specificAddress: '',
    province: '',
    district: '',
    ward: '',
    isDefault: false
  };
  
  // Location data
  provinces: Province[] = [];
  districts: District[] = [];
  wards: Ward[] = [];
  filteredDistricts: District[] = [];
  filteredWards: Ward[] = [];

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    console.log('🚀 Customer Management Component initialized');
    
    // Load dữ liệu ngay lập tức
    this.loadLocationData();
    this.isLoading = false; // Không hiển thị loading
    this.loadFromLocalStorage(); // Load từ cache ngay lập tức
    this.loadCustomers(); // Load từ backend ngầm
  }

  loadFromLocalStorage() {
    try {
      const cachedCustomers = localStorage.getItem('customers');
      if (cachedCustomers) {
        this.customers = JSON.parse(cachedCustomers);
    this.applyFilters();
        console.log('📦 Loaded customers from cache:', this.customers.length);
      }
    } catch (error) {
      console.error('❌ Error loading from cache:', error);
    }
  }

  loadCustomers() {
    this.error = null;
    // Không set loading state - load ngầm
    
    // Load từ backend để cập nhật dữ liệu mới nhất
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        console.log('✅ Customers loaded from backend:', customers);
        // Xử lý dữ liệu từ Spring Boot (có thể là array hoặc object với data property)
        this.customers = Array.isArray(customers) ? customers : (customers as any).data || [];
        this.saveToLocalStorage();
        this.applyFilters();
        // Không cần clear loading state vì không có loading
      },
      error: (error) => {
        console.error('❌ Error loading from backend:', error);
        
        // Fallback to localStorage nếu backend lỗi
        this.loadFromLocalStorage();
        this.error = 'Không thể tải dữ liệu mới từ server. Đang hiển thị dữ liệu cache.';
        // Không cần clear loading state vì không có loading
      }
    });
  }

  loadSampleData() {
    // Fallback sample data với cấu trúc database mới từ backend
    this.customers = [
      {
        id: 1,
        ho_ten: 'Nguyen Van An',
        email: 'an@email.com',
        so_dien_thoai: '0123456789',
        ngay_sinh: new Date('1990-01-15'),
        gioi_tinh: true, // Nam
        ngay_tao: new Date('2024-06-10'),
        diem_tich_luy: 100,
        trang_thai: true, // Active
        // Các trường bổ sung cho hiển thị
        name: 'Nguyen Van An',
        phone: '0123456789',
        dateOfBirth: new Date('1990-01-15'),
        gender: 'Nam',
        registrationDate: new Date('2024-06-10'),
        totalSpent: 1000000,
        status: 'Active',
        diemTichLuy: 100,
        userId: undefined,
        diaChi: [{
          id: 1,
          tenDiaChi: 'Nha rieng An',
          thanhPho: 'Ha Noi',
          quan: 'Cau Giay',
          phuong: 'Dich Vong',
          diaChiCuThe: 'So 123 Duong ABC',
          macDinh: true
        }]
      },
      {
        id: 2,
        ho_ten: 'Tran Thi Binh',
        email: 'binh@email.com',
        so_dien_thoai: '0987654321',
        ngay_sinh: new Date('1985-05-20'),
        gioi_tinh: false, // Nữ
        ngay_tao: new Date('2024-06-10'),
        diem_tich_luy: 200,
        trang_thai: true, // Active
        // Các trường bổ sung cho hiển thị
        name: 'Tran Thi Binh',
        phone: '0987654321',
        dateOfBirth: new Date('1985-05-20'),
        gender: 'Nữ',
        registrationDate: new Date('2024-06-10'),
        totalSpent: 2000000,
        status: 'Active',
        diemTichLuy: 200,
        userId: undefined,
        diaChi: [{
          id: 2,
          tenDiaChi: 'Nha rieng Binh',
          thanhPho: 'TP HCM',
          quan: 'Quan 1',
          phuong: 'Ben Nghe',
          diaChiCuThe: 'So 456 Duong DEF',
          macDinh: true
        }]
      },
      {
        id: 3,
        ho_ten: 'Le Van Cuong',
        email: 'cuong@email.com',
        so_dien_thoai: '0111111111',
        ngay_sinh: new Date('1992-02-10'),
        gioi_tinh: true, // Nam
        ngay_tao: new Date('2024-06-10'),
        diem_tich_luy: 150,
        trang_thai: true, // Active
        // Các trường bổ sung cho hiển thị
        name: 'Le Van Cuong',
        phone: '0111111111',
        dateOfBirth: new Date('1992-02-10'),
        gender: 'Nam',
        registrationDate: new Date('2024-06-10'),
        totalSpent: 1500000,
        status: 'Active',
        diemTichLuy: 150,
        userId: undefined,
        diaChi: [{
          id: 3,
          tenDiaChi: 'Nha rieng Cuong',
          thanhPho: 'Da Nang',
          quan: 'Hai Chau',
          phuong: 'Thach Thang',
          diaChiCuThe: 'So 789 Duong GHI',
          macDinh: true
        }]
      },
      {
        id: 4,
        ho_ten: 'Pham Thi Dung',
        email: 'dung@email.com',
        so_dien_thoai: '0222222222',
        ngay_sinh: new Date('1993-03-12'),
        gioi_tinh: false, // Nữ
        ngay_tao: new Date('2024-06-10'),
        diem_tich_luy: 120,
        trang_thai: true, // Active
        // Các trường bổ sung cho hiển thị
        name: 'Pham Thi Dung',
        phone: '0222222222',
        dateOfBirth: new Date('1993-03-12'),
        gender: 'Nữ',
        registrationDate: new Date('2024-06-10'),
        totalSpent: 1200000,
        status: 'Active',
        diemTichLuy: 120,
        userId: undefined,
        diaChi: [{
          id: 4,
          tenDiaChi: 'Nha rieng Dung',
          thanhPho: 'Hai Phong',
          quan: 'Ngo Quyen',
          phuong: 'May To',
          diaChiCuThe: 'So 101 Duong JKL',
          macDinh: true
        }]
      },
      {
        id: 5,
        ho_ten: 'Hoang Van Em',
        email: 'em@email.com',
        so_dien_thoai: '0333333333',
        ngay_sinh: new Date('1994-04-14'),
        gioi_tinh: true, // Nam
        ngay_tao: new Date('2024-06-10'),
        diem_tich_luy: 180,
        trang_thai: true, // Active
        // Các trường bổ sung cho hiển thị
        name: 'Hoang Van Em',
        phone: '0333333333',
        dateOfBirth: new Date('1994-04-14'),
        gender: 'Nam',
        registrationDate: new Date('2024-06-10'),
        totalSpent: 1800000,
        status: 'Active',
        diemTichLuy: 180,
        userId: undefined,
        diaChi: [{
          id: 5,
          tenDiaChi: 'Nha rieng Em',
          thanhPho: 'Can Tho',
          quan: 'Ninh Kieu',
          phuong: 'Xuan Khanh',
          diaChiCuThe: 'So 202 Duong MNO',
          macDinh: true
        }]
      },
      {
        id: 6,
        ho_ten: 'Ngo Thi Phuong',
        email: 'phuong@email.com',
        so_dien_thoai: '0444444444',
        ngay_sinh: new Date('1995-05-16'),
        gioi_tinh: false, // Nữ
        ngay_tao: new Date('2024-06-10'),
        diem_tich_luy: 160,
        trang_thai: true, // Active
        // Các trường bổ sung cho hiển thị
        name: 'Ngo Thi Phuong',
        phone: '0444444444',
        dateOfBirth: new Date('1995-05-16'),
        gender: 'Nữ',
        registrationDate: new Date('2024-06-10'),
        totalSpent: 1600000,
        status: 'Active',
        diemTichLuy: 160,
        userId: undefined,
        diaChi: [{
          id: 6,
          tenDiaChi: 'Nha rieng Phuong',
          thanhPho: 'Hue',
          quan: 'Phu Nhuan',
          phuong: 'Phu Hoi',
          diaChiCuThe: 'So 303 Duong PQR',
          macDinh: true
        }]
      },
      {
        id: 7,
        ho_ten: 'Do Van Giang',
        email: 'giang@email.com',
        so_dien_thoai: '0555555555',
        ngay_sinh: new Date('1996-06-18'),
        gioi_tinh: true, // Nam
        ngay_tao: new Date('2024-06-10'),
        diem_tich_luy: 170,
        trang_thai: true, // Active
        // Các trường bổ sung cho hiển thị
        name: 'Do Van Giang',
        phone: '0555555555',
        dateOfBirth: new Date('1996-06-18'),
        gender: 'Nam',
        registrationDate: new Date('2024-06-10'),
        totalSpent: 1700000,
        status: 'Active',
        diemTichLuy: 170,
        userId: undefined,
        diaChi: [{
          id: 7,
          tenDiaChi: 'Nha rieng Giang',
          thanhPho: 'Quang Ninh',
          quan: 'Ha Long',
          phuong: 'Bai Chay',
          diaChiCuThe: 'So 404 Duong STU',
          macDinh: true
        }]
      },
      {
        id: 8,
        ho_ten: 'Bui Thi Hoa',
        email: 'hoa@email.com',
        so_dien_thoai: '0666666666',
        ngay_sinh: new Date('1997-07-20'),
        gioi_tinh: false, // Nữ
        ngay_tao: new Date('2024-06-10'),
        diem_tich_luy: 190,
        trang_thai: true, // Active
        // Các trường bổ sung cho hiển thị
        name: 'Bui Thi Hoa',
        phone: '0666666666',
        dateOfBirth: new Date('1997-07-20'),
        gender: 'Nữ',
        registrationDate: new Date('2024-06-10'),
        totalSpent: 1900000,
        status: 'Active',
        diemTichLuy: 190,
        userId: undefined,
        diaChi: [{
          id: 8,
          tenDiaChi: 'Nha rieng Hoa',
          thanhPho: 'Binh Duong',
          quan: 'Thu Dau Mot',
          phuong: 'Phu Hoa',
          diaChiCuThe: 'So 505 Duong VWX',
          macDinh: true
        }]
      },
      {
        id: 9,
        ho_ten: 'Vu Van Inh',
        email: 'inh@email.com',
        so_dien_thoai: '0777777777',
        ngay_sinh: new Date('1998-08-22'),
        gioi_tinh: true, // Nam
        ngay_tao: new Date('2024-06-10'),
        diem_tich_luy: 110,
        trang_thai: true, // Active
        // Các trường bổ sung cho hiển thị
        name: 'Vu Van Inh',
        phone: '0777777777',
        dateOfBirth: new Date('1998-08-22'),
        gender: 'Nam',
        registrationDate: new Date('2024-06-10'),
        totalSpent: 1100000,
        status: 'Active',
        diemTichLuy: 110,
        userId: undefined,
        diaChi: [{
          id: 9,
          tenDiaChi: 'Nha rieng Inh',
          thanhPho: 'Nghe An',
          quan: 'Vinh',
          phuong: 'Hung Dung',
          diaChiCuThe: 'So 606 Duong YZA',
          macDinh: true
        }]
      },
      {
        id: 10,
        ho_ten: 'Phan Thi J',
        email: 'j@email.com',
        so_dien_thoai: '0888888888',
        ngay_sinh: new Date('1999-09-24'),
        gioi_tinh: false, // Nữ
        ngay_tao: new Date('2024-06-10'),
        diem_tich_luy: 130,
        trang_thai: true, // Active
        // Các trường bổ sung cho hiển thị
        name: 'Phan Thi J',
        phone: '0888888888',
        dateOfBirth: new Date('1999-09-24'),
        gender: 'Nữ',
        registrationDate: new Date('2024-06-10'),
        totalSpent: 1300000,
        status: 'Active',
        diemTichLuy: 130,
        userId: undefined,
        diaChi: [{
          id: 10,
          tenDiaChi: 'Nha rieng J',
          thanhPho: 'Thanh Hoa',
          quan: 'Thanh Hoa',
          phuong: 'Dong Huong',
          diaChiCuThe: 'So 707 Duong BCD',
          macDinh: true
        }]
      },
      // Thêm một số khách hàng Inactive để test
      {
        id: 11,
        ho_ten: 'Tran Van K',
        email: 'k@email.com',
        so_dien_thoai: '0999999999',
        ngay_sinh: new Date('1980-01-01'),
        gioi_tinh: true, // Nam
        ngay_tao: new Date('2024-01-01'),
        diem_tich_luy: 50,
        trang_thai: false, // Inactive
        // Các trường bổ sung cho hiển thị
        name: 'Tran Van K',
        phone: '0999999999',
        dateOfBirth: new Date('1980-01-01'),
        gender: 'Nam',
        registrationDate: new Date('2024-01-01'),
        totalSpent: 500000,
        status: 'Inactive',
        diemTichLuy: 50,
        userId: undefined,
        diaChi: [{
          id: 11,
          tenDiaChi: 'Nha rieng K',
          thanhPho: 'Vung Tau',
          quan: 'Vung Tau',
          phuong: 'Thang Tam',
          diaChiCuThe: 'So 808 Duong EFG',
          macDinh: true
        }]
      },
      {
        id: 12,
        ho_ten: 'Le Thi L',
        email: 'l@email.com',
        so_dien_thoai: '0888888888',
        ngay_sinh: new Date('1985-02-02'),
        gioi_tinh: false, // Nữ
        ngay_tao: new Date('2024-02-02'),
        diem_tich_luy: 30,
        trang_thai: false, // Inactive
        // Các trường bổ sung cho hiển thị
        name: 'Le Thi L',
        phone: '0888888888',
        dateOfBirth: new Date('1985-02-02'),
        gender: 'Nữ',
        registrationDate: new Date('2024-02-02'),
        totalSpent: 300000,
        status: 'Inactive',
        diemTichLuy: 30,
        userId: undefined,
        diaChi: [{
          id: 12,
          tenDiaChi: 'Nha rieng L',
          thanhPho: 'Nha Trang',
          quan: 'Nha Trang',
          phuong: 'Loc Tho',
          diaChiCuThe: 'So 909 Duong HIJ',
          macDinh: true
        }]
      }
    ];
    this.saveToLocalStorage();
    this.applyFilters();
  }

  // Validation errors
  customerErrors: any = {};
  addressErrors: any = {};

  // Clear errors when user starts typing
  clearError(field: string): void {
    if (this.customerErrors[field]) {
      delete this.customerErrors[field];
    }
  }

  clearAddressError(field: string): void {
    if (this.addressErrors[field]) {
      delete this.addressErrors[field];
    }
  }

  // Address helper methods
  getAddressSpecific(address: Address): string {
    return address.specificAddress || address.diaChiCuThe || 'Chưa có thông tin';
  }

  getAddressProvince(address: Address): string {
    return address.province || address.thanhPho || 'Chưa có thông tin';
  }

  getAddressDistrict(address: Address): string {
    return address.district || address.quan || 'Chưa có thông tin';
  }

  getAddressWard(address: Address): string {
    return address.ward || address.phuong || 'Chưa có thông tin';
  }

  getAddressDefault(address: Address): boolean {
    return address.isDefault || address.mac_dinh || false;
  }

  editAddress(address: Address): void {
    this.selectedAddress = address;
    this.showAddressEditModal = true;
    this.showAddressAddModal = false;
  }

  deleteAddress(address: Address): void {
    if (confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      const index = this.addresses.findIndex(a => a.id === address.id);
      if (index > -1) {
        this.addresses.splice(index, 1);
        if (this.currentAddressIndex >= this.addresses.length) {
          this.currentAddressIndex = Math.max(0, this.addresses.length - 1);
        }
        // Address deleted successfully
      }
    }
  }

  toggleDefaultAddress(address: Address): void {
    // Bỏ mặc định tất cả địa chỉ khác
    this.addresses.forEach(addr => {
      if (addr.id !== address.id) {
        addr.isDefault = false;
        addr.mac_dinh = false;
        addr.macDinh = false;
      }
    });
    
    // Đặt địa chỉ này làm mặc định
    address.isDefault = !address.isDefault;
    address.mac_dinh = address.isDefault;
    address.macDinh = address.isDefault;
    
    // Default address updated successfully
  }


  // Customer Form Methods
  saveCustomer() {
    // Clear previous errors
    this.customerFormErrors = {};
    this.addressFormErrors = {};
    
    // Validation cơ bản
    if (!this.validateCustomerForm()) {
      return;
    }

    // Validation địa chỉ
    if (!this.validateAddresses()) {
      return;
    }

    // Không sử dụng loading state

    // Tạo địa chỉ chính từ địa chỉ mặc định hoặc địa chỉ đầu tiên
    let primaryAddress = this.customerForm.address.trim();
    if (this.addresses.length > 0) {
      const defaultAddress = this.addresses.find(addr => addr.isDefault) || this.addresses[0];
      primaryAddress = `${defaultAddress.specificAddress}, ${defaultAddress.ward}, ${defaultAddress.district}, ${defaultAddress.province}`;
    }

    // Tạo mã khách hàng tự động
    let customerCode: string;
    if (this.showEditModal && this.selectedCustomer) {
      // Sửa khách hàng - giữ nguyên mã cũ
      customerCode = this.getCustomerCode(this.selectedCustomer);
    } else {
      // Thêm khách hàng mới - tạo mã mới
      const nextId = Math.max(...this.customers.map(c => c.id || 0), 0) + 1;
      customerCode = 'KH' + nextId.toString().padStart(5, '0');
    }

    // Tạo data để gửi lên backend (format chuẩn)
    const customerRequestData: CustomerRequestData = {
      ho_ten: this.customerForm.ho_ten.trim(),
      email: this.customerForm.email.trim().toLowerCase(),
      so_dien_thoai: this.customerForm.so_dien_thoai.trim().replace(/\s/g, ''),
      ngay_sinh: this.customerForm.ngay_sinh instanceof Date 
        ? this.customerForm.ngay_sinh.toISOString().split('T')[0]
        : this.customerForm.ngay_sinh,
      gioi_tinh: this.customerForm.gioi_tinh,
      trang_thai: true, // Active
      customerCode: customerCode // Thêm mã khách hàng
    };

    // Tạo data để lưu local (bao gồm tất cả thông tin)
    const customerData: Customer = {
      id: this.showEditModal && this.selectedCustomer ? this.selectedCustomer.id : undefined,
      ho_ten: this.customerForm.ho_ten.trim(),
        email: this.customerForm.email.trim(),
      so_dien_thoai: this.customerForm.so_dien_thoai.trim(),
      ngay_sinh: this.customerForm.ngay_sinh,
      gioi_tinh: this.customerForm.gioi_tinh,
      ngay_tao: this.showEditModal && this.selectedCustomer ? this.selectedCustomer.ngay_tao : new Date().toISOString(),
      diem_tich_luy: this.showEditModal && this.selectedCustomer ? this.selectedCustomer.diem_tich_luy : 0,
      trang_thai: true, // Active
      customerCode: customerCode,
      addresses: [...this.addresses],
      // Các trường bổ sung cho hiển thị
      name: this.customerForm.ho_ten.trim(),
      phone: this.customerForm.so_dien_thoai.trim(),
      dateOfBirth: this.customerForm.ngay_sinh,
      gender: this.customerForm.gioi_tinh ? 'Nam' : 'Nữ',
      registrationDate: this.showEditModal && this.selectedCustomer ? this.selectedCustomer.registrationDate : new Date().toISOString(),
      totalSpent: this.showEditModal && this.selectedCustomer ? this.selectedCustomer.totalSpent : 0,
      status: 'Active'
    };

    // Gọi API backend để lưu vào database
    console.log('🔍 Sending to backend:', customerRequestData);
    console.log('🔍 API URL:', this.showEditModal ? 'UPDATE' : 'CREATE');
    console.log('🔍 Backend URL:', 'http://localhost:8081/api/khach-hang');
    console.log('🔍 Customer Code:', customerCode);
    
    const operation = this.showEditModal && this.selectedCustomer && this.selectedCustomer.id
      ? this.customerService.updateCustomer(this.selectedCustomer.id, customerRequestData)
      : this.customerService.createCustomer(customerRequestData);

    // Gọi API backend và chờ response
    operation.subscribe({
      next: (savedCustomer) => {
        console.log('✅ Customer saved to backend:', savedCustomer);
        
        // Cập nhật danh sách khách hàng từ backend
        this.loadCustomers();
        // Customer saved successfully
        
        // Đóng modal và reset form
    this.closeModals();
        this.resetForm();
      },
      error: (error) => {
        console.error('❌ Error saving to backend:', error);
        console.error('❌ Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url,
          error: error.error
        });
        
        // Hiển thị thông báo lỗi chi tiết hơn
        let errorMessage = '❌ Lỗi khi lưu khách hàng. ';
        
        if (error.status === 0) {
          errorMessage += 'Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.';
        } else if (error.status === 400) {
          errorMessage += 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
        } else if (error.status === 500) {
          errorMessage += 'Lỗi server. Vui lòng thử lại sau.';
        } else if (error.status === 404) {
          errorMessage += 'API endpoint không tìm thấy. Vui lòng kiểm tra backend.';
        } else {
          const statusText = error.statusText || 'Unknown Error';
          const status = error.status || 'Unknown';
          errorMessage += `Lỗi ${status}: ${statusText}`;
        }
        
        // Thêm thông tin debug nếu có
        if (error.error && typeof error.error === 'string') {
          errorMessage += `\n\nChi tiết: ${error.error}`;
        }
        
        console.error('Error:', errorMessage);
      }
    });
  }

  // Address Management Methods
  loadLocationData() {
    // Sample provinces
    this.provinces = [
      { id: 'hcm', name: 'Thành phố Hồ Chí Minh' },
      { id: 'hn', name: 'Hà Nội' },
      { id: 'dn', name: 'Đà Nẵng' }
    ];

    // Sample districts
    this.districts = [
      { id: 'q1', name: 'Quận 1', provinceId: 'hcm' },
      { id: 'q2', name: 'Quận 2', provinceId: 'hcm' },
      { id: 'bt', name: 'Quận Ba Đình', provinceId: 'hn' },
      { id: 'hk', name: 'Quận Hoàn Kiếm', provinceId: 'hn' },
      { id: 'hc', name: 'Quận Hải Châu', provinceId: 'dn' }
    ];

    // Sample wards
    this.wards = [
      { id: 'p1', name: 'Phường Bến Nghé', districtId: 'q1' },
      { id: 'p2', name: 'Phường Bến Thành', districtId: 'q1' },
      { id: 'p3', name: 'Phường Cầu Kho', districtId: 'q1' },
      { id: 'p4', name: 'Phường Thạnh Xuân', districtId: 'q2' },
      { id: 'p5', name: 'Phường Thủ Thiêm', districtId: 'q2' },
      { id: 'p6', name: 'Phường Phúc Xá', districtId: 'bt' },
      { id: 'p7', name: 'Phường Trúc Bạch', districtId: 'bt' },
      { id: 'p8', name: 'Phường Hàng Bạc', districtId: 'hk' },
      { id: 'p9', name: 'Phường Hàng Buồm', districtId: 'hk' },
      { id: 'p10', name: 'Phường Hải Châu I', districtId: 'hc' }
    ];
  }

  loadAddressSampleData() {
    this.addresses = [
      {
        id: 1,
        specificAddress: '123 Nguyễn Huệ',
        province: 'Thành phố Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé',
        isDefault: true,
        mac_dinh: true,
        dia_chi: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh',
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2023-01-15')
      }
    ];
  }

  // Address Navigation
  previousAddress() {
    if (this.currentAddressIndex > 0) {
      this.currentAddressIndex--;
    }
  }

  nextAddress() {
    if (this.currentAddressIndex < this.addresses.length - 1) {
      this.currentAddressIndex++;
    }
  }

  // Address Modal methods
  openAddressAddModal() {
    this.resetAddressForm();
    this.showAddressAddModal = true;
  }

  openAddressEditModal(address: Address) {
    this.selectedAddress = address;
    this.addressForm = {
      specificAddress: address.specificAddress || '',
      province: this.getProvinceIdByName(address.province || ''),
      district: this.getDistrictIdByName(address.district || ''),
      ward: this.getWardIdByName(address.ward || ''),
      isDefault: address.isDefault || false
    };
    this.onProvinceChange();
    this.onDistrictChange();
    this.showAddressEditModal = true;
  }


  closeAddressModals() {
    this.showAddressAddModal = false;
    this.showAddressEditModal = false;
    this.selectedAddress = null;
    this.resetAddressForm();
  }

  resetAddressForm() {
    this.addressForm = {
      specificAddress: '',
      province: '',
      district: '',
      ward: '',
      isDefault: false
    };
    this.filteredDistricts = [];
    this.filteredWards = [];
  }

  // Address Form methods
  onProvinceChange() {
    this.filteredDistricts = this.districts.filter(d => d.provinceId === this.addressForm.province);
    this.addressForm.district = '';
    this.addressForm.ward = '';
    this.filteredWards = [];
  }

  onDistrictChange() {
    this.filteredWards = this.wards.filter(w => w.districtId === this.addressForm.district);
    this.addressForm.ward = '';
  }

  saveAddress() {
    console.log('🔄 Starting saveAddress...');
    console.log('📋 Address form data:', this.addressForm);
    console.log('👤 Selected customer:', this.selectedCustomer);
    console.log('🏠 Current addresses:', this.addresses.length);
    console.log('📝 ShowAddModal:', this.showAddModal);
    console.log('📝 ShowAddressAddModal:', this.showAddressAddModal);
    console.log('📝 ShowAddressEditModal:', this.showAddressEditModal);
    
    // Clear previous errors
    this.addressFormErrors = {};
    
    // Validation địa chỉ chi tiết
    if (!this.validateAddressForm()) {
      console.log('❌ Address validation failed');
      return;
    }
    
    console.log('✅ Address validation passed');

    const addressData: Address = {
      id: this.showAddressEditModal && this.selectedAddress ? this.selectedAddress.id : undefined,
          specificAddress: this.addressForm.specificAddress.trim(),
          province: this.getProvinceNameById(this.addressForm.province) || 'Chưa chọn',
          district: this.getDistrictNameById(this.addressForm.district) || 'Chưa chọn',
          ward: this.getWardNameById(this.addressForm.ward) || 'Chưa chọn',
      isDefault: this.addressForm.isDefault || false,
      mac_dinh: this.addressForm.isDefault || false,
      macDinh: this.addressForm.isDefault || false,
      dia_chi: `${this.addressForm.specificAddress.trim()}, ${this.getWardNameById(this.addressForm.ward) || 'Chưa chọn'}, ${this.getDistrictNameById(this.addressForm.district) || 'Chưa chọn'}, ${this.getProvinceNameById(this.addressForm.province) || 'Chưa chọn'}`,
      // Database mới fields
      diaChiCuThe: this.addressForm.specificAddress.trim(),
      thanhPho: this.getProvinceNameById(this.addressForm.province) || 'Chưa chọn',
      quan: this.getDistrictNameById(this.addressForm.district) || 'Chưa chọn',
      phuong: this.getWardNameById(this.addressForm.ward) || 'Chưa chọn',
      tenDiaChi: `Địa chỉ ${this.addresses.length + 1}`,
      soDienThoai: this.selectedCustomer?.so_dien_thoai || this.selectedCustomer?.phone || '0123456789',
      tenNguoiNhan: this.selectedCustomer?.ho_ten || this.selectedCustomer?.name || 'Khách hàng',
      createdAt: this.showAddressEditModal && this.selectedAddress ? this.selectedAddress.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customerId: this.selectedCustomer?.id
    };

    // Nếu đang thêm địa chỉ cho khách hàng mới (chưa có ID) hoặc đang trong modal thêm khách hàng
    if ((this.showAddModal && !this.selectedCustomer?.id) || this.showAddressAddModal) {
      // Chỉ lưu vào local array cho khách hàng mới
      console.log('🔄 Adding address for new customer (local only)');
      console.log('📝 ShowAddModal:', this.showAddModal);
      console.log('📝 ShowAddressAddModal:', this.showAddressAddModal);
      console.log('👤 SelectedCustomer ID:', this.selectedCustomer?.id);
      console.log('🔍 Condition check: showAddModal && !selectedCustomer?.id =', this.showAddModal && !this.selectedCustomer?.id);
      console.log('🔍 Condition check: showAddressAddModal =', this.showAddressAddModal);

      if (this.showAddressEditModal && this.selectedAddress) {
        // Cập nhật địa chỉ hiện có
        const index = this.addresses.findIndex(a => a.id === this.selectedAddress!.id);
        if (index > -1) {
          this.addresses[index] = {
            ...this.addresses[index],
            ...addressData,
            updatedAt: new Date().toISOString()
          };
        }
        console.log('✅ Address updated in local array');
      } else {
        // Thêm địa chỉ mới
        console.log('🔄 Adding new address to local array...');
        const newId = this.addresses.length > 0 ? Math.max(...this.addresses.map(a => a.id || 0)) + 1 : 1;
        console.log('🆔 Generated new ID:', newId);
        
        const newAddress: Address = {
          ...addressData,
          id: newId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        console.log('📦 New address object:', newAddress);
        this.addresses.push(newAddress);
        this.currentAddressIndex = this.addresses.length - 1;
        console.log('✅ Address added to local array:', newAddress);
        console.log('📋 Total addresses now:', this.addresses.length);
        
        // Cập nhật customerForm.address để hiển thị trong form
        this.customerForm.address = newAddress.dia_chi || '';
        console.log('📝 Updated customerForm.address:', this.customerForm.address);
      }
      
      this.closeAddressModals();
      return;
    }

    // Nếu đang thêm địa chỉ cho khách hàng đã có ID
    if (this.selectedCustomer && this.selectedCustomer.id) {
      console.log('🔄 Adding address for existing customer with ID:', this.selectedCustomer.id);
      if (this.showAddressEditModal && this.selectedAddress && this.selectedAddress.id) {
        // Gọi API backend để cập nhật địa chỉ
        this.customerService.updateCustomerAddress(this.selectedCustomer.id, this.selectedAddress.id, addressData).subscribe({
          next: (updatedAddress) => {
            console.log('✅ Cập nhật địa chỉ thành công từ database:', updatedAddress);
            
            // Cập nhật local array với dữ liệu từ backend
            const index = this.addresses.findIndex(a => a.id === this.selectedAddress!.id);
            if (index > -1) {
              this.addresses[index] = updatedAddress;
            }
            
            // Address updated successfully
    this.closeAddressModals();
          },
          error: (error) => {
            console.error('❌ Lỗi khi cập nhật địa chỉ trong database:', error);
            console.error('Error updating address');
          }
        });
      } else {
        // Gọi API backend để thêm địa chỉ mới
        this.customerService.addCustomerAddress(this.selectedCustomer.id, addressData).subscribe({
          next: (newAddress) => {
            console.log('✅ Thêm địa chỉ thành công từ database:', newAddress);
            
            // Thêm địa chỉ mới vào local array
            this.addresses.push(newAddress);
            this.currentAddressIndex = this.addresses.length - 1;
            
            // Address added successfully
            this.closeAddressModals();
          },
          error: (error) => {
            console.error('❌ Lỗi khi thêm địa chỉ vào database:', error);
            console.error('Error adding address');
          }
        });
      }
    } else {
      console.log('❌ Không tìm thấy khách hàng để thêm địa chỉ!');
      console.log('📋 Debug info:');
      console.log('- selectedCustomer:', this.selectedCustomer);
      console.log('- selectedCustomer.id:', this.selectedCustomer?.id);
      console.log('- showAddModal:', this.showAddModal);
      console.log('- showAddressAddModal:', this.showAddressAddModal);
      console.log('- showAddressEditModal:', this.showAddressEditModal);
      console.log('🔍 Final condition check:');
      console.log('  - (showAddModal && !selectedCustomer?.id) =', this.showAddModal && !this.selectedCustomer?.id);
      console.log('  - showAddressAddModal =', this.showAddressAddModal);
      console.log('  - (selectedCustomer && selectedCustomer.id) =', this.selectedCustomer && this.selectedCustomer.id);
    }
  }


  setAddressAsDefault(address: Address) {
    if (!address.isDefault) {
      // Nếu đang thêm khách hàng mới, chỉ cập nhật local array
      if (this.showAddModal && !this.selectedCustomer) {
      // Unset all other defaults
      this.addresses.forEach(addr => {
        addr.isDefault = false;
      });
      
      // Set this as default
      address.isDefault = true;
      console.log('✅ Đã đặt làm địa chỉ mặc định!');
        return;
      }

      // Nếu đang sửa khách hàng, gửi lên server
      if (this.selectedCustomer && this.selectedCustomer.id && address.id) {
        console.log('🔄 Đang đặt địa chỉ mặc định trong database...', address);
        
        this.customerService.setDefaultAddress(this.selectedCustomer.id, address.id).subscribe({
          next: (updatedAddress) => {
            console.log('✅ Đặt địa chỉ mặc định thành công từ database:', updatedAddress);
            
            // Update address in local array
            const index = this.addresses.findIndex(a => a.id === address.id);
            if (index > -1) {
              this.addresses[index] = updatedAddress;
            }
            
            // Unset all other defaults
            this.addresses.forEach(addr => {
              if (addr.id !== address.id) {
                addr.isDefault = false;
              }
            });
            
            // Cập nhật customer trong local storage
            if (this.selectedCustomer && this.selectedCustomer.id) {
              const customerIndex = this.customers.findIndex(c => c.id === this.selectedCustomer!.id);
              if (customerIndex > -1) {
                this.customers[customerIndex].addresses = [...this.addresses];
                this.saveToLocalStorage();
              }
            }
            
            console.log('✅ Đã đặt làm địa chỉ mặc định trong database!');
          },
          error: (error) => {
            console.error('❌ Lỗi khi đặt địa chỉ mặc định trong database:', error);
            
            // Fallback: update local data
            this.addresses.forEach(addr => {
              addr.isDefault = false;
            });
            address.isDefault = true;
            
            if (error.status === 400) {
              console.log('❌ Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.');
            } else if (error.status === 404) {
              console.log('❌ Không tìm thấy địa chỉ hoặc khách hàng! Vui lòng thử lại.');
            } else if (error.status === 500) {
              console.log('❌ Lỗi server! Không thể đặt địa chỉ mặc định.');
            } else {
              console.log('❌ Lỗi kết nối! Không thể đặt địa chỉ mặc định trong database.');
            }
          }
        });
      }
    }
  }

  // Address Helper methods
  getProvinceIdByName(name: string): string {
    const province = this.provinces.find(p => p.name === name);
    return province ? province.id : '';
  }

  getDistrictIdByName(name: string): string {
    const district = this.districts.find(d => d.name === name);
    return district ? district.id : '';
  }

  getWardIdByName(name: string): string {
    const ward = this.wards.find(w => w.name === name);
    return ward ? ward.id : '';
  }

  getProvinceNameById(id: string): string {
    const province = this.provinces.find(p => p.id === id);
    return province ? province.name : '';
  }

  getDistrictNameById(id: string): string {
    const district = this.districts.find(d => d.id === id);
    return district ? district.name : '';
  }

  getWardNameById(id: string): string {
    const ward = this.wards.find(w => w.id === id);
    return ward ? ward.name : '';
  }

  // Customer Management Methods
  applyFilters() {
    console.log('🔍 Applying filters - Status filter:', this.statusFilter);
    console.log('📊 Total customers:', this.customers.length);
    
    this.filteredCustomers = this.customers.filter(customer => {
      // Search filter
      const searchMatch = !this.searchTerm || 
        (customer.ho_ten || customer.name || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (customer.email || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (customer.so_dien_thoai || customer.phone || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.getCustomerCode(customer).toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Status filter - check both boolean and string status
      const isActive = customer.trang_thai === true || 
        customer.status === 'Active' || 
        (customer.status as string)?.toLowerCase() === 'active';
      const statusMatch = this.statusFilter === 'all' || 
        (this.statusFilter === 'active' && isActive) ||
        (this.statusFilter === 'inactive' && !isActive);
      
      // Debug log for each customer
      if (this.statusFilter !== 'all') {
        console.log(`👤 ${customer.ho_ten || customer.name}: trang_thai=${customer.trang_thai}, status=${customer.status}, isActive=${isActive}, statusMatch=${statusMatch}`);
      }
      
      // Points filter
      const points = customer.diem_tich_luy || customer.diemTichLuy || 0;
      const pointsMatch = this.pointsFilter === 'all' ||
        (this.pointsFilter === 'high' && points >= 1000) ||
        (this.pointsFilter === 'medium' && points >= 100 && points < 1000) ||
        (this.pointsFilter === 'low' && points < 100);
      
      // Date filter
      const customerDate = new Date(customer.ngay_tao || customer.registrationDate || '');
      const now = new Date();
      const dateMatch = this.dateFilter === 'all' ||
        (this.dateFilter === 'today' && this.isSameDay(customerDate, now)) ||
        (this.dateFilter === 'week' && this.isSameWeek(customerDate, now)) ||
        (this.dateFilter === 'month' && this.isSameMonth(customerDate, now));
      
      return searchMatch && statusMatch && pointsMatch && dateMatch;
    });
    
    console.log('✅ Filtered customers:', this.filteredCustomers.length);
    console.log('📋 Status filter result:', this.statusFilter, '→', this.filteredCustomers.length, 'customers');
    
    this.currentPage = 1;
    this.updatePagination();
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.pointsFilter = 'all';
    this.dateFilter = 'all';
    this.applyFilters();
  }

  // Modal Methods
  openAddModal() {
    this.resetForm();
    // Force clear addresses khi thêm khách hàng mới
    this.addresses = [];
    this.currentAddressIndex = 0;
    this.selectedCustomer = null;
    
    // Clear validation errors khi mở modal add
    this.customerFormErrors = {};
    this.addressErrors = {};
    
    this.showAddModal = true;
  }

  openEditModal(customer: Customer) {
    this.selectedCustomer = customer;
    
    // Clear validation errors khi mở modal edit
    this.customerFormErrors = {};
    this.addressErrors = {};
    
    this.customerForm = {
      ho_ten: customer.ho_ten || customer.name || '',
      email: customer.email,
      so_dien_thoai: customer.so_dien_thoai || customer.phone || '',
      ngay_sinh: typeof customer.ngay_sinh === 'string' ? new Date(customer.ngay_sinh) : (customer.ngay_sinh || new Date()),
      gioi_tinh: customer.gioi_tinh !== undefined ? customer.gioi_tinh : (customer.gender === 'Nam'),
      // Các trường bổ sung cho form
      name: customer.name || customer.ho_ten || '',
      phone: customer.phone || customer.so_dien_thoai || '',
      dateOfBirth: typeof customer.dateOfBirth === 'string' ? new Date(customer.dateOfBirth) : (customer.dateOfBirth || new Date()),
      gender: customer.gender || (customer.gioi_tinh ? 'Nam' : 'Nữ'),
      address: customer.address || '',
      notes: customer.notes || ''
    };
    
    // Load địa chỉ chi tiết từ API
    this.loadCustomerAddresses(customer.id);
    
    // Hiển thị modal
    this.showEditModal = true;
  }

  loadCustomerAddresses(customerId: number | undefined) {
    if (!customerId) {
      this.addresses = [];
      this.currentAddressIndex = 0;
      return;
    }
    
    console.log('🔍 Loading addresses for customer:', customerId);
    
    // Load addresses directly
    this.customerService.getCustomerAddresses(customerId).subscribe({
      next: (addresses) => {
        console.log('✅ Addresses loaded successfully:', addresses);
        this.addresses = addresses || [];
        this.currentAddressIndex = 0;
        
        // Nếu không có địa chỉ, tạo địa chỉ mẫu
        if (this.addresses.length === 0) {
          console.log('⚠️ No addresses found, creating sample address');
          this.createSampleAddress(customerId);
        } else {
          // Tự động điền địa chỉ mặc định vào trường "Địa chỉ" chính (database mới)
          const defaultAddress = this.addresses.find(addr => addr.isDefault || addr.macDinh) || this.addresses[0];
          if (defaultAddress) {
            const fullAddress = `${defaultAddress.diaChiCuThe || defaultAddress.specificAddress}, ${defaultAddress.phuong || defaultAddress.ward}, ${defaultAddress.quan || defaultAddress.district}, ${defaultAddress.thanhPho || defaultAddress.province}`;
            this.customerForm.address = fullAddress;
          }
        }
      },
      error: (error) => {
        console.error('❌ Error loading addresses:', error);
        this.addresses = [];
        this.currentAddressIndex = 0;
        // Tạo địa chỉ mẫu khi có lỗi
        this.createSampleAddress(customerId);
      }
    });
  }

  createSampleAddress(customerId: number) {
    const sampleAddress: Address = {
      id: 1,
      specificAddress: '123 Đường ABC',
      province: 'Hà Nội',
      district: 'Quận Ba Đình',
      ward: 'Phường Phúc Xá',
      isDefault: true,
      mac_dinh: true,
      macDinh: true,
      dia_chi: '123 Đường ABC, Phường Phúc Xá, Quận Ba Đình, Hà Nội',
      diaChiCuThe: '123 Đường ABC',
      thanhPho: 'Hà Nội',
      quan: 'Quận Ba Đình',
      phuong: 'Phường Phúc Xá',
      tenDiaChi: 'Địa chỉ nhà',
      soDienThoai: '0123456789',
      tenNguoiNhan: 'Khách hàng',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customerId: customerId
    };
    
    this.addresses = [sampleAddress];
    this.currentAddressIndex = 0;
    
    // Tự động điền địa chỉ mẫu
    this.customerForm.address = sampleAddress.dia_chi || `${sampleAddress.specificAddress}, ${sampleAddress.ward}, ${sampleAddress.district}, ${sampleAddress.province}`;
    
    console.log('✅ Sample address created:', sampleAddress);
  }


  closeModals() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showViewModal = false;
    this.selectedCustomer = null;
    // Reset addresses khi đóng modal
    this.addresses = [];
    this.currentAddressIndex = 0;
    
    // Clear validation errors khi đóng modal
    this.customerFormErrors = {};
    this.addressErrors = {};
    
    this.resetForm();
  }


  resetForm() {
    this.customerForm = {
      ho_ten: '',
      email: '',
      so_dien_thoai: '',
      ngay_sinh: new Date(),
      gioi_tinh: true, // true = Nam, false = Nữ
      // Các trường bổ sung cho form
      name: '',
      phone: '',
      dateOfBirth: new Date(),
      gender: 'Nam',
      address: '',
      notes: ''
    };
    
    // Reset addresses khi reset form
    this.addresses = [];
    this.currentAddressIndex = 0;
  }



  // Sorting Methods
  sortCustomers(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    
    this.filteredCustomers.sort((a, b) => {
      let aValue = this.getFieldValue(a, field);
      let bValue = this.getFieldValue(b, field);
      
      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    this.updatePagination();
  }
  
  getFieldValue(customer: Customer, field: string): any {
    switch (field) {
      case 'ho_ten': return customer.ho_ten || customer.name || '';
      case 'email': return customer.email || '';
      case 'so_dien_thoai': return customer.so_dien_thoai || customer.phone || '';
      case 'ngay_sinh': return customer.ngay_sinh || customer.dateOfBirth || '';
      case 'diem_tich_luy': return customer.diem_tich_luy || customer.diemTichLuy || 0;
      case 'ngay_tao': return customer.ngay_tao || customer.registrationDate || '';
      case 'trang_thai': return this.getCustomerStatus(customer);
      default: return '';
    }
  }
  
  getSortIcon(field: string): string {
    if (this.sortField !== field) return '↕️';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }
  
  getFieldDisplayName(field: string): string {
    switch (field) {
      case 'ho_ten': return 'Tên khách hàng';
      case 'email': return 'Email';
      case 'so_dien_thoai': return 'Số điện thoại';
      case 'ngay_sinh': return 'Ngày sinh';
      case 'diem_tich_luy': return 'Điểm tích lũy';
      case 'ngay_tao': return 'Ngày tạo';
      case 'trang_thai': return 'Trạng thái';
      default: return field;
    }
  }
  
  resetSorting() {
    this.sortField = 'ho_ten';
    this.sortDirection = 'asc';
    this.applyFilters();
  }

  // Pagination Methods
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredCustomers.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCustomers = this.filteredCustomers.slice(startIndex, endIndex);
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.updatePagination();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToFirstPage() {
    this.currentPage = 1;
    this.updatePagination();
  }

  goToLastPage() {
    this.currentPage = this.totalPages;
    this.updatePagination();
  }


  // Utility Methods
  onMouseEnter(event: any) {
    (event.target as HTMLElement).style.backgroundColor = '#f8f9fa';
  }

  onMouseLeave(event: any) {
    (event.target as HTMLElement).style.backgroundColor = '';
  }

  // LocalStorage methods
  saveToLocalStorage() {
    try {
      localStorage.setItem('customers', JSON.stringify(this.customers));
      console.log('✅ Đã lưu dữ liệu vào localStorage');
    } catch (error) {
      console.error('❌ Lỗi khi lưu vào localStorage:', error);
    }
  }


  // Helper method để lấy trạng thái khách hàng
  getCustomerStatus(customer: Customer): 'Active' | 'Inactive' {
    // Ưu tiên status string trước, sau đó mới đến trang_thai boolean
    if (customer.status) {
      return customer.status;
    }
    if (customer.trang_thai !== undefined) {
      return customer.trang_thai ? 'Active' : 'Inactive';
    }
    // Mặc định là Active nếu không có thông tin
    return 'Active';
  }





  // Method để hiển thị thông tin địa chỉ chi tiết
  showAddressDetails(): void {
    if (this.addresses.length === 0) {
      console.log('❌ Không có địa chỉ nào!');
      return;
    }
    
    let addressInfo = '🏠 Danh sách địa chỉ:\n\n';
    this.addresses.forEach((address, index) => {
      const isDefault = this.getAddressDefault(address) ? ' (Mặc định)' : '';
      addressInfo += `${index + 1}. ${address.tenDiaChi || address.specificAddress || 'Địa chỉ'}: ${address.diaChiCuThe || address.specificAddress || 'Chưa cập nhật'}${isDefault}\n`;
    });
    
    console.log(addressInfo);
  }



  // Method để format date cho input
  formatDateForInput(date: Date | string | undefined): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
  }

  // Method để xử lý thay đổi ngày sinh
  onDateChange(event: any): void {
    const value = event.target.value;
    if (value) {
      this.customerForm.ngay_sinh = new Date(value);
    }
  }

  // Method để format ngày tháng
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'Chưa cập nhật';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('vi-VN');
  }


  getStartItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndItem(): number {
    const end = this.currentPage * this.itemsPerPage;
    return Math.min(end, this.filteredCustomers.length);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = Math.min(5, this.totalPages);
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, startPage + maxPages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }


  viewCustomer(customer: Customer): void {
    this.selectedCustomer = customer;
    this.showViewModal = true;
  }

  getCustomerCode(customer: any): string {
    // Ưu tiên maKhachHang từ backend trước
    if (customer.maKhachHang) {
      return customer.maKhachHang;
    }
    // Fallback về id nếu không có maKhachHang
    if (customer.id) {
      return `KH${customer.id.toString().padStart(6, '0')}`;
    }
    return 'N/A';
  }

  getCustomerBirthday(customer: any): string {
    // Ưu tiên ngaySinh từ backend trước
    if (customer.ngaySinh) {
      return new Date(customer.ngaySinh).toLocaleDateString('vi-VN');
    }
    // Fallback về ngay_sinh
    if (customer.ngay_sinh) {
      return new Date(customer.ngay_sinh).toLocaleDateString('vi-VN');
    }
    return 'Chưa cập nhật';
  }

  getCustomerAddress(customer: any): string {
    if (customer.diaChiList && customer.diaChiList.length > 0) {
      const defaultAddress = customer.diaChiList.find((addr: any) => addr.macDinh === true);
      const address = defaultAddress || customer.diaChiList[0];
      return `${address.diaChi}, ${address.phuongXa}, ${address.quanHuyen}, ${address.tinhThanh}`;
    }
    return customer.dia_chi || customer.address || 'Không có địa chỉ';
  }

  getAddressCount(): number {
    if (this.selectedCustomer && (this.selectedCustomer as any).diaChiList) {
      return (this.selectedCustomer as any).diaChiList.length;
    }
    return 0;
  }

  getAddressList(): any[] {
    if (this.selectedCustomer && (this.selectedCustomer as any).diaChiList) {
      return (this.selectedCustomer as any).diaChiList;
    }
    return [];
  }

  editCustomer(customer: Customer): void {
    console.log('🔧 Edit customer clicked:', customer);
    this.selectedCustomer = customer;
    this.editingCustomer = customer;
    this.showAddModal = true;
    console.log('🔧 showAddModal set to:', this.showAddModal);
    this.resetForm();
    
    // Populate form with customer data from backend structure
    this.customerForm.ho_ten = customer.ho_ten || customer.name || '';
    this.customerForm.so_dien_thoai = customer.so_dien_thoai || customer.phone || '';
    this.customerForm.email = customer.email || '';
    // Ưu tiên ngaySinh từ backend trước, sau đó mới đến ngay_sinh
    if ((customer as any).ngaySinh) {
      const date = new Date((customer as any).ngaySinh);
      (this.customerForm as any).ngay_sinh = date.toISOString().split('T')[0]; // Format YYYY-MM-DD for input type="date"
    } else if (customer.ngay_sinh) {
      const date = new Date(customer.ngay_sinh);
      (this.customerForm as any).ngay_sinh = date.toISOString().split('T')[0]; // Format YYYY-MM-DD for input type="date"
    } else {
      (this.customerForm as any).ngay_sinh = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD for input type="date"
    }
    this.customerForm.gioi_tinh = customer.gioi_tinh || false;
    this.customerForm.address = this.getCustomerAddress(customer);
    console.log('🔧 Form populated:', this.customerForm);
    console.log('🔧 Customer ngaySinh:', (customer as any).ngaySinh);
    console.log('🔧 Customer ngay_sinh:', customer.ngay_sinh);
    console.log('🔧 Form ngay_sinh:', this.customerForm.ngay_sinh);
    console.log('🔧 Form ngay_sinh type:', typeof this.customerForm.ngay_sinh);
    console.log('🔧 Form ngay_sinh value:', this.customerForm.ngay_sinh?.toISOString());
  }

  deleteCustomer(customer: Customer): void {
    if (confirm(`Bạn có chắc chắn muốn xóa khách hàng "${customer.ho_ten || customer.name}"?`)) {
      // Xóa ngay lập tức khỏi danh sách local
      this.deleteCustomerFromLocal(customer);
      console.log('✅ Đã xóa khách hàng!');
      
      // Gọi API backend ngầm (không chờ response)
      this.customerService.deleteCustomer(customer.id || 0).subscribe({
        next: (response) => {
          console.log('✅ Xóa khách hàng thành công từ database:', response);
        },
        error: (error) => {
          console.error('❌ Lỗi khi xóa khách hàng từ database:', error);
          // Không hiển thị lỗi cho user vì đã xóa thành công khỏi local
        }
      });
    }
  }




  saveCustomerOffline(customerData: Customer): void {
    if (this.showEditModal && this.selectedCustomer) {
      // Update existing customer in local array
      const index = this.customers.findIndex(c => c.id === this.selectedCustomer!.id);
      if (index > -1) {
        this.customers[index] = customerData;
      }
      console.log('⚠️ Đã cập nhật khách hàng (offline mode)');
    } else {
      // Add new customer to local array
      customerData.id = Date.now(); // Generate temporary ID
      this.customers.push(customerData);
      console.log('⚠️ Đã thêm khách hàng (offline mode)');
    }
    
    this.saveToLocalStorage();
    this.applyFilters();
    this.closeModals();
    this.resetForm();
    this.isLoading = false;
  }

  // Validation Methods
  validateCustomerForm(): boolean {
    this.customerFormErrors = {};
    let isValid = true;

    // Kiểm tra thông tin bắt buộc
    if (!this.customerForm.ho_ten) {
      this.customerFormErrors.ho_ten = 'Tên khách hàng không được để trống';
      isValid = false;
    } else if (this.customerForm.ho_ten.trim().length < 2) {
      this.customerFormErrors.ho_ten = 'Tên khách hàng phải có ít nhất 2 ký tự';
      isValid = false;
    } else if (this.customerForm.ho_ten.trim().length > 100) {
      this.customerFormErrors.ho_ten = 'Tên khách hàng không được quá 100 ký tự';
      isValid = false;
    }

    if (!this.customerForm.email) {
      this.customerFormErrors.email = 'Email không được để trống';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.customerForm.email)) {
        this.customerFormErrors.email = 'Email không đúng định dạng';
        isValid = false;
      } else {
        // Kiểm tra email trùng lặp
        const existingCustomer = this.customers.find(c => 
          c.email.toLowerCase() === this.customerForm.email.toLowerCase() && 
          (!this.showEditModal || c.id !== this.selectedCustomer?.id)
        );
        if (existingCustomer) {
          this.customerFormErrors.email = 'Email này đã được sử dụng';
          isValid = false;
        }
      }
    }

    if (!this.customerForm.so_dien_thoai) {
      this.customerFormErrors.so_dien_thoai = 'Số điện thoại không được để trống';
      isValid = false;
    } else {
      const phoneRegex = /^(\+84|84|0)[1-9][0-9]{8,9}$/;
      const cleanPhone = this.customerForm.so_dien_thoai.replace(/\s/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        this.customerFormErrors.so_dien_thoai = 'Số điện thoại không đúng định dạng';
        isValid = false;
      } else {
        // Kiểm tra số điện thoại trùng lặp
        const existingPhone = this.customers.find(c => 
          c.so_dien_thoai === cleanPhone && 
          (!this.showEditModal || c.id !== this.selectedCustomer?.id)
        );
        if (existingPhone) {
          this.customerFormErrors.so_dien_thoai = 'Số điện thoại này đã được sử dụng';
          isValid = false;
        }
      }
    }

    // Validation date of birth
    if (this.customerForm.ngay_sinh) {
      const today = new Date();
      const birthDate = new Date(this.customerForm.ngay_sinh);
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 0 || age > 120) {
        this.customerFormErrors.ngay_sinh = 'Tuổi phải từ 0-120 tuổi';
        isValid = false;
      } else if (birthDate > today) {
        this.customerFormErrors.ngay_sinh = 'Ngày sinh không thể là ngày trong tương lai';
        isValid = false;
      }
    }

    return isValid;
  }

  validateAddresses(): boolean {
    // Kiểm tra có ít nhất 1 địa chỉ
    if (this.addresses.length === 0) {
      console.log('❌ Vui lòng thêm ít nhất 1 địa chỉ cho khách hàng!');
      return false;
    }

    // Validation từng địa chỉ
    for (let i = 0; i < this.addresses.length; i++) {
      const address = this.addresses[i];
      
      // Kiểm tra thông tin bắt buộc
      if (!address.specificAddress || !address.ward || !address.district || !address.province) {
        console.log(`❌ Địa chỉ ${i + 1}: Vui lòng điền đầy đủ thông tin!\n- Địa chỉ cụ thể\n- Phường/Xã\n- Quận/Huyện\n- Tỉnh/Thành phố`);
        return false;
      }

      // Kiểm tra độ dài địa chỉ cụ thể
      if (address.specificAddress.trim().length < 10) {
        console.log(`❌ Địa chỉ ${i + 1}: Địa chỉ cụ thể phải có ít nhất 10 ký tự!`);
        return false;
      }

      if (address.specificAddress.trim().length > 200) {
        console.log(`❌ Địa chỉ ${i + 1}: Địa chỉ cụ thể không được quá 200 ký tự!`);
        return false;
      }

      // Kiểm tra có địa chỉ mặc định
      if (i === this.addresses.length - 1 && !address.isDefault) {
        console.log('❌ Phải có ít nhất 1 địa chỉ mặc định!');
        return false;
      }
    }

    return true;
  }

  validateAddressForm(): boolean {
    console.log('🔍 Validating address form...');
    console.log('📋 Form data:', this.addressForm);
    
    // Kiểm tra thông tin bắt buộc - chỉ cần địa chỉ cụ thể
    if (!this.addressForm.specificAddress || this.addressForm.specificAddress.trim() === '') {
      console.log('❌ Địa chỉ cụ thể không được để trống!');
      return false;
    }

    // Kiểm tra độ dài địa chỉ cụ thể - giảm yêu cầu
    if (this.addressForm.specificAddress.trim().length < 5) {
      console.log('❌ Địa chỉ cụ thể phải có ít nhất 5 ký tự!');
      return false;
    }

    if (this.addressForm.specificAddress.trim().length > 200) {
      console.log('❌ Địa chỉ cụ thể không được quá 200 ký tự!');
      return false;
    }

    // Các trường khác không bắt buộc - có thể để trống
    console.log('✅ Address validation passed');
    return true;
  }

  private deleteCustomerFromLocal(customer: Customer): void {
    // Xóa khỏi danh sách local
    this.customers = this.customers.filter(c => c.id !== customer.id);
    this.saveToLocalStorage();
    this.applyFilters(); // Áp dụng lại filter
  }

  // Helper methods for date filtering
  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  private isSameWeek(date1: Date, date2: Date): boolean {
    const week1 = this.getWeekNumber(date1);
    const week2 = this.getWeekNumber(date2);
    return week1 === week2 && date1.getFullYear() === date2.getFullYear();
  }

  private isSameMonth(date1: Date, date2: Date): boolean {
    return date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  // Format currency for display
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount);
  }

  // Helper method to check if customer is toggling
  isCustomerToggling(customer: Customer): boolean {
    return (customer as any).isToggling || false;
  }

  // Toggle customer status
  toggleCustomerStatus(customer: Customer) {
    console.log('🔄 Toggling customer status:', customer);
    
    // Toggle status immediately
    const newStatus = !customer.trang_thai;
    customer.trang_thai = newStatus;
    
    // Update local data immediately
    const index = this.customers.findIndex(c => c.id === customer.id);
    if (index !== -1) {
      this.customers[index].trang_thai = newStatus;
      this.saveToLocalStorage();
      this.applyFilters();
    }
    
    // Show success message
    const statusText = newStatus ? 'kích hoạt' : 'hủy kích hoạt';
    console.log(`✅ Đã ${statusText} khách hàng ${customer.ho_ten || customer.name}`);
    
    // Try to update backend in background (optional)
    try {
      this.customerService.updateCustomerStatus(customer.id || 0, newStatus).subscribe({
        next: (updatedCustomer) => {
          console.log('✅ Backend sync completed:', updatedCustomer);
        },
        error: (error) => {
          console.error('❌ Backend sync failed:', error);
          console.log('⚠️ Local change is kept');
        }
      });
    } catch (error) {
      console.error('❌ Service call failed:', error);
    }
  }

}