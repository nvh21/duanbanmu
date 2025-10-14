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
  selectedCustomer: Customer | null = null;
  
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

  // Search and filter
  searchTerm = '';
  statusFilter = 'all'; // 'all', 'active', 'inactive'

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
    this.loadLocationData();
    this.loadCustomers();
  }

  loadCustomers() {
    this.error = null;
    
    // Load từ localStorage trước để hiển thị nhanh
    this.loadFromLocalStorage();
    
    // Gọi API backend để load dữ liệu mới nhất (không hiển thị loading)
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        console.log('✅ Customers loaded from backend:', customers);
        // Xử lý dữ liệu từ Spring Boot (có thể là array hoặc object với data property)
        this.customers = Array.isArray(customers) ? customers : (customers as any).data || [];
        this.saveToLocalStorage();
    this.applyFilters();
      },
      error: (error) => {
        console.error('❌ Error loading from backend:', error);
        this.error = error.message || 'Không thể tải danh sách khách hàng từ backend.';
        // Fallback to sample data if API fails
        if (this.customers.length === 0) {
          this.loadSampleData();
        }
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

  // Customer Form Methods
  saveCustomer() {
    // Clear previous errors
    this.customerErrors = {};
    this.addressErrors = {};
    
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

    // Lưu ngay lập tức vào local storage
    this.saveCustomerOffline(customerData);
    alert('✅ Khách hàng đã được lưu thành công!');
    
    // Đóng modal và reset form
    this.closeModals();
    this.resetForm();
    
    // Gọi API backend ngầm (không chờ response)
    operation.subscribe({
      next: (savedCustomer) => {
        console.log('✅ Customer saved to backend:', savedCustomer);
      },
      error: (error) => {
        console.error('❌ Error saving to backend:', error);
        // Không hiển thị lỗi cho user vì đã lưu thành công vào local storage
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
    // Validation địa chỉ chi tiết
    if (!this.validateAddressForm()) {
      return;
    }

    const addressData: Address = {
      id: this.showAddressEditModal && this.selectedAddress ? this.selectedAddress.id : undefined,
          specificAddress: this.addressForm.specificAddress.trim(),
          province: this.getProvinceNameById(this.addressForm.province),
          district: this.getDistrictNameById(this.addressForm.district),
          ward: this.getWardNameById(this.addressForm.ward),
      isDefault: this.addressForm.isDefault || false,
      mac_dinh: this.addressForm.isDefault || false,
      dia_chi: `${this.addressForm.specificAddress.trim()}, ${this.getWardNameById(this.addressForm.ward)}, ${this.getDistrictNameById(this.addressForm.district)}, ${this.getProvinceNameById(this.addressForm.province)}`,
      createdAt: this.showAddressEditModal && this.selectedAddress ? this.selectedAddress.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customerId: this.selectedCustomer?.id
    };

    // Nếu đang thêm địa chỉ cho khách hàng mới (chưa có ID)
    if (this.showAddModal && !this.selectedCustomer?.id) {
      // Force clear addresses cũ trước khi thêm mới
      console.log('🔄 Clearing old addresses before adding new one');
      this.addresses = [];
      this.currentAddressIndex = 0;
      
      // Chỉ lưu vào local array
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
        alert('✅ Cập nhật địa chỉ thành công!');
    } else {
        // Thêm địa chỉ mới
        const newId = this.addresses.length > 0 ? Math.max(...this.addresses.map(a => a.id || 0)) + 1 : 1;
      const newAddress: Address = {
          ...addressData,
        id: newId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        this.addresses.push(newAddress);
        this.currentAddressIndex = this.addresses.length - 1;
        alert('✅ Thêm địa chỉ thành công!');
      }
      this.closeAddressModals();
      return;
    }

    // Nếu đang thêm địa chỉ cho khách hàng đã có ID
    if (this.selectedCustomer && this.selectedCustomer.id) {
      if (this.showAddressEditModal && this.selectedAddress && this.selectedAddress.id) {
        // Cập nhật ngay lập tức trong local array
        const index = this.addresses.findIndex(a => a.id === this.selectedAddress!.id);
        if (index > -1) {
          this.addresses[index] = {
            ...this.addresses[index],
            ...addressData,
            updatedAt: new Date().toISOString()
          };
        }
        
        // Cập nhật customer trong local storage
        if (this.selectedCustomer && this.selectedCustomer.id) {
          const customerIndex = this.customers.findIndex(c => c.id === this.selectedCustomer!.id);
          if (customerIndex > -1) {
            this.customers[customerIndex].addresses = [...this.addresses];
            this.saveToLocalStorage();
          }
        }
        
        alert('✅ Cập nhật địa chỉ thành công!');
        this.closeAddressModals();
        
        // Gọi API backend ngầm (không chờ response)
        this.customerService.updateCustomerAddress(this.selectedCustomer.id, this.selectedAddress.id, addressData).subscribe({
          next: (updatedAddress) => {
            console.log('✅ Cập nhật địa chỉ thành công từ database:', updatedAddress);
          },
          error: (error) => {
            console.error('❌ Lỗi khi cập nhật địa chỉ trong database:', error);
            // Không hiển thị lỗi cho user vì đã cập nhật thành công vào local storage
          }
        });
      } else {
        // Thêm địa chỉ mới ngay lập tức
        const newId = this.addresses.length > 0 ? Math.max(...this.addresses.map(a => a.id || 0)) + 1 : 1;
        const newAddress: Address = {
          ...addressData,
          id: newId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        this.addresses.push(newAddress);
        this.currentAddressIndex = this.addresses.length - 1;
        
        // Cập nhật customer trong local storage
        if (this.selectedCustomer && this.selectedCustomer.id) {
          const customerIndex = this.customers.findIndex(c => c.id === this.selectedCustomer!.id);
          if (customerIndex > -1) {
            this.customers[customerIndex].addresses = [...this.addresses];
            this.saveToLocalStorage();
          }
        }
        
        alert('✅ Thêm địa chỉ thành công!');
        this.closeAddressModals();
        
        // Gọi API backend ngầm (không chờ response)
        this.customerService.addCustomerAddress(this.selectedCustomer.id, addressData).subscribe({
          next: (newAddress) => {
            console.log('✅ Thêm địa chỉ thành công từ database:', newAddress);
          },
          error: (error) => {
            console.error('❌ Lỗi khi thêm địa chỉ vào database:', error);
            // Không hiển thị lỗi cho user vì đã thêm thành công vào local storage
          }
        });
      }
    } else {
      alert('❌ Không tìm thấy khách hàng để thêm địa chỉ!');
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
      alert('✅ Đã đặt làm địa chỉ mặc định!');
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
            
            alert('✅ Đã đặt làm địa chỉ mặc định trong database!');
          },
          error: (error) => {
            console.error('❌ Lỗi khi đặt địa chỉ mặc định trong database:', error);
            
            // Fallback: update local data
            this.addresses.forEach(addr => {
              addr.isDefault = false;
            });
            address.isDefault = true;
            
            if (error.status === 400) {
              alert('❌ Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.');
            } else if (error.status === 404) {
              alert('❌ Không tìm thấy địa chỉ hoặc khách hàng! Vui lòng thử lại.');
            } else if (error.status === 500) {
              alert('❌ Lỗi server! Không thể đặt địa chỉ mặc định.');
            } else {
              alert('❌ Lỗi kết nối! Không thể đặt địa chỉ mặc định trong database.');
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
    this.filteredCustomers = this.customers.filter(customer => {
      const matchesSearch = !this.searchTerm || 
        (customer.ho_ten || customer.name || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (customer.so_dien_thoai || customer.phone || '').includes(this.searchTerm);
      
      // Sử dụng getCustomerStatus để lấy trạng thái chính xác
      const customerStatus = this.getCustomerStatus(customer);
      const matchesStatus = this.statusFilter === 'all' || 
        (this.statusFilter === 'active' && customerStatus === 'Active') ||
        (this.statusFilter === 'inactive' && customerStatus === 'Inactive');
      
      return matchesSearch && matchesStatus;
    });
    
    this.updatePagination();
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.applyFilters();
  }

  // Modal Methods
  openAddModal() {
    this.resetForm();
    // Force clear addresses khi thêm khách hàng mới
    this.addresses = [];
    this.currentAddressIndex = 0;
    this.selectedCustomer = null;
    this.showAddModal = true;
    
  }

  openEditModal(customer: Customer) {
    this.selectedCustomer = customer;
    
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
    this.customerService.getCustomerAddresses(customerId).subscribe({
      next: (addresses) => {
        this.addresses = addresses || [];
        this.currentAddressIndex = 0;
        
        // Tự động điền địa chỉ mặc định vào trường "Địa chỉ" chính
        if (this.addresses.length > 0) {
          const defaultAddress = this.addresses.find(addr => addr.isDefault) || this.addresses[0];
          if (defaultAddress) {
            const fullAddress = `${defaultAddress.specificAddress}, ${defaultAddress.ward}, ${defaultAddress.district}, ${defaultAddress.province}`;
            this.customerForm.address = fullAddress;
          }
        }
        
      },
      error: (error) => {
        console.error('❌ Error loading customer addresses:', error);
        this.addresses = [];
        this.currentAddressIndex = 0;
      }
    });
  }


  closeModals() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.selectedCustomer = null;
    // Reset addresses khi đóng modal
    this.addresses = [];
    this.currentAddressIndex = 0;
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

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
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

  loadFromLocalStorage() {
    try {
      const savedCustomers = localStorage.getItem('customers');
      if (savedCustomers) {
        this.customers = JSON.parse(savedCustomers);
        this.applyFilters();
      }
    } catch (error) {
      console.error('Lỗi khi load từ localStorage:', error);
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

  // Helper method để lấy trạng thái mặc định của địa chỉ
  getAddressDefault(address: Address): boolean {
    // Ưu tiên isDefault trước, sau đó mới đến mac_dinh
    if (address.isDefault !== undefined) {
      return address.isDefault;
    }
    if (address.mac_dinh !== undefined) {
      return address.mac_dinh;
    }
    // Mặc định là false nếu không có thông tin
    return false;
  }

  // Helper method để lấy địa chỉ cụ thể
  getAddressSpecific(address: Address): string {
    // Ưu tiên specificAddress trước, sau đó mới đến dia_chi
    if (address.specificAddress) {
      return address.specificAddress;
    }
    if (address.dia_chi) {
      return address.dia_chi;
    }
    // Mặc định là chuỗi rỗng nếu không có thông tin
    return '';
  }

  // Helper method để lấy địa chỉ của khách hàng
  getCustomerAddress(customer: Customer): string {
    // Ưu tiên address string trước
    if (customer.address) {
      return customer.address;
    }
    
    // Nếu có mảng diaChi từ backend (diachikhachhang table), lấy địa chỉ đầu tiên
    if (customer.diaChi && customer.diaChi.length > 0) {
      const firstAddress = customer.diaChi[0];
      // Ưu tiên diaChiCuThe trước, sau đó mới đến tenDiaChi
      if (firstAddress.diaChiCuThe) {
        return firstAddress.diaChiCuThe;
      }
      if (firstAddress.tenDiaChi) {
        return firstAddress.tenDiaChi;
      }
    }
    
    // Nếu có mảng addresses, lấy địa chỉ đầu tiên
    if (customer.addresses && customer.addresses.length > 0) {
      const firstAddress = customer.addresses[0];
      // Ưu tiên dia_chi trước, sau đó mới đến specificAddress
      if (firstAddress.dia_chi) {
        return firstAddress.dia_chi;
      }
      if (firstAddress.specificAddress) {
        return firstAddress.specificAddress;
      }
    }
    
    // Nếu không có địa chỉ nào, hiển thị "Chưa cập nhật"
    return 'Chưa cập nhật';
  }


  // Method để hiển thị thông tin địa chỉ chi tiết
  showAddressDetails(): void {
    if (this.addresses.length === 0) {
      alert('❌ Không có địa chỉ nào!');
      return;
    }
    
    let addressInfo = '🏠 Danh sách địa chỉ:\n\n';
    this.addresses.forEach((address, index) => {
      const isDefault = this.getAddressDefault(address) ? ' (Mặc định)' : '';
      addressInfo += `${index + 1}. ${address.tenDiaChi || address.specificAddress || 'Địa chỉ'}: ${address.diaChiCuThe || address.specificAddress || 'Chưa cập nhật'}${isDefault}\n`;
    });
    
    alert(addressInfo);
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

  getCustomerCode(customer: Customer): string {
    if (customer.customerCode) {
      return customer.customerCode;
    }
    if (customer.id) {
      return 'KH' + customer.id.toString().padStart(5, '0');
    }
    return 'KH00000';
  }

  getStartItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndItem(): number {
    const end = this.currentPage * this.itemsPerPage;
    return Math.min(end, this.filteredCustomers.length);
  }

  // Xóa địa chỉ khỏi database
  deleteAddress(address: Address): void {
    if (!this.selectedCustomer || !this.selectedCustomer.id) {
      alert('❌ Không tìm thấy khách hàng!');
      return;
    }

    if (confirm(`Bạn có chắc chắn muốn xóa địa chỉ này?`)) {
      console.log('🔄 Đang xóa địa chỉ khỏi database...', address);
      
      this.customerService.deleteCustomerAddress(this.selectedCustomer.id!, address.id!).subscribe({
        next: (response) => {
          console.log('✅ Xóa địa chỉ thành công từ database:', response);
          
          // Xóa khỏi danh sách local
          const index = this.addresses.findIndex(a => a.id === address.id);
          if (index > -1) {
            this.addresses.splice(index, 1);
            if (this.currentAddressIndex >= this.addresses.length) {
              this.currentAddressIndex = Math.max(0, this.addresses.length - 1);
            }
          }
          
          // Cập nhật customer trong local storage
          if (this.selectedCustomer && this.selectedCustomer.id) {
            const customerIndex = this.customers.findIndex(c => c.id === this.selectedCustomer!.id);
            if (customerIndex > -1) {
              this.customers[customerIndex].addresses = [...this.addresses];
              this.saveToLocalStorage();
            }
          }
          
          alert('✅ Đã xóa địa chỉ khỏi database!');
        },
        error: (error) => {
          console.error('❌ Lỗi khi xóa địa chỉ khỏi database:', error);
          
          // Xóa khỏi local array ngay cả khi backend lỗi
          const index = this.addresses.findIndex(a => a.id === address.id);
          if (index > -1) {
            this.addresses.splice(index, 1);
            if (this.currentAddressIndex >= this.addresses.length) {
              this.currentAddressIndex = Math.max(0, this.addresses.length - 1);
            }
          }
          
          if (error.status === 404) {
            alert('❌ Không tìm thấy địa chỉ trong database!');
          } else if (error.status === 500) {
            alert('❌ Lỗi server! Không thể xóa địa chỉ.');
          } else {
            alert('❌ Lỗi kết nối! Không thể xóa địa chỉ khỏi database.');
          }
        }
      });
    }
  }

  viewCustomer(customer: Customer): void {
    // Hiển thị thông tin chi tiết khách hàng
    alert(`Thông tin khách hàng:
Mã KH: ${this.getCustomerCode(customer)}
Tên: ${customer.ho_ten || customer.name}
Email: ${customer.email}
Số điện thoại: ${customer.so_dien_thoai || customer.phone}
Địa chỉ: ${this.getCustomerAddress(customer)}
Điểm tích lũy: ${customer.diem_tich_luy || customer.diemTichLuy || 0}
Ngày tạo: ${this.formatDate(customer.ngay_tao || customer.registrationDate)}
Trạng thái: ${this.getCustomerStatus(customer) === 'Active' ? 'Hoạt động' : 'Không hoạt động'}`);
  }

  deleteCustomer(customer: Customer): void {
    if (confirm(`Bạn có chắc chắn muốn xóa khách hàng "${customer.ho_ten || customer.name}"?`)) {
      // Xóa ngay lập tức khỏi danh sách local
      this.deleteCustomerFromLocal(customer);
      alert('✅ Đã xóa khách hàng!');
      
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


  // Bật/tắt trạng thái hoạt động của khách hàng
  toggleCustomerStatus(customer: Customer): void {
    const currentStatus = this.getCustomerStatus(customer);
    const newStatus = currentStatus === 'Active' ? false : true;
    const action = newStatus ? 'bật' : 'tắt';
    
    if (confirm(`Bạn có chắc chắn muốn ${action} hoạt động cho khách hàng "${customer.ho_ten || customer.name}"?`)) {
      // Cập nhật ngay lập tức trong danh sách local
      const index = this.customers.findIndex(c => c.id === customer.id);
      if (index !== -1) {
        this.customers[index].trang_thai = newStatus;
        this.customers[index].status = newStatus ? 'Active' : 'Inactive';
        this.saveToLocalStorage();
        this.applyFilters();
      }
      alert(`✅ Đã ${action} hoạt động cho khách hàng!`);
      
      // Gọi API backend ngầm (không chờ response)
      this.customerService.updateCustomerStatus(customer.id || 0, newStatus).subscribe({
        next: (response) => {
          console.log('✅ Cập nhật trạng thái thành công từ database:', response);
        },
        error: (error) => {
          console.error('❌ Lỗi khi cập nhật trạng thái từ database:', error);
          // Không hiển thị lỗi cho user vì đã cập nhật thành công khỏi local
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
      alert('⚠️ Đã cập nhật khách hàng (offline mode)');
    } else {
      // Add new customer to local array
      customerData.id = Date.now(); // Generate temporary ID
      this.customers.push(customerData);
      alert('⚠️ Đã thêm khách hàng (offline mode)');
    }
    
    this.saveToLocalStorage();
    this.applyFilters();
    this.closeModals();
    this.resetForm();
    this.isLoading = false;
  }

  // Validation Methods
  validateCustomerForm(): boolean {
    this.customerErrors = {};
    let isValid = true;

    // Kiểm tra thông tin bắt buộc
    if (!this.customerForm.ho_ten) {
      this.customerErrors.ho_ten = 'Tên khách hàng không được để trống';
      isValid = false;
    } else if (this.customerForm.ho_ten.trim().length < 2) {
      this.customerErrors.ho_ten = 'Tên khách hàng phải có ít nhất 2 ký tự';
      isValid = false;
    } else if (this.customerForm.ho_ten.trim().length > 100) {
      this.customerErrors.ho_ten = 'Tên khách hàng không được quá 100 ký tự';
      isValid = false;
    }

    if (!this.customerForm.email) {
      this.customerErrors.email = 'Email không được để trống';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.customerForm.email)) {
        this.customerErrors.email = 'Email không đúng định dạng';
        isValid = false;
      } else {
        // Kiểm tra email trùng lặp
        const existingCustomer = this.customers.find(c => 
          c.email.toLowerCase() === this.customerForm.email.toLowerCase() && 
          (!this.showEditModal || c.id !== this.selectedCustomer?.id)
        );
        if (existingCustomer) {
          this.customerErrors.email = 'Email này đã được sử dụng';
          isValid = false;
        }
      }
    }

    if (!this.customerForm.so_dien_thoai) {
      this.customerErrors.so_dien_thoai = 'Số điện thoại không được để trống';
      isValid = false;
    } else {
      const phoneRegex = /^(\+84|84|0)[1-9][0-9]{8,9}$/;
      const cleanPhone = this.customerForm.so_dien_thoai.replace(/\s/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        this.customerErrors.so_dien_thoai = 'Số điện thoại không đúng định dạng';
        isValid = false;
      } else {
        // Kiểm tra số điện thoại trùng lặp
        const existingPhone = this.customers.find(c => 
          c.so_dien_thoai === cleanPhone && 
          (!this.showEditModal || c.id !== this.selectedCustomer?.id)
        );
        if (existingPhone) {
          this.customerErrors.so_dien_thoai = 'Số điện thoại này đã được sử dụng';
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
        this.customerErrors.ngay_sinh = 'Tuổi phải từ 0-120 tuổi';
        isValid = false;
      } else if (birthDate > today) {
        this.customerErrors.ngay_sinh = 'Ngày sinh không thể là ngày trong tương lai';
        isValid = false;
      }
    }

    return isValid;
  }

  validateAddresses(): boolean {
    // Kiểm tra có ít nhất 1 địa chỉ
    if (this.addresses.length === 0) {
      alert('❌ Vui lòng thêm ít nhất 1 địa chỉ cho khách hàng!');
      return false;
    }

    // Validation từng địa chỉ
    for (let i = 0; i < this.addresses.length; i++) {
      const address = this.addresses[i];
      
      // Kiểm tra thông tin bắt buộc
      if (!address.specificAddress || !address.ward || !address.district || !address.province) {
        alert(`❌ Địa chỉ ${i + 1}: Vui lòng điền đầy đủ thông tin!\n- Địa chỉ cụ thể\n- Phường/Xã\n- Quận/Huyện\n- Tỉnh/Thành phố`);
        return false;
      }

      // Kiểm tra độ dài địa chỉ cụ thể
      if (address.specificAddress.trim().length < 10) {
        alert(`❌ Địa chỉ ${i + 1}: Địa chỉ cụ thể phải có ít nhất 10 ký tự!`);
        return false;
      }

      if (address.specificAddress.trim().length > 200) {
        alert(`❌ Địa chỉ ${i + 1}: Địa chỉ cụ thể không được quá 200 ký tự!`);
        return false;
      }

      // Kiểm tra có địa chỉ mặc định
      if (i === this.addresses.length - 1 && !address.isDefault) {
        alert('❌ Phải có ít nhất 1 địa chỉ mặc định!');
        return false;
      }
    }

    return true;
  }

  validateAddressForm(): boolean {
    // Kiểm tra thông tin bắt buộc
    if (!this.addressForm.specificAddress || !this.addressForm.province || !this.addressForm.district || !this.addressForm.ward) {
      alert('❌ Vui lòng điền đầy đủ thông tin địa chỉ!\n- Địa chỉ cụ thể\n- Tỉnh/Thành phố\n- Quận/Huyện\n- Phường/Xã');
      return false;
    }

    // Kiểm tra độ dài địa chỉ cụ thể
    if (this.addressForm.specificAddress.trim().length < 10) {
      alert('❌ Địa chỉ cụ thể phải có ít nhất 10 ký tự!');
      return false;
    }

    if (this.addressForm.specificAddress.trim().length > 200) {
      alert('❌ Địa chỉ cụ thể không được quá 200 ký tự!');
      return false;
    }

    // Kiểm tra các trường khác
    if (!this.addressForm.province || this.addressForm.province === '') {
      alert('❌ Vui lòng chọn tỉnh/thành phố!');
      return false;
    }

    if (!this.addressForm.district || this.addressForm.district === '') {
      alert('❌ Vui lòng chọn quận/huyện!');
      return false;
    }

    if (!this.addressForm.ward || this.addressForm.ward === '') {
      alert('❌ Vui lòng chọn phường/xã!');
      return false;
    }

    return true;
  }

  private deleteCustomerFromLocal(customer: Customer): void {
    // Xóa khỏi danh sách local
    this.customers = this.customers.filter(c => c.id !== customer.id);
    this.saveToLocalStorage();
    this.applyFilters(); // Áp dụng lại filter
  }

}