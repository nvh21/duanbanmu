import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Customer {
  id: string;
  code: string;
  name: string;
  gender: string;
  birthDate: string;
  totalPurchases: number;
  lastPurchase: string;
}

@Component({
  selector: 'app-voucher-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './voucher-form.component.html',
  styleUrls: ['./voucher-form.component.scss'],
})
export class VoucherFormComponent {
  voucherCode = 'PGG_0ITmsBUY';
  voucherName = '';
  voucherType = '';
  minOrder = 0;
  quantity = 0;
  startDate = '';
  endDate = '';
  description = '';
  
  searchTerm = '';
  selectedCustomers: Customer[] = [];
  
  customers: Customer[] = [
    {
      id: '1',
      code: 'KH00002',
      name: 'Đình Thế Mạnh',
      gender: 'Nữ',
      birthDate: '12/9/1998',
      totalPurchases: 19,
      lastPurchase: '28/8/2025'
    },
    {
      id: '2',
      code: 'KH00003',
      name: 'Trịnh Châu Anh',
      gender: 'Nam',
      birthDate: '17/4/1986',
      totalPurchases: 2,
      lastPurchase: '9/3/2025'
    },
    {
      id: '3',
      code: 'KH00004',
      name: 'Nguyễn Hoàng...',
      gender: 'Nữ',
      birthDate: '6/8/2000',
      totalPurchases: 13,
      lastPurchase: '2/8/2025'
    },
    {
      id: '4',
      code: 'KH00005',
      name: 'Nguyễn Minh ...',
      gender: 'Nam',
      birthDate: '19/12/2001',
      totalPurchases: 2,
      lastPurchase: '9/3/2025'
    },
    {
      id: '5',
      code: 'KH00006',
      name: 'Nguyễn Hải Lo...',
      gender: 'Nữ',
      birthDate: '20/10/1994',
      totalPurchases: 1,
      lastPurchase: '9/3/2025'
    }
  ];

  filteredCustomers: Customer[] = this.customers;

  constructor(private router: Router) {}

  ngOnInit() {
    this.filterCustomers();
  }

  goBack() {
    this.router.navigate(['/vouchers']);
  }

  navigateToHome() {
    this.router.navigate(['/dashboard']);
  }

  navigateToVouchers() {
    this.router.navigate(['/vouchers']);
  }

  onSearch() {
    this.filterCustomers();
  }

  filterCustomers() {
    if (!this.searchTerm.trim()) {
      this.filteredCustomers = this.customers;
    } else {
      this.filteredCustomers = this.customers.filter(customer =>
        customer.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  selectCustomer(customer: Customer) {
    if (!this.selectedCustomers.find(c => c.id === customer.id)) {
      this.selectedCustomers.push(customer);
    }
  }

  removeCustomer(customerId: string) {
    this.selectedCustomers = this.selectedCustomers.filter(c => c.id !== customerId);
  }

  saveVoucher() {
    // Logic to save voucher
    console.log('Saving voucher:', {
      code: this.voucherCode,
      name: this.voucherName,
      type: this.voucherType,
      minOrder: this.minOrder,
      quantity: this.quantity,
      startDate: this.startDate,
      endDate: this.endDate,
      description: this.description,
      customers: this.selectedCustomers
    });
    
    // Navigate back to voucher list
    this.router.navigate(['/vouchers']);
  }
}
