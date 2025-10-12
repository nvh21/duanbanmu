import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-backend-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="backend-test-container">
      <h3>🔗 Test Kết Nối Backend</h3>
      
      <div class="test-section">
        <button (click)="testConnection()" [disabled]="isLoading" class="btn test-btn">
          {{ isLoading ? '⏳ Đang test...' : '🚀 Test Kết Nối' }}
        </button>
        
        <div *ngIf="connectionResult" class="result">
          <div [class]="'status ' + (connectionResult.success ? 'success' : 'error')">
            {{ connectionResult.success ? '✅' : '❌' }} {{ connectionResult.message }}
          </div>
          <div *ngIf="connectionResult.details" class="details">
            <pre>{{ connectionResult.details | json }}</pre>
          </div>
        </div>
      </div>

      <div class="test-section">
        <button (click)="testCustomersAPI()" [disabled]="isLoading" class="btn test-btn">
          {{ isLoading ? '⏳ Đang test...' : '👥 Test API Khách Hàng' }}
        </button>
        
        <div *ngIf="customersResult" class="result">
          <div [class]="'status ' + (customersResult.success ? 'success' : 'error')">
            {{ customersResult.success ? '✅' : '❌' }} {{ customersResult.message }}
          </div>
          <div *ngIf="customersResult.data" class="details">
            <strong>Số khách hàng: {{ customersResult.data.length }}</strong>
            <div *ngFor="let customer of customersResult.data.slice(0, 3)" class="customer-item">
              <span>{{ customer.ho_ten || customer.name || 'N/A' }}</span>
              <span>{{ customer.email }}</span>
              <span>{{ customer.so_dien_thoai || customer.phone || 'N/A' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="test-section">
        <button (click)="testCreateCustomer()" [disabled]="isLoading" class="btn test-btn">
          {{ isLoading ? '⏳ Đang test...' : '➕ Test Tạo Khách Hàng' }}
        </button>
        
        <div *ngIf="createResult" class="result">
          <div [class]="'status ' + (createResult.success ? 'success' : 'error')">
            {{ createResult.success ? '✅' : '❌' }} {{ createResult.message }}
          </div>
          <div *ngIf="createResult.data" class="details">
            <pre>{{ createResult.data | json }}</pre>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .backend-test-container {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }

    .test-section {
      margin: 15px 0;
      padding: 15px;
      background: white;
      border-radius: 6px;
      border: 1px solid #e9ecef;
    }

    .test-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 10px;
    }

    .test-btn:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .result {
      margin-top: 15px;
      padding: 10px;
      border-radius: 4px;
    }

    .status.success {
      color: #28a745;
      font-weight: bold;
    }

    .status.error {
      color: #dc3545;
      font-weight: bold;
    }

    .details {
      margin-top: 10px;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 4px;
      font-size: 12px;
    }

    .customer-item {
      display: flex;
      gap: 10px;
      margin: 5px 0;
      padding: 5px;
      background: #e9ecef;
      border-radius: 3px;
    }

    pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-all;
    }
  `]
})
export class BackendTestComponent implements OnInit {
  isLoading = false;
  connectionResult: any = null;
  customersResult: any = null;
  createResult: any = null;

  constructor(
    private http: HttpClient,
    private customerService: CustomerService
  ) {}

  ngOnInit() {
    console.log('🔗 Backend Test Component initialized');
  }

  testConnection() {
    this.isLoading = true;
    this.connectionResult = null;

    // Test basic connection
    this.http.get('http://localhost:8081/api/khach-hang', { 
      observe: 'response',
      headers: { 'Accept': 'application/json' }
    }).subscribe({
      next: (response) => {
        this.connectionResult = {
          success: true,
          message: 'Kết nối backend thành công!',
          details: {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers.keys()
          }
        };
        this.isLoading = false;
      },
      error: (error) => {
        this.connectionResult = {
          success: false,
          message: 'Không thể kết nối backend: ' + error.message,
          details: error
        };
        this.isLoading = false;
      }
    });
  }

  testCustomersAPI() {
    this.isLoading = true;
    this.customersResult = null;

    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.customersResult = {
          success: true,
          message: `Lấy danh sách khách hàng thành công! (${customers.length} khách hàng)`,
          data: customers
        };
        this.isLoading = false;
      },
      error: (error) => {
        this.customersResult = {
          success: false,
          message: 'Lỗi khi lấy danh sách khách hàng: ' + error.message,
          details: error
        };
        this.isLoading = false;
      }
    });
  }

  testCreateCustomer() {
    this.isLoading = true;
    this.createResult = null;

    const testCustomer = {
      ho_ten: 'Test Customer ' + Date.now(),
      email: 'test' + Date.now() + '@example.com',
      so_dien_thoai: '0123456789',
      ngay_sinh: new Date().toISOString().split('T')[0],
      gioi_tinh: true,
      trang_thai: true
    };

    this.customerService.createCustomer(testCustomer).subscribe({
      next: (customer) => {
        this.createResult = {
          success: true,
          message: 'Tạo khách hàng test thành công!',
          data: customer
        };
        this.isLoading = false;
      },
      error: (error) => {
        this.createResult = {
          success: false,
          message: 'Lỗi khi tạo khách hàng: ' + error.message,
          details: error
        };
        this.isLoading = false;
      }
    });
  }
}
