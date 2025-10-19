import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Imei, ImeiRequest, ImeiResponse, ImeiImportResult } from '../interfaces/imei.interface';

@Injectable({
  providedIn: 'root',
})
export class ImeiApiService {
  private apiUrl = `${environment.apiUrl}/imei`;

  constructor(private http: HttpClient) {}

  // Tạo mới IMEI
  create(imei: ImeiRequest): Observable<ImeiResponse> {
    return this.http.post<any>(this.apiUrl, imei).pipe(map((response) => response.data));
  }

  // Tạo nhiều IMEI
  createMultiple(imeis: ImeiRequest[]): Observable<ImeiResponse[]> {
    return this.http
      .post<any>(`${this.apiUrl}/multiple`, imeis)
      .pipe(map((response) => response.data || []));
  }

  // Lấy IMEI theo ID
  getById(id: number): Observable<ImeiResponse> {
    return this.http.get<ImeiResponse>(`${this.apiUrl}/${id}`);
  }

  // Lấy tất cả IMEI theo sản phẩm
  getBySanPhamId(sanPhamId: number): Observable<ImeiResponse[]> {
    console.log('API Service - getBySanPhamId:', sanPhamId);
    console.log('API URL:', `${this.apiUrl}/san-pham/${sanPhamId}`);
    return this.http.get<any>(`${this.apiUrl}/san-pham/${sanPhamId}`).pipe(
      map((response) => {
        console.log('API Response:', response);
        console.log('API Response data:', response.data);
        return response.data || [];
      })
    );
  }

  // Lấy IMEI theo sản phẩm với phân trang
  getBySanPhamIdWithPagination(
    sanPhamId: number,
    page: number = 0,
    size: number = 10
  ): Observable<any> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get<any>(`${this.apiUrl}/san-pham/${sanPhamId}/page`, { params });
  }

  // Lấy IMEI còn hàng theo sản phẩm
  getAvailableBySanPhamId(sanPhamId: number): Observable<ImeiResponse[]> {
    return this.http.get<ImeiResponse[]>(`${this.apiUrl}/san-pham/${sanPhamId}/available`);
  }

  // Cập nhật trạng thái IMEI
  updateStatus(id: number, trangThai: boolean): Observable<ImeiResponse> {
    const params = new HttpParams().set('trangThai', trangThai.toString());
    return this.http.put<ImeiResponse>(`${this.apiUrl}/${id}/status`, null, { params });
  }

  // Xóa IMEI
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Xóa tất cả IMEI của sản phẩm
  deleteBySanPhamId(sanPhamId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/san-pham/${sanPhamId}`);
  }

  // Kiểm tra IMEI có tồn tại không
  existsBySoImei(soImei: string): Observable<boolean> {
    return this.http
      .get<any>(`${this.apiUrl}/exists/${soImei}`)
      .pipe(map((response) => response.data || false));
  }

  // Validate IMEI format
  validateImei(soImei: string): Observable<boolean> {
    return this.http
      .get<any>(`${this.apiUrl}/validate/${soImei}`)
      .pipe(map((response) => response.data || false));
  }

  // Import IMEI từ danh sách
  importImeiList(sanPhamId: number, imeiList: string[]): Observable<ImeiResponse[]> {
    return this.http.post<ImeiResponse[]>(`${this.apiUrl}/import/${sanPhamId}`, imeiList);
  }

  // Validate IMEI format locally
  isValidImeiFormat(imei: string): boolean {
    const imeiRegex = /^[0-9]{15}$/;
    return imeiRegex.test(imei);
  }

  // Format IMEI (remove spaces, dashes, etc.)
  formatImei(imei: string): string {
    return imei.replace(/[^0-9]/g, '');
  }

  // Tìm kiếm IMEI theo số IMEI
  searchImei(soImei: string, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('soImei', soImei)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }

  // Thống kê IMEI theo sản phẩm
  getImeiStatsBySanPham(sanPhamId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats/san-pham/${sanPhamId}`);
  }

  // Thống kê IMEI toàn hệ thống
  getImeiOverviewStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats/overview`);
  }

  // Cập nhật trạng thái hàng loạt
  updateBulkStatus(imeiIds: number[], trangThai: boolean): Observable<ImeiResponse[]> {
    const params = new HttpParams().set('trangThai', trangThai.toString());
    return this.http.put<ImeiResponse[]>(`${this.apiUrl}/bulk/status`, imeiIds, { params });
  }
}
