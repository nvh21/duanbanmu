import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Customer } from '../../interfaces/customer.interface';
import { Address, AddressFormData, Province, District, Ward } from '../../interfaces/address.interface';

@Component({
  selector: 'app-customer-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-management.component.html',
  styleUrl: './customer-management.component.scss'
})
export class CustomerManagementComponent implements OnInit {
  // Customer data
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  paginatedCustomers: Customer[] = [];
  
  // Modal states
  showAddModal = false;
  showEditModal = false;
  selectedCustomer: Customer | null = null;
  
  // Customer form data
  customerForm = {
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: new Date(),
    gender: 'Nam' as 'Nam' | 'Nữ' | 'Khác',
    notes: ''
  };

  // Search and filter
  searchTerm = '';
  statusFilter = 'all';

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

  ngOnInit() {
    this.loadSampleData();
    this.loadLocationData();
    this.loadAddressSampleData();
    this.applyFilters();
  }

  loadSampleData() {
    this.customers = [
      {
        id: 1,
        customerCode: 'KH00001',
        name: 'Nguyễn Văn An',
        email: 'an.nguyen@email.com',
        phone: '0123456789',
        address: '123 Nguyễn Huệ, Q1, TP.HCM',
        dateOfBirth: new Date('1990-05-15'),
        gender: 'Nam',
        registrationDate: new Date('2023-01-15'),
        totalOrders: 5,
        totalSpent: 2500000,
        status: 'Active',
        notes: 'Khách hàng VIP'
      },
      {
        id: 2,
        customerCode: 'KH00002',
        name: 'Trần Thị Bình',
        email: 'binh.tran@email.com',
        phone: '0987654321',
        address: '456 Lê Lợi, Q1, TP.HCM',
        dateOfBirth: new Date('1985-08-20'),
        gender: 'Nữ',
        registrationDate: new Date('2023-02-10'),
        totalOrders: 3,
        totalSpent: 1800000,
        status: 'Active',
        notes: 'Khách hàng thân thiết'
      }
    ];
  }

