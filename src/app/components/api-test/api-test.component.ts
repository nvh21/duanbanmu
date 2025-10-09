import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { HoaDonService } from '../../services/hoa-don.service';
import { MasterDataService } from '../../services/master-data.service';

@Component({
  selector: 'app-api-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <h2>API Connection Test</h2>
          
          <div class="card mb-3">
            <div class="card-header">
              <h5>Backend Connection Status</h5>
            </div>
            <div class="card-body">
              <div *ngIf="connectionStatus === 'testing'" class="alert alert-info">
                <i class="bi bi-hourglass-split"></i> Testing connection...
              </div>
              <div *ngIf="connectionStatus === 'success'" class="alert alert-success">
                <i class="bi bi-check-circle"></i> Connection successful!
              </div>
              <div *ngIf="connectionStatus === 'error'" class="alert alert-danger">
                <i class="bi bi-x-circle"></i> Connection failed: {{ errorMessage }}
              </div>
              
              <button class="btn btn-primary" (click)="testConnection()" [disabled]="connectionStatus === 'testing'">
                Test Connection
              </button>
            </div>
          </div>

          <div class="card mb-3">
            <div class="card-header">
              <h5>Sample Data</h5>
            </div>
            <div class="card-body">
              <div *ngIf="sampleDataStatus === 'creating'" class="alert alert-info">
                <i class="bi bi-hourglass-split"></i> Creating sample data...
              </div>
              <div *ngIf="sampleDataStatus === 'success'" class="alert alert-success">
                <i class="bi bi-check-circle"></i> Sample data created successfully!
              </div>
              <div *ngIf="sampleDataStatus === 'error'" class="alert alert-danger">
                <i class="bi bi-x-circle"></i> Failed to create sample data: {{ sampleDataMessage }}
              </div>
              
              <button class="btn btn-success" (click)="createSampleData()" [disabled]="sampleDataStatus === 'creating'">
                Create Sample Data
              </button>
            </div>
          </div>

          <div class="card mb-3">
            <div class="card-header">
              <h5>Hóa Đơn Data</h5>
            </div>
            <div class="card-body">
              <div *ngIf="hoaDonStatus === 'loading'" class="alert alert-info">
                <i class="bi bi-hourglass-split"></i> Loading hóa đơn data...
              </div>
              <div *ngIf="hoaDonStatus === 'success'" class="alert alert-success">
                <i class="bi bi-check-circle"></i> Loaded {{ hoaDonCount }} hóa đơn records
              </div>
              <div *ngIf="hoaDonStatus === 'error'" class="alert alert-danger">
                <i class="bi bi-x-circle"></i> Failed to load hóa đơn data: {{ hoaDonMessage }}
              </div>
              
              <button class="btn btn-info" (click)="loadHoaDonData()" [disabled]="hoaDonStatus === 'loading'">
                Load Hóa Đơn Data
              </button>
            </div>
          </div>

          <div class="card mb-3">
            <div class="card-header">
              <h5>Master Data</h5>
            </div>
            <div class="card-body">
              <div *ngIf="masterDataStatus === 'loading'" class="alert alert-info">
                <i class="bi bi-hourglass-split"></i> Loading master data...
              </div>
              <div *ngIf="masterDataStatus === 'success'" class="alert alert-success">
                <i class="bi bi-check-circle"></i> Loaded master data successfully
              </div>
              <div *ngIf="masterDataStatus === 'error'" class="alert alert-danger">
                <i class="bi bi-x-circle"></i> Failed to load master data: {{ masterDataMessage }}
              </div>
              
              <button class="btn btn-warning" (click)="loadMasterData()" [disabled]="masterDataStatus === 'loading'">
                Load Master Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      margin-bottom: 1rem;
    }
    .btn {
      margin-right: 0.5rem;
    }
  `]
})
export class ApiTestComponent implements OnInit {
  connectionStatus: 'idle' | 'testing' | 'success' | 'error' = 'idle';
  errorMessage: string = '';
  
  sampleDataStatus: 'idle' | 'creating' | 'success' | 'error' = 'idle';
  sampleDataMessage: string = '';
  
  hoaDonStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  hoaDonMessage: string = '';
  hoaDonCount: number = 0;
  
  masterDataStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  masterDataMessage: string = '';

  private dataService = inject(DataService);
  private hoaDonService = inject(HoaDonService);
  private masterDataService = inject(MasterDataService);

  ngOnInit(): void {
    // Auto test connection on component init
    this.testConnection();
  }

  testConnection(): void {
    this.connectionStatus = 'testing';
    this.errorMessage = '';
    
    this.dataService.testAPIConnection().subscribe({
      next: (response: string) => {
        console.log('API Test Response:', response);
        this.connectionStatus = 'success';
      },
      error: (error: any) => {
        console.error('API Test Error:', error);
        this.connectionStatus = 'error';
        this.errorMessage = error.message || 'Unknown error occurred';
      }
    });
  }

  createSampleData(): void {
    this.sampleDataStatus = 'creating';
    this.sampleDataMessage = '';
    
    this.dataService.createSampleData().subscribe({
      next: (response: string) => {
        console.log('Sample Data Response:', response);
        this.sampleDataStatus = 'success';
        this.sampleDataMessage = response;
      },
      error: (error: any) => {
        console.error('Sample Data Error:', error);
        this.sampleDataStatus = 'error';
        this.sampleDataMessage = error.message || 'Unknown error occurred';
      }
    });
  }

  loadHoaDonData(): void {
    this.hoaDonStatus = 'loading';
    this.hoaDonMessage = '';
    
    this.dataService.getInvoicesFromAPI().subscribe({
      next: (hoaDonList: any[]) => {
        console.log('Hóa Đơn Data:', hoaDonList);
        this.hoaDonStatus = 'success';
        this.hoaDonCount = hoaDonList.length;
      },
      error: (error: any) => {
        console.error('Hóa Đơn Data Error:', error);
        this.hoaDonStatus = 'error';
        this.hoaDonMessage = error.message || 'Unknown error occurred';
      }
    });
  }

  loadMasterData(): void {
    this.masterDataStatus = 'loading';
    this.masterDataMessage = '';
    
    // Test loading nhà sản xuất data
    this.masterDataService.getAllNhaSanXuat().subscribe({
      next: (nhaSanXuatList: any) => {
        console.log('Nhà Sản Xuất Data:', nhaSanXuatList);
        this.masterDataStatus = 'success';
      },
      error: (error: any) => {
        console.error('Master Data Error:', error);
        this.masterDataStatus = 'error';
        this.masterDataMessage = error.message || 'Unknown error occurred';
      }
    });
  }
}
