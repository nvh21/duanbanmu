import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Customer, CustomerFormData } from '../../interfaces/customer.interface';

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
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  totalItems = 0;
  
  // Sorting
  sortField = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Search
  searchTerm = '';
  
  // Modal states
  showAddModal = false;
  showEditModal = false;
  showDetailModal = false;
  showDeleteModal = false;
  
  // Form data
  selectedCustomer: Customer | null = null;
  customerForm: CustomerFormData = {
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: new Date(),
    gender: 'Nam',
    notes: ''
  };
  
  // Form validation
  formErrors: { [key: string]: string } = {};

  ngOnInit() {
    this.loadSampleData();
    this.applyFilters();
  }

  loadSampleData() {
    this.customers = [
      {
        id: 1,
        name: 'Nguyễn Văn An',
        email: 'an.nguyen@email.com',
        phone: '0123456789',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        dateOfBirth: new Date('1990-05-15'),
        gender: 'Nam',
        registrationDate: new Date('2023-01-15'),
        totalOrders: 25,
        totalSpent: 15000000,
        status: 'Active',
        notes: 'Khách hàng VIP'
      },
      {
        id: 2,
        name: 'Trần Thị Bình',
        email: 'binh.tran@email.com',
        phone: '0987654321',
        address: '456 Đường XYZ, Quận 2, TP.HCM',
        dateOfBirth: new Date('1985-08-20'),
        gender: 'Nữ',
        registrationDate: new Date('2023-02-20'),
        totalOrders: 15,
        totalSpent: 8500000,
        status: 'Active',
        notes: 'Khách hàng thường xuyên'
      },
      {
        id: 3,
        name: 'Lê Văn Cường',
        email: 'cuong.le@email.com',
        phone: '0369852147',
        address: '789 Đường DEF, Quận 3, TP.HCM',
        dateOfBirth: new Date('1992-12-10'),
        gender: 'Nam',
        registrationDate: new Date('2023-03-10'),
        totalOrders: 8,
        totalSpent: 4200000,
        status: 'Inactive',
        notes: 'Khách hàng mới'
      },
      {
        id: 4,
        name: 'Phạm Thị Dung',
        email: 'dung.pham@email.com',
        phone: '0741852963',
        address: '321 Đường GHI, Quận 4, TP.HCM',
        dateOfBirth: new Date('1988-03-25'),
        gender: 'Nữ',
        registrationDate: new Date('2023-04-05'),
        totalOrders: 32,
        totalSpent: 18500000,
        status: 'Active',
        notes: 'Khách hàng VIP, mua nhiều'
      },
      {
        id: 5,
        name: 'Hoàng Văn Em',
        email: 'em.hoang@email.com',
        phone: '0527419638',
        address: '654 Đường JKL, Quận 5, TP.HCM',
        dateOfBirth: new Date('1995-07-18'),
        gender: 'Nam',
        registrationDate: new Date('2023-05-12'),
        totalOrders: 12,
        totalSpent: 6800000,
        status: 'Active',
        notes: 'Khách hàng trẻ tuổi'
      }
    ];
  }

  applyFilters() {
    let filtered = [...this.customers];
    
    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.phone.includes(term) ||
        customer.address.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    if (this.sortField) {
      filtered.sort((a, b) => {
        const aValue = this.getFieldValue(a, this.sortField);
        const bValue = this.getFieldValue(b, this.sortField);
        
        if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    this.filteredCustomers = filtered;
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
  }

  getFieldValue(customer: Customer, field: string): any {
    switch (field) {
      case 'name': return customer.name;
      case 'email': return customer.email;
      case 'phone': return customer.phone;
      case 'totalOrders': return customer.totalOrders;
      case 'totalSpent': return customer.totalSpent;
      case 'registrationDate': return customer.registrationDate;
      case 'status': return customer.status;
      default: return '';
    }
  }

  sort(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  getPaginatedCustomers(): Customer[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCustomers.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
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

  // Modal functions
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
      dateOfBirth: new Date(customer.dateOfBirth),
      gender: customer.gender,
      notes: customer.notes || ''
    };
    this.showEditModal = true;
  }

  openDetailModal(customer: Customer) {
    this.selectedCustomer = customer;
    this.showDetailModal = true;
  }

  openDeleteModal(customer: Customer) {
    this.selectedCustomer = customer;
    this.showDeleteModal = true;
  }

  closeModals() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showDetailModal = false;
    this.showDeleteModal = false;
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
      gender: 'Nam',
      notes: ''
    };
    this.formErrors = {};
  }

  // Method to clear form errors when user starts typing
  clearError(field: string) {
    if (this.formErrors[field]) {
      delete this.formErrors[field];
    }
  }

  validateForm(): boolean {
    this.formErrors = {};
    let isValid = true;

    if (!this.customerForm.name.trim()) {
      this.formErrors['name'] = 'Tên khách hàng không được để trống';
      isValid = false;
    }

    if (!this.customerForm.email.trim()) {
      this.formErrors['email'] = 'Email không được để trống';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.customerForm.email)) {
      this.formErrors['email'] = 'Email không hợp lệ';
      isValid = false;
    } else {
      // Check for duplicate email (only when adding new customer or editing with different email)
      const isDuplicate = this.customers.some(customer => 
        customer.email.toLowerCase() === this.customerForm.email.toLowerCase().trim() &&
        (!this.selectedCustomer || customer.id !== this.selectedCustomer.id)
      );
      
      if (isDuplicate) {
        this.formErrors['email'] = 'Email này đã được sử dụng';
        isValid = false;
      }
    }

    if (!this.customerForm.phone.trim()) {
      this.formErrors['phone'] = 'Số điện thoại không được để trống';
      isValid = false;
    } else if (!/^[0-9]{10,11}$/.test(this.customerForm.phone)) {
      this.formErrors['phone'] = 'Số điện thoại phải có 10-11 chữ số';
      isValid = false;
    } else {
      // Check for duplicate phone (only when adding new customer or editing with different phone)
      const isDuplicate = this.customers.some(customer => 
        customer.phone === this.customerForm.phone.trim() &&
        (!this.selectedCustomer || customer.id !== this.selectedCustomer.id)
      );
      
      if (isDuplicate) {
        this.formErrors['phone'] = 'Số điện thoại này đã được sử dụng';
        isValid = false;
      }
    }

    if (!this.customerForm.address.trim()) {
      this.formErrors['address'] = 'Địa chỉ không được để trống';
      isValid = false;
    }

    return isValid;
  }

  addCustomer() {
    if (!this.validateForm()) return;

    const newCustomer: Customer = {
      id: this.customers.length > 0 ? Math.max(...this.customers.map(c => c.id)) + 1 : 1,
      name: this.customerForm.name.trim(),
      email: this.customerForm.email.trim(),
      phone: this.customerForm.phone.trim(),
      address: this.customerForm.address.trim(),
      dateOfBirth: this.customerForm.dateOfBirth,
      gender: this.customerForm.gender,
      registrationDate: new Date(),
      totalOrders: 0,
      totalSpent: 0,
      status: 'Active',
      notes: this.customerForm.notes?.trim() || ''
    };

    this.customers.push(newCustomer);
    this.applyFilters();
    this.closeModals();
    
    // Show success message
    alert('✅ Khách hàng đã được thêm thành công!');
  }

  updateCustomer() {
    if (!this.validateForm() || !this.selectedCustomer) return;

    const index = this.customers.findIndex(c => c.id === this.selectedCustomer!.id);
    if (index !== -1) {
      this.customers[index] = {
        ...this.customers[index],
        name: this.customerForm.name.trim(),
        email: this.customerForm.email.trim(),
        phone: this.customerForm.phone.trim(),
        address: this.customerForm.address.trim(),
        dateOfBirth: this.customerForm.dateOfBirth,
        gender: this.customerForm.gender,
        notes: this.customerForm.notes?.trim() || ''
      };
    }

    this.applyFilters();
    this.closeModals();
    
    // Show success message
    alert('✅ Khách hàng đã được cập nhật thành công!');
  }

  deleteCustomer() {
    if (!this.selectedCustomer) return;

    const index = this.customers.findIndex(c => c.id === this.selectedCustomer!.id);
    if (index !== -1) {
      this.customers.splice(index, 1);
    }

    this.applyFilters();
    this.closeModals();
    
    // Show success message
    alert('✅ Khách hàng đã được xóa thành công!');
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('vi-VN').format(new Date(date));
  }

  getStatusClass(status: string): string {
    return status === 'Active' ? 'status-active' : 'status-inactive';
  }

  // Helper method for template
  getMathMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  // Helper method to format date for input
  getDateInputValue(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Helper method to convert date string to Date object
  convertToDate(dateString: string): Date {
    return new Date(dateString);
  }

  // Method to handle form submission with Enter key
  onFormSubmit(event: Event) {
    event.preventDefault();
    if (this.showAddModal) {
      this.addCustomer();
    } else if (this.showEditModal) {
      this.updateCustomer();
    }
  }

  // Method to handle modal close with Escape key
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeModals();
    }
  }

  // Method to check if modal is open
  isModalOpen(): boolean {
    return this.showAddModal || this.showEditModal || this.showDetailModal || this.showDeleteModal;
  }
}