  // Customer Form Methods
  saveCustomer() {
    if (!this.customerForm.name || !this.customerForm.email || !this.customerForm.phone || !this.customerForm.gender) {
      alert('❌ Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    // Tạo địa chỉ chính từ địa chỉ mặc định hoặc địa chỉ đầu tiên
    let primaryAddress = this.customerForm.address.trim();
    if (this.addresses.length > 0) {
      const defaultAddress = this.addresses.find(addr => addr.isDefault) || this.addresses[0];
      primaryAddress = `${defaultAddress.specificAddress}, ${defaultAddress.ward}, ${defaultAddress.district}, ${defaultAddress.province}`;
    }

    if (this.showEditModal && this.selectedCustomer) {
      // Update existing customer
      const index = this.customers.findIndex(c => c.id === this.selectedCustomer!.id);
      if (index > -1) {
        this.customers[index] = {
          ...this.customers[index],
          name: this.customerForm.name.trim(),
          email: this.customerForm.email.trim(),
          phone: this.customerForm.phone.trim(),
          address: primaryAddress,
          addresses: [...this.addresses], // Lưu danh sách địa chỉ chi tiết
          dateOfBirth: this.customerForm.dateOfBirth,
          gender: this.customerForm.gender,
          notes: this.customerForm.notes.trim()
        };
        alert('✅ Cập nhật khách hàng thành công!');
      }
    } else {
      // Add new customer
      const customerCode = 'KH' + Date.now().toString().slice(-6);
      const newCustomer: Customer = {
        id: Date.now(),
        customerCode: customerCode,
        name: this.customerForm.name.trim(),
        email: this.customerForm.email.trim(),
        phone: this.customerForm.phone.trim(),
        address: primaryAddress,
        addresses: [...this.addresses], // Lưu danh sách địa chỉ chi tiết
        dateOfBirth: this.customerForm.dateOfBirth,
        gender: this.customerForm.gender,
        registrationDate: new Date(),
        totalOrders: 0,
        totalSpent: 0,
        status: 'Active',
        notes: this.customerForm.notes.trim()
      };
      
      this.customers.push(newCustomer);
      alert('✅ Thêm khách hàng thành công!');
    }
    
    this.applyFilters();
    this.closeModals();
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
      specificAddress: address.specificAddress,
      province: this.getProvinceIdByName(address.province),
      district: this.getDistrictIdByName(address.district),
      ward: this.getWardIdByName(address.ward),
      isDefault: address.isDefault
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

    if (this.showAddressEditModal && this.selectedAddress) {
      // Update existing address
      const index = this.addresses.findIndex(a => a.id === this.selectedAddress!.id);
      if (index > -1) {
        this.addresses[index] = {
          ...this.addresses[index],
          specificAddress: this.addressForm.specificAddress.trim(),
          province: this.getProvinceNameById(this.addressForm.province),
          district: this.getDistrictNameById(this.addressForm.district),
          ward: this.getWardNameById(this.addressForm.ward),
          isDefault: this.addressForm.isDefault,
          updatedAt: new Date()
        };
        
        // If setting as default, unset other defaults
        if (this.addressForm.isDefault) {
          this.addresses.forEach((addr, i) => {
            if (i !== index) {
              addr.isDefault = false;
            }
          });
        }
        
        alert('✅ Cập nhật địa chỉ thành công!');
      }
    } else {
      // Add new address
      const newId = this.addresses.length > 0 ? Math.max(...this.addresses.map(a => a.id)) + 1 : 1;
      const newAddress: Address = {
        id: newId,
        specificAddress: this.addressForm.specificAddress.trim(),
        province: this.getProvinceNameById(this.addressForm.province),
        district: this.getDistrictNameById(this.addressForm.district),
        ward: this.getWardNameById(this.addressForm.ward),
        isDefault: this.addressForm.isDefault,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // If setting as default, unset other defaults
      if (this.addressForm.isDefault) {
        this.addresses.forEach(addr => {
          addr.isDefault = false;
        });
      }
      
      this.addresses.push(newAddress);
      this.currentAddressIndex = this.addresses.length - 1; // Navigate to new address
      alert('✅ Thêm địa chỉ thành công!');
    }
    
    this.closeAddressModals();
  }


  setAddressAsDefault(address: Address) {
    if (!address.isDefault) {
      // Unset all other defaults
      this.addresses.forEach(addr => {
        addr.isDefault = false;
      });
      
      // Set this as default
      address.isDefault = true;
      address.updatedAt = new Date();
      alert('✅ Đã đặt làm địa chỉ mặc định!');
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
        customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.phone.includes(this.searchTerm) ||
        (customer.customerCode && customer.customerCode.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesStatus = this.statusFilter === 'all' || customer.status === this.statusFilter;
      
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
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      dateOfBirth: customer.dateOfBirth,
      gender: customer.gender,
      notes: customer.notes || ''
    };
    
    // Load địa chỉ chi tiết của khách hàng
    this.addresses = customer.addresses ? [...customer.addresses] : [];
    this.currentAddressIndex = 0;
    
    this.showEditModal = true;
  }


  closeModals() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.selectedCustomer = null;
    this.resetForm();
  }

  resetForm() {
    this.customerForm = {
      name: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: new Date(),
      gender: 'Nam' as 'Nam' | 'Nữ' | 'Khác',
      notes: ''
    };
    // Reset địa chỉ chi tiết
    this.addresses = [];
    this.currentAddressIndex = 0;
  }


  toggleCustomerStatus(customer: Customer) {
    customer.status = customer.status === 'Active' ? 'Inactive' : 'Active';
    alert(`✅ Đã ${customer.status === 'Active' ? 'kích hoạt' : 'vô hiệu hóa'} khách hàng ${customer.name}`);
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

}