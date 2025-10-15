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
    console.log('🔍 Mapping backend customer:', backendCustomer);
    
    return {
      id: backendCustomer.id,
      ho_ten: backendCustomer.tenKhachHang || backendCustomer.name || backendCustomer.ho_ten,
      email: backendCustomer.email,
      so_dien_thoai: backendCustomer.soDienThoai || backendCustomer.phone || backendCustomer.so_dien_thoai,
      ngay_sinh: backendCustomer.ngaySinh || backendCustomer.dateOfBirth || backendCustomer.ngay_sinh,
      gioi_tinh: backendCustomer.gioiTinh || backendCustomer.gender === 'Nam' || backendCustomer.gioi_tinh === true,
      diem_tich_luy: backendCustomer.diemTichLuy || backendCustomer.diem_tich_luy || 0,
      ngay_tao: backendCustomer.ngayTao || backendCustomer.registrationDate || backendCustomer.ngay_tao,
      trang_thai: backendCustomer.trangThai || backendCustomer.status === 'Active' || backendCustomer.trang_thai === true,
      customerCode: backendCustomer.maKhachHang || backendCustomer.customerCode || 'KH' + (backendCustomer.id || 0).toString().padStart(5, '0'),
      // Các trường bổ sung cho hiển thị
      name: backendCustomer.tenKhachHang || backendCustomer.name || backendCustomer.ho_ten,
      phone: backendCustomer.soDienThoai || backendCustomer.phone || backendCustomer.so_dien_thoai,
      dateOfBirth: backendCustomer.ngaySinh || backendCustomer.dateOfBirth || backendCustomer.ngay_sinh,
      gender: backendCustomer.gioiTinh || backendCustomer.gender || (backendCustomer.gioi_tinh ? 'Nam' : 'Nữ'),
      status: backendCustomer.trangThai || backendCustomer.status || (backendCustomer.trang_thai ? 'Active' : 'Inactive'),
      registrationDate: backendCustomer.ngayTao || backendCustomer.registrationDate || backendCustomer.ngay_tao,
      totalSpent: backendCustomer.diemTichLuy || backendCustomer.diem_tich_luy || 0,
      // Xử lý địa chỉ từ bảng diachikhachhang
      diaChi: backendCustomer.diaChi || [],
      userId: backendCustomer.userId,
      diemTichLuy: backendCustomer.diemTichLuy || 0
    };
  }

  // Error handling method
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Có lỗi xảy ra!';
    
    console.error('🔍 Full error object:', error);
    console.error('🔍 Error status:', error.status);
    console.error('🔍 Error message:', error.message);
    console.error('🔍 Error error:', error.error);
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Lỗi: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Lỗi kết nối! Không thể kết nối đến server.';
      } else if (error.status === 400) {
        errorMessage = 'Dữ liệu không hợp lệ! Vui lòng kiểm tra lại.';
      } else if (error.status === 404) {
        errorMessage = 'Không tìm thấy dữ liệu!';
      } else if (error.status === 500) {
        errorMessage = 'Lỗi server! Vui lòng thử lại sau.';
      } else {
        errorMessage = `Lỗi ${error.status}: ${error.error?.message || error.message}`;
      }
    }
    
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Customer CRUD operations
  getCustomers(): Observable<Customer[]> {
    return this.http.get<any>(`${this.apiUrl}/khach-hang`, this.httpOptions)
      .pipe(
        map((response: any) => {
          console.log('🔍 Backend response:', response);
          // Xử lý response từ backend mới
          let customers = [];
          if (response.data && Array.isArray(response.data)) {
            customers = response.data;
          } else if (response.content && Array.isArray(response.content)) {
            customers = response.content;
          } else if (Array.isArray(response)) {
            customers = response;
          }
          
          console.log('🔍 Processed customers:', customers);
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
    // Map frontend data to backend format (theo cấu trúc database mới)
    const backendData = {
      tenKhachHang: customer.ho_ten,
      email: customer.email,
      soDienThoai: customer.so_dien_thoai,
      ngaySinh: customer.ngay_sinh instanceof Date ? customer.ngay_sinh.toISOString().split('T')[0] : customer.ngay_sinh,
      gioiTinh: customer.gioi_tinh,
      trangThai: customer.trang_thai,
      diemTichLuy: 0,
      ngayTao: new Date().toISOString().split('T')[0],
      maKhachHang: customer.customerCode || 'KH00000'
    };
    
    console.log('🔍 Sending to backend:', backendData);
    console.log('🔍 API URL:', `${this.apiUrl}/khach-hang`);
    
    return this.http.post<any>(`${this.apiUrl}/khach-hang`, backendData, this.httpOptions)
      .pipe(
        map((response: any) => {
          console.log('🔍 Backend response:', response);
          return this.mapBackendToFrontend(response);
        }),
        catchError(this.handleError)
      );
  }

  updateCustomer(id: number, customer: CustomerRequestData): Observable<Customer> {
    const backendData = {
      tenKhachHang: customer.ho_ten,
      email: customer.email,
      soDienThoai: customer.so_dien_thoai,
      ngaySinh: customer.ngay_sinh instanceof Date ? customer.ngay_sinh.toISOString().split('T')[0] : customer.ngay_sinh,
      gioiTinh: customer.gioi_tinh,
      trangThai: customer.trang_thai,
      diemTichLuy: 0,
      ngayTao: new Date().toISOString().split('T')[0],
      maKhachHang: customer.customerCode || 'KH00000'
    };
    
    console.log('🔍 Updating customer:', id, backendData);
    
    return this.http.put<any>(`${this.apiUrl}/khach-hang/${id}`, backendData, this.httpOptions)
      .pipe(
        map((response: any) => {
          console.log('🔍 Update response:', response);
          return this.mapBackendToFrontend(response);
        }),
        catchError(this.handleError)
      );
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
    console.log('🔍 Fetching addresses for customer:', customerId);
    console.log('🔍 API URL:', `${this.apiUrl}/khach-hang/${customerId}/dia-chi`);
    
    return this.http.get<any>(`${this.apiUrl}/khach-hang/${customerId}/dia-chi`, this.httpOptions)
      .pipe(
        map((response: any) => {
          console.log('🔍 Raw response from backend:', response);
          
          // Xử lý response từ backend mới
          let addresses = [];
          if (response.data && Array.isArray(response.data)) {
            addresses = response.data;
          } else if (Array.isArray(response)) {
            addresses = response;
          }
          
          console.log('🔍 Processed addresses:', addresses);
          console.log('🔍 Addresses length:', addresses?.length);
          
          if (!addresses || addresses.length === 0) {
            console.log('⚠️ No addresses found for customer:', customerId);
            return [];
          }
          
          const mappedAddresses = addresses.map((addr: any) => {
            const mappedAddress = {
              id: addr.id,
              specificAddress: addr.diaChiCuThe || '',
              province: addr.thanhPho || '',
              district: addr.quan || '',
              ward: addr.phuong || '',
              isDefault: addr.macDinh || false,
              mac_dinh: addr.macDinh || false,
              macDinh: addr.macDinh || false,
              dia_chi: `${addr.diaChiCuThe || ''}, ${addr.phuong || ''}, ${addr.quan || ''}, ${addr.thanhPho || ''}`,
              diaChiCuThe: addr.diaChiCuThe || '',
              thanhPho: addr.thanhPho || '',
              quan: addr.quan || '',
              phuong: addr.phuong || '',
              soDienThoai: addr.soDienThoai || '',
              tenNguoiNhan: addr.tenNguoiNhan || '',
              tenDiaChi: addr.tenDiaChi || '',
              createdAt: addr.createdAt,
              updatedAt: addr.updatedAt,
              customerId: customerId
            };
            console.log('🔍 Mapped address:', mappedAddress);
            return mappedAddress;
          });
          
          console.log('🔍 Final mapped addresses:', mappedAddresses);
          return mappedAddresses;
        }),
        catchError(error => {
          console.error('❌ Error fetching addresses:', error);
          console.error('❌ Error status:', error.status);
          console.error('❌ Error message:', error.message);
          return throwError(() => error);
        })
      );
  }

  addCustomerAddress(customerId: number, address: Address): Observable<Address> {
    // Map frontend address to AddressRequestDTO format (database mới)
    const backendAddress = {
      diaChiCuThe: address.specificAddress || address.diaChiCuThe || '',
      thanhPho: address.province || address.thanhPho || '',
      quan: address.district || address.quan || '',
      phuong: address.ward || address.phuong || '',
      macDinh: address.isDefault || address.mac_dinh || address.macDinh || false,
      tenDiaChi: address.tenDiaChi || 'Địa chỉ mới',
      soDienThoai: address.soDienThoai || '0123456789',
      tenNguoiNhan: address.tenNguoiNhan || 'Khách hàng'
    };
    
    return this.http.post<any>(`${this.apiUrl}/khach-hang/${customerId}/dia-chi`, backendAddress, this.httpOptions)
      .pipe(
        map((response: any) => {
          console.log('🔍 Backend response for add address:', response);
          // Map AddressResponseDTO to frontend format (database mới)
          const addressData = response.data || response;
          return {
            id: addressData.id,
            specificAddress: addressData.diaChiCuThe,
            province: addressData.thanhPho,
            district: addressData.quan,
            ward: addressData.phuong,
            isDefault: addressData.macDinh,
            mac_dinh: addressData.macDinh,
            macDinh: addressData.macDinh,
            dia_chi: `${addressData.diaChiCuThe}, ${addressData.phuong}, ${addressData.quan}, ${addressData.thanhPho}`,
            diaChiCuThe: addressData.diaChiCuThe,
            thanhPho: addressData.thanhPho,
            quan: addressData.quan,
            phuong: addressData.phuong,
            soDienThoai: addressData.soDienThoai,
            tenNguoiNhan: addressData.tenNguoiNhan,
            tenDiaChi: addressData.tenDiaChi,
            createdAt: addressData.createdAt,
            updatedAt: addressData.updatedAt,
            customerId: customerId
          };
        }),
        catchError(this.handleError)
      );
  }

  updateCustomerAddress(customerId: number, addressId: number, address: Address): Observable<Address> {
    // Map frontend address to AddressRequestDTO format (database mới)
    const backendAddress = {
      diaChiCuThe: address.specificAddress || address.diaChiCuThe || '',
      thanhPho: address.province || address.thanhPho || '',
      quan: address.district || address.quan || '',
      phuong: address.ward || address.phuong || '',
      macDinh: address.isDefault || address.mac_dinh || address.macDinh || false,
      tenDiaChi: address.tenDiaChi || 'Địa chỉ mới',
      soDienThoai: address.soDienThoai || '0123456789',
      tenNguoiNhan: address.tenNguoiNhan || 'Khách hàng'
    };
    
    return this.http.put<Address>(`${this.apiUrl}/khach-hang/${customerId}/dia-chi/${addressId}`, backendAddress, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteCustomerAddress(customerId: number, addressId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/khach-hang/${customerId}/dia-chi/${addressId}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  setDefaultAddress(customerId: number, addressId: number): Observable<Address> {
    return this.http.patch<any>(`${this.apiUrl}/khach-hang/${customerId}/dia-chi/${addressId}/mac-dinh`, {}, this.httpOptions)
      .pipe(
        map((response: any) => {
          // Map AddressResponseDTO to frontend format (database mới)
          const addressData = response.data || response;
          return {
            id: addressData.id,
            specificAddress: addressData.diaChiCuThe,
            province: addressData.thanhPho,
            district: addressData.quan,
            ward: addressData.phuong,
            isDefault: addressData.macDinh,
            mac_dinh: addressData.macDinh,
            macDinh: addressData.macDinh,
            dia_chi: `${addressData.diaChiCuThe}, ${addressData.phuong}, ${addressData.quan}, ${addressData.thanhPho}`,
            diaChiCuThe: addressData.diaChiCuThe,
            thanhPho: addressData.thanhPho,
            quan: addressData.quan,
            phuong: addressData.phuong,
            soDienThoai: addressData.soDienThoai,
            tenNguoiNhan: addressData.tenNguoiNhan,
            tenDiaChi: addressData.tenDiaChi,
            createdAt: addressData.createdAt,
            updatedAt: addressData.updatedAt,
            customerId: customerId
          };
        }),
        catchError(this.handleError)
      );
  }

  // Test address endpoint
  testAddressEndpoint(customerId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/khach-hang/${customerId}/dia-chi/test`, this.httpOptions)
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

  // Xóa khách hàng (soft delete)
  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/khach-hang/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Xóa vĩnh viễn khách hàng
  permanentDeleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/khach-hang/${id}/permanent`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // Cập nhật trạng thái khách hàng
  updateCustomerStatus(id: number, status: boolean): Observable<Customer> {
    return this.http.patch<any>(`${this.apiUrl}/khach-hang/${id}/trang-thai?trangThai=${status}`, {}, this.httpOptions)
      .pipe(
        map((response: any) => this.mapBackendToFrontend(response)),
        catchError(this.handleError)
      );
  }

  // Cập nhật điểm tích lũy
  updateCustomerPoints(id: number, points: number): Observable<Customer> {
    return this.http.patch<any>(`${this.apiUrl}/khach-hang/${id}/diem-tich-luy?diemTichLuy=${points}`, {}, this.httpOptions)
      .pipe(
        map((response: any) => this.mapBackendToFrontend(response)),
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
