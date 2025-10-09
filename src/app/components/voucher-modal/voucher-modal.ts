import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface VoucherForm {
  code: string;
  name: string;
  type: 'cash' | 'percentage';
  maxDiscount: number;
  minOrder: number;
  quantity: number;
  startDate: string;
  endDate: string;
}

interface Customer {
  id: number;
  code: string;
  name: string;
  gender: string;
  birthDate: Date;
  totalPurchases: number;
  lastPurchase: Date;
}

@Component({
  selector: 'app-voucher-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './voucher-modal.html',
  styleUrl: './voucher-modal.scss'
})
export class VoucherModal implements OnInit {
  @Output() voucherSaved = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();

  voucherForm: VoucherForm = {
    code: '',
    name: '',
    type: 'cash',
    maxDiscount: 0,
    minOrder: 0,
    quantity: 0,
    startDate: '',
    endDate: ''
  };

  // Validation
  codeError: string = '';

  searchCustomer: string = '';
  selectedCustomers: Customer[] = [];
  
  customers: Customer[] = [
    {
      id: 1,
      code: 'KH00002',
      name: 'Đinh Thế Mạnh',
      gender: 'Nữ',
      birthDate: new Date('1998-09-12'),
      totalPurchases: 19,
      lastPurchase: new Date('2025-08-28')
    },
    {
      id: 2,
      code: 'KH00003',
      name: 'Trịnh Châu Anh',
      gender: 'Nam',
      birthDate: new Date('1986-04-17'),
      totalPurchases: 2,
      lastPurchase: new Date('2025-03-09')
    },
    {
      id: 3,
      code: 'KH00004',
      name: 'Nguyễn Hoàng...',
      gender: 'Nữ',
      birthDate: new Date('2000-08-06'),
      totalPurchases: 13,
      lastPurchase: new Date('2025-08-02')
    },
    {
      id: 4,
      code: 'KH00005',
      name: 'Nguyễn Minh ...',
      gender: 'Nam',
      birthDate: new Date('2001-12-19'),
      totalPurchases: 2,
      lastPurchase: new Date('2025-03-09')
    },
    {
      id: 5,
      code: 'KH00006',
      name: 'Nguyễn Hải Lo...',
      gender: 'Nữ',
      birthDate: new Date('1994-10-20'),
      totalPurchases: 1,
      lastPurchase: new Date('2025-03-09')
    }
  ];

  filteredCustomers: Customer[] = [];

  ngOnInit() {
    this.generateVoucherCode();
    this.filteredCustomers = [...this.customers];
  }

  generateVoucherCode() {
    const randomString = Math.random().toString(36).substring(2, 10).toUpperCase();
    this.voucherForm.code = `VOUCHER_${randomString}`;
    this.validateVoucherCode();
  }

  validateVoucherCode() {
    this.codeError = '';
    
    if (!this.voucherForm.code.trim()) {
      this.codeError = 'Mã voucher không được để trống';
      return false;
    }
    
    if (this.voucherForm.code.length < 3) {
      this.codeError = 'Mã voucher phải có ít nhất 3 ký tự';
      return false;
    }
    
    return true;
  }

  onCodeChange() {
    this.validateVoucherCode();
  }

  onCustomerSearch() {
    if (!this.searchCustomer.trim()) {
      this.filteredCustomers = [...this.customers];
      return;
    }

    this.filteredCustomers = this.customers.filter(customer =>
      customer.code.toLowerCase().includes(this.searchCustomer.toLowerCase()) ||
      customer.name.toLowerCase().includes(this.searchCustomer.toLowerCase())
    );
  }

  showAllCustomers() {
    this.searchCustomer = '';
    this.filteredCustomers = [...this.customers];
  }

  selectCustomer(customer: Customer) {
    if (!this.isCustomerSelected(customer)) {
      this.selectedCustomers.push(customer);
    }
  }

  removeCustomer(customer: Customer) {
    this.selectedCustomers = this.selectedCustomers.filter(c => c.id !== customer.id);
  }

  isCustomerSelected(customer: Customer): boolean {
    return this.selectedCustomers.some(c => c.id === customer.id);
  }

  saveVoucher() {
    if (!this.validateVoucherCode()) {
      return;
    }
    
    const voucherData = {
      ...this.voucherForm,
      selectedCustomers: this.selectedCustomers
    };
    
    this.voucherSaved.emit(voucherData);
    this.closeModal();
  }

  closeModal() {
    this.modalClosed.emit();
  }
}
