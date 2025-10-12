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
    this.loadLocationData();
    this.loadCustomers();
  }

  loadCustomers() {
    this.isLoading = true;
    this.error = null;
    
    // Thử load từ localStorage trước
    this.loadFromLocalStorage();
    
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        // Xử lý dữ liệu từ Spring Boot (có thể là array hoặc object với data property)
        this.customers = Array.isArray(customers) ? customers : (customers as any).data || [];
        this.saveToLocalStorage();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.error = error.message || 'Không thể tải danh sách khách hàng. Vui lòng thử lại.';
        this.isLoading = false;
        // Fallback to sample data if API fails
        this.loadSampleData();
      }
    });
  }

  loadSampleData() {
    // Fallback sample data với cấu trúc database
    this.customers = [
      {
        id: 1,
        ho_ten: 'Nguyễn Văn An',
        email: 'an.nguyen@email.com',
        so_dien_thoai: '0123456789',
        ngay_sinh: new Date('1990-05-15'),
        gioi_tinh: true, // Nam
        ngay_tao: new Date('2023-01-15'),
        diem_tich_luy: 2500,
        trang_thai: true, // Active
        // Các trường bổ sung cho hiển thị
        name: 'Nguyễn Văn An',
        phone: '0123456789',
        dateOfBirth: new Date('1990-05-15'),
        gender: 'Nam',
        registrationDate: new Date('2023-01-15'),
        totalSpent: 2500000,
        status: 'Active',
        addresses: [{
          id: 1,
          dia_chi: '123 Nguyễn Huệ, Q1, TP.HCM',
          mac_dinh: true,
          isDefault: true
        }]
      },
      {
        id: 2,
        ho_ten: 'Trần Thị Bình',
        email: 'binh.tran@email.com',
        so_dien_thoai: '0987654321',
        ngay_sinh: new Date('1985-08-20'),
        gioi_tinh: false, // Nữ
        ngay_tao: new Date('2023-02-10'),
        diem_tich_luy: 1800,
        trang_thai: true, // Active
        // Các trường bổ sung cho hiển thị
        name: 'Trần Thị Bình',
        phone: '0987654321',
        dateOfBirth: new Date('1985-08-20'),
        gender: 'Nữ',
        registrationDate: new Date('2023-02-10'),
        totalSpent: 1800000,
        status: 'Active',
        addresses: [{
          id: 2,
          dia_chi: '456 Lê Lợi, Q1, TP.HCM',
          mac_dinh: true,
          isDefault: true
        }]
      }
    ];
    this.saveToLocalStorage();
    this.applyFilters();
  }

  // Customer Form Methods
  saveCustomer() {
    if (!this.customerForm.ho_ten || !this.customerForm.email || !this.customerForm.so_dien_thoai) {
      alert('❌ Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    this.isLoading = true;

    // Tạo địa chỉ chính từ địa chỉ mặc định hoặc địa chỉ đầu tiên
    let primaryAddress = this.customerForm.address.trim();
    if (this.addresses.length > 0) {
      const defaultAddress = this.addresses.find(addr => addr.isDefault) || this.addresses[0];
      primaryAddress = `${defaultAddress.specificAddress}, ${defaultAddress.ward}, ${defaultAddress.district}, ${defaultAddress.province}`;
    }

    // Tạo data để gửi lên backend
    const customerRequestData: CustomerRequestData = {
      ho_ten: this.customerForm.ho_ten.trim(),
      email: this.customerForm.email.trim(),
      so_dien_thoai: this.customerForm.so_dien_thoai.trim(),
      ngay_sinh: this.customerForm.ngay_sinh,
      gioi_tinh: this.customerForm.gioi_tinh,
      trang_thai: true // Active
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

    const operation = this.showEditModal && this.selectedCustomer && this.selectedCustomer.id
      ? this.customerService.updateCustomer(this.selectedCustomer.id, customerRequestData)
      : this.customerService.createCustomer(customerRequestData);

    operation.subscribe({
      next: (savedCustomer) => {
        if (this.showEditModal && this.selectedCustomer) {
          // Update existing customer in local array
          const index = this.customers.findIndex(c => c.id === this.selectedCustomer!.id);
          if (index > -1) {
            this.customers[index] = savedCustomer;
          }
          alert('✅ Cập nhật khách hàng thành công!');
        } else {
          // Add new customer to local array
          this.customers.push(savedCustomer);
          alert('✅ Thêm khách hàng thành công!');
        }
        
        this.saveToLocalStorage();
        this.applyFilters();
        this.closeModals();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error saving customer:', error);
        
        // Fallback: Lưu vào local array nếu API fail
        if (this.showEditModal && this.selectedCustomer) {
          // Update existing customer in local array
          const index = this.customers.findIndex(c => c.id === this.selectedCustomer!.id);
          if (index > -1) {
            this.customers[index] = {
              ...this.customers[index],
              ...customerData,
              id: this.selectedCustomer.id
            };
          }
          alert('✅ Cập nhật khách hàng thành công (offline mode)!');
        } else {
          // Add new customer to local array
          const newCustomer = {
            ...customerData,
            id: Date.now(),
            customerCode: customerData.customerCode || 'KH' + Date.now().toString().slice(-6)
          };
          this.customers.push(newCustomer);
          alert('✅ Thêm khách hàng thành công (offline mode)!');
        }
        
        this.saveToLocalStorage();
        this.applyFilters();
        this.closeModals();
        this.isLoading = false;
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
    if (!this.addressForm.specificAddress || !this.addressForm.province || !this.addressForm.district || !this.addressForm.ward) {
      alert('❌ Vui lòng điền đầy đủ thông tin bắt buộc!');
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
        // Cập nhật địa chỉ hiện có
        this.customerService.updateCustomerAddress(this.selectedCustomer.id, this.selectedAddress.id, addressData).subscribe({
          next: (updatedAddress) => {
            const index = this.addresses.findIndex(a => a.id === this.selectedAddress!.id);
            if (index > -1) {
              this.addresses[index] = updatedAddress;
            }
            alert('✅ Cập nhật địa chỉ thành công!');
            this.closeAddressModals();
          },
          error: (error) => {
            console.error('Error updating address:', error);
            // Fallback: update local data
            const index = this.addresses.findIndex(a => a.id === this.selectedAddress!.id);
            if (index > -1) {
              this.addresses[index] = {
                ...this.addresses[index],
                ...addressData,
                updatedAt: new Date().toISOString()
              };
            }
            alert('✅ Cập nhật địa chỉ thành công (offline mode)!');
            this.closeAddressModals();
          }
        });
      } else {
        // Thêm địa chỉ mới
        this.customerService.addCustomerAddress(this.selectedCustomer.id, addressData).subscribe({
          next: (newAddress) => {
            this.addresses.push(newAddress);
            this.currentAddressIndex = this.addresses.length - 1;
            alert('✅ Thêm địa chỉ thành công!');
            this.closeAddressModals();
          },
          error: (error) => {
            console.error('Error adding address:', error);
            // Fallback: add to local data
            const newId = this.addresses.length > 0 ? Math.max(...this.addresses.map(a => a.id || 0)) + 1 : 1;
            const newAddress: Address = {
              ...addressData,
              id: newId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            this.addresses.push(newAddress);
            this.currentAddressIndex = this.addresses.length - 1;
            alert('✅ Thêm địa chỉ thành công (offline mode)!');
            this.closeAddressModals();
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
        this.customerService.setDefaultAddress(this.selectedCustomer.id, address.id).subscribe({
          next: (updatedAddress) => {
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
            
            alert('✅ Đã đặt làm địa chỉ mặc định!');
          },
          error: (error) => {
            console.error('Error setting default address:', error);
            alert('❌ Có lỗi xảy ra khi đặt địa chỉ mặc định. Vui lòng thử lại.');
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
      
      const matchesStatus = this.statusFilter === 'all' || 
        (this.statusFilter === 'active' && (customer.status === 'Active' || customer.trang_thai === true)) ||
        (this.statusFilter === 'inactive' && (customer.status === 'Inactive' || customer.trang_thai === false));
      
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
        this.addresses = addresses;
        this.currentAddressIndex = 0;
      },
      error: (error) => {
        console.error('Error loading customer addresses:', error);
        // Fallback to addresses from customer object
        this.addresses = this.selectedCustomer?.addresses ? [...this.selectedCustomer.addresses] : [];
        this.currentAddressIndex = 0;
      }
    });
  }


  closeModals() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.selectedCustomer = null;
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
    // Reset địa chỉ chi tiết
    this.addresses = [];
    this.currentAddressIndex = 0;
  }


  toggleCustomerStatus(customer: Customer) {
    if (!customer.id) return;
    
    const newStatus = customer.status === 'Active' ? 'Inactive' : 'Active';
    const newTrangThai = customer.trang_thai !== undefined ? !customer.trang_thai : (customer.status === 'Active' ? false : true);
    
    this.customerService.toggleCustomerStatus(customer.id, newStatus).subscribe({
      next: (updatedCustomer) => {
        // Update customer in local array
        const index = this.customers.findIndex(c => c.id === customer.id);
        if (index > -1) {
          this.customers[index] = updatedCustomer;
        }
        this.saveToLocalStorage();
        this.applyFilters();
        alert(`✅ Đã ${newStatus === 'Active' ? 'kích hoạt' : 'vô hiệu hóa'} khách hàng ${customer.ho_ten || customer.name}`);
      },
      error: (error) => {
        console.error('Error toggling customer status:', error);
        
        // Fallback: Cập nhật local array nếu API fail
        const index = this.customers.findIndex(c => c.id === customer.id);
        if (index > -1) {
          this.customers[index] = {
            ...this.customers[index],
            status: newStatus,
            trang_thai: newTrangThai
          };
        }
        this.saveToLocalStorage();
        this.applyFilters();
        alert(`✅ Đã ${newStatus === 'Active' ? 'kích hoạt' : 'vô hiệu hóa'} khách hàng ${customer.ho_ten || customer.name} (offline mode)`);
      }
    });
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
        console.log('✅ Đã load dữ liệu từ localStorage:', this.customers.length, 'khách hàng');
        this.applyFilters();
      }
    } catch (error) {
      console.error('❌ Lỗi khi load từ localStorage:', error);
    }
  }

}