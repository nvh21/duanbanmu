import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Customer, CustomerRequestData } from '../interfaces/customer.interface';
import { Address } from '../interfaces/address.interface';
import { SPRING_BOOT_CONFIG, SpringBootResponse } from '../config/spring-boot.config';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = SPRING_BOOT_CONFIG.API_BASE_URL;
  private httpOptions = {
    headers: new HttpHeaders(SPRING_BOOT_CONFIG.DEFAULT_HEADERS)
  };

  constructor(private http: HttpClient) {}

  // Map backend data to frontend format
  private mapBackendToFrontend(backendCustomer: any): Customer {
    return {
      id: backendCustomer.id,
      ho_ten: backendCustomer.name || backendCustomer.ho_ten,
      email: backendCustomer.email,
      so_dien_thoai: backendCustomer.phone || backendCustomer.so_dien_thoai,
      ngay_sinh: backendCustomer.dateOfBirth || backendCustomer.ngay_sinh,
      gioi_tinh: backendCustomer.gender === 'Nam' || backendCustomer.gioi_tinh === true,
      diem_tich_luy: backendCustomer.diemTichLuy || backendCustomer.diem_tich_luy,
      ngay_tao: backendCustomer.registrationDate || backendCustomer.ngay_tao,
      trang_thai: backendCustomer.status === 'Active' || backendCustomer.trang_thai === true,
      // Các trường bổ sung cho hiển thị
      name: backendCustomer.name || backendCustomer.ho_ten,
      phone: backendCustomer.phone || backendCustomer.so_dien_thoai,
      dateOfBirth: backendCustomer.dateOfBirth || backendCustomer.ngay_sinh,
      gender: backendCustomer.gender || (backendCustomer.gioi_tinh ? 'Nam' : 'Nữ'),
      status: backendCustomer.status || (backendCustomer.trang_thai ? 'Active' : 'Inactive'),
      registrationDate: backendCustomer.registrationDate || backendCustomer.ngay_tao,
      totalSpent: backendCustomer.diemTichLuy || backendCustomer.diem_tich_luy
    };
  }

  // Error handling method
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Có lỗi xảy ra!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Lỗi: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      } else if (error.status === 404) {
        errorMessage = 'Không tìm thấy dữ liệu.';
      } else if (error.status === 500) {
        errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
      } else {
        errorMessage = `Lỗi ${error.status}: ${error.message}`;
      }
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  // Customer CRUD operations
  getCustomers(): Observable<Customer[]> {
    return this.http.get<any>(`${this.apiUrl}/khach-hang`, this.httpOptions)
      .pipe(
        map((response: any) => {
          // Backend trả về dữ liệu trong 'content' array
          const customers = response.content || response;
          return customers.map((customer: any) => this.mapBackendToFrontend(customer));
        }),
        catchError(this.handleError)
      );
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<any>(`${this.apiUrl}/khach-hang/${id}`, this.httpOptions)
      .pipe(
        map((response: any) => this.mapBackendToFrontend(response)),
        catchError(this.handleError)
      );
  }

  createCustomer(customer: CustomerRequestData): Observable<Customer> {
    // Map frontend data to backend format
    const backendData = {
      name: customer.ho_ten,
      email: customer.email,
      phone: customer.so_dien_thoai,
      dateOfBirth: customer.ngay_sinh,
      gender: customer.gioi_tinh ? 'Nam' : 'Nữ',
      status: customer.trang_thai ? 'Active' : 'Inactive'
    };
    return this.http.post<any>(`${this.apiUrl}/khach-hang`, backendData, this.httpOptions)
      .pipe(
        map((response: any) => this.mapBackendToFrontend(response)),
        catchError(this.handleError)
      );
  }

  updateCustomer(id: number, customer: CustomerRequestData): Observable<Customer> {
    const backendData = {
      name: customer.ho_ten,
      email: customer.email,
      phone: customer.so_dien_thoai,
      dateOfBirth: customer.ngay_sinh,
      gender: customer.gioi_tinh ? 'Nam' : 'Nữ',
      status: customer.trang_thai ? 'Active' : 'Inactive'
    };
    return this.http.put<any>(`${this.apiUrl}/khach-hang/${id}`, backendData, this.httpOptions)
      .pipe(
        map((response: any) => this.mapBackendToFrontend(response)),
        catchError(this.handleError)
      );
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/khach-hang/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  toggleCustomerStatus(id: number, status: 'Active' | 'Inactive'): Observable<Customer> {
    return this.http.patch<any>(`${this.apiUrl}/khach-hang/${id}/trang-thai`, { status: status }, this.httpOptions)
      .pipe(
        map((response: any) => this.mapBackendToFrontend(response)),
        catchError(this.handleError)
      );
  }

  // Address operations
  getCustomerAddresses(customerId: number): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.apiUrl}/khach-hang/${customerId}/dia-chi`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  addCustomerAddress(customerId: number, address: Address): Observable<Address> {
    // Spring Boot thường expect data không có ID khi tạo mới
    const addressData = { ...address };
    delete addressData.id;
    addressData.customerId = customerId;
    return this.http.post<Address>(`${this.apiUrl}/khach-hang/${customerId}/dia-chi`, addressData, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateCustomerAddress(customerId: number, addressId: number, address: Address): Observable<Address> {
    return this.http.put<Address>(`${this.apiUrl}/khach-hang/${customerId}/dia-chi/${addressId}`, address, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteCustomerAddress(customerId: number, addressId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/khach-hang/${customerId}/dia-chi/${addressId}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  setDefaultAddress(customerId: number, addressId: number): Observable<Address> {
    return this.http.patch<Address>(`${this.apiUrl}/khach-hang/${customerId}/dia-chi/${addressId}/mac-dinh`, {}, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Search and filter
  searchCustomers(searchTerm: string): Observable<Customer[]> {
    return this.http.get<any>(`${this.apiUrl}/khach-hang/search?name=${encodeURIComponent(searchTerm)}`, this.httpOptions)
      .pipe(
        map((response: any) => {
          const customers = response.content || response;
          return customers.map((customer: any) => this.mapBackendToFrontend(customer));
        }),
        catchError(this.handleError)
      );
  }

  getCustomersByStatus(status: 'Active' | 'Inactive' | 'all'): Observable<Customer[]> {
    const url = status === 'all' 
      ? `${this.apiUrl}/khach-hang`
      : `${this.apiUrl}/khach-hang/search?status=${status}`;
    return this.http.get<any>(url, this.httpOptions)
      .pipe(
        map((response: any) => {
          const customers = response.content || response;
          return customers.map((customer: any) => this.mapBackendToFrontend(customer));
        }),
        catchError(this.handleError)
      );
  }

  // Pagination
  getCustomersPaginated(page: number, limit: number): Observable<{customers: Customer[], total: number, totalPages: number}> {
    return this.http.get<any>(`${this.apiUrl}/khach-hang/paginated?page=${page}&size=${limit}`, this.httpOptions)
      .pipe(
        map((response: any) => {
          const customers = response.content || response;
          return {
            customers: customers.map((customer: any) => this.mapBackendToFrontend(customer)),
            total: response.totalElements || customers.length,
            totalPages: response.totalPages || 1
          };
        }),
        catchError(this.handleError)
      );
  }
}
