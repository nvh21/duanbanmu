import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface CustomerDTO {
  id: number;
  tenKhachHang: string;
  email: string;
  soDienThoai: string;
  ngaySinh?: string;
  gioiTinh?: boolean;
  diemTichLuy?: number;
  ngayTao?: string;
  trangThai?: boolean;
  userId?: number;
  username?: string;
  fullName?: string;
  danhSachDiaChi?: AddressDTO[];
}

export interface AddressDTO {
  id: number;
  khachHangId: number;
  tenNguoiNhan: string;
  soDienThoai: string;
  diaChi: string;
  tinhThanh: string;
  quanHuyen: string;
  phuongXa: string;
  macDinh: boolean;
  trangThai: boolean;
}

export interface CustomerPaginatedResponse {
  content: CustomerDTO[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = `${environment.apiBaseUrl}/api/khach-hang`;

  constructor(private http: HttpClient) {}

  // Lấy tất cả khách hàng với phân trang
  getAllCustomers(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id',
    sortDir: string = 'asc'
  ): Observable<CustomerPaginatedResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<CustomerPaginatedResponse>(this.apiUrl, { params });
  }

  // Lấy khách hàng theo ID
  getCustomerById(id: number): Observable<CustomerDTO> {
    return this.http.get<CustomerDTO>(`${this.apiUrl}/${id}`);
  }

  // Tìm kiếm khách hàng
  searchCustomers(
    tenKhachHang?: string,
    email?: string,
    soDienThoai?: string,
    trangThai?: boolean,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'id',
    sortDir: string = 'asc'
  ): Observable<CustomerPaginatedResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    if (tenKhachHang) params = params.set('tenKhachHang', tenKhachHang);
    if (email) params = params.set('email', email);
    if (soDienThoai) params = params.set('soDienThoai', soDienThoai);
    if (trangThai !== undefined) params = params.set('trangThai', trangThai.toString());

    return this.http.get<CustomerPaginatedResponse>(`${this.apiUrl}/search`, { params });
  }

  // Tạo khách hàng mới
  createCustomer(customer: Partial<CustomerDTO>): Observable<CustomerDTO> {
    return this.http.post<CustomerDTO>(this.apiUrl, customer);
  }

  // Cập nhật khách hàng
  updateCustomer(id: number, customer: Partial<CustomerDTO>): Observable<CustomerDTO> {
    return this.http.put<CustomerDTO>(`${this.apiUrl}/${id}`, customer);
  }

  // Xóa khách hàng (soft delete)
  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Xóa vĩnh viễn khách hàng
  permanentlyDeleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/permanent`);
  }

  // Lấy khách hàng theo email
  getCustomerByEmail(email: string): Observable<CustomerDTO> {
    return this.http.get<CustomerDTO>(`${this.apiUrl}/email/${email}`);
  }

  // Lấy khách hàng theo số điện thoại
  getCustomerByPhone(phone: string): Observable<CustomerDTO> {
    return this.http.get<CustomerDTO>(`${this.apiUrl}/phone/${phone}`);
  }

  // Lấy khách hàng VIP
  getVIPCustomers(limit: number = 10): Observable<CustomerDTO[]> {
    return this.http.get<CustomerDTO[]>(`${this.apiUrl}/vip?limit=${limit}`);
  }

  // Thống kê khách hàng
  getCustomerStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  // Lấy khách hàng theo khoảng thời gian
  getCustomersByDateRange(startDate: string, endDate: string): Observable<CustomerDTO[]> {
    return this.http.get<CustomerDTO[]>(
      `${this.apiUrl}/date-range?startDate=${startDate}&endDate=${endDate}`
    );
  }

  // Cập nhật điểm tích lũy
  updateLoyaltyPoints(id: number, points: number): Observable<CustomerDTO> {
    return this.http.patch<CustomerDTO>(`${this.apiUrl}/${id}/diem-tich-luy`, points);
  }

  // Kiểm tra email đã tồn tại
  checkEmailExists(email: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/check-email/${email}`);
  }

  // Kiểm tra số điện thoại đã tồn tại
  checkPhoneExists(phone: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/check-phone/${phone}`);
  }

  // Lấy tất cả khách hàng (không phân trang) - cho dropdown/select
  getAllCustomersSimple(): Observable<CustomerDTO[]> {
    console.log('CustomerService: Calling API:', this.apiUrl);
    return this.http.get<CustomerPaginatedResponse>(this.apiUrl).pipe(
      map((response) => {
        console.log('CustomerService: API Response:', response);
        return response.content;
      })
    );
  }
}
