import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Test Customer API</h2>
      <div *ngIf="loading" class="alert alert-info">Đang tải dữ liệu...</div>
      <div *ngIf="error" class="alert alert-danger">Lỗi: {{ error }}</div>
      <div *ngIf="customers.length > 0">
        <h3>Dữ liệu khách hàng từ API:</h3>
        <div class="table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên khách hàng</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Trạng thái</th>
                <th>Điểm tích lũy</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let customer of customers">
                <td>{{ customer.id }}</td>
                <td>{{ customer.tenKhachHang }}</td>
                <td>{{ customer.email }}</td>
                <td>{{ customer.soDienThoai }}</td>
                <td>
                  <span class="badge" [class.bg-success]="customer.trangThai" [class.bg-secondary]="!customer.trangThai">
                    {{ customer.trangThai ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>{{ customer.diemTichLuy }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class CustomerTestComponent implements OnInit {
  customers: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;
    this.error = null;
    
    this.customerService.getAllCustomersSimple().subscribe({
      next: (data) => {
        console.log('Customer data received:', data);
        this.customers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading customers:', err);
        this.error = err.message || 'Có lỗi xảy ra khi tải dữ liệu';
        this.loading = false;
      }
    });
  }
}
