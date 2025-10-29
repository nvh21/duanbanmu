import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
  id: number;
  maKhachHang: string;
  tenKhachHang: string;
  email: string;
  soDienThoai: string;
  diaChi: string | null;
  ngaySinh: string | null;
  gioiTinh: boolean;
  ngayTao: string;
  trangThai: boolean;
  userId: number | null;
  username: string | null;
}

export interface CustomerPageResponse {
  content: Customer[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = 'http://localhost:8081/api/khach-hang';

  constructor(private http: HttpClient) {}

  getCustomers(
    page: number = 0,
    size: number = 10,
    search?: string,
    status?: string
  ): Observable<CustomerPageResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search) {
      params = params.set('search', search);
    }

    if (status && status !== 'all') {
      // Gửi boolean value thay vì string 'true'/'false'
      params = params.set('trangThai', status === 'active');
    }

    return this.http.get<CustomerPageResponse>(this.apiUrl, { params });
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  createCustomer(customer: Partial<Customer>): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  updateCustomer(id: number, customer: Partial<Customer>): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateCustomerStatus(id: number, trangThai: boolean): Observable<Customer> {
    return this.http.patch<Customer>(`${this.apiUrl}/${id}/trang-thai`, { trangThai });
  }
}

